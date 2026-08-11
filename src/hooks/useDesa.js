import { useState, useEffect } from 'react'
import { desaInfo as mockDesaInfo } from '@/data/mockData'
import { db } from '@/lib/firebase'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'

const defaultDesaData = {
  ...mockDesaInfo,
  slogan: 'Produk Lokal Berkualitas Tinggi',
  sejarah: '',
  visi: 'Meningkatkan kesejahteraan masyarakat Desa Gumelar Kidul dengan melakukan program andalan yang berbasis kemasyarakatan demi terciptanya masyarakat yang aman, makmur dan sejahtera dengan berlandaskan akhlakul kharimah, menjaga kesatuan dan persatuan warga dengan berpegang teguh pada peraturan dan perundang-undangan yang berlaku.',
  misi: `1. Meningkatkan keimanan dan ketaqwaan terhadap Tuhan Yang Maha Esa
2. Meningkatkan kesejahteraan masyarakat desa dan menambah pendapatan asli desa melalui program andalan BUMDES.
3. Meningkatkan kesejahteraan petani dan penggarap sawah dengan menerapkan program masa tanam yang lebih baik demi kesejahteraan masyarakat Desa Gumelar Kidul
4. Meningkatkan pelayanan publik yang lebih cepat dan efisien.
5. Meningkatkan cipta kondisi masyarakat aman, tentram dan damai.
6. Pembinaan secara mental spritual baik secara formal dan informal.
7. Peningkatkan kemampuan masyarakat melalui program pelatihan, pembinaan dan penyuluhan.`,
  videoUrl: '',
  statistik: {
    penduduk: '1200',
    kk: '350',
    umkm: '45',
    rt: '32'
  },
  kontakDesa: mockDesaInfo.kontakDesa || {
    telepon: '',
    email: '',
    instagram: ''
  }
}

export function useDesa() {
  const [desaInfo, setDesaInfo] = useState(defaultDesaData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const desaDocRef = doc(db, 'desa', 'info')
    
    const unsubscribe = onSnapshot(desaDocRef, (docSnap) => {
      try {
        if (docSnap.exists()) {
          const parsed = docSnap.data()
          setDesaInfo({
            ...defaultDesaData,
            ...parsed,
            statistik: { ...defaultDesaData.statistik, ...(parsed.statistik || {}) },
            kontakDesa: { 
              ...defaultDesaData.kontakDesa, 
              ...(parsed.kontakDesa || {})
            },
            identitas: { ...(defaultDesaData.identitas || mockDesaInfo.identitas), ...(parsed.identitas || {}) },
            beranda: { 
              ...(defaultDesaData.beranda || mockDesaInfo.beranda), 
              ...(parsed.beranda || {}),
              kades: {
                ...(defaultDesaData.beranda?.kades || mockDesaInfo.beranda?.kades),
                ...(parsed.beranda?.kades || {})
              }
            }
          })
        } else {
          // Document doesn't exist yet, use defaults
          setDesaInfo(defaultDesaData)
        }
      } catch (err) {
        console.error('Gagal memuat profil desa dari Firestore:', err)
        setDesaInfo(defaultDesaData)
      } finally {
        setLoading(false)
      }
    }, (error) => {
      console.error('Error fetching desa info realtime:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const updateDesaInfo = async (newData) => {
    try {
      await setDoc(doc(db, 'desa', 'info'), newData, { merge: true })
      return true
    } catch (err) {
      console.error('Error updating desa info:', err)
      throw err;
    }
  }

  return { desaInfo, loading, updateDesaInfo }
}
