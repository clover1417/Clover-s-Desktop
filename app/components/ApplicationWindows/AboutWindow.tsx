'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { aboutTabs, profileData, Tag, AboutTab } from '../../data/about';
import Image from 'next/image';
import BaseWindow from './BaseWindow';
import { createPortal } from 'react-dom';

interface AboutWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

// Precompute tag rotations to prevent them from changing on hover
const precomputedRotations: Record<string, number> = {};

const AboutWindow: React.FC<AboutWindowProps> = ({ isOpen, onClose }) => {
  const [activeTooltip, setActiveTooltip] = useState<{ tagId: string; text: string; x: number; y: number } | null>(null);
  const tooltipTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const [avatarError, setAvatarError] = useState(false);
  const [columns, setColumns] = useState<AboutTab[][]>([[], []]);
  const rightSectionRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isTooltipActive, setIsTooltipActive] = useState(false);

  // Format the description to highlight "5 years of experience"
  const formattedDescription = () => {
    const text = profileData.description;
    const fiveYearsPattern = /5 years of experience/g;
    
    // Split the text by the pattern and create an array of regular text and highlighted parts
    const parts = text.split(fiveYearsPattern);
    
    // Create a React element with the formatted text
    return (
      <>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <span style={{ color: '#6a5b5b', fontWeight: 500, textDecoration: 'underline' }}>
                5 years of experience
              </span>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  // Calculate columns - always use exactly 2 columns
  useEffect(() => {
    if (isOpen) {
      const newColumns: AboutTab[][] = [[], []];
      
      // Split tabs into two equal columns
      aboutTabs.forEach((tab, index) => {
        const columnIndex = index % 2; // Alternate between columns 0 and 1
        newColumns[columnIndex].push(tab);
      });
      
      setColumns(newColumns);
    }
  }, [isOpen]);

  // Remove precomputed rotations effect since we're not using rotations anymore

  // Direct tooltip handlers
  const handleTooltipMouseEnter = (e: React.MouseEvent, tag: Tag, tabId: string) => {
    const tagId = tag.name;
    
    // Clear any existing timeout for this tag
    Object.keys(tooltipTimers.current).forEach(key => {
      if (tooltipTimers.current[key]) {
        clearTimeout(tooltipTimers.current[key]);
        delete tooltipTimers.current[key];
      }
    });
    
    // Get tag element position instead of mouse position
    const tagElement = e.currentTarget;
    const rect = tagElement.getBoundingClientRect();
    const tagCenterX = rect.left + rect.width / 2;
    const tagTopY = rect.top;
    
    // Set tooltip data positioned above tag center immediately
      setActiveTooltip({
        tagId,
        text: tag.description,
      x: tagCenterX,
      y: tagTopY - 5 // Position above tag
      });
    
    // Mark tooltip as active
    setIsTooltipActive(true);
  };

  const handleTooltipMouseLeave = (tagId: string) => {
    // Hide immediately when no longer hovering
    setActiveTooltip(null);
    setIsTooltipActive(false);
  };
  
  // Global tag container hover handlers
  const handleTagContainerEnter = () => {
    // Just track state
    setIsTooltipActive(true);
  };
  
  const handleTagContainerLeave = () => {
    // Hide immediately
    setIsTooltipActive(false);
    setActiveTooltip(null);
  };

  // Thorough cleanup function to remove tooltips
  const removeAllTooltips = () => {
    Object.keys(tooltipTimers.current).forEach(key => {
      if (tooltipTimers.current[key]) {
        clearTimeout(tooltipTimers.current[key]);
        delete tooltipTimers.current[key];
      }
    });
    
    // Reset state only - don't manipulate DOM directly
    setActiveTooltip(null);
    setIsTooltipActive(false);
  };

  // Effect to cleanup tooltip when component unmounts or window closes
  

  // Mount/unmount handler
  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      removeAllTooltips();
    };
  }, []);

  return (
    <>
      <BaseWindow
        isOpen={isOpen}
        onClose={() => {
          removeAllTooltips();
          onClose();
        }}
        windowId="about"
        title="about"
        width={1050}
        height={675}
      >
      <div className="about-window-content">
        <div className="about-window-left" style={{ width: '330px' }}>
          <div 
            className="about-window-avatar" 
            style={{ boxSizing: 'border-box' }}
          >
            {avatarError ? (
              <div style={{ 
                width: '100px', 
                height: '100px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: 'var(--light-cream)',
                color: 'var(--text-color)',
                fontSize: '28px',
                borderRadius: '50%',
                transition: 'transform 0.2s ease'
              }}
              className="avatar-hover-effect"
              >
                CJ
              </div>
            ) : (
              <div 
                style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  flexShrink: 0,
                  transition: 'transform 0.2s ease'
                }}
                className="avatar-hover-effect"
              >
                <img 
                  src="/assets/CloverAvater.jpg" 
                  alt="Profile"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }}
                  onError={() => setAvatarError(true)}
                />
              </div>
            )}
          </div>
          <h2 className="about-window-name">{profileData.name}</h2>
          <div className="about-window-japanese-name">{profileData.japaneseName}</div>
          <div className="about-window-greeting" style={{ alignSelf: 'flex-start', textAlign: 'left' }}>{profileData.greeting}</div>
            <div className="about-window-description-container" style={{ width: '100%', marginBottom: 'auto' }}>
          <p className="about-window-description">{formattedDescription()}</p>
            </div>
          <a 
            href={profileData.seeMoreLink} 
            className="about-window-see-more"
            style={{ 
              alignSelf: 'flex-start', 
              display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
                width: 'auto'
            }}
          >
            <span>See more in</span> <span style={{ color: '#A9C4EB', textDecoration: 'underline', marginLeft: '5px' }}>works</span>
          </a>
        </div>
        
        {/* Separator between left and right panels */}
          <div className="about-window-separator" style={{ flexShrink: 0 }}></div>
        
          <div className="about-window-right" ref={rightSectionRef}>
            <div className="about-window-columns">
            {columns.map((column, columnIndex) => (
                <div key={`column-${columnIndex}`} className="about-window-column">
                  {column.map(tab => (
                    <div key={tab.id} className="about-tab">
                      <h3 className="about-tab-title">{tab.title}</h3>
                      {tab.bullets && (
                    <ul className="about-tab-bullets">
                          {tab.bullets.map((bullet, bulletIndex) => (
                            <li key={`bullet-${tab.id}-${bulletIndex}`} className="about-tab-bullet">
                          {bullet.content}
                        </li>
                      ))}
                    </ul>
                      )}
                      
                      {tab.tags && (
                        <div 
                          className="about-tab-tags"
                          onMouseEnter={handleTagContainerEnter}
                          onMouseLeave={handleTagContainerLeave}
                        >
                          {tab.tags.map(tag => {
                            const tagKey = `tag-${tab.id}-${tag.name}`;
                            return (
                          <div 
                                key={tagKey}
                            className="about-tab-tag tag-animate-hover"
                                onMouseEnter={(e) => handleTooltipMouseEnter(e, tag, tab.id)}
                            onMouseLeave={() => handleTooltipMouseLeave(tag.name)}
                          >
                            {tag.name}
                          </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      </BaseWindow>

      {/* Render tooltip directly to body using portal */}
      {activeTooltip && isOpen && mounted && document.body && createPortal(
    <div 
          className="tag-tooltip"
      style={{
            top: `${activeTooltip.y}px`,
            left: `${activeTooltip.x}px`,
          }}
        >
          {/* Only show description */}
          <div>{activeTooltip.text}</div>
          <div className="tag-tooltip-arrow" />
    </div>,
    document.body
      )}
    </>
  );
};

export default AboutWindow; 