import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import SEO from '@/components/ui/SEO'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, login } = useAuth()
  const navigate = useNavigate()

  // If already logged in, redirect
  if (user) {
    navigate('/admin/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Mohon isi email dan kata sandi.')
      return
    }

    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message || 'Email atau kata sandi salah. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Login Admin" />
      <div className="login-wrapper">
        <style>{`
          .login-wrapper {
            display: flex;
            min-height: 100vh;
            flex-direction: column;
          }
          @media (min-width: 768px) {
            .login-wrapper {
              flex-direction: row;
            }
          }
          
          /* PANEL KIRI (BRANDING) */
          .login-brand {
            position: relative;
            background-color: var(--color-primary);
            color: #fff;
            padding: 40px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            flex: 1;
            min-height: 35vh; /* For mobile */
          }
        .login-brand-pattern {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          opacity: 0.1;
          background-image: repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 16px);
          pointer-events: none;
        }
        .login-brand-content {
          position: relative;
          z-index: 1;
          max-width: 480px;
          margin: auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
        }
        .btn-back-glass {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 99px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
          align-self: flex-start;
          margin-bottom: clamp(30px, 8vw, 80px);
        }
        .btn-back-glass:hover {
          background: rgba(255,255,255,0.2);
        }
        .brand-text h1 {
          font-size: clamp(32px, 5vw, 48px);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .brand-text p {
          font-size: clamp(15px, 2vw, 18px);
          line-height: 1.6;
          opacity: 0.85;
          margin: 0;
        }

        /* PANEL KANAN (FORM) */
        .login-form-side {
          background-color: var(--color-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          flex: 1;
          position: relative;
        }
        
        /* Mobile overlap effect */
        @media (max-width: 767px) {
          .login-brand {
            padding: 24px;
            padding-bottom: 48px;
            flex: 0 0 auto;
            min-height: auto;
          }
          .btn-back-glass {
            margin-bottom: 24px;
          }
          .brand-text h1 {
            font-size: 28px;
            margin-bottom: 0;
          }
          .brand-text p {
            display: none; /* Hide long text on mobile to save space */
          }
          .login-form-side {
            border-top-left-radius: 24px;
            border-top-right-radius: 24px;
            margin-top: -24px;
            z-index: 2;
            padding: 32px 24px 60px 24px;
            box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
            align-items: flex-start; /* Form goes to top instead of center */
          }
          .login-brand-content {
            justify-content: flex-start;
          }
        }

        .login-form-container {
          width: 100%;
          max-width: 400px;
        }
        .login-icon-box {
          width: 64px;
          height: 64px;
          background: var(--color-primary-10);
          color: var(--color-primary);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
        .login-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--color-text);
          margin: 0 0 8px;
          letter-spacing: -0.02em;
          text-align: center;
        }
        .login-subtitle {
          color: var(--color-text-muted);
          margin: 0 0 32px;
          font-size: 15px;
          text-align: center;
        }
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 8px;
        }
        .form-input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          background: var(--color-surface-alt);
          font-size: 15px;
          transition: all 0.2s;
          color: var(--color-text);
        }
        .form-input:focus {
          outline: none;
          border-color: var(--color-primary);
          background: var(--color-surface);
          box-shadow: 0 0 0 4px var(--color-primary-10);
        }
        .btn-submit {
          width: 100%;
          padding: 16px;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-top: 16px;
        }
        .btn-submit:hover {
          background: var(--color-primary-dark);
        }
        .btn-submit:active {
          transform: scale(0.98);
        }
        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .error-alert {
          background: #fee2e2;
          color: #991b1b;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #fecaca;
        }
      `}</style>

      {/* PANEL KIRI (BRANDING) */}
      <div className="login-brand">
        <div className="login-brand-pattern" />
        <div className="login-brand-content">
          <a href="/" className="btn-back-glass">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Kembali ke Website
          </a>
          
          <div className="brand-text">
            <h1>Selamat Datang di Portal Admin</h1>
            <p>Kelola etalase UMKM, pantau pesan dari masyarakat, dan kembangkan potensi ekonomi digital Desa Gumelar Kidul secara terpusat.</p>
          </div>
        </div>
      </div>

      {/* PANEL KANAN (FORM LOGIN) */}
      <div className="login-form-side">
        <div className="login-form-container">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <img src="/logo.png" alt="Logo Desa" style={{ width: 80, height: 80, objectFit: 'contain' }} />
          </div>
          
          <h2 className="login-title">Panel Admin</h2>
          <p className="login-subtitle">Silakan masuk menggunakan kredensial yang valid.</p>

          {error && (
            <div className="error-alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="form-label">Alamat Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="Masukkan alamat email admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            
            <div>
              <label className="form-label">Kata Sandi</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: '48px' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                  title={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Memverifikasi...' : 'Masuk Sekarang →'}
            </button>
          </form>


        </div>
      </div>
    </div>
    </>
  )
}
