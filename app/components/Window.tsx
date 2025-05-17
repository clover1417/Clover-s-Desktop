"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";

interface WindowProps {
  children?: React.ReactNode;
}

export function Window({ children }: WindowProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
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
                <div className="return-button">
                  <Image 
                    src="/assets/Return.png"
                    alt="Return"
                    width={22}
                    height={22}
                  />
                </div>
                <div className="taskbar-right">
                  <div className="speaker-icon">
                    <Image 
                      src="/assets/Speaker.png"
                      alt="Speaker"
                      width={18}
                      height={18}
                    />
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
    </div>
  );
} 