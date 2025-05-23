'use client';

import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import { FiMail, FiLink, FiCopy, FiCheck } from 'react-icons/fi';
import BaseWindow from './ApplicationWindows/BaseWindow';

interface ContactWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactWindow: React.FC<ContactWindowProps> = ({ isOpen, onClose }) => {
  const [emailCopied, setEmailCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const emailRef = useRef<HTMLDivElement>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopyEmail = () => {
    const email = "hungtm1417@gmail.com";
    navigator.clipboard.writeText(email)
      .then(() => {
        setEmailCopied(true);
        
        // Reset copied state after 2 seconds
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }
        
        copyTimeoutRef.current = setTimeout(() => {
          setEmailCopied(false);
          copyTimeoutRef.current = null;
        }, 2000);
      })
      .catch(err => {
        console.error('Could not copy email: ', err);
      });
  };
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Add focus animation when component mounts
  useEffect(() => {
    if (isOpen && emailRef.current) {
      setTimeout(() => {
        if (emailRef.current) {
          emailRef.current.style.animation = "highlight 1s ease";
          
          // Remove the highlight after animation completes
          setTimeout(() => {
            if (emailRef.current) {
              emailRef.current.style.animation = "";
            }
          }, 1000);
        }
      }, 500);
    }
  }, [isOpen]);
  
  // Add opening animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      
      if (contentRef.current) {
        contentRef.current.style.animation = "fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards";
      }
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        if (contentRef.current) {
          contentRef.current.style.animation = "";
        }
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const styles: Record<string, CSSProperties> = {
    contactWindowContent: {
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      height: '100%',
      backgroundColor: 'var(--white)',
      color: 'var(--text-color)',
      borderRadius: '4px',
      overflowY: 'auto'
    },
    contactHeader: {
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
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      position: 'relative'
    },
    contactHeaderTitle: {
      fontSize: '1.5rem',
      marginBottom: '8px',
      position: 'relative',
      display: 'inline-block'
    },
    contactHeaderText: {
      fontSize: '0.9rem',
      opacity: 0.8
    },
    contactMethods: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      marginBottom: '24px'
    },
    contactItem: {
      display: 'flex',
      gap: '16px',
      padding: '16px',
      borderRadius: '8px',
      backgroundColor: 'var(--light-cream)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    contactItemIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px',
      backgroundColor: 'var(--middle-tone)',
      borderRadius: '50%',
      color: 'var(--text-color)',
      flexShrink: 0
    },
    contactItemContent: {
      flex: 1
    },
    contactItemContentTitle: {
      fontSize: '1.1rem',
      marginBottom: '8px',
      fontWeight: 500
    },
    contactItemContentText: {
      fontSize: '0.85rem',
      opacity: 0.8,
      marginTop: '8px'
    },
    contactEmailContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'var(--white)',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '0.9rem',
      fontFamily: 'monospace',
      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    contactEmail: {
      flex: 1,
      userSelect: 'all'
    },
    contactCopyButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
      color: 'var(--text-color)',
      cursor: 'pointer',
      width: '30px',
      height: '30px',
      borderRadius: '4px',
      transition: 'background-color 0.2s ease'
    },
    copySuccess: {
      color: '#5fa371'
    },
    contactLinks: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    contactLink: {
      display: 'inline-block',
      padding: '6px 12px',
      backgroundColor: 'var(--white)',
      color: 'var(--text-color)',
      textDecoration: 'none',
      borderRadius: '4px',
      fontSize: '0.9rem',
      transition: 'background-color 0.2s ease, transform 0.2s ease',
      position: 'relative'
    },
    contactFooter: {
      marginTop: 'auto',
      textAlign: 'center',
      fontSize: '0.9rem',
      fontStyle: 'italic',
      opacity: 0.7,
      paddingTop: '16px',
      borderTop: '1px dashed var(--dark-cream)'
    }
  };

  return (
    <BaseWindow
      isOpen={isOpen}
      onClose={onClose}
      windowId="contact"
      title="contact"
      width={500}
      height={400}
    >
      <div 
        ref={contentRef}
        style={styles.contactWindowContent}
      >
        <div style={styles.contactHeader}>
          <h2 style={styles.contactHeaderTitle}>Get In Touch</h2>
          <p style={styles.contactHeaderText}>Feel free to reach out to me through any of these methods:</p>
        </div>
        
        <div style={styles.contactMethods}>
          <div 
            ref={emailRef}
            style={styles.contactItem}
          >
            <div style={styles.contactItemIcon}>
              <FiMail size={24} />
            </div>
            <div style={styles.contactItemContent}>
              <h3 style={styles.contactItemContentTitle}>Email</h3>
              <div style={styles.contactEmailContainer}>
                <span style={styles.contactEmail}>hungtm1417@gmail.com</span>
                <button 
                  style={styles.contactCopyButton}
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                >
                  {emailCopied ? (
                    <FiCheck style={styles.copySuccess} size={16} />
                  ) : (
                    <FiCopy size={16} />
                  )}
                </button>
              </div>
              <p style={styles.contactItemContentText}>I'll respond as soon as possible</p>
            </div>
          </div>
          
          <div style={styles.contactItem}>
            <div style={styles.contactItemIcon}>
              <FiLink size={24} />
            </div>
            <div style={styles.contactItemContent}>
              <h3 style={styles.contactItemContentTitle}>Other Platforms</h3>
              <ul style={styles.contactLinks}>
                <li style={{marginBottom: '8px'}}>
                  <a 
                    href="https://github.com/clover" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.contactLink}
                  >
                    Github
                  </a>
                </li>
                <li style={{marginBottom: '8px'}}>
                  <a 
                    href="https://www.linkedin.com/in/clover" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.contactLink}
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a 
                    href="https://twitter.com/clover" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={styles.contactLink}
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div style={styles.contactFooter}>
          <p>Looking forward to connecting with you!</p>
        </div>
      </div>
    </BaseWindow>
  );
};

export default ContactWindow; 