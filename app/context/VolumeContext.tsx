"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface VolumeContextType {
  volume: number;
  setVolume: (volume: number) => void;
  showVolumeSlider: boolean;
  setShowVolumeSlider: (show: boolean) => void;
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined);

export function VolumeProvider({ children }: { children: ReactNode }) {
  const [volume, setVolume] = useState(70);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  return (
    <VolumeContext.Provider value={{ volume, setVolume, showVolumeSlider, setShowVolumeSlider }}>
      {children}
    </VolumeContext.Provider>
  );
}

export function useVolume() {
  const context = useContext(VolumeContext);
  if (context === undefined) {
    throw new Error('useVolume must be used within a VolumeProvider');
  }
  return context;
} 