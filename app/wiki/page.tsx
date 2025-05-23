"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  wikiData, 
  wikiCategories, 
  WikiSection, 
  WikiSubsection,
  TeamMemberDetails,
  getTeamMemberDetails,
  getPartnerDetails
} from '../data/wiki';
import '../styles/Applications/wiki.css';

export default function WikiPage() {
  const [activeCategory, setActiveCategory] = useState<string>(wikiCategories[0]);
  const [selectedSection, setSelectedSection] = useState<WikiSection | null>(null);
  const [selectedSubsection, setSelectedSubsection] = useState<WikiSubsection | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset animations when category changes
  useEffect(() => {
    if (contentRef.current) {
      // Reset animation by forcing reflow
      const sections = contentRef.current.querySelectorAll('.wiki-section-frame');
      const cards = contentRef.current.querySelectorAll('.wiki-team-card, .wiki-partner-item, .wiki-project-card');
      
      [...sections, ...cards].forEach((el, index) => {
        el.classList.remove('animated');
        // Force reflow with proper type casting
        void (el as HTMLElement).offsetWidth;
        // Add animated class with delay for staggered effect
        setTimeout(() => {
          el.classList.add('animated');
        }, index * 50);
      });
      
      // Scroll to top of content
      contentRef.current.scrollTop = 0;
    }
  }, [activeCategory]);

  // Add animated class to all elements on initial load
  useEffect(() => {
    if (contentRef.current) {
      const sections = contentRef.current.querySelectorAll('.wiki-section-frame');
      const cards = contentRef.current.querySelectorAll('.wiki-team-card, .wiki-partner-item, .wiki-project-card');
      
      setTimeout(() => {
        [...sections, ...cards].forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('animated');
          }, index * 50);
        });
      }, 100);
    }
  }, []);

  // Filter out "Resources" and "Contact" from the categories
  const navigationCategories = wikiCategories.filter(cat => 
    cat !== 'Resources' && cat !== 'Contact' && cat !== 'All');
  
  // Get relevant sections for the active category
  const filteredSections = wikiData.filter(section => 
    section.title.includes(activeCategory) || 
    section.id === activeCategory.toLowerCase()
  );

  const openSectionDetails = (section: WikiSection, subsection?: WikiSubsection) => {
    setSelectedSection(section);
    setSelectedSubsection(subsection || null);
    setIsDetailsOpen(true);
  };

  const closeDetails = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsDetailsOpen(false);
    setTimeout(() => {
      setSelectedSection(null);
      setSelectedSubsection(null);
    }, 300); // Wait for animation to complete
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // SVG icons for each category
  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'about':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
      case 'team':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        );
      case 'projects':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        );
      case 'partners':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        );
      case 'values':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <main className="wiki-container">
      {/* Header */}
      <header className="wiki-header">
        <div className="wiki-header-left">
          <Link href="/" className="wiki-logo-link">
            <span className="wiki-logo-text">Clover</span>
            <span className="wiki-logo-separator">•</span>
            <span>Slime Island Studio</span>
          </Link>
        </div>
        <div className="wiki-header-center">
          <h1 className="wiki-header-title">Slime Island Cooperation</h1>
        </div>
        <div className="wiki-header-right">
          <Link href="/" className="wiki-home-button">
            Home
          </Link>
          <button 
            className="wiki-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Navigation */}
      <div className={`wiki-nav-wrapper ${isMenuOpen ? 'open' : ''}`}>
        <nav className="wiki-navigation">
          <div className="wiki-categories">
            {navigationCategories.map((category) => (
              <button
                key={category}
                className={`wiki-category ${activeCategory === category ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(category);
                  if (isMobile) setIsMenuOpen(false);
                }}
              >
                <span className="wiki-category-icon">
                  {getCategoryIcon(category)}
                </span>
                <span>{category}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Grid Layout */}
      <div className="wiki-grid-background">
        {/* Description Line */}
        <div className="wiki-description">
          <p>Explore the world of Slime Island Studio - our projects, team, values, and more.</p>
        </div>
        
        {/* Main Content */}
        <div className="wiki-content-wrapper" ref={contentRef}>
          {activeCategory === 'Team' ? (
            <div className="wiki-team-section">
              <div className="wiki-section-frame">
                <h2 className="wiki-section-heading">Team</h2>
                <p className="wiki-section-description">
                  Slime Island brings together talented individuals with diverse skills and a shared passion for creative excellence.
                </p>
                
                <div className="wiki-team-grid">
                  {wikiData.find(section => section.id === 'team')?.subsections?.map(member => {
                    const memberDetails = member.details as TeamMemberDetails;
                    
                    return (
                      <div 
                        key={member.id}
                        className="wiki-team-card"
                        onClick={() => openSectionDetails(wikiData.find(section => section.id === 'team')!, member)}
                      >
                        <div className="wiki-team-avatar">
                          <Image 
                            src={memberDetails?.avatar || '/assets/LogoNoShadow.png'} 
                            alt={member.title}
                            width={100}
                            height={100}
                            className="wiki-avatar-image"
                          />
                        </div>
                        <div className="wiki-team-card-content">
                          <h3 className="wiki-team-name">{member.title}</h3>
                          <p className="wiki-team-role">{member.content.split('.')[0]}</p>
                          <p className="wiki-team-experience">{memberDetails?.experience || ''}</p>
                          <div className="wiki-team-skills">
                            {memberDetails?.skills.map((skill, index) => (
                              <div 
                                key={index} 
                                className="wiki-skill-tag"
                                onMouseEnter={() => setShowTooltip(`${member.id}-${index}`)}
                                onMouseLeave={() => setShowTooltip(null)}
                              >
                                {skill}
                                {showTooltip === `${member.id}-${index}` && (
                                  <span className="wiki-skill-tooltip">Expertise in {skill}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="wiki-team-card-arrow">
                          <span>See more</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : activeCategory === 'Partners' ? (
            <div className="wiki-partners-section">
              <div className="wiki-section-frame">
                <h2 className="wiki-section-heading">Partners</h2>
                <p className="wiki-section-description">
                  We collaborate with like-minded creators and organizations to bring creative visions to life.
                </p>
                
                <div className="wiki-partners-list">
                  {wikiData.find(section => section.id === 'partners')?.subsections?.map(partner => {
                    const partnerDetails = partner.details;
                    
                    return (
                      <div 
                        key={partner.id}
                        className="wiki-partner-item"
                        onClick={() => openSectionDetails(wikiData.find(section => section.id === 'partners')!, partner)}
                      >
                        <div className="wiki-partner-avatar">
                          <Image 
                            src={partnerDetails?.avatar || '/assets/LogoNoShadow.png'} 
                            alt={partner.title}
                            width={60}
                            height={60}
                          />
                        </div>
                        <div className="wiki-partner-content">
                          <h3 className="wiki-partner-name">{partner.title}</h3>
                          <p className="wiki-partner-description">{partner.content}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : activeCategory === 'Projects' ? (
            <div className="wiki-projects-section">
              <div className="wiki-section-frame">
                <h2 className="wiki-section-heading">Projects</h2>
                <p className="wiki-section-description">
                  Slime Island has worked on a variety of creative projects since our founding, each showcasing our diverse capabilities.
                </p>
                
                <div className="wiki-projects-grid">
                  {wikiData.find(section => section.id === 'projects')?.subsections?.map(project => (
                    <div 
                      key={project.id}
                      className="wiki-project-card"
                      onClick={() => openSectionDetails(wikiData.find(section => section.id === 'projects')!, project)}
                    >
                      <h3 className="wiki-project-title">{project.title}</h3>
                      <p className="wiki-project-description">{project.content}</p>
                      <div className="wiki-project-more">Learn more</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="wiki-general-section">
              {filteredSections.map(section => (
                <div key={section.id} className="wiki-section-frame">
                  <div className="wiki-section-block">
                    <div className="wiki-section-header">
                      {section.icon && (
                        <div className="wiki-section-icon">
                          <Image 
                            src={section.icon} 
                            alt={section.title} 
                            width={40} 
                            height={40} 
                          />
                        </div>
                      )}
                      <h2 className="wiki-section-heading">{section.title}</h2>
                    </div>
                    
                    <div className="wiki-section-body">
                      <p className="wiki-section-content">{section.content}</p>
                      
                      {section.subsections && section.subsections.length > 0 && (
                        <div className="wiki-topics">
                          <h3 className="wiki-topics-heading">Topics</h3>
                          <ul className="wiki-topics-list">
                            {section.subsections.map(subsection => (
                              <li 
                                key={subsection.id} 
                                className="wiki-topic-item"
                                onClick={() => openSectionDetails(section, subsection)}
                              >
                                <span className="wiki-topic-title">{subsection.title}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer - moved inside grid-background */}
        <footer className="wiki-footer">
          <div className="wiki-footer-content">
            <div className="wiki-footer-logo">
              <Image 
                src="/assets/LogoNoShadow.png" 
                alt="Slime Island Studio" 
                width={30} 
                height={30} 
              />
              <span>Slime Island Studio</span>
            </div>
            <p className="wiki-footer-copyright">© 2025 Slime Island Studio. All rights reserved.</p>
          </div>
        </footer>
      </div>

      {/* Wiki Details Modal */}
      {selectedSection && (
        <div className={`wiki-details-overlay ${isDetailsOpen ? 'open' : ''}`} onClick={closeDetails}>
          <div className="wiki-details-container" onClick={(e) => e.stopPropagation()}>
            <button className="wiki-details-close" onClick={closeDetails}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="wiki-details-header">
              {selectedSection.icon && !selectedSubsection && (
                <div className="wiki-details-icon">
                  <Image src={selectedSection.icon} alt={selectedSection.title} width={60} height={60} />
                </div>
              )}
              <h2 className="wiki-details-title">
                {selectedSubsection ? selectedSubsection.title : selectedSection.title}
              </h2>
            </div>
            
            <div className="wiki-details-content">
              {selectedSubsection ? (
                <div className="wiki-details-subsection">
                  <div className="wiki-details-breadcrumb">
                    <span onClick={() => setSelectedSubsection(null)}>{selectedSection.title}</span>
                    <span> / </span>
                    <span>{selectedSubsection.title}</span>
                  </div>
                  
                  {/* Enhanced Team Member Details */}
                  {selectedSection.id === 'team' && (
                    <div className="wiki-details-team-member">
                      {(() => {
                        const memberDetails = selectedSubsection.details as TeamMemberDetails;
                        
                        return (
                          <>
                            <div className="wiki-details-member-header">
                              <div className="wiki-details-member-avatar">
                                <Image 
                                  src={memberDetails?.avatar || '/assets/LogoNoShadow.png'} 
                                  alt={selectedSubsection.title}
                                  width={120}
                                  height={120}
                                  className="wiki-avatar-image"
                                />
                              </div>
                              <div className="wiki-details-member-info">
                                <h3 className="wiki-details-member-role">{selectedSubsection.content.split('.')[0]}</h3>
                                <div className="wiki-details-member-experience">{memberDetails?.experience || ''}</div>
                              </div>
                            </div>
                            
                            <div className="wiki-details-member-skills">
                              <h4>Skills & Expertise</h4>
                              <div className="wiki-details-skills-list">
                                {memberDetails?.skills.map((skill, index) => (
                                  <div 
                                    key={index} 
                                    className="wiki-details-skill-item"
                                    onMouseEnter={() => setShowTooltip(`detail-${selectedSubsection.id}-${index}`)}
                                    onMouseLeave={() => setShowTooltip(null)}
                                  >
                                    <span className="wiki-details-skill-tag">
                                      {skill}
                                      {showTooltip === `detail-${selectedSubsection.id}-${index}` && (
                                        <span className="wiki-skill-tooltip">Expertise in {skill}</span>
                                      )}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="wiki-details-member-bio">
                              <h4>Bio</h4>
                              <p>{selectedSubsection.content}</p>
                              <p>As a key member of the Slime Island Studio team, {selectedSubsection.title} contributes to our creative vision through innovative approaches and collaborative work.</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                  
                  {/* Default Content for non-team members */}
                  {selectedSection.id !== 'team' && (
                    <div className="wiki-details-text">
                      <p>{selectedSubsection.content}</p>
                      <p>This is part of our continued commitment to excellence in all aspects of our creative work at Slime Island Studio.</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="wiki-details-section">
                    <div className="wiki-details-text">
                      <p>{selectedSection.content}</p>
                    </div>
                  </div>
                  
                  {selectedSection.subsections && selectedSection.subsections.length > 0 && (
                    <div className="wiki-details-subsections">
                      <h3 className="wiki-details-subsections-title">Topics</h3>
                      <ul className="wiki-details-topics-list">
                        {selectedSection.subsections.map((subsection) => (
                          <li 
                            key={subsection.id}
                            className="wiki-details-topic-item"
                            onClick={() => setSelectedSubsection(subsection)}
                          >
                            <span className="wiki-details-topic-title">{subsection.title}</span>
                            <span className="wiki-details-topic-preview">
                              {subsection.content.substring(0, 80)}...
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 