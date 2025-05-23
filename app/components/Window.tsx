"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import { useVolume } from '../context/VolumeContext';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { closeAllWindows, resetAllWindowPositions, bringToFront } from '../utils/windowManager';
import { createPortal } from 'react-dom';

interface WindowProps {
  children?: React.ReactNode;
}

// Separate Reset Confirmation Modal component
function ResetConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [zIndex, setZIndex] = useState(1);
  const modalRef = useRef<HTMLDivElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Handle opening and closing animations
  useEffect(() => {
    // Clean up any existing timeouts
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    if (isOpen) {
      setIsAnimating(true);
      setIsClosing(false);
      // Don't reset position when opening if it's already been positioned
      if (position.x === 0 && position.y === 0) {
      setPosition({ x: 0, y: 0 });
      }
      
      // Bring to front when opened
      setZIndex(bringToFront('resetModal'));
    } else if (isAnimating && !isClosing) {
      // When closing, wait for animation to complete
      // Do NOT reset position during close animation
      setIsClosing(true);
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        setIsClosing(false);
      }, 300); // Match animation duration
    }
    
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isOpen, isAnimating, position, isClosing]);

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsAnimating(false);
      setIsClosing(false);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isOpen || !modalRef.current) return;
    
    // Bring window to front when grabbed
    setZIndex(bringToFront('resetModal'));
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

  // Don't render anything if modal is closed and not animating
  if ((!isOpen && !isAnimating) || !mounted) return null;

  return createPortal(
    <div 
      ref={modalRef}
      className={`modal-container ${isOpen && !isClosing ? 'modal-show' : 'modal-hide'}`}
      onAnimationEnd={handleAnimationEnd}
      style={{
        position: 'fixed',
        top: `calc(50% + ${position.y}px)`,
        left: `calc(50% + ${position.x}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: zIndex,
        animation: isOpen && !isClosing ? 'popIn 0.3s forwards' : 'popOut 0.3s forwards'
      }}
    >
      <div 
        className="modal-header"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'grab', userSelect: 'none' }}
      >
        <h3 className="modal-title">Reset Windows</h3>
      </div>
      <div className="modal-content">
        <p className="modal-message">Do you want to close all windows and reset their positions?</p>
        <p className="modal-destination">This will return everything to default</p>
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
    </div>,
    document.body
  );
}

export function Window({ children }: WindowProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const { volume, setVolume, showVolumeSlider, setShowVolumeSlider } = useVolume();
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Format time as HH:MM AM/PM
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).replace(/am|pm/i, match => match.toUpperCase());
  };
  
  // Format date as MM/DD/YYYY
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString(undefined, {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const toggleVolumeSlider = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
  };

  // Close volume slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const volumeControl = document.querySelector('.taskbar-volume-control');
      const volumeSlider = document.querySelector('.taskbar-volume-slider');
      const speakerIcon = document.querySelector('.speaker-icon');
      
      // Don't close if clicking on controls or slider elements
      if (
        !showVolumeSlider || 
        !volumeControl || 
        !speakerIcon
      ) {
        return;
      }
      
      // Check if the click is outside both the speaker icon and volume control
      const isClickOutside = !volumeControl.contains(target) && 
                             !speakerIcon.contains(target);
      
      if (isClickOutside) {
        setShowVolumeSlider(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVolumeSlider, setShowVolumeSlider]);

  // Stop propagation of events on the volume slider
  const handleSliderMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const handleSliderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleReturnButtonClick = () => {
    // If the modal is already open, just bring it to front
    if (showResetConfirmation) {
      // Use our z-index management system to bring the reset modal to front
      bringToFront('resetModal');
    } else {
      // Otherwise, open it for the first time
      setShowResetConfirmation(true);
    }
  };
  
  const handleConfirmReset = () => {
    // Set closing state in the modal component
    setIsClosingModal(true);
    
    // Delay the actual closing and reset actions to allow animation to complete
    setTimeout(() => {
    // Close the confirmation dialog
    setShowResetConfirmation(false);
      setIsClosingModal(false);
    
    // Close all windows and reset their positions
    closeAllWindows();
    resetAllWindowPositions();
    
    console.log('All windows closed and positions reset');
    }, 300); // Match animation duration
  };
  
  const handleCancelReset = () => {
    // Set closing state in the modal component
    setIsClosingModal(true);
    
    // Delay the actual closing to allow animation to complete
    setTimeout(() => {
    setShowResetConfirmation(false);
      setIsClosingModal(false);
    }, 300); // Match animation duration
  };

  return (
    <div className="window-container">
      <div className="window">
        <div className="window-frame">
          {/* Main container with shadow */}
          <div className="main-container">
            {/* Upper part */}
            <div className="upper-part">
              <div className="title-bar">
                <div className="title-inner">
                  <p className="title-text">clover's desktop</p>
                </div>
              </div>
            </div>
            
            {/* Lower part */}
            <div className="lower-part">
              {/* Background grid */}
              <div className="window-background">
                <div className="background-inner">
                  <div className="center-text">
                    <h1 className="hello-text">Hello world! &lt;3</h1>
                    <p className="username-text">@ItsClover!</p>
                  </div>
                </div>
              </div>
              
              {/* Taskbar */}
              <div className="taskbar">
                <div 
                  className="return-button"
                  onClick={handleReturnButtonClick}
                  style={{ cursor: 'pointer' }}
                >
                  <Image 
                    src="/assets/Return.png"
                    alt="Return"
                    width={22}
                    height={22}
                  />
                </div>
                <div className="taskbar-right">
                  <div className="speaker-icon" onClick={toggleVolumeSlider}>
                    {volume === 0 ? (
                      <FiVolumeX size={18} color="var(--text-color)" />
                    ) : (
                      <FiVolume2 size={18} color="var(--text-color)" />
                    )}
                    
                    {showVolumeSlider && (
                      <div className="taskbar-volume-control" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="taskbar-volume-slider"
                          onMouseDown={handleSliderMouseDown}
                          onClick={handleSliderClick}
                        />
                      </div>
                    )}
                  </div>
                  <div className="time-info">
                    <p className="time">{formatTime(currentTime)}</p>
                    <p className="date">{formatDate(currentTime)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {children}
      </div>
      
      {/* Use the separate ResetConfirmationModal instead of the generic Modal */}
      <ResetConfirmationModal
        isOpen={showResetConfirmation && !isClosingModal}
        onClose={handleCancelReset}
        onConfirm={handleConfirmReset}
      />
    </div>
  );
} 