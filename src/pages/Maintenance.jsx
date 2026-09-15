import { motion } from 'framer-motion'
import styles from './Maintenance.module.css'

export default function Maintenance() {
  return (
    <div className={styles.maintenanceContainer}>
      <motion.div
        className={styles.maintenanceCard}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.div 
          className={styles.iconWrapper}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
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
    </div>
  )
}
