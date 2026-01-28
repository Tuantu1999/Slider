import { useEffect, useRef, useState } from "react";

const Slider = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);

  const CARD_WIDTH = 300;
  const MIN_DRAG_DISTANCE = 40;
  const AUTO_SCROLL_INTERVAL = 3000;
  const totalItems = items.length;

  useEffect(() => {
    if (!isAutoPlay || isDragging) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlay, isDragging, totalItems]);

  const handleMouseDown = (e) => {
    if (isDragging) return;
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragDistance(0);
    setIsAutoPlay(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentDrag = e.clientX - dragStart;
    setDragDistance(currentDrag);
  };

  const handleTouchStart = (e) => {
    if (isDragging) return;
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setDragDistance(0);
    setIsAutoPlay(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentDrag = e.touches[0].clientX - dragStart;
    setDragDistance(currentDrag);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    handleDragEnd(e.clientX);
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    handleDragEnd(e.changedTouches[0].clientX);
  };

  const handleDragEnd = (endX) => {
    const distance = dragStart - endX;

    if (Math.abs(distance) >= MIN_DRAG_DISTANCE) {
      if (distance > 0) {
        // Dragged left, move to next (infinite loop)
        setCurrentIndex((prev) => (prev + 1) % totalItems);
      } else {
        // Dragged right, move to previous (infinite loop)
        setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
      }
    }

    setIsDragging(false);
    setDragDistance(0);
    setIsAutoPlay(true);
  };

  const handleMouseEnter = () => {
    setIsAutoPlay(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlay(true);
  };

  const handleCardClick = (e, landingPage) => {
    // Prevent click if dragging
    if (Math.abs(dragDistance) >= MIN_DRAG_DISTANCE) {
      e.stopPropagation();
      return;
    }

    if (landingPage && landingPage.startsWith("http")) {
      window.open(landingPage, "_blank");
    }
  };

  return (
    <div
      className="slider-container elevation-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={sliderRef}
    >
      <div
        className="slider-track"
        style={{
          transform: `translateX(calc(-${currentIndex * CARD_WIDTH}px + ${isDragging ? dragDistance : 0}px))`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="slider-card">
            <div className="card-content">
              <p>{item.title}</p>
              <img
                src={item.image}
                alt={item.title}
                onClick={(e) => handleCardClick(e, item.landing_page)}
                className="slider-image"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
