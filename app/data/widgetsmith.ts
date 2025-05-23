// Gallery image collection for Widgetsmith
export interface GalleryImage {
  src: string;
  name: string;
}

// Collection of Widgetsmith gallery images
export const widgetsmithGallery: GalleryImage[] = [
  {
    src: "/widgetsmith/ShizukaChan.jpg",
    name: "静かちゃんは本当可愛い❤️🥹！！"
  },
  {
    src: "/widgetsmith/ShizukaChan2.jpg",
    name: "見よ！静かちゃんだた😋"
  },
];

// Helper function to get random image from the gallery
export function getRandomGalleryImage(): GalleryImage {
  // Always return a known valid image for predictability
  return widgetsmithGallery[widgetsmithGallery.length - 1]; // Resource.png
}

// Helper to check if an image exists in the gallery
export function findGalleryImageIndex(src: string): number {
  const index = widgetsmithGallery.findIndex(img => img.src === src);
  return index >= 0 ? index : 0; // Default to first image if not found
} 