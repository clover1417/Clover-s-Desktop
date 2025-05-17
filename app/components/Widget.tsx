"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ImageViewer } from './ImageViewer';
import { widgetsmithGallery, getRandomGalleryImage, findGalleryImageIndex } from '../utils/galleryImages';

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

  // Auto rotate images every 10 seconds
  useEffect(() => {
    if (type === 'wigetsmith' && !isImageViewerOpen) {
      // Set up the rotation timer
      rotationTimerRef.current = setInterval(() => {
        // Get next image index
        const nextIndex = (currentIndexRef.current + 1) % widgetsmithGallery.length;
        currentIndexRef.current = nextIndex;
        
        // Transition animation
        setIsTransitioning(true);
        
        // Change the image after transition out
        setTimeout(() => {
          setCurrentImage({
            src: widgetsmithGallery[nextIndex].src,
            name: widgetsmithGallery[nextIndex].name
          });
          
          // Remove transitioning class after image change
          setTimeout(() => {
            setIsTransitioning(false);
          }, 300);
        }, 300);
      }, 10000); // 10 seconds
    }
    
    // Cleanup on unmount or when viewer opens
    return () => {
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
        rotationTimerRef.current = null;
      }
    };
  }, [type, isImageViewerOpen]);

  // Initialize currentIndexRef on first render
  useEffect(() => {
    if (type === 'wigetsmith') {
      currentIndexRef.current = findGalleryImageIndex(currentImage.src);
    }
  }, []);

  const handleWidgetClick = () => {
    if (type === 'wigetsmith') {
      console.log("Opening viewer with image:", currentImage.src);
      setIsImageViewerOpen(true);
      
      // Clear rotation timer when gallery opens
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
        rotationTimerRef.current = null;
      }
    }
  };

  const handleCloseViewer = () => {
    console.log("Closing viewer");
    setIsImageViewerOpen(false);
  };

  // Find the correct index for the current image
  const getInitialIndex = () => {
    const index = findGalleryImageIndex(currentImage.src);
    console.log("Initial index:", index, "for src:", currentImage.src);
    return index;
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
          
          {type === 'announcement' && (
            <>
              <div className="widget-inner">
                <p className="widget-title">{title || 'Title'}</p>
                <div className="widget-dividers">
                  <div className="divider" />
                  <div className="divider" />
                  <div className="divider" />
                </div>
                <div className="widget-content">
                  {content?.map((line, index) => (
                    <p key={index} className="content-line">{line}</p>
                  )) || (
                    <>
                      <p className="content-line">TestTestTestTestTest</p>
                      <p className="content-line">TestTestTestTestTest</p>
                    </>
                  )}
                </div>
              </div>
              <p className="widget-label">Announcement</p>
            </>
          )}
        </div>
      </div>

      {isImageViewerOpen && (
        <ImageViewer 
          isOpen={isImageViewerOpen}
          onClose={handleCloseViewer}
          images={widgetsmithGallery}
          initialIndex={getInitialIndex()}
        />
      )}
    </>
  );
} 