import { createContext, useContext, useState, useEffect } from 'react'
import { isFirebaseConfigured, auth } from '@/lib/firebase'

const AuthContext = createContext(null)

// Mock admin credentials for development
const MOCK_ADMIN = {
  email: 'admin@gumelarkidul.desa.id',
  password: 'AdminGumelar#24',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check sessionStorage for mock session first
    const savedUser = sessionStorage.getItem('umkm_admin_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setLoading(false)
      return
    }

    if (isFirebaseConfigured && auth) {
      let unsubscribe = () => {}
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser)
          setLoading(false)
        })
      })
      return () => unsubscribe()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    // Selalu izinkan login untuk kredensial admin bawaan (bypass Firebase)
    if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
      const mockUser = { email, displayName: 'Admin Desa' }
      setUser(mockUser)
      sessionStorage.setItem('umkm_admin_user', JSON.stringify(mockUser))
      return mockUser
    }

    if (isFirebaseConfigured && auth) {
      try {
        const { signInWithEmailAndPassword } = await import('firebase/auth')
        const result = await signInWithEmailAndPassword(auth, email, password)
        setUser(result.user)
        return result.user
      } catch (error) {
        // Abaikan error konfigurasi firebase jika memang sengaja tidak diaktifkan, dan anggap saja salah sandi
        throw new Error('Email atau kata sandi salah. Silakan coba lagi.')
      }
    } else {
      throw new Error('Email atau kata sandi salah. Silakan coba lagi.')
    }
  }

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      const { signOut } = await import('firebase/auth')
      try { await signOut(auth) } catch (e) {}
    }
    sessionStorage.removeItem('umkm_admin_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
