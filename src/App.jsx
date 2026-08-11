import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import { UmkmProvider } from '@/hooks/useUmkm'
import { ToastProvider } from '@/components/admin/Toast'
import ReactGA from 'react-ga4'

const TRACKING_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
if (TRACKING_ID && TRACKING_ID !== 'G-XXXXXXXXXX') {
  ReactGA.initialize(TRACKING_ID)
}

import Layout from '@/components/layout/Layout'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'

import Beranda from '@/pages/Beranda'
import SemuaUmkm from '@/pages/SemuaUmkm'
import DetailUmkm from '@/pages/DetailUmkm'
import NotFound from '@/pages/NotFound'
import Galeri from '@/pages/Galeri'
import ProfilDesa from '@/pages/ProfilDesa'

import AdminLogin from '@/pages/admin/AdminLogin'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminUmkmForm from '@/pages/admin/AdminUmkmForm'
import AdminGaleri from '@/pages/admin/AdminGaleri'
import AdminDesaInfo from '@/pages/admin/AdminDesaInfo'
import AdminPesan from '@/pages/admin/AdminPesan'
import GabungUmkm from '@/pages/GabungUmkm'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function RouteTracker() {
  const location = useLocation()
  useEffect(() => {
    if (TRACKING_ID && TRACKING_ID !== 'G-XXXXXXXXXX') {
      ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search })
    }
  }, [location])
  return null
}

import { useDesa } from '@/hooks/useDesa'

function HeadUpdater() {
  const { desaInfo } = useDesa()
  
  useEffect(() => {
    if (desaInfo?.identitas) {
      // Update Title
      document.title = desaInfo.identitas.namaWeb || 'UMKM Gumelar Kidul'
      
      // Update Favicon
      const iconUrl = desaInfo.identitas.favicon || desaInfo.identitas.logo || '/favicon.svg'
      let link = document.querySelector("link[rel~='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = iconUrl
    }
  }, [desaInfo?.identitas])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteTracker />
      <HeadUpdater />
      <AuthProvider>
        <UmkmProvider>
          <ToastProvider>
            <Routes>
              {/* Public routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Beranda />} />
                <Route path="/umkm" element={<SemuaUmkm />} />
                <Route path="/umkm/:id" element={<DetailUmkm />} />
                <Route path="/galeri" element={<Galeri />} />
                <Route path="/profil" element={<ProfilDesa />} />
                <Route path="/gabung" element={<GabungUmkm />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="umkm/tambah" element={<AdminUmkmForm />} />
                <Route path="umkm/edit/:id" element={<AdminUmkmForm />} />
                <Route path="galeri" element={<AdminGaleri />} />
                <Route path="pengaturan" element={<AdminDesaInfo />} />
                <Route path="pesan" element={<AdminPesan />} />
              </Route>
            </Routes>
          </ToastProvider>
        </UmkmProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
