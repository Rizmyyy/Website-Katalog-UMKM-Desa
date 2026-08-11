import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({ children, className = '', delay = 0, style = {} }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const delayClass = delay > 0 ? `delay-${delay}` : ''

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'visible' : ''} ${delayClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
