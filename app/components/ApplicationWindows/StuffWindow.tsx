'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FiSearch, FiX, FiFilter, FiArrowUp, FiArrowDown, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import BaseWindow from './BaseWindow';
import styles from '../../styles/Applications/stuff.module.css';
import { 
  Category, 
  SubCategory, 
  ResourceItem, 
  resourceCategories, 
  findCategoryById, 
  findSubcategoryById, 
  searchResources,
  sortResourcesByDate,
  getAllResources
} from '../../data/stuff';

interface StuffWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const StuffWindow: React.FC<StuffWindowProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ResourceItem[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null);
  const [sortAscending, setSortAscending] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [filterAnimating, setFilterAnimating] = useState(false);
  const [categoryAnimating, setCategoryAnimating] = useState<string | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const filterOptionsRef = useRef<HTMLDivElement>(null);

  // Handle search functionality
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setSearchResults(null);
      return;
    }
    
    const results = searchResources(searchTerm);
    setSearchResults(results);
    
    // Clear selected category when searching
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    
    // Auto search as you type
    if (e.target.value.trim() === '') {
      setSearchResults(null);
    } else {
      const results = searchResources(e.target.value);
      setSearchResults(results);
      
      // Clear selected category when searching
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
    
    // Focus search input after clearing
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle category selection with animation
  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setSearchResults(null);
    
    if (categoryAnimating === category.id) return;
    
    // Toggle category open/closed state with animation
    setCategoryAnimating(category.id);
    
    if (openCategories.has(category.id)) {
      // Animate closing
      const subcategoriesEl = document.getElementById(`subcategories-${category.id}`);
      if (subcategoriesEl) {
        subcategoriesEl.className = `${styles['stuff-subcategories']} ${styles['slide-up']}`;
        setTimeout(() => {
          setOpenCategories(prev => {
            const newSet = new Set(prev);
            newSet.delete(category.id);
            return newSet;
          });
          setCategoryAnimating(null);
        }, 300);
      }
    } else {
      // Open immediately, then animate
      setOpenCategories(prev => {
        const newSet = new Set(prev);
        newSet.add(category.id);
        return newSet;
      });
      
      // Add animation class after a small delay
      setTimeout(() => {
        const subcategoriesEl = document.getElementById(`subcategories-${category.id}`);
        if (subcategoriesEl) {
          subcategoriesEl.className = `${styles['stuff-subcategories']} ${styles['slide-down']}`;
          setTimeout(() => {
            setCategoryAnimating(null);
          }, 300);
        }
      }, 10);
    }
  };

  // Handle subcategory selection
  const handleSubcategoryClick = (subcategory: SubCategory) => {
    setSelectedSubcategory(subcategory);
    setSearchResults(null);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortAscending(!sortAscending);
  };

  // Toggle filter display
  const toggleFilter = () => {
    if (filterAnimating) return;
    
    if (showFilter) {
      // Start animating out
      setFilterAnimating(true);
      const filterOptions = filterOptionsRef.current;
      if (filterOptions) {
        filterOptions.className = `${styles['stuff-sort-options']} ${styles['slide-up']}`;
        setTimeout(() => {
          setShowFilter(false);
          setFilterAnimating(false);
        }, 300); // Match animation duration
      }
    } else {
      setShowFilter(true);
      // Add a small delay before starting animation in
      setTimeout(() => {
        const filterOptions = filterOptionsRef.current;
        if (filterOptions) {
          filterOptions.className = `${styles['stuff-sort-options']} ${styles['slide-down']}`;
          setTimeout(() => {
            setFilterAnimating(false);
          }, 300);
        }
      }, 10);
    }
  };

  // Add cleanup effect when the window closes
  useEffect(() => {
    if (!isOpen) {
      // Clear search state on close
      setSearchTerm('');
      setSearchResults(null);
      setShowFilter(false);
      setOpenCategories(new Set());
    }
  }, [isOpen]);

  // Prepare resources to display based on selections and search
  const getResourcesToDisplay = (): ResourceItem[] => {
    let resources: ResourceItem[] = [];
    
    if (searchResults) {
      resources = searchResults;
    } else if (selectedSubcategory) {
      resources = selectedSubcategory.resources;
    } else if (selectedCategory) {
      // Combine all subcategory resources for the category
      resources = selectedCategory.subcategories.reduce(
        (allResources, subcategory) => [...allResources, ...subcategory.resources],
        [] as ResourceItem[]
      );
    } else {
      resources = getAllResources();
    }
    
    // Sort by date
    return sortResourcesByDate(resources, sortAscending);
  };

  // Get result count text
  const getResultCountText = (): string => {
    const resources = getResourcesToDisplay();
    const count = resources.length;
    
    if (searchResults) {
      return `${count} result${count !== 1 ? 's' : ''} for "${searchTerm}"`;
    } else if (selectedSubcategory) {
      return `${count} resource${count !== 1 ? 's' : ''} in ${selectedSubcategory.name}`;
    } else if (selectedCategory) {
      return `${count} resource${count !== 1 ? 's' : ''} in ${selectedCategory.name}`;
    }
    
    return `${count} resource${count !== 1 ? 's' : ''} total`;
  };

  return (
    <BaseWindow
      isOpen={isOpen}
      onClose={onClose}
      windowId="stuff"
      title="stuff"
      width={800}
      height={600}
    >
      <div className={styles['stuff-window-toolbar']}>
        <div className={styles['stuff-search-container']}>
          <input
            type="text"
            className={styles['stuff-search-input']}
            placeholder="Search resources..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            ref={searchInputRef}
          />
          {searchTerm ? (
            <button className={styles['stuff-search-clear']} onClick={clearSearch}>
              <FiX size={16} />
            </button>
          ) : (
            <FiSearch className={styles['stuff-search-icon']} size={16} />
          )}
        </div>
        
        <div className={styles['stuff-filter-container']}>
          <button className={styles['stuff-filter-button']} onClick={toggleFilter}>
            <FiFilter size={16} />
            <span className={styles['stuff-filter-text']}>Filter</span>
          </button>
          
          {showFilter && (
            <div 
              className={`${styles['stuff-sort-options']}`} 
              ref={filterOptionsRef}
            >
              <button 
                className={`${styles['stuff-sort-option']} ${!sortAscending ? styles.active : ''}`}
                onClick={() => setSortAscending(false)}
              >
                <FiArrowDown size={14} />
                Newest First
              </button>
              <button 
                className={`${styles['stuff-sort-option']} ${sortAscending ? styles.active : ''}`}
                onClick={() => setSortAscending(true)}
              >
                <FiArrowUp size={14} />
                Oldest First
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles['stuff-two-column-layout']}>
        <div className={styles['stuff-sidebar']} ref={sidebarRef}>
          <div className={styles['stuff-categories']}>
            {resourceCategories.map((category) => (
              <div key={category.id} className={styles['stuff-category-section']}>
                <div 
                  className={`${styles['stuff-category']} ${selectedCategory?.id === category.id ? styles.active : ''}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <span className={styles['stuff-category-icon']}>
                    {openCategories.has(category.id) ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                  </span>
                  {category.name}
                </div>
                
                <div 
                  id={`subcategories-${category.id}`}
                  className={`${styles['stuff-subcategories']} ${openCategories.has(category.id) ? styles.expanded : styles.collapsed}`}
                >
                  {category.subcategories.map((subcategory) => (
                    <div 
                      key={subcategory.id}
                      className={`${styles['stuff-subcategory']} ${selectedSubcategory?.id === subcategory.id ? styles.active : ''}`}
                      onClick={() => handleSubcategoryClick(subcategory)}
                    >
                      {subcategory.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles['stuff-content']}>
          <div className={styles['stuff-content-title']}>
            {selectedSubcategory ? (
              <>
                {selectedCategory?.name}: <strong>{selectedSubcategory.name}</strong>
              </>
            ) : selectedCategory ? (
              <>{selectedCategory.name}</>
            ) : searchResults ? (
              <>Search Results</>
            ) : (
              <>All Resources</>
            )}
          </div>
          
          <div className={styles['stuff-result-count']}>
            {getResultCountText()}
          </div>
          
          <div className={styles['stuff-resources']}>
            {getResourcesToDisplay().map((resource) => (
              <div key={resource.id} className={styles['stuff-resource-item']}>
                <div className={styles['stuff-resource-image']}>
                  <Image
                    src={resource.imageSrc}
                    alt={resource.title}
                    width={100}
                    height={100}
                    objectFit="cover"
                  />
                </div>
                <div className={styles['stuff-resource-info']}>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <div className={styles['stuff-resource-meta']}>
                    <span>{resource.date}</span>
                    {resource.tags?.map((tag: string) => (
                      <span key={tag} className={styles['stuff-resource-tag']}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseWindow>
  );
};

export default StuffWindow; 