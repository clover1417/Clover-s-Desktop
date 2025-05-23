"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getRandomTrack, getNextTrack, getPrevTrack, findTrackIndex, musicTracks } from '../../data/musicList';
import { getMusicThumbnailFromURL } from '../../utils/extractor';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward } from 'react-icons/fi';
import { useVolume } from '../../context/VolumeContext';

interface MusicPlayerProps {
  top: string;
  left: string;
}

export function MusicPlayer({ top, left }: MusicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(() => getRandomTrack());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHoveringControl, setIsHoveringControl] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dynamicThumbnail, setDynamicThumbnail] = useState<string | null>(null);
  const [showVolumeMessage, setShowVolumeMessage] = useState(false);
  
  const { volume } = useVolume();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lastPlayAttemptRef = useRef<number>(0);

  // Try to extract thumbnail directly from MP3
  useEffect(() => {
    const extractThumbnail = async () => {
      try {
        // We need to use the public path directly
        const path = window.location.origin + currentTrack.src;
        const thumbnail = await getMusicThumbnailFromURL(path);
        if (thumbnail) {
          setDynamicThumbnail(thumbnail);
        }
      } catch (error) {
        console.error('Failed to extract thumbnail:', error);
        // Use fallback thumbnail from track
        setDynamicThumbnail(null);
      }
    };
    
    extractThumbnail();
  }, [currentTrack.src]);

  useEffect(() => {
    const audio = new Audio(currentTrack.src);
    audioRef.current = audio;
    
    const setAudioData = () => {
      setDuration(audio.duration);
    };
    
    const setAudioTime = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
    };
    
    const handleEnded = () => {
      handleNext();
    };
    
    // Event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);
    
    // Set volume
    audio.volume = volume / 100;
    
    // Initialize - don't auto play when switching tracks
    if (isPlaying) {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
        setIsPlaying(false);
      });
    }
    
    return () => {
      // Clean up
      audio.pause();
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack.src, isDragging]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Check if volume is 0 when attempting to play
        if (volume === 0) {
          const now = Date.now();
          lastPlayAttemptRef.current = now;
          setShowVolumeMessage(true);
          
          // Hide message after 4 seconds
          setTimeout(() => {
            if (lastPlayAttemptRef.current === now) {
              setShowVolumeMessage(false);
            }
          }, 4000);
        }
        
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  // Handle mouse up event for dragging
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging && progressBarRef.current && audioRef.current) {
        audioRef.current.currentTime = currentTime;
        setIsDragging(false);
      }
    };
    
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, currentTime]);
  
  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && progressBarRef.current && audioRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        let clickPosition = e.clientX - rect.left;
        
        // Constrain to the progress bar width
        clickPosition = Math.max(0, Math.min(clickPosition, rect.width));
        
        const clickPercentage = clickPosition / rect.width;
        const newTime = clickPercentage * duration;
        
        setCurrentTime(newTime);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, duration]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = findTrackIndex(currentTrack.src);
    const nextTrack = getNextTrack(currentIndex);
    setCurrentTrack(nextTrack);
    setCurrentTime(0);
    // Don't auto-play when switching tracks
    setDynamicThumbnail(null);
  };

  const handlePrev = () => {
    // If we've played more than 3 seconds, restart current track
    if (currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      return;
    }
    
    const currentIndex = findTrackIndex(currentTrack.src);
    const prevTrack = getPrevTrack(currentIndex);
    setCurrentTrack(prevTrack);
    setCurrentTime(0);
    // Don't auto-play when switching tracks
    setDynamicThumbnail(null);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const clickPercentage = clickPosition / rect.width;
    const newTime = clickPercentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    // Also update time position immediately
    handleProgressClick(e);
  };

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Determine which thumbnail to use
  const thumbnailSrc = dynamicThumbnail || currentTrack.thumbnail;

  return (
    <div 
      className="widget music-player"
      style={{
        position: 'absolute',
        top,
        left,
      }}
    >
      <div className="widget-outer">
        <div className="widget-inner">
          {/* Album Art */}
          <div className="music-thumbnail">
            <Image 
              src={thumbnailSrc}
              alt={currentTrack.name}
              width={80} 
              height={80}
              className="music-image"
              style={{ objectFit: 'cover' }}
            />
          </div>
          
          {/* Track Info */}
          <div className="music-info">
            <p className="music-title">{currentTrack.name}</p>
          </div>
          
          {/* Progress Bar */}
          <div 
            className="music-progress-container"
            ref={progressBarRef}
            onClick={handleProgressClick}
            onMouseDown={handleProgressMouseDown}
          >
            <div className={`music-progress-bg ${isDragging ? 'dragging' : ''}`}>
              <div 
                className="music-progress-fill" 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              <div 
                className="music-progress-handle"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="music-time">
              {duration ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "0:00"}
            </div>
          </div>
          
          {/* Controls */}
          <div className="music-controls">
            <button 
              className="music-control-btn prev"
              onClick={handlePrev}
              onMouseEnter={() => setIsHoveringControl(true)}
              onMouseLeave={() => setIsHoveringControl(false)}
            >
              <FiSkipBack size={16} />
            </button>
            
            <button 
              className="music-control-btn play-pause"
              onClick={handlePlayPause}
              onMouseEnter={() => setIsHoveringControl(true)}
              onMouseLeave={() => setIsHoveringControl(false)}
            >
              {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}
            </button>
            
            <button 
              className="music-control-btn next"
              onClick={handleNext}
              onMouseEnter={() => setIsHoveringControl(true)}
              onMouseLeave={() => setIsHoveringControl(false)}
            >
              <FiSkipForward size={16} />
            </button>
          </div>
        </div>
        <p className="widget-label">Music Player</p>
      </div>
      
      {/* Volume Message */}
      {showVolumeMessage && (
        <div className="volume-message">
          <div className="message-bubble">
            <p>You won't hear anything until you turn the volume up!</p>
          </div>
        </div>
      )}
    </div>
  );
} 