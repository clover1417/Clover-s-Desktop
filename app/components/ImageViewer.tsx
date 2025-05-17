"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{src: string, name: string}>;
  initialIndex?: number;
}

export function ImageViewer({ isOpen, onClose, images, initialIndex = 0 }: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset scale and position when opening new image or changing image
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsImageLoaded(false);
      setIsFirstLoad(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, currentIndex]);

  // Reset current index when modal opens
  useEffect(() => {
    if (isOpen) {
      const validIndex = Math.max(0, Math.min(initialIndex, Math.max(0, images.length - 1)));
      setCurrentIndex(validIndex);
    }
  }, [isOpen, initialIndex, images.length]);

  const handlePrevImage = () => {
    if (currentIndex > 0 && !isTransitioning) {
      // Start transition animation
      setIsTransitioning(true);
      setSlideDirection('right');
      
      // Reset position and scale for clean transitions
      setPosition({ x: 0, y: 0 });
      setScale(1);
      
      // Change the image after transition out
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        
        // Remove transitioning class after image change
        setTimeout(() => {
          setIsTransitioning(false);
          setSlideDirection(null);
        }, 300);
      }, 300);
    }
  };

  const handleNextImage = () => {
    if (currentIndex < images.length - 1 && !isTransitioning) {
      // Start transition animation
      setIsTransitioning(true);
      setSlideDirection('left');
      
      // Reset position and scale for clean transitions
      setPosition({ x: 0, y: 0 });
      setScale(1);
      
      // Change the image after transition out
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        
        // Remove transitioning class after image change
        setTimeout(() => {
          setIsTransitioning(false);
          setSlideDirection(null);
        }, 300);
      }, 300);
    }
  };

  const handleDotClick = (index: number) => {
    if (index !== currentIndex && !isTransitioning) {
      // Start transition animation
      setIsTransitioning(true);
      setSlideDirection(index > currentIndex ? 'left' : 'right');
      
      // Reset position and scale for clean transitions
      setPosition({ x: 0, y: 0 });
      setScale(1);
      
      // Change the image after transition out
      setTimeout(() => {
        setCurrentIndex(index);
        
        // Remove transitioning class after image change
        setTimeout(() => {
          setIsTransitioning(false);
          setSlideDirection(null);
        }, 300);
      }, 300);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // Zoom in
      setScale(prev => Math.min(prev + 0.1, 3));
    } else {
      // Zoom out
      setScale(prev => Math.max(prev - 0.1, 0.5));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    // Allow dragging regardless of zoom level
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    e.preventDefault(); // Prevent default behavior
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    
    setPosition({
      x: newX,
      y: newY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Key press handler for arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, isTransitioning, images.length]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mouseleave', handleMouseUp);
      
      return () => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mouseleave', handleMouseUp);
      };
    }
  }, [isOpen]);

  // Don't render if not mounted or not open
  if (!mounted || !isOpen) return null;

  // Handle empty images array
  const safeImages = images.length > 0 ? images : [{ 
    src: '/assets/Resource.png', 
    name: 'Default Image' 
  }];
  
  const safeIndex = Math.min(currentIndex, safeImages.length - 1);
  const currentImage = safeImages[safeIndex];

  // Calculate correct transform based on state
  const getTransformStyle = () => {
    // Always start in the center with no transitions during first load
    if (isFirstLoad) {
      return {
        transform: `translate(-50%, -50%) scale(${scale})`,
        translate: `${position.x}px ${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isImageLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        animation: 'none'
      };
    }
    
    // When dragging or zooming
    if (!isTransitioning) {
      return {
        transform: `translate(-50%, -50%) scale(${scale})`,
        translate: `${position.x}px ${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isImageLoaded ? 1 : 0,
        transition: isImageLoaded ? 'opacity 0.3s ease-in-out' : 'none'
      };
    }
    
    // During transitions, only apply basic centered positioning
    return {
      transform: 'translate(-50%, -50%)',
      cursor: 'grab',
      opacity: isImageLoaded ? 1 : 0
    };
  };

  const viewerContent = (
    <div className="image-viewer-overlay">
      <div className="image-viewer-container" onClick={(e) => e.stopPropagation()}>
        {/* Left Navigation Arrow */}
        {safeIndex > 0 && (
          <button 
            className="image-viewer-nav-btn left"
            onClick={handlePrevImage}
            aria-label="Previous image"
            disabled={isTransitioning}
          >
            <FiChevronLeft size={30} />
          </button>
        )}
        {/* Image Container */}
        <div 
          className="image-viewer-content-wrapper"
          onClick={onClose}
        >
          <div 
            ref={contentRef}
            className={`image-viewer-content ${isFirstLoad ? 'initial-load' : ''}`}
            style={getTransformStyle()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
          >
            <Image
              src={currentImage.src}
              alt={currentImage.name}
              width={800}
              height={800}
              className={`image-viewer-img ${isTransitioning ? (slideDirection === 'left' ? 'slide-exit-left' : 'slide-exit-right') : (isFirstLoad ? '' : 'slide-enter')}`}
              draggable={false}
              unoptimized
              priority
              onLoad={() => {
                setIsImageLoaded(true);
                // After a small delay, remove first load state to enable animations
                setTimeout(() => {
                  setIsFirstLoad(false);
                }, 100);
              }}
            />
            <div className="image-viewer-name">{currentImage.name}</div>
          </div>
        </div>
        
        {/* Right Navigation Arrow */}
        {safeIndex < safeImages.length - 1 && (
          <button 
            className="image-viewer-nav-btn right"
            onClick={handleNextImage}
            aria-label="Next image"
            disabled={isTransitioning}
          >
            <FiChevronRight size={30} />
          </button>
        )}
        
        {/* Pagination Dots */}
        {safeImages.length > 1 && (
          <div className="image-viewer-pagination">
            <div className="pagination-dots">
              {safeImages.map((_, index) => (
                <button 
                  key={index}
                  className={`pagination-dot ${safeIndex === index ? 'active' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to image ${index + 1}`}
                  disabled={isTransitioning}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Close Button */}
        <button 
          className="image-viewer-close-btn"
          onClick={onClose}
        >
          Leave
        </button>
      </div>
    </div>
  );
  
  try {
    return createPortal(viewerContent, document.body);
  } catch (e) {
    console.error("Portal rendering error:", e);
    return null;
  }
} 