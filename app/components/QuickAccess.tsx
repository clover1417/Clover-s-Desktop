"use client";

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Modal } from './Modal';

interface QuickAccessProps {
  top: string;
  left: string;
}

export function QuickAccess({ top, left }: QuickAccessProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isClickable, setIsClickable] = useState(true);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function for any timeouts
  const cleanupTimeouts = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Handle icon click with tracking
  const handleIconClick = useCallback((buttonId: string, link: string, title: string) => {
    if (!isClickable) return;
    
    setIsClickable(false);
    
    // If a modal is already open and it's the same button, just close it
    if (modalOpen && activeButton === buttonId) {
      setModalOpen(false);
      setActiveButton(null);
      
      // Re-enable clicking after a delay
      clickTimeoutRef.current = setTimeout(() => {
        setIsClickable(true);
      }, 300);
      return;
    }
    
    // If a modal is already open but it's a different button
    if (modalOpen) {
      setModalOpen(false);
      
      // Add a short delay before opening the new modal
      closeTimeoutRef.current = setTimeout(() => {
        setCurrentLink(link);
        setModalTitle(title);
        setModalMessage('You are about to leave this site and visit:');
        setActiveButton(buttonId);
        setModalOpen(true);
        
        // Re-enable clicking after a delay
        clickTimeoutRef.current = setTimeout(() => {
          setIsClickable(true);
        }, 300);
      }, 200);
    } else {
      // Normal flow when no modal is open
      setCurrentLink(link);
      setModalTitle(title);
      setModalMessage('You are about to leave this site and visit:');
      setActiveButton(buttonId);
      setModalOpen(true);
      
      // Re-enable clicking after a delay
      clickTimeoutRef.current = setTimeout(() => {
        setIsClickable(true);
      }, 300);
    }
  }, [isClickable, modalOpen, activeButton]);

  const handleYouTubeClick = () => {
    handleIconClick(
      'youtube', 
      'https://www.youtube.com/@zegzropat', 
      'Open YouTube Channel'
    );
  };

  const handleDiscordClick = () => {
    handleIconClick(
      'discord', 
      'https://discord.gg/rMHyQpK8PR', 
      'Join Discord Server'
    );
  };

  const handleConfirm = () => {
    if (currentLink) {
      window.open(currentLink, '_blank');
    }
    setModalOpen(false);
    setActiveButton(null);
  };

  const handleClose = () => {
    setModalOpen(false);
    setActiveButton(null);
    
    // Add a short delay before allowing new clicks
    clickTimeoutRef.current = setTimeout(() => {
      setIsClickable(true);
    }, 100);
  };

  // Clean up timeouts on unmount
  React.useEffect(() => {
    return () => {
      cleanupTimeouts();
    };
  }, []);

  return (
    <>
      <div 
        className="quick-access"
        style={{
          position: 'absolute',
          top,
          left,
        }}
      >
        <div 
          className={`quick-access-item ${!isClickable ? 'disabled' : ''}`}
          onClick={handleYouTubeClick}
          title="Visit YouTube Channel"
          style={{ pointerEvents: isClickable ? 'auto' : 'none' }}
        >
          <div className="quick-icon">
            <Image 
              src="/assets/Youtube.png" 
              alt="YouTube" 
              width={33} 
              height={24}
            />
          </div>
          <p className="quick-label">YouTube</p>
        </div>
        
        <div 
          className={`quick-access-item ${!isClickable ? 'disabled' : ''}`}
          onClick={handleDiscordClick}
          title="Join Discord Server"
          style={{ pointerEvents: isClickable ? 'auto' : 'none' }}
        >
          <div className="quick-icon">
            <Image 
              src="/assets/Discord.png" 
              alt="Discord" 
              width={33} 
              height={24}
            />
          </div>
          <p className="quick-label">Discord</p>
        </div>
      </div>

      <Modal 
        isOpen={modalOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={modalTitle}
        message={modalMessage}
        destination={currentLink}
      />
    </>
  );
} 