'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  bringToFront, 
  getZIndex, 
  registerWindow,
  unregisterWindow
} from '../../utils/windowManager';

export interface BaseWindowProps {
  isOpen: boolean;
  onClose: () => void;
  windowId: string;
  title: string;
  width: number;
  height: number;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
}

// Simple z-index management - all windows use these values
const Z_INDEX = {
  BACKGROUND: 1,
  FOREGROUND: 2
};

const BaseWindow: React.FC<BaseWindowProps> = ({ 
  isOpen, 
  onClose, 
  windowId, 
  title, 
  width, 
  height, 
  children,
  maxWidth = '90vw',
  maxHeight = '85vh'
}) => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  
  const windowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const dragOffsetX = useRef(0);
  const dragOffsetY = useRef(0);
  const dragActive = useRef(false);
  const initialRender = useRef(true);

  // Calculate initial center position
  const getCenterPosition = () => ({
    x: Math.max(0, Math.round((window.innerWidth - width) / 2)),
    y: Math.max(0, Math.round((window.innerHeight - height) / 2))
  });

  // Use position state or default center position
  const finalPosition = position || getCenterPosition();

  // Mount effect for client-side rendering
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset position when window opens (after being closed)
  useEffect(() => {
    // If the window opens and we're not in the initial render
    if (isOpen && !initialRender.current) {
      // Only reset to center position if there was no previous position saved
      if (!position) {
        const centerPos = getCenterPosition();
        setPosition(centerPos);
        
        // Apply center position immediately to prevent teleporting
        if (windowRef.current) {
          windowRef.current.style.setProperty('--tx', `${centerPos.x}px`);
          windowRef.current.style.setProperty('--ty', `${centerPos.y}px`);
        }
      } else if (windowRef.current) {
        // If there's a saved position, ensure CSS variables are correctly set
        windowRef.current.style.setProperty('--tx', `${position.x}px`);
        windowRef.current.style.setProperty('--ty', `${position.y}px`);
        windowRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
      }
      
      // Start opening animation
      setIsOpening(true);
      setTimeout(() => setIsOpening(false), 300);
    }
    
    // Window is closing, mark it no longer in initial render
    if (!isOpen) {
      initialRender.current = false;
    }
  }, [isOpen, position]);

  // Handle window opening animation on first render
  useEffect(() => {
    if (isOpen && mounted && initialRender.current) {
      // Start opening animation for initial render
      setIsOpening(true);
      setTimeout(() => {
        setIsOpening(false);
        initialRender.current = false; // Mark initial render as done
      }, 300);
    }
  }, [isOpen, mounted]);

  // Register with window manager
  useEffect(() => {
    if (!isOpen) return;
    
    registerWindow(windowId, {
      onClose: () => handleCloseWithAnimation(),
      onReset: () => {
        const centerPos = getCenterPosition();
        setPosition(centerPos);
        
        // Also update the CSS variables immediately
        if (windowRef.current) {
          windowRef.current.style.setProperty('--tx', `${centerPos.x}px`);
          windowRef.current.style.setProperty('--ty', `${centerPos.y}px`);
          windowRef.current.style.transform = `translate(${centerPos.x}px, ${centerPos.y}px)`;
        }
      },
      onFocus: () => setIsActive(true),
      onBlur: () => setIsActive(false)
    });
    
    // Bring to front on mount
    setIsActive(true);
    bringToFront(windowId);
    
    return () => {
      unregisterWindow(windowId);
    };
  }, [isOpen, windowId, onClose, width, height]);

  // Initialize position on first open
  useEffect(() => {
    if (isOpen && !position && initialRender.current) {
      setPosition(getCenterPosition());
    }
  }, [isOpen, position, width, height]);
  
  // Set custom CSS properties for the animations to preserve position
  useEffect(() => {
    if (!windowRef.current || !finalPosition) return;
    
    // Update CSS variables for position-preserving animations
    windowRef.current.style.setProperty('--tx', `${finalPosition.x}px`);
    windowRef.current.style.setProperty('--ty', `${finalPosition.y}px`);
    
    // If not dragging, apply position through transform
    if (!isDragging) {
      windowRef.current.style.transform = `translate(${finalPosition.x}px, ${finalPosition.y}px)`;
    }
  }, [finalPosition, isDragging]);

  // Dragging functionality
  useEffect(() => {
    if (!isOpen || !headerRef.current || !windowRef.current) return;
    
    const header = headerRef.current;
    const window = windowRef.current;
    
    const handleMouseDown = (e: MouseEvent) => {
      // Ignore clicks on close button
      if ((e.target as HTMLElement).closest(`.${windowId}-window-close`)) {
        return;
      }
      
      e.preventDefault();
      
      // Bring window to front
      setIsActive(true);
      bringToFront(windowId);
      
      // Calculate drag offset
      const rect = window.getBoundingClientRect();
      dragOffsetX.current = e.clientX - rect.left;
      dragOffsetY.current = e.clientY - rect.top;
      
      // Set dragging state
      dragActive.current = true;
      setIsDragging(true);
      
      // Disable animations safely
      window.style.animation = "none";
      window.style.transition = "none";
      
      // Add grabbing cursor
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragActive.current) return;
      
      e.preventDefault();
      
      // Calculate new position
      const newX = e.clientX - dragOffsetX.current;
      const newY = e.clientY - dragOffsetY.current;
      
      // Save the position for animation
      window.style.setProperty('--tx', `${newX}px`);
      window.style.setProperty('--ty', `${newY}px`);
      
      // Apply position directly to DOM during drag
      window.style.transform = `translate(${newX}px, ${newY}px)`;
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (!dragActive.current) return;
      
      e.preventDefault();
      
      // Reset cursor state
      document.body.style.cursor = 'auto';
      document.body.style.userSelect = '';
      
      // Get current position from transform
      const style = getComputedStyle(window);
      const transform = style.transform || style.webkitTransform;
      
      // Extract position from transform matrix
      const matrix = new DOMMatrix(transform);
      const newX = matrix.m41;
      const newY = matrix.m42;
      
      // Update CSS variables for animations
      window.style.setProperty('--tx', `${newX}px`);
      window.style.setProperty('--ty', `${newY}px`);
      
      // Update position state
      setPosition({ x: newX, y: newY });
      
      // Reset dragging state
      dragActive.current = false;
      setIsDragging(false);
      
      // Restore normal transition but keep animation disabled
      window.style.transition = "box-shadow 0.2s ease";
    };
    
    // Apply safe styles when already dragging on mount
    if (isDragging && window) {
      window.style.animation = "none";
      window.style.transition = "none";
    }
    
    // Add event listeners
    header.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Cleanup
    return () => {
      header.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
      document.body.style.userSelect = '';
      dragActive.current = false;
      setIsDragging(false);
    };
  }, [isOpen, windowId]);

  // Handle close with animation
  const handleCloseWithAnimation = () => {
    if (isClosing) return; // Prevent multiple close events
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      // Reset the closing state after the window is fully closed
      // This ensures the state is reset for next time the window opens
      setTimeout(() => {
        setIsClosing(false);
      }, 50);
    }, 300); // Match animation duration
  };

  // Handle clicking on window to focus
  const handleWindowClick = () => {
    if (!isActive) {
      setIsActive(true);
      bringToFront(windowId);
    }
  };

  // Don't render if not mounted or not open
  if (!mounted || (!isOpen && !isClosing)) return null;

  const content = (
    <div 
      className={`${windowId}-window ${isOpening && !isDragging ? `${windowId}-window-opening` : ''} ${isClosing ? `${windowId}-window-closing` : ''}`}
      ref={windowRef}
      onClick={handleWindowClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${width}px`,
        height: `${height}px`,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        zIndex: isActive ? Z_INDEX.FOREGROUND : Z_INDEX.BACKGROUND,
        background: 'white',
        borderRadius: '4px',
        boxShadow: isActive 
          ? '0 8px 16px rgba(0, 0, 0, 0.3)' 
          : '0 4px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: isDragging ? 'none' : 'box-shadow 0.2s ease',
        willChange: 'transform',
        pointerEvents: 'auto'
      }}
    >
      <div 
        className={`${windowId}-window-header`}
        ref={headerRef}
        style={{ 
          cursor: isDragging ? 'grabbing' : 'grab', 
          userSelect: 'none',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #eee'
        }}
      >
        <div className={`${windowId}-window-title`}>{title}</div>
        <div 
          className={`${windowId}-window-close`} 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleCloseWithAnimation();
          }}
          style={{
            cursor: 'pointer',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            background: '#f5f5f5',
            fontSize: '16px'
          }}
        >
          <span>×</span>
        </div>
      </div>
      <div 
        className={`${windowId}-window-content`}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px'
        }}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default BaseWindow; 