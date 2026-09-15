import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './Maintenance.module.css'

export default function Maintenance() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={styles.maintenanceContainer}>
      <motion.div
        className={styles.maintenanceCard}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div 
          className={styles.logoWrapper}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img src="/logo.png" alt="Logo Desa" className={styles.logo} />
        </motion.div>

        <h1 className={styles.title}>Sistem Dalam Perbaikan</h1>
        
        <p className={styles.description}>
          Mohon maaf, kami sedang melakukan pemeliharaan sistem untuk meningkatkan pengalaman Anda. 
          Website akan segera kembali normal dalam waktu dekat.
        </p>

        <div className={styles.progressContainer}>
          <div className={styles.progressBarBg}>
            <motion.div 
              className={styles.progressBarFill}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>

        <p className={styles.contactText}>
          Terima kasih atas kesabaran Anda.
        </p>
      </motion.div>
      
      <motion.div 
        className={styles.clockWrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <span className={styles.clockText}>
          {time.toLocaleTimeString('id-ID', { hour12: false })}
        </span>
      </motion.div>
    </div>
  )
}
