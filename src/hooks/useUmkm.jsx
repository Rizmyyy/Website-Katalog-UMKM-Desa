import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { isFirebaseConfigured, db, storage } from '@/lib/firebase'
import { mockUmkmData } from '@/data/mockData'
import imageCompression from 'browser-image-compression'

const UmkmContext = createContext(null)

export function UmkmProvider({ children }) {
  const [umkmList, setUmkmList] = useState([])
  const [loading, setLoading] = useState(true)

  // Load data
  useEffect(() => {
    if (isFirebaseConfigured && db) {
      // Firebase mode
      loadFromFirestore()
    } else {
      // Mock mode — use local data
      const saved = localStorage.getItem('umkm_data')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setUmkmList(parsed)
        } catch (e) {
          setUmkmList(mockUmkmData)
        }
      } else {
        setUmkmList(mockUmkmData)
        localStorage.setItem('umkm_data', JSON.stringify(mockUmkmData))
      }
      setLoading(false)
    }
  }, [])

  const loadFromFirestore = async () => {
    try {
      const { collection, getDocs, orderBy, query } = await import('firebase/firestore')
      const q = query(collection(db, 'umkm'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setUmkmList(data)
    } catch (error) {
      console.error('Error loading from Firestore:', error)
      setUmkmList(mockUmkmData)
    } finally {
      setLoading(false)
    }
  }

  const saveMockData = useCallback((data) => {
    localStorage.setItem('umkm_data', JSON.stringify(data))
  }, [])

  const getById = useCallback((id) => {
    return umkmList.find((item) => item.id === id)
  }, [umkmList])

  const getFeatured = useCallback(() => {
    return umkmList.filter((item) => item.isFeatured)
  }, [umkmList])

  const getByCategory = useCallback((category) => {
    if (!category || category.toLowerCase() === 'semua') return umkmList
    return umkmList.filter((item) => item.kategori.toLowerCase() === category.toLowerCase())
  }, [umkmList])

  const search = useCallback((query) => {
    if (!query) return umkmList
    const q = query.toLowerCase()
    return umkmList.filter(
      (item) =>
        item.namaUmkm.toLowerCase().includes(q) ||
        item.namaPemilik.toLowerCase().includes(q) ||
        item.deskripsiSingkat.toLowerCase().includes(q) ||
        item.produkUnggulan.toLowerCase().includes(q)
    )
  }, [umkmList])

  const getRecommendations = useCallback((currentId, limit = 3) => {
    const current = umkmList.find((item) => item.id === currentId)
    if (!current) return umkmList.slice(0, limit)

    // Prioritize same category, then others
    const sameCategory = umkmList.filter(
      (item) => item.id !== currentId && item.kategori === current.kategori
    )
    const others = umkmList.filter(
      (item) => item.id !== currentId && item.kategori !== current.kategori
    )
    return [...sameCategory, ...others].slice(0, limit)
  }, [umkmList])

  const getByPemilik = useCallback((idPemilik, excludeId) => {
    if (!idPemilik) return []
    return umkmList.filter(
      (item) => item.idPemilik === idPemilik && item.id !== excludeId
    )
  }, [umkmList])

  const createUmkm = useCallback(async (data) => {
    if (isFirebaseConfigured && db) {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const docRef = await addDoc(collection(db, 'umkm'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      const newItem = { ...data, id: docRef.id, createdAt: new Date(), updatedAt: new Date() }
      setUmkmList((prev) => [newItem, ...prev])
      return docRef.id
    } else {
      // Mock mode
      const id = data.namaUmkm
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') + '-' + Date.now()
      const newItem = {
        ...data,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const updated = [newItem, ...umkmList]
      setUmkmList(updated)
      saveMockData(updated)
      return id
    }
  }, [umkmList, saveMockData])

  const updateUmkm = useCallback(async (id, data) => {
    if (isFirebaseConfigured && db) {
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
      await updateDoc(doc(db, 'umkm', id), {
        ...data,
        updatedAt: serverTimestamp(),
      })
    }
    const updated = umkmList.map((item) =>
      item.id === id ? { ...item, ...data, updatedAt: new Date() } : item
    )
    setUmkmList(updated)
    if (!isFirebaseConfigured) saveMockData(updated)
  }, [umkmList, saveMockData])

  const deleteUmkm = useCallback(async (id) => {
    if (isFirebaseConfigured && db) {
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(db, 'umkm', id))
    }
    const updated = umkmList.filter((item) => item.id !== id)
    setUmkmList(updated)
    if (!isFirebaseConfigured) saveMockData(updated)
  }, [umkmList, saveMockData])

  const uploadImages = useCallback(async (files) => {
    if (isFirebaseConfigured && db) {
      const urls = []
      const { uploadToCloudinary } = await import('@/utils/imageUpload')
      
      const compressionOptions = {
        maxSizeMB: 0.8, // Maksimal 800KB
        maxWidthOrHeight: 1200, // Dimensi maksimal
        useWebWorker: true
      }

      for (const file of files) {
        try {
          // Kompresi otomatis sebelum diunggah
          let processFile = file;
          // Coba kompresi jika itu gambar (abaikan error kompresi jika format aneh)
          if (file.type.startsWith('image/')) {
            try {
               processFile = await imageCompression(file, compressionOptions);
            } catch (e) {
               console.warn("Gagal kompresi, menggunakan file asli", e);
            }
          }

          // Konversi ke Base64
          const reader = new FileReader()
          const base64Promise = new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
            reader.readAsDataURL(processFile)
          })
          
          const base64String = await base64Promise
          
          // Kirim ke Cloudinary
          const url = await uploadToCloudinary(base64String, file.name.replace(/\.[^/.]+$/, ""))
          urls.push(url)
        } catch (error) {
          console.error("Gagal mengunggah gambar ke Cloudinary:", error)
        }
      }
      return urls
    } else {
      // Mock: create object URLs
      return Array.from(files).map((file) => URL.createObjectURL(file))
    }
  }, [])

  return (
    <UmkmContext.Provider
      value={{
        umkmList,
        loading,
        getById,
        getFeatured,
        getByCategory,
        search,
        getRecommendations,
        getByPemilik,
        createUmkm,
        updateUmkm,
        deleteUmkm,
        uploadImages,
      }}
    >
      {children}
    </UmkmContext.Provider>
  )
}

export function useUmkm() {
  const context = useContext(UmkmContext)
  if (!context) {
    throw new Error('useUmkm must be used within UmkmProvider')
  }
  return context
}
