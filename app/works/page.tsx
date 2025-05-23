"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categories, works, getWorksByCategory, Category, WorkItem } from '../data/works';
import '../styles/Applications/works.css';
import { FiChevronDown, FiArrowDown, FiArrowUp, FiExternalLink, FiCheck } from 'react-icons/fi';
import { ImageViewer } from '../components/ImageViewer';

export default function WorksPage() {
  const [activeTab, setActiveTab] = useState<Category>('All');
  const [filteredWorks, setFilteredWorks] = useState<WorkItem[]>(works);
  const [sortAscending, setSortAscending] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{src: string, name: string}[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  useEffect(() => {
    // Filter works by selected category
    let filtered = getWorksByCategory(activeTab);
    
    // Sort by date if needed
    filtered = sortByDate(filtered, sortAscending);
    
    setFilteredWorks(filtered);
  }, [activeTab, sortAscending]);
  
  // Sort works by date
  const sortByDate = (items: WorkItem[], ascending: boolean): WorkItem[] => {
    return [...items].sort((a, b) => {
      // Parse dates (format: DD/MM/YYYY or DD/MM/YYYY - DD/MM/YYYY)
      const aDateStr = a.date.split(' - ')[0];
      const bDateStr = b.date.split(' - ')[0];
      
      const aParts = aDateStr.split('/');
      const bParts = bDateStr.split('/');
      
      const aDate = new Date(parseInt(aParts[2]), parseInt(aParts[1]) - 1, parseInt(aParts[0]));
      const bDate = new Date(parseInt(bParts[2]), parseInt(bParts[1]) - 1, parseInt(bParts[0]));
      
      return ascending ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
    });
  };
  
  // Toggle sort order
  const toggleSortOrder = () => {
    setSortAscending(prev => !prev);
  };
  
  // Open image viewer
  const openImageViewer = (images: string[], index: number, title: string) => {
    // Format images for ImageViewer component
    const formattedImages = images.map(img => ({
      src: img,
      name: title
    }));
    
    setSelectedImages(formattedImages);
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };
  
  // Close image viewer
  const closeImageViewer = () => {
    setImageViewerOpen(false);
  };
  
  // Close mobile nav when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const navDropdown = document.querySelector('.works-tabs-dropdown');
      if (navDropdown && !navDropdown.contains(event.target as Node)) {
        setMobileNavOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Calculate progress for each project
  const calculateProgress = (date: string): number => {
    if (!date.includes(' - ')) return 100; // Completed project
    
    const [startDateStr, endDateStr] = date.split(' - ');
    
    // If no end date is specified, project is still in progress
    if (!endDateStr) return 50;
    
    const startParts = startDateStr.split('/');
    const endParts = endDateStr.split('/');
    
    const startDate = new Date(parseInt(startParts[2]), parseInt(startParts[1]) - 1, parseInt(startParts[0]));
    const endDate = new Date(parseInt(endParts[2]), parseInt(endParts[1]) - 1, parseInt(endParts[0]));
    const today = new Date();
    
    // If today is past the end date, project is complete
    if (today > endDate) return 100;
    
    // Calculate progress percentage
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = today.getTime() - startDate.getTime();
    
    return Math.min(Math.round((elapsedDuration / totalDuration) * 100), 100);
  };
  
  // Get description for each category
  const getCategoryDescription = (category: Category): string => {
    switch (category) {
      case 'Programming':
        return "Projects that showcase my programming skills, from game development to web applications. These projects demonstrate my understanding of various programming paradigms, data structures, algorithms, and design patterns.";
      case '3D Design':
        return "Explore my 3D modeling and design work, including environments, characters, and assets. These projects highlight my skills in creating detailed and visually appealing 3D artwork.";
      case 'UI/UX':
        return "User interface and experience designs for various applications. These projects focus on creating intuitive, accessible, and aesthetically pleasing user experiences.";
      case 'Artworks':
        return "My collection of digital and traditional artwork. These pieces showcase my artistic style and creativity across different mediums and themes.";
      case 'Animating':
        return "Animation projects that bring characters and scenes to life. These works demonstrate my understanding of movement, timing, and storytelling through animation.";
      case 'Visual Effects':
        return "Visual effects created for various projects, including particle systems, simulations, and post-processing. These effects enhance the visual appeal and immersion of digital experiences.";
      default:
        return "A complete showcase of my portfolio across various disciplines. Browse through my projects to see my skills and experience in different creative and technical fields.";
    }
  };
  
  // Get milestones for project progress
  const getMilestones = (date: string) => {
    if (!date.includes(' - ')) {
      return [
        { label: 'Completed', position: 100, completed: true }
      ];
    }
    
    const [startDateStr, endDateStr] = date.split(' - ');
    
    if (!endDateStr) {
      return [
        { label: 'Started', position: 0, completed: true },
        { label: 'In Progress', position: 50, completed: false },
        { label: 'Completion', position: 100, completed: false }
      ];
    }
    
    const progress = calculateProgress(date);
    
    return [
      { label: startDateStr, position: 0, completed: true },
      { label: 'Midpoint', position: 50, completed: progress >= 50 },
      { label: endDateStr, position: 100, completed: progress === 100 }
    ];
  };

  // Generate bullet points for project description
  const generateBulletPoints = (description: string): string[] => {
    // Simple logic to split description into bullet points
    // In a real application, you might want to store these as structured data
    return description.split('. ')
      .filter(sentence => sentence.length > 20)
      .map(sentence => sentence.trim() + (sentence.endsWith('.') ? '' : '.'))
      .slice(0, 4); // Limit to 4 bullet points
  };

  return (
    <main className="works-container">
      <header className="works-header">
        <div className="works-header-content">
          <Link href="/" className="works-back-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Home</span>
          </Link>
          <h1 className="works-title">My Works</h1>
        </div>
      </header>

      <div className="works-tabs-container">
        {/* Desktop tabs */}
        <div className="works-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`works-tab ${activeTab === category ? 'active' : ''}`}
              onClick={() => setActiveTab(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Mobile dropdown */}
        <div className="works-tabs-dropdown">
          <button 
            className="works-tabs-dropdown-button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {activeTab} <FiChevronDown />
          </button>
          {mobileNavOpen && (
            <div className="works-tabs-dropdown-content open">
              {categories.map((category) => (
                <div
                  key={category}
                  className={`works-tab-mobile ${activeTab === category ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(category);
                    setMobileNavOpen(false);
                  }}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Description */}
      <div className="category-description">
        <div className="category-description-content">
          <h2 className="category-description-title">{activeTab}</h2>
          <p className="category-description-text">{getCategoryDescription(activeTab)}</p>
        </div>
      </div>

      {/* Date Filter */}
      <div className="works-filter-container">
        <button 
          className="works-sort-button"
          onClick={toggleSortOrder}
        >
          Sort by Date: {sortAscending ? 'Oldest' : 'Newest'}
          <span className={`works-sort-icon ${sortAscending ? 'ascending' : ''}`}>
            {sortAscending ? <FiArrowUp /> : <FiArrowDown />}
          </span>
        </button>
      </div>

      {/* Knowledge Overview for Programming Category */}
      {activeTab === 'Programming' && (
        <div className="works-thread-container">
          <div className="knowledge-overview">
            <h2 className="knowledge-overview-title">Programming Knowledge Overview</h2>
            
            <div className="knowledge-section">
              <h3 className="knowledge-section-title">Programming Paradigms</h3>
              <ul className="knowledge-list">
                <li>Object-Oriented Programming (OOP) with expertise in encapsulation, inheritance, polymorphism, and abstraction</li>
                <li>Functional Programming (FP) principles including pure functions, immutability, and higher-order functions</li>
                <li>Imperative Programming (IP) for direct state manipulation when appropriate</li>
                <li>Declarative Programming (DP) for describing what the program should accomplish rather than how</li>
              </ul>
            </div>
            
            <div className="knowledge-section">
              <h3 className="knowledge-section-title">Data Structures & Algorithms</h3>
              <ul className="knowledge-list">
                <li>Proficient in implementing and optimizing common data structures (arrays, linked lists, trees, graphs, hash tables)</li>
                <li>Experience with algorithm design and analysis, including time and space complexity considerations</li>
                <li>Efficient memory management techniques and database optimization</li>
              </ul>
            </div>
            
            <div className="knowledge-section">
              <h3 className="knowledge-section-title">Game Development</h3>
              <ul className="knowledge-list">
                <li>Clean and optimized gameplay pipelines using OOP and design patterns (Observer, Singleton, Factory, Strategy)</li>
                <li>Experience with service architecture including tweening, raycasting, pathfinding, sound systems, and character movement</li>
                <li>Custom module development for specialized game mechanics and systems</li>
                <li>Plugin development to extend engine functionality and streamline workflows</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Thread Posts */}
      <div className="works-thread-container">
        {filteredWorks.map((work) => {
          const progress = calculateProgress(work.date);
          const milestones = getMilestones(work.date);
          const bulletPoints = generateBulletPoints(work.description);
          
          return (
            <div key={work.id} className="thread-item">
              <div className="thread-item-header">
                <h2 className="thread-item-title">{work.title}</h2>
                <div className="thread-meta">
                  <div className="thread-categories">
                    {work.category.map((cat) => (
                      <span key={cat} className="thread-category">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <span className="thread-date">{work.date}</span>
                </div>
              </div>
              
              <div className="thread-content">
                <p className="thread-description">{work.description}</p>
                
                {/* Bullet Points */}
                <ul className="thread-bullets">
                  {bulletPoints.map((point, index) => (
                    <li key={index} className="thread-bullet">{point}</li>
                  ))}
                </ul>
                
                {/* Image Gallery */}
                {work.images && work.images.length > 0 && (
                  <div className="thread-images">
                    {work.images.slice(0, 4).map((img, index) => (
                      <div 
                        key={index}
                        className="thread-image"
                        onClick={() => openImageViewer(work.images!, index, work.title)}
                      >
                        <Image
                          src={img}
                          alt={`${work.title} - Image ${index + 1}`}
                          width={300}
                          height={200}
                          layout="responsive"
                        />
                      </div>
                    ))}
                    {work.images.length > 4 && (
                      <div 
                        className="thread-image"
                        onClick={() => openImageViewer(work.images!, 4, work.title)}
                      >
                        <Image
                          src={work.images[4]}
                          alt={`${work.title} - Image 5`}
                          width={300}
                          height={200}
                          layout="responsive"
                        />
                        <div className="thread-image-count">
                          +{work.images.length - 4}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Project Link */}
                {work.url && (
                  <a href={work.url} target="_blank" rel="noopener noreferrer" className="thread-link">
                    Visit Project
                    <FiExternalLink />
                  </a>
                )}
                
                {/* Progress Bar - Moved to bottom */}
                <div className="progress-container">
                  <div className="progress-title">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="progress-milestones">
                    {milestones.map((milestone, index) => (
                      <div 
                        key={index}
                        className="progress-milestone"
                        style={{ left: `${milestone.position}%` }}
                      >
                        <div className={`milestone-dot ${milestone.completed ? 'completed' : ''}`}>
                          {milestone.completed && <FiCheck size={8} color="white" />}
                        </div>
                        <span className="milestone-label">{milestone.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Using the existing ImageViewer component */}
      {imageViewerOpen && (
        <ImageViewer
          isOpen={imageViewerOpen}
          onClose={closeImageViewer}
          images={selectedImages}
          initialIndex={selectedImageIndex}
        />
      )}
    </main>
  );
} 