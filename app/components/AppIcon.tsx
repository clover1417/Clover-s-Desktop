"use client";

import React from 'react';
import Image from 'next/image';

interface AppIconProps {
  name: string;
  icon: string;
  top: string;
  left: string;
  onClick?: () => void;
}

export function AppIcon({ name, icon, top, left, onClick }: AppIconProps) {
  return (
    <div 
      className="app-icon"
      style={{
        position: 'absolute',
        top,
        left,
      }}
      onClick={onClick}
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
  );
} 