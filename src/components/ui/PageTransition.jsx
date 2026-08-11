import { motion } from 'framer-motion'

const slideVariants = {
  initial: {
    opacity: 0,
    x: 40, // Mulai dari agak kanan
  },
  enter: {
    opacity: 1,
    x: 0, // Posisi normal
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1], // Kurva ease-out yang estetik seperti Instagram
    },
  },
  exit: {
    opacity: 0,
    x: -40, // Geser ke kiri saat hilang
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    },
  },
}

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={slideVariants}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  )
}
