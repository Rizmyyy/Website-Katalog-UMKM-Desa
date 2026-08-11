import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Navbar from './Navbar'
import Footer from './Footer'
import { AnimatePresence } from 'framer-motion'
import PageTransition from '@/components/ui/PageTransition'

export default function Layout() {
  const { logout, user } = useAuth()
  const location = useLocation()

  // Paksa logout jika user masuk ke halaman publik
  useEffect(() => {
    if (user) {
      logout()
    }
  }, [user, logout])

  return (
    <>
      <Navbar />
      <main style={{ overflowX: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}
