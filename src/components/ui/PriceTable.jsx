export default function PriceTable({ items }) {
  if (!items || items.length === 0) return null

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <div style={{ 
            fontWeight: 700, 
            fontSize: '16px', 
            color: '#1f2937',
            maxWidth: '60%'
          }}>
            {item.namaProduk}
          </div>
          
          {/* Dotted Leader (Garis Titik-Titik Penghubung) */}
          <div style={{ 
            flex: 1, 
            borderBottom: '2px dotted var(--color-border)', 
            margin: '0 16px', 
            opacity: 0.7,
            transform: 'translateY(-4px)'
          }}></div>
          
          <div style={{ 
            fontWeight: 800, 
            fontSize: '15px', 
            color: '#059669', // Emerald 600
            backgroundColor: '#d1fae5', // Emerald 100
            padding: '6px 16px', 
            borderRadius: '100px',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.15)'
          }}>
            {formatRupiah(item.harga)}
          </div>
        </div>
      ))}
    </div>
  )
}
