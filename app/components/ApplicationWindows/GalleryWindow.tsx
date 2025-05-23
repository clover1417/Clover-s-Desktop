'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FiSearch, FiX } from 'react-icons/fi';
import BaseWindow from './BaseWindow';
import { GalleryAlbum, GalleryImage, galleryAlbums, findAlbumById, searchGallery } from '../../data/gallery';
import { ImageViewer } from '../ImageViewer';
import { getZIndex, bringToFront } from '../../utils/windowManager';

interface GalleryWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

// Extended GalleryImage type with temporary properties for search results
interface ExtendedGalleryImage extends GalleryImage {
  album?: string; // Only used for search results
}

const GalleryWindow: React.FC<GalleryWindowProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{albums: GalleryAlbum[], images: GalleryImage[]} | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ image: GalleryImage, albumImages: GalleryImage[] } | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle search functionality
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setSearchResults(null);
      return;
    }
    
    const results = searchGallery(searchTerm);
    setSearchResults(results);
    setSelectedAlbum(null);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    
    // Auto search as you type
    if (e.target.value.trim() === '') {
      setSearchResults(null);
    } else {
      const results = searchGallery(e.target.value);
      setSearchResults(results);
      setSelectedAlbum(null);
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

  // Handle album click
  const handleAlbumClick = (album: GalleryAlbum) => {
    setSelectedAlbum(album);
    setSearchResults(null);
  };

  // Handle back button click
  const handleBackToAlbums = () => {
    setSelectedAlbum(null);
  };

  // Handle image click
  const handleImageClick = (image: GalleryImage, albumImages: GalleryImage[]) => {
    setSelectedImage({ image, albumImages });
    setIsImageViewerOpen(true);
  };

  // Improved image viewer close handler
  const handleImageViewerClose = () => {
    setIsImageViewerOpen(false);
    // Make sure to bring the gallery window back to front
    bringToFront('gallery');
  };

  // Close ImageViewer when GalleryWindow is closed
  useEffect(() => {
    if (!isOpen && isImageViewerOpen) {
      setIsImageViewerOpen(false);
    }
  }, [isOpen, isImageViewerOpen]);

  // Find the selected image's index in the album for the ImageViewer
  const getSelectedImageIndex = (): number => {
    if (!selectedImage) return 0;
    
    const index = selectedImage.albumImages.findIndex(
      img => img.src === selectedImage.image.src
    );
    return index >= 0 ? index : 0;
  };
  
  // Prepare images array for the ImageViewer
  const prepareImagesForViewer = (): Array<{src: string, name: string}> => {
    if (!selectedImage) return [];
    
    return selectedImage.albumImages.map(img => ({
      src: img.src,
      name: img.name
    }));
  };

  return (
    <>
      <BaseWindow 
        isOpen={isOpen}
        onClose={onClose}
        windowId="gallery"
        title="gallery"
        width={900}
        height={600}
      >
        <div className="gallery-window-toolbar">
          <div className="gallery-search-container">
            <input
              type="text"
              className="gallery-search-input"
              placeholder="Search albums and images..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              ref={searchInputRef}
            />
            {searchTerm ? (
              <button className="gallery-search-clear" onClick={clearSearch}>
                <FiX size={16} />
              </button>
            ) : (
              <FiSearch className="gallery-search-icon" size={16} />
            )}
          </div>
          
          {selectedAlbum && (
            <button className="gallery-back-button" onClick={handleBackToAlbums}>
              Back to Albums
            </button>
          )}
        </div>
        
        <div className="gallery-content-area">
          {searchResults ? (
            <div className="gallery-search-results">
              {(searchResults.albums.length > 0 || searchResults.images.length > 0) ? (
                <>
                  {searchResults.albums.length > 0 && (
                    <div className="gallery-search-albums">
                      <h3 className="gallery-search-section-title">Albums ({searchResults.albums.length})</h3>
                      <div className="gallery-search-albums-grid">
                        {searchResults.albums.map(album => (
                          <div 
                            key={album.id} 
                            className="gallery-album-card search-result"
                            onClick={() => handleAlbumClick(album)}
                          >
                            <div className="gallery-album-cover">
                              <Image 
                                src={album.coverImage} 
                                alt={album.title}
                                width={160}
                                height={120}
                                className="gallery-album-image"
                              />
                            </div>
                            <div className="gallery-album-info">
                              <div className="gallery-album-title">{album.title}</div>
                              <div className="gallery-album-count">{album.images.length} photos</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {searchResults.images.length > 0 && (
                    <div className="gallery-search-images">
                      <h3 className="gallery-search-section-title">Images ({searchResults.images.length})</h3>
                      <div className="gallery-search-images-grid">
                        {searchResults.images.map(image => (
                          <div 
                            key={image.src} 
                            className="gallery-image-card search-result"
                            onClick={() => {
                              // Find the album this image belongs to
                              const album = galleryAlbums.find(a => 
                                a.images.some(img => img.src === image.src)
                              );
                              
                              if (album) {
                                handleImageClick(image, album.images);
                              }
                            }}
                          >
                            <div className="gallery-image-container">
                              <Image 
                                src={image.src} 
                                alt={image.name}
                                width={160}
                                height={120}
                                className="gallery-image"
                              />
                              <div className="gallery-image-hover-info">
                                <div className="gallery-image-name">{image.name}</div>
                                <div className="gallery-image-date">{image.date}</div>
                                {(image as ExtendedGalleryImage).album && (
                                  <div className="gallery-image-album">
                                    Album: {(image as ExtendedGalleryImage).album}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="gallery-no-results">
                  <p>No results found for "{searchTerm}"</p>
                </div>
              )}
            </div>
          ) : selectedAlbum ? (
            <div className="gallery-album-view">
              <div className="gallery-album-header">
                <h2 className="gallery-album-view-title">{selectedAlbum.title}</h2>
                <p className="gallery-album-view-description">{selectedAlbum.description}</p>
              </div>
              
              <div className="gallery-images-grid">
                {selectedAlbum.images.map(image => (
                  <div 
                    key={image.src} 
                    className="gallery-image-card"
                    onClick={() => handleImageClick(image, selectedAlbum.images)}
                  >
                    <div className="gallery-image-container">
                      <Image 
                        src={image.src} 
                        alt={image.name}
                        width={200}
                        height={150}
                        className="gallery-image"
                      />
                      <div className="gallery-image-hover-info">
                        <div className="gallery-image-name">{image.name}</div>
                        <div className="gallery-image-date">{image.date}</div>
                        {image.description && (
                          <div className="gallery-image-description">
                            {image.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="gallery-albums-grid">
              {galleryAlbums.map(album => (
                <div 
                  key={album.id} 
                  className="gallery-album-card"
                  onClick={() => handleAlbumClick(album)}
                >
                  <div className="gallery-album-cover">
                    <Image 
                      src={album.coverImage} 
                      alt={album.title}
                      width={200}
                      height={150}
                      className="gallery-album-image"
                    />
                  </div>
                  <div className="gallery-album-info">
                    <div className="gallery-album-title">{album.title}</div>
                    <div className="gallery-album-description">{album.description}</div>
                    <div className="gallery-album-count">{album.images.length} photos</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </BaseWindow>

      {isImageViewerOpen && selectedImage && (
        <ImageViewer
          isOpen={isImageViewerOpen}
          images={prepareImagesForViewer()}
          initialIndex={getSelectedImageIndex()}
          onClose={handleImageViewerClose}
        />
      )}
    </>
  );
};

export default GalleryWindow; 