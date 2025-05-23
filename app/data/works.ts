import { StaticImageData } from 'next/image';

export type Category = 
  | 'All' 
  | 'Programming' 
  | '3D Design' 
  | 'UI/UX' 
  | 'Artworks' 
  | 'Animating' 
  | 'Visual Effects';

export interface WorkItem {
  id: string;
  title: string;
  description: string;
  category: Category[];
  thumbnail: string;
  images?: string[];
  video?: string;
  url?: string;
  technologies?: string[];
  date: string;
  featured?: boolean;
}

export const categories: Category[] = [
  'All',
  'Programming',
  '3D Design',
  'UI/UX',
  'Artworks',
  'Animating',
  'Visual Effects'
];

export const works: WorkItem[] = [
  {
    id: 'portfolio-website',
    title: 'Portfolio Website',
    description: 'A unique desktop-inspired portfolio website built with Next.js and React.',
    category: ['Programming', 'UI/UX'],
    thumbnail: '/assets/works/portfolio-thumbnail.jpg',
    images: ['/assets/works/portfolio-1.jpg', '/assets/works/portfolio-2.jpg'],
    technologies: ['Next.js', 'React', 'TypeScript', 'CSS'],
    date: '2023',
    featured: true
  },
  {
    id: 'slime-island-logo',
    title: 'Slime Island Studio Logo',
    description: 'Logo design for Slime Island studio with playful and energetic aesthetics.',
    category: ['UI/UX', 'Artworks'],
    thumbnail: '/assets/LogoNoShadow.png',
    date: '2022',
    featured: true
  },
  {
    id: 'character-animation',
    title: 'Character Animation',
    description: 'Animated character rig for a game project.',
    category: ['Animating', '3D Design'],
    thumbnail: '/assets/works/animation-thumbnail.jpg',
    date: '2022'
  },
  {
    id: 'vfx-explosion',
    title: 'Particle Explosion Effect',
    description: 'VFX simulation of magical particle explosion.',
    category: ['Visual Effects'],
    thumbnail: '/assets/works/vfx-thumbnail.jpg',
    date: '2023'
  },
  {
    id: 'mobile-app-design',
    title: 'Mobile App Interface',
    description: 'UI/UX design for a mobile application with focus on accessibility.',
    category: ['UI/UX', 'Programming'],
    thumbnail: '/assets/works/mobile-app-thumbnail.jpg',
    date: '2022'
  },
  {
    id: '3d-character',
    title: '3D Character Model',
    description: 'Fully rigged 3D character model for animation.',
    category: ['3D Design'],
    thumbnail: '/assets/works/3d-model-thumbnail.jpg',
    date: '2023'
  }
];

export const getWorksByCategory = (category: Category): WorkItem[] => {
  if (category === 'All') {
    return works;
  }
  return works.filter(work => work.category.includes(category));
};

export const getFeaturedWorks = (): WorkItem[] => {
  return works.filter(work => work.featured);
};

export const getWorkById = (id: string): WorkItem | undefined => {
  return works.find(work => work.id === id);
}; 