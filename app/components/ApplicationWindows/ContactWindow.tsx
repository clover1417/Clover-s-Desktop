'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiMail, FiLink, FiCopy, FiCheck } from 'react-icons/fi';
import BaseWindow from './BaseWindow';
import styles from '../../styles/Applications/contact.module.css';

interface ContactWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactWindow: React.FC<ContactWindowProps> = ({ isOpen, onClose }) => {
  const [emailCopied, setEmailCopied] = useState(false);
  const emailRef = useRef<HTMLDivElement>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
          emailRef.current.classList.add(styles['contact-item-highlight']);
          
          // Remove the highlight after animation completes
          setTimeout(() => {
            if (emailRef.current) {
              emailRef.current.classList.remove(styles['contact-item-highlight']);
            }
          }, 1000);
        }
      }, 500);
    }
  }, [isOpen]);

  return (
    <BaseWindow
      isOpen={isOpen}
      onClose={onClose}
      windowId="contact"
      title="contact"
      width={500}
      height={400}
    >
      <div className={styles['contact-window-content']}>
        <div className={styles['contact-header']}>
          <h2>Get In Touch</h2>
          <p>Feel free to reach out to me through any of these methods:</p>
        </div>
        
        <div className={styles['contact-methods']}>
          <div 
            ref={emailRef}
            className={styles['contact-item']}
          >
            <div className={styles['contact-item-icon']}>
              <FiMail size={24} />
            </div>
            <div className={styles['contact-item-content']}>
              <h3>Email</h3>
              <div className={styles['contact-email-container']}>
                <span className={styles['contact-email']}>hungtm1417@gmail.com</span>
                <button 
                  className={styles['contact-copy-button']} 
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                >
                  {emailCopied ? (
                    <FiCheck className={styles['copy-success']} size={16} />
                  ) : (
                    <FiCopy size={16} />
                  )}
                </button>
              </div>
              <p>I'll respond as soon as possible</p>
            </div>
          </div>
          
          <div className={styles['contact-item']}>
            <div className={styles['contact-item-icon']}>
              <FiLink size={24} />
            </div>
            <div className={styles['contact-item-content']}>
              <h3>Other Platforms</h3>
              <ul className={styles['contact-links']}>
                <li>
                  <a 
                    href="https://github.com/clover" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles['contact-link']}
                  >
                    Github
                  </a>
                </li>
                <li>
                  <a 
                    href="https://www.linkedin.com/in/clover" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles['contact-link']}
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a 
                    href="https://twitter.com/clover" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles['contact-link']}
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className={styles['contact-footer']}>
          <p>Looking forward to connecting with you!</p>
        </div>
      </div>
    </BaseWindow>
  );
};

export default ContactWindow; 