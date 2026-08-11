export default function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <div 
      className="category-filter-scroll flex gap-2" 
      role="group" 
      aria-label="Filter kategori"
      style={{ 
        display: 'flex',
        overflowX: 'auto', 
        paddingBottom: '12px',
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <style>{`.category-filter-scroll::-webkit-scrollbar { display: none; }`}</style>
      {categories.map((cat) => {
        const id = cat.id || cat;
        const label = cat.label || cat;
        return (
          <button
            key={id}
            className={`chip ${activeCategory === id ? 'active' : ''}`}
            style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            onClick={() => onCategoryChange(id)}
            aria-pressed={activeCategory === id}
          >
            {label}
          </button>
        );
      })}
    </div>
  )
}
