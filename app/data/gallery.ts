// Gallery data definitions and utilities
export interface GalleryImage {
  src: string;
  name: string;
  description: string;
  date: string; // Format: YYYY-MM-DD
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  images: GalleryImage[];
}

// Album data
export const galleryAlbums: GalleryAlbum[] = [
  {
    id: "kusuri",
    title: "楠莉's laboratory",
    description: "楠莉先輩、メタンフェタミンはどこですか😬？",
    coverImage: "/gallery/Kusuri.jpg",
    images: [
      {
        src: "/gallery/Kusuri.jpg",
        name: "Kusuri",
        description: "Kusuri working in her lab",
        date: "2023-08-15"
      },
      {
        src: "/gallery/KusuriScared.jpg",
        name: "Scared Kusuri",
        description: "When the experiment goes wrong...",
        date: "2023-09-02"
      },
      {
        src: "/gallery/KusuriEat.jpg",
        name: "Kusuri Eating",
        description: "Taking a lunch break between experiments",
        date: "2023-10-10"
      }
    ]
  },
  {
    id: "karane",
    title: "The Realms of 院田唐音",
    description: "彼女は本当にかわいいんです😭",
    coverImage: "/gallery/DereDereKarane.jpg",
    images: [
      {
        src: "/gallery/DereDereKarane.jpg",
        name: "Dere Dere Karane",
        description: "Karane in her happy mood",
        date: "2023-11-05"
      },
      {
        src: "/gallery/RentaroHugKarane.jpg",
        name: "Rentaro Hugging Karane",
        description: "Sweet moments between Rentaro and Karane",
        date: "2023-12-20"
      }
    ]
  }
];

// Helper function to get all images across all albums
export const getAllGalleryImages = (): GalleryImage[] => {
  return galleryAlbums.flatMap(album => album.images);
};

// Helper function to find an album by ID
export const findAlbumById = (id: string): GalleryAlbum | undefined => {
  return galleryAlbums.find(album => album.id === id);
};

// Helper function to search through all albums and images
export const searchGallery = (query: string): {
  albums: GalleryAlbum[];
  images: GalleryImage[];
} => {
  const lowercaseQuery = query.toLowerCase();
  
  // Filter albums by title or description
  const filteredAlbums = galleryAlbums.filter(album => 
    album.title.toLowerCase().includes(lowercaseQuery) || 
    album.description.toLowerCase().includes(lowercaseQuery)
  );
  
  // Filter all images by name or description
  const filteredImages = getAllGalleryImages().filter(image => 
    image.name.toLowerCase().includes(lowercaseQuery) || 
    image.description.toLowerCase().includes(lowercaseQuery)
  );
  
  return {
    albums: filteredAlbums,
    images: filteredImages
  };
}; 