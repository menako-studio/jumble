import React, { useRef, useState, useEffect, type ReactNode } from 'react';

interface HorizontalScrollerProps {
  children: ReactNode;
  className?: string;
}

export const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({ children, className = '' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScrollability = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [children]);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Convert vertical mouse wheel to horizontal scroll when hovering
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    if (e.deltaY !== 0) {
      scrollRef.current.scrollLeft += e.deltaY;
      checkScrollability();
    }
  };

  // Mouse drag-to-scroll support
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
    checkScrollability();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className={`relative flex items-center group w-full ${className}`}>
      {/* Left Arrow Button */}
      {canScrollLeft && (
        <button
          onClick={() => scrollBy(-240)}
          className="absolute left-0 z-20 w-8 h-8 rounded-full bg-[#182329]/90 border border-white/20 hover:bg-white/20 text-white flex items-center justify-center font-black text-sm shadow-xl transition-all cursor-pointer backdrop-blur-sm -translate-x-1"
          aria-label="Scroll left"
        >
          ‹
        </button>
      )}

      {/* Left Gradient Fade Mask */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#131f24] to-transparent pointer-events-none z-10" />
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScrollability}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {children}
      </div>

      {/* Right Gradient Fade Mask */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#131f24] to-transparent pointer-events-none z-10" />
      )}

      {/* Right Arrow Button */}
      {canScrollRight && (
        <button
          onClick={() => scrollBy(240)}
          className="absolute right-0 z-20 w-8 h-8 rounded-full bg-[#182329]/90 border border-white/20 hover:bg-white/20 text-white flex items-center justify-center font-black text-sm shadow-xl transition-all cursor-pointer backdrop-blur-sm translate-x-1"
          aria-label="Scroll right"
        >
          ›
        </button>
      )}
    </div>
  );
};
