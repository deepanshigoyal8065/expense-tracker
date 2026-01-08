import { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'

const VirtualList = ({ 
  items, 
  itemHeight = 80, 
  containerHeight = 400, 
  renderItem,
  overscan = 3 
}) => {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef(null)

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])

  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const offsetY = startIndex * itemHeight

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="overflow-y-auto"
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div key={item._id || startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

VirtualList.propTypes = {
  items: PropTypes.array.isRequired,
  itemHeight: PropTypes.number,
  containerHeight: PropTypes.number,
  renderItem: PropTypes.func.isRequired,
  overscan: PropTypes.number
}

export default VirtualList
