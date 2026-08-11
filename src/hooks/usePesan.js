import { useState, useEffect } from 'react'
import { 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/lib/firebase'

const MOCK_KEY = 'mock_pesan_umkm'
const getMockData = () => JSON.parse(localStorage.getItem(MOCK_KEY) || '[]')
const saveMockData = (data) => localStorage.setItem(MOCK_KEY, JSON.stringify(data))

export function usePesan() {
  const [pesan, setPesan] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch all messages (realtime for admin)
  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      console.warn('Firebase not configured. Menggunakan simulasi database lokal (LocalStorage).')
      
      const loadMockData = () => {
        const data = getMockData().sort((a,b) => b.createdAt - a.createdAt)
        setPesan(data)
        setUnreadCount(data.filter(m => !m.isRead).length)
        setLoading(false)
      }
      loadMockData()
      // Polling ringan untuk sinkronisasi antar halaman
      const interval = setInterval(loadMockData, 1000)
      return () => clearInterval(interval)
    }

    const q = query(collection(db, 'pesan_umkm'), orderBy('createdAt', 'desc'))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPesan(messages)
      
      const unread = messages.filter(m => !m.isRead).length
      setUnreadCount(unread)
      
      setLoading(false)
    }, (err) => {
      console.error("Error fetching messages:", err)
      setError(err)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Fungsi untuk pengguna mengirim form pendaftaran
  const kirimPesan = async (data) => {
    if (!isFirebaseConfigured || !db) {
      const current = getMockData()
      const newMsg = {
        id: 'sim-' + Date.now(),
        ...data,
        isRead: false,
        createdAt: Date.now()
      }
      saveMockData([...current, newMsg])
      
      return new Promise(resolve => {
        setTimeout(() => resolve({ success: true, id: newMsg.id }), 800)
      })
    }

    try {
      setLoading(true)
      const docRef = await addDoc(collection(db, 'pesan_umkm'), {
        ...data,
        isRead: false,
        createdAt: serverTimestamp()
      })
      return { success: true, id: docRef.id }
    } catch (err) {
      console.error("Error sending message:", err)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Fungsi admin: Tandai sudah dibaca
  const tandaiDibaca = async (id) => {
    if (!isFirebaseConfigured || !db) {
      const current = getMockData()
      const updated = current.map(m => m.id === id ? { ...m, isRead: true } : m)
      saveMockData(updated)
      return { success: true }
    }

    try {
      const docRef = doc(db, 'pesan_umkm', id)
      await updateDoc(docRef, { isRead: true })
      return { success: true }
    } catch (err) {
      console.error("Error updating message:", err)
      return { success: false, error: err.message }
    }
  }

  // Fungsi admin: Hapus pesan
  const hapusPesan = async (id) => {
    if (!isFirebaseConfigured || !db) {
      const current = getMockData()
      const updated = current.filter(m => m.id !== id)
      saveMockData(updated)
      return { success: true }
    }

    try {
      const docRef = doc(db, 'pesan_umkm', id)
      await deleteDoc(docRef)
      return { success: true }
    } catch (err) {
      console.error("Error deleting message:", err)
      return { success: false, error: err.message }
    }
  }

  return { 
    pesan, 
    loading, 
    error, 
    unreadCount,
    kirimPesan,
    tandaiDibaca,
    hapusPesan
  }
}
