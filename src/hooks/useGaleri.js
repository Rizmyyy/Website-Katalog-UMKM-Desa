import { useState, useEffect } from 'react'
import { galeriKkn } from '@/data/mockData'
import { db } from '@/lib/firebase'
import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore'

export function useGaleri() {
  const [galeri, setGaleri] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to real-time updates from Firestore
    const galeriRef = collection(db, 'galeri')
    
    const unsubscribe = onSnapshot(galeriRef, (snapshot) => {
      try {
        if (snapshot.empty) {
          // If empty, initialize with mock data but don't save to db automatically yet
          setGaleri(galeriKkn)
        } else {
          const loadedData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          // Sort by date descending
          loadedData.sort((a, b) => new Date(b.date) - new Date(a.date))
          setGaleri(loadedData)
        }
      } catch (err) {
        console.error('Gagal memuat galeri dari Firestore:', err)
        setGaleri(galeriKkn)
      } finally {
        setLoading(false)
      }
    }, (error) => {
      console.error('Error fetching gallery realtime:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const addFoto = async (foto) => {
    try {
      const id = Date.now().toString();
      const newFoto = {
        ...foto,
        id,
        date: foto.date || new Date().toISOString().split('T')[0]
      }
      await setDoc(doc(db, 'galeri', id), newFoto)
      return newFoto
    } catch (err) {
      console.error('Error adding foto:', err);
      throw err;
    }
  }

  const updateFoto = async (id, updatedData) => {
    try {
      await setDoc(doc(db, 'galeri', id), updatedData, { merge: true })
    } catch (err) {
      console.error('Error updating foto:', err);
      throw err;
    }
  }

  const deleteFoto = async (id) => {
    try {
      await deleteDoc(doc(db, 'galeri', id))
    } catch (err) {
      console.error('Error deleting foto:', err);
      throw err;
    }
  }

  return { galeri, loading, addFoto, updateFoto, deleteFoto }
}
