"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ImageViewer } from '../ImageViewer';
import { widgetsmithGallery, getRandomGalleryImage, findGalleryImageIndex } from '../../data/widgetsmith';
import { createPortal } from 'react-dom';

interface WidgetProps {
  type: 'wigetsmith' | 'announcement';
  top: string;
  left: string;
  title?: string;
  content?: string[];
  imageSrc?: string;
  imageName?: string;
}

export function Widget({ 
  type, 
  top, 
  left, 
  title, 
  content,
  imageSrc,
  imageName
}: WidgetProps) {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(() => {
    if (!imageSrc) {
      const randomImage = getRandomGalleryImage();
      return {
        src: randomImage.src,
        name: randomImage.name
      };
    }
    return {
      src: imageSrc,
      name: imageName || 'Widgetsmith Image'
    };
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);
  const isWidgetMountedRef = useRef(true);
  // Create a unique ID for this widget instance to prevent conflicts
  const uniqueId = useRef(`widget-${Date.now()}-${Math.floor(Math.random() * 10000)}`).current;
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const finishTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Add a ref to track if the widget is actively showing an ImageViewer
  const isViewerActiveRef = useRef(false);

  // Careful cleanup of rotation timer
  const cleanupRotationTimer = () => {
    if (rotationTimerRef.current) {
      clearInterval(rotationTimerRef.current);
      rotationTimerRef.current = null;
    }
  };

  // Careful cleanup of transition timers
  const cleanupTransitionTimers = () => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    if (finishTimerRef.current) {
      clearTimeout(finishTimerRef.current);
      finishTimerRef.current = null;
    }
  };

  // Make sure we clean up all resources on unmount
  useEffect(() => {
    isWidgetMountedRef.current = true;
    
    return () => {
      isWidgetMountedRef.current = false;
      cleanupRotationTimer();
      cleanupTransitionTimers();
      
      // Ensure the image viewer is closed if the widget is unmounted
      if (isImageViewerOpen) {
        setIsImageViewerOpen(false);
      }
    };
  }, [isImageViewerOpen]);

  // Auto rotate images every 10 seconds
  useEffect(() => {
    // Clean up any existing timer first
    cleanupRotationTimer();
    
    if (type === 'wigetsmith' && !isImageViewerOpen) {
      // Set up the rotation timer
      rotationTimerRef.current = setInterval(() => {
        // Skip if the widget is not mounted anymore
        if (!isWidgetMountedRef.current) {
          cleanupRotationTimer();
          return;
        }
        
        // Get next image index
        const nextIndex = (currentIndexRef.current + 1) % widgetsmithGallery.length;
        currentIndexRef.current = nextIndex;
        
        // Transition animation
        setIsTransitioning(true);
        
        // Change the image after transition out
        cleanupTransitionTimers();
        transitionTimerRef.current = setTimeout(() => {
          if (!isWidgetMountedRef.current) return;
          
          setCurrentImage({
            src: widgetsmithGallery[nextIndex].src,
            name: widgetsmithGallery[nextIndex].name
          });
          
          // Remove transitioning class after image change
          finishTimerRef.current = setTimeout(() => {
            if (!isWidgetMountedRef.current) return;
            setIsTransitioning(false);
          }, 300);
          
        }, 300);
      }, 10000); // 10 seconds
    }
    
    // Cleanup on unmount or when viewer opens
    return () => {
      cleanupRotationTimer();
      cleanupTransitionTimers();
    };
  }, [type, isImageViewerOpen]);

  // Initialize currentIndexRef on first render
  useEffect(() => {
    if (type === 'wigetsmith') {
      currentIndexRef.current = findGalleryImageIndex(currentImage.src);
    }
  }, [type, currentImage.src]);

  // Simplify widget-imageviewer interaction
  const handleWidgetClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling up
    
    if (type === 'wigetsmith') {
      // Clear rotation timer when gallery opens
      cleanupRotationTimer();
      
      // Simply open the image viewer
      setIsImageViewerOpen(true);
    }
  };

  // Simplified close handler
  const handleCloseViewer = () => {
    // Simply update state to hide viewer
    setIsImageViewerOpen(false);
    
    // Update currentIndexRef
    if (type === 'wigetsmith') {
      currentIndexRef.current = findGalleryImageIndex(currentImage.src);
    }
  };

  // Find the correct index for the current image
  const getInitialIndex = () => {
    return findGalleryImageIndex(currentImage.src);
  };

  // Prepare a proper copy of the gallery data to avoid reference issues
  const getGalleryData = () => {
    return widgetsmithGallery.map(img => ({
      src: img.src,
      name: img.name
    }));
  };

  return (
    <>
      <div 
        className={`widget ${type}`}
        style={{
          position: 'absolute',
          top,
          left,
        }}
      >
        <div className="widget-outer" onClick={handleWidgetClick}>
          {type === 'wigetsmith' && (
            <>
              <div className="widget-inner">
                <div className={`widget-image ${isTransitioning ? 'transitioning' : ''}`}>
                  <Image 
                    src={currentImage.src}
                    alt={currentImage.name}
                    width={81} 
                    height={81}
                    className={isTransitioning ? 'image-exit' : 'image-enter'}
                  />
                </div>
              </div>
              <p className="widget-label">Widgetsmith</p>
            </>
          )}
        </div>
      </div>

      {/* Only create portal when actually needed */}
      {isImageViewerOpen && typeof document !== 'undefined' && createPortal(
        <ImageViewer 
          isOpen={isImageViewerOpen}
          onClose={handleCloseViewer}
          images={getGalleryData()}
          initialIndex={getInitialIndex()}
        />,
        document.body
      )}
    </>
  );
} 