'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FiExternalLink, FiHeart, FiStar, FiCoffee, FiGift } from 'react-icons/fi';
import BaseWindow from './BaseWindow';
import styles from '../../styles/Applications/patreon.module.css';

interface PatreonWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TierProps {
  title: string;
  price: string;
  benefits: string[];
  icon: React.ReactNode;
  highlight?: boolean;
}

const PatreonTier: React.FC<TierProps> = ({ title, price, benefits, icon, highlight }) => {
  return (
    <div className={`${styles['patreon-tier']} ${highlight ? styles['highlight'] : ''}`}>
      <div className={styles['tier-header']}>
        <div className={styles['tier-icon']}>
          {icon}
        </div>
        <div className={styles['tier-title-group']}>
          <h3>{title}</h3>
          <span className={styles['tier-price']}>{price}</span>
        </div>
      </div>
      <div className={styles['tier-benefits']}>
        <h4>Benefits include:</h4>
        <ul>
          {benefits.map((benefit, index) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const PatreonWindow: React.FC<PatreonWindowProps> = ({ isOpen, onClose }) => {
  const [animateIn, setAnimateIn] = useState(false);
  const tiersRef = useRef<HTMLDivElement>(null);
  
  // Patreon link
  const patreonUrl = "https://www.patreon.com/c/clovershub?fromConcierge=true";
  
  // Handle open Patreon link
  const handleOpenPatreon = () => {
    window.open(patreonUrl, '_blank', 'noopener,noreferrer');
  };
  
  // Animate tiers in when component mounts
  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);
  
  return (
    <BaseWindow
      isOpen={isOpen}
      onClose={onClose}
      windowId="patreon"
      title="patreon"
      width={650}
      height={580}
    >
      <div className={styles['patreon-window-content']}>
        <div className={styles['patreon-header']}>
          <div className={styles['patreon-logo']}>
            <div className={styles['patreon-logo-inner']}>
              <FiHeart size={24} />
            </div>
          </div>
          <h2>Support My Work</h2>
          <p>Join my community on Patreon and get exclusive content and perks!</p>
        </div>
        
        <div 
          ref={tiersRef}
          className={`${styles['patreon-tiers']} ${animateIn ? styles['animate-in'] : ''}`}
        >
          <PatreonTier 
            title="Supporter"
            price="$5/month"
            benefits={[
              "Early access to updates",
              "Exclusive posts and content",
              "Access to community Discord"
            ]}
            icon={<FiHeart size={20} />}
          />
          
          <PatreonTier 
            title="Premium"
            price="$10/month"
            benefits={[
              "All previous tier benefits",
              "Monthly Q&A sessions",
              "Vote on future content",
              "Access to resource library"
            ]}
            icon={<FiStar size={20} />}
            highlight={true}
          />
          
          <PatreonTier 
            title="VIP"
            price="$25/month"
            benefits={[
              "All previous tier benefits",
              "Monthly 1-on-1 sessions",
              "Custom project feedback",
              "Name in credits",
              "Early beta access"
            ]}
            icon={<FiCoffee size={20} />}
          />
        </div>
        
        <div className={styles['patreon-cta']}>
          <button 
            className={styles['patreon-button']}
            onClick={handleOpenPatreon}
            aria-label="Visit my Patreon page"
          >
            <span>Become a Patron</span>
            <FiExternalLink size={16} />
          </button>
          
          <div className={styles['patreon-note']}>
            <FiGift className={styles['gift-icon']} size={16} />
            <p>One-time donations are also welcomed and appreciated!</p>
          </div>
        </div>
        
        <div className={styles['patreon-footer']}>
          <div className={styles['patreon-community']}>
            <div className={styles['community-avatar-group']}>
              {/* Placeholder avatars representing community members */}
              <div className={styles['community-avatar']} style={{ backgroundColor: 'var(--middle-tone)' }}></div>
              <div className={styles['community-avatar']} style={{ backgroundColor: 'var(--dark-cream)' }}></div>
              <div className={styles['community-avatar']} style={{ backgroundColor: 'var(--middle-tone)' }}></div>
              <div className={styles['community-avatar']} style={{ backgroundColor: 'var(--light-cream)' }}></div>
              <div className={styles['community-avatar']} style={{ backgroundColor: 'var(--dark-cream)' }}></div>
            </div>
            <p>Join our growing community of amazing supporters!</p>
          </div>
        </div>
      </div>
    </BaseWindow>
  );
};

export default PatreonWindow; 