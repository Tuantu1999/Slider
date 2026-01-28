import { useEffect, useRef, useState } from "react";

const Slider = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);
  const skipClickRef = useRef(false);

  const CARD_WIDTH = 300;
  const MIN_DRAG_DISTANCE = 40;
  const AUTO_SCROLL_INTERVAL = 3000;
  const totalItems = items.length;

  useEffect(() => {
    if (!isAutoPlay || isDragging) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(autoPlayRef.current); // Cleanup function
  }, [isAutoPlay, isDragging, totalItems]);

  const handleMouseDown = (e) => {
    if (isDragging) return;
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragDistance(0);
    setIsAutoPlay(false);
    skipClickRef.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const currentDrag = e.clientX - dragStart;
    if (Math.abs(currentDrag) > 5) skipClickRef.current = true;
    setDragDistance(currentDrag);
  };

  const handleTouchStart = (e) => {
    if (isDragging) return;
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setDragDistance(0);
    setIsAutoPlay(false);
    skipClickRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentDrag = e.touches[0].clientX - dragStart;
    if (Math.abs(currentDrag) > 5) skipClickRef.current = true;
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
        setCurrentIndex((prev) => (prev + 1) % totalItems);
      } else {
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

  const handleClick = (e, landingPage) => {
    if (skipClickRef.current || Math.abs(dragDistance) >= MIN_DRAG_DISTANCE) {
      e.stopPropagation();
      skipClickRef.current = false;
      return;
    }

    if (landingPage && landingPage.startsWith("http")) {
      window.open(landingPage, "_blank");
    }
  };

  return (
    <div
      className={`slider-container elevation-3 ${isDragging ? "dragging" : ""}`}
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
              <img
                src={item.image}
                alt={item.title}
                onClick={(e) => handleClick(e, item.landing_page)}
                className="slider-image"
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
