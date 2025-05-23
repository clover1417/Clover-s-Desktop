"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { bringToFront, sendToBack, getZIndex, registerWindow } from '../utils/windowManager';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  destination: string;
}

export function Modal({ isOpen, onClose, onConfirm, title, message, destination }: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [zIndex, setZIndex] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Store reference to the close function to avoid stale closures
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);
  
  // Reset position to center
  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    console.log('Modal position reset');
  };
  
  // Handle closing with animation - using simpler approach
  const handleClose = () => {
    // Set state to trigger animation, but don't change position
    if (isOpen) {
      // Maintain current position but trigger closing animation via CSS
      setIsAnimating(true);
      onCloseRef.current();
    }
  };
  
  // Register with the window manager
  useEffect(() => {
    registerWindow('modal', {
      onClose: () => {
        // When closed from outside (e.g., return button), ensure animation state is set
        setIsAnimating(true);
        onCloseRef.current();
      },
      onReset: resetPosition
    });
  }, []);
  
  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Handle opening and closing animations with proper timing
  useEffect(() => {
    // Clean up any existing timeouts
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    if (isOpen) {
      setIsAnimating(true);
      // Only reset position when opening, not when closing
      setPosition({ x: 0, y: 0 });
      
      // Bring to front when opened
      setZIndex(bringToFront('modal'));
    } else if (isAnimating) {
      // When closing, wait for animation to complete
      // Do NOT reset position when closing to avoid teleportation
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match animation duration
    }
    
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isOpen, isAnimating]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsAnimating(false);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isOpen || !modalRef.current) return;
    
    // Bring window to front when grabbed
    setZIndex(bringToFront('modal'));
    if (modalRef.current) {
      modalRef.current.style.zIndex = '2';
    }
    
    setIsDragging(true);
    
    // Store the initial mouse position
    setDragStart({ 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate new position
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setPosition({ x: newX, y: newY });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };
    
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      // Calculate new position
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      setPosition({ x: newX, y: newY });
    };
    
    // Use global event listeners instead
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

  // Add a side effect to listen for external z-index changes
  useEffect(() => {
    const updateZIndexInterval = setInterval(() => {
      if (isOpen && modalRef.current) {
        const newZIndex = getZIndex('modal');
        if (newZIndex !== zIndex) {
          setZIndex(newZIndex);
          modalRef.current.style.zIndex = newZIndex.toString();
        }
      }
    }, 100); // Check every 100ms
    
    return () => clearInterval(updateZIndexInterval);
  }, [isOpen, zIndex]);

  // Use a controlled approach for animation classes
  const modalClassName = `modal-container ${isOpen ? 'modal-show' : ''}`;

  // Don't render anything if modal is closed and not animating
  if (!isOpen && !isAnimating || !mounted) return null;

  const modalContent = (
    <div 
      ref={modalRef}
      className={`modal-container ${isOpen ? 'modal-show' : 'modal-hide'}`}
      onAnimationEnd={handleAnimationEnd}
      style={{
        position: 'fixed',
        top: `calc(50% + ${position.y}px)`,
        left: `calc(50% + ${position.x}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: zIndex
      }}
    >
      <div 
        className="modal-header"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'grab', userSelect: 'none' }}
      >
        <h3 className="modal-title">{title}</h3>
      </div>
      <div className="modal-content">
        <p className="modal-message">{message}</p>
        <p className="modal-destination">{destination}</p>
      </div>
      <div className="modal-actions">
        <button 
          className="modal-button confirm-button"
          onClick={onConfirm}
        >
          Yes!
        </button>
        <button 
          className="modal-button cancel-button"
          onClick={onClose}
        >
          Nope
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
} 