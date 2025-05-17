"use client";

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

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
  const modalRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
      setPosition({ x: 0, y: 0 });
    } else if (isAnimating) {
      // When closing, wait for animation to complete
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
        zIndex: 10000
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
          Nvm.
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
} 