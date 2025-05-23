'use client';

import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import Image from 'next/image';
import { FiExternalLink, FiHeart, FiStar, FiCoffee, FiGift } from 'react-icons/fi';
import BaseWindow from './ApplicationWindows/BaseWindow';

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
  const tierStyles: Record<string, CSSProperties> = {
    tier: {
      backgroundColor: 'var(--light-cream)',
      borderRadius: '8px',
      padding: '20px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      border: highlight ? '2px solid var(--dark-cream)' : 'none',
      boxShadow: highlight ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none'
    },
    tierHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px'
    },
    tierIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      backgroundColor: 'var(--middle-tone)',
      borderRadius: '50%',
      marginRight: '12px'
    },
    tierTitleGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    tierTitle: {
      fontSize: '1.2rem',
      margin: '0 0 4px 0',
      fontWeight: 500
    },
    tierPrice: {
      fontSize: '0.9rem',
      opacity: 0.8
    },
    tierBenefits: {
      marginLeft: '52px'
    },
    tierBenefitsTitle: {
      fontSize: '0.9rem',
      marginBottom: '8px',
      fontWeight: 500,
      opacity: 0.8
    },
    tierBenefitsList: {
      paddingLeft: '16px',
      margin: 0
    },
    tierBenefitsItem: {
      marginBottom: '6px',
      fontSize: '0.9rem'
    },
    tierBenefitsItemLast: {
      marginBottom: 0,
      fontSize: '0.9rem'
    },
    popularBadge: highlight ? {
      position: 'absolute',
      top: '10px',
      right: '-30px',
      backgroundColor: 'var(--dark-cream)',
      color: 'white',
      padding: '4px 30px',
      fontSize: '0.7rem',
      textTransform: 'uppercase',
      transform: 'rotate(45deg)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    } : {},
    tierAfter: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '6px',
      height: '100%',
      backgroundColor: 'var(--middle-tone)'
    }
  };

  return (
    <div style={tierStyles.tier}>
      {highlight && <div style={tierStyles.popularBadge}>Popular</div>}
      <div style={tierStyles.tierAfter}></div>
      <div style={tierStyles.tierHeader}>
        <div style={tierStyles.tierIcon}>
          {icon}
        </div>
        <div style={tierStyles.tierTitleGroup}>
          <h3 style={tierStyles.tierTitle}>{title}</h3>
          <span style={tierStyles.tierPrice}>{price}</span>
        </div>
      </div>
      <div style={tierStyles.tierBenefits}>
        <h4 style={tierStyles.tierBenefitsTitle}>Benefits include:</h4>
        <ul style={tierStyles.tierBenefitsList}>
          {benefits.map((benefit, index) => (
            <li 
              key={index} 
              style={index === benefits.length - 1 ? tierStyles.tierBenefitsItemLast : tierStyles.tierBenefitsItem}
            >
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const PatreonWindow: React.FC<PatreonWindowProps> = ({ isOpen, onClose }) => {
  const [animateIn, setAnimateIn] = useState(false);
  const tiersRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Patreon link
  const patreonUrl = "https://www.patreon.com/c/clovershub?fromConcierge=true";
  
  // Handle open Patreon link
  const handleOpenPatreon = () => {
    window.open(patreonUrl, '_blank', 'noopener,noreferrer');
  };
  
  // Animate tiers in when component mounts
  useEffect(() => {
    if (isOpen) {
      // Add window open animation
      if (contentRef.current) {
        contentRef.current.style.animation = "fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards";
        
        // Add a small delay before starting tile animations
        setTimeout(() => {
          setAnimateIn(true);
          
          const timer = setTimeout(() => {
            if (contentRef.current) {
              contentRef.current.style.animation = "";
            }
          }, 800);
          
          return () => clearTimeout(timer);
        }, 300);
      }
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  const styles: Record<string, CSSProperties> = {
    patreonWindowContent: {
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      height: '100%',
      backgroundColor: 'var(--white)',
      color: 'var(--text-color)',
      borderRadius: '4px',
      overflowY: 'auto'
    },
    patreonHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'var(--light-cream)',
      cursor: 'grab',
      margin: '-24px -24px 24px -24px',
      padding: '16px 24px',
      borderTopLeftRadius: '4px',
      borderTopRightRadius: '4px',
      borderBottom: '1px solid #eee',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
    },
    patreonLogoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    patreonLogo: {
      width: '64px',
      height: '64px',
      backgroundColor: 'var(--light-cream)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      animation: 'pulse 2s infinite ease-in-out'
    },
    patreonLogoInner: {
      width: '48px',
      height: '48px',
      backgroundColor: 'var(--middle-tone)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-color)'
    },
    patreonHeaderTitle: {
      fontSize: '1.8rem',
      marginBottom: '8px',
      fontWeight: 500
    },
    patreonHeaderText: {
      fontSize: '1rem',
      opacity: 0.8,
      maxWidth: '400px'
    },
    patreonTiers: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginBottom: '32px',
      opacity: animateIn ? 1 : 0,
      transform: animateIn ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease'
    },
    patreonCta: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '24px'
    },
    patreonButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      backgroundColor: 'var(--dark-cream)',
      color: 'white',
      border: 'none',
      borderRadius: '24px',
      padding: '12px 24px',
      fontSize: '1rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      marginBottom: '16px'
    },
    patreonNote: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.85rem',
      color: 'var(--text-color)',
      opacity: 0.8
    },
    giftIcon: {
      animation: 'wiggle 3s ease-in-out infinite'
    },
    patreonFooter: {
      marginTop: 'auto',
      paddingTop: '16px',
      borderTop: '1px solid var(--light-cream)'
    },
    patreonCommunity: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    communityAvatarGroup: {
      display: 'flex',
      marginBottom: '8px'
    },
    communityAvatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: '2px solid white',
      marginLeft: '-10px'
    },
    communityAvatarFirst: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      border: '2px solid white',
      marginLeft: 0
    },
    communityText: {
      fontSize: '0.9rem',
      opacity: 0.7
    }
  };
  
  return (
    <BaseWindow
      isOpen={isOpen}
      onClose={onClose}
      windowId="patreon"
      title="patreon"
      width={650}
      height={580}
    >
      <div 
        ref={contentRef}
        style={styles.patreonWindowContent}
      >
        <div style={styles.patreonHeader}>
          <div style={styles.patreonLogoSection}>
            <div style={styles.patreonLogo}>
              <div style={styles.patreonLogoInner}>
                <FiHeart size={24} />
              </div>
            </div>
            <div>
              <h2 style={styles.patreonHeaderTitle}>Support My Work</h2>
              <p style={styles.patreonHeaderText}>Join my community on Patreon and get exclusive content and perks!</p>
            </div>
          </div>
        </div>
        
        <div 
          ref={tiersRef}
          style={styles.patreonTiers}
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
        
        <div style={styles.patreonCta}>
          <button 
            style={styles.patreonButton}
            onClick={handleOpenPatreon}
            aria-label="Visit my Patreon page"
          >
            <span>Become a Patron</span>
            <FiExternalLink size={16} />
          </button>
          
          <div style={styles.patreonNote}>
            <FiGift style={styles.giftIcon} size={16} />
            <p>One-time donations are also welcomed and appreciated!</p>
          </div>
        </div>
        
        <div style={styles.patreonFooter}>
          <div style={styles.patreonCommunity}>
            <div style={styles.communityAvatarGroup}>
              {/* Placeholder avatars representing community members */}
              <div style={styles.communityAvatarFirst}></div>
              <div style={styles.communityAvatar}></div>
              <div style={styles.communityAvatar}></div>
              <div style={styles.communityAvatar}></div>
              <div style={styles.communityAvatar}></div>
            </div>
            <p style={styles.communityText}>Join our growing community of amazing supporters!</p>
          </div>
        </div>
      </div>
    </BaseWindow>
  );
};

export default PatreonWindow; 