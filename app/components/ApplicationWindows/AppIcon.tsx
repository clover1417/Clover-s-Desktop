"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import windows with no SSR to avoid hydration issues
const AboutWindow = dynamic(() => import('./AboutWindow'), { ssr: false });
const GalleryWindow = dynamic(() => import('./GalleryWindow'), { ssr: false });
const StuffWindow = dynamic(() => import('./StuffWindow'), { ssr: false });
const ContactWindow = dynamic(() => import('./ContactWindow'), { ssr: false });
const PatreonWindow = dynamic(() => import('./PatreonWindow'), { ssr: false });

interface AppIconProps {
  name: string;
  icon: string;
  top: string;
  left: string;
  onClick?: () => void;
}

export function AppIcon({ name, icon, top, left, onClick }: AppIconProps) {
  const router = useRouter();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isStuffOpen, setIsStuffOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isPatreonOpen, setIsPatreonOpen] = useState(false);
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    // Generate random rotation between -15 and 15 degrees
    const randomRotation = Math.floor(Math.random() * 31) - 15;
    e.currentTarget.style.setProperty('--random-rotation', `${randomRotation}deg`);
  };

  const handleClick = () => {
    // Route to separate pages for works and wiki
    if (name === 'works') {
      router.push('/works');
      return; // Add return to prevent further execution
    } else if (name === 'wiki') {
      router.push('/wiki');
      return; // Add return to prevent further execution
    }
    
    // Toggle windows for other apps
    if (name === 'about') {
      setIsAboutOpen(prev => !prev);
    } else if (name === 'gallery') {
      setIsGalleryOpen(prev => !prev);
    } else if (name === 'stuff') {
      setIsStuffOpen(prev => !prev);
    } else if (name === 'contact') {
      setIsContactOpen(prev => !prev);
    } else if (name === 'patreon') {
      setIsPatreonOpen(prev => !prev);
    } else if (onClick) {
      onClick();
    }
  };

  const closeAbout = () => {
    setIsAboutOpen(false);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const closeStuff = () => {
    setIsStuffOpen(false);
  };
  
  const closeContact = () => {
    setIsContactOpen(false);
  };
  
  const closePatreon = () => {
    setIsPatreonOpen(false);
  };

  return (
    <>
      <div 
        className="app-icon"
        style={{
          position: 'absolute',
          top,
          left,
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        <div className="icon-container">
          <Image
            src={`/assets/${icon}.png`}
            alt={name}
            width={45}
            height={45}
            className="icon-image"
          />
        </div>
        <p className="icon-label">{name}</p>
      </div>
      
      {name === 'about' && <AboutWindow isOpen={isAboutOpen} onClose={closeAbout} />}
      {name === 'gallery' && <GalleryWindow isOpen={isGalleryOpen} onClose={closeGallery} />}
      {name === 'stuff' && <StuffWindow isOpen={isStuffOpen} onClose={closeStuff} />}
      {name === 'contact' && <ContactWindow isOpen={isContactOpen} onClose={closeContact} />}
      {name === 'patreon' && <PatreonWindow isOpen={isPatreonOpen} onClose={closePatreon} />}
    </>
  );
}