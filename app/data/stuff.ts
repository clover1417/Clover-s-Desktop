export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  date: string; 
  imageSrc: string; 
  link?: string;
  tags?: string[]; 
}

export interface SubCategory {
  id: string;
  name: string;
  resources: ResourceItem[];
}

export interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

export const resourceCategories: Category[] = [
  {
    id: "3d-design",
    name: "3D Design",
    subcategories: [
      {
        id: "3d-all",
        name: "All",
        resources: [
          {
            id: "3d-fundamentals",
            title: "3D Modeling Fundamentals",
            description: "Basic principles of 3D modeling and design",
            date: "2023-06-15",
            imageSrc: "/assets/StuffApp/3d-fundamentals.jpg",
            link: "https://example.com/3d-fundamentals"
          }
        ]
      },
      {
        id: "hard-surface",
        name: "Hard Surface",
        resources: [
          {
            id: "hard-surface-modeling",
            title: "Hard Surface Modeling Techniques",
            description: "Advanced techniques for creating detailed mechanical models",
            date: "2023-09-22",
            imageSrc: "/assets/StuffApp/hard-surface.jpg",
            link: "https://example.com/hard-surface"
          }
        ]
      },
      {
        id: "character",
        name: "Character",
        resources: [
          {
            id: "character-modeling",
            title: "Character Modeling Workflow",
            description: "Complete workflow for creating 3D characters",
            date: "2023-07-30",
            imageSrc: "/assets/StuffApp/character-modeling.jpg",
            link: "https://example.com/character-modeling"
          }
        ]
      },
      {
        id: "environment",
        name: "Environment",
        resources: [
          {
            id: "environment-design",
            title: "Environment Design Principles",
            description: "Creating realistic and immersive 3D environments",
            date: "2023-08-12",
            imageSrc: "/assets/StuffApp/environment-design.jpg",
            link: "https://example.com/environment-design"
          }
        ]
      }
    ]
  },
  {
    id: "2d-design",
    name: "2D Design",
    subcategories: [
      {
        id: "2d-all",
        name: "All",
        resources: [
          {
            id: "2d-fundamentals",
            title: "2D Art Fundamentals",
            description: "Essential knowledge for 2D art and design",
            date: "2023-05-18",
            imageSrc: "/assets/StuffApp/2d-fundamentals.jpg",
            link: "https://example.com/2d-fundamentals"
          }
        ]
      },
      {
        id: "anime",
        name: "Anime",
        resources: [
          {
            id: "anime-style-guide",
            title: "Anime Style Drawing Guide",
            description: "Techniques for creating anime-style characters and scenes",
            date: "2023-10-05",
            imageSrc: "/assets/StuffApp/anime-style.jpg",
            link: "https://example.com/anime-style"
          }
        ]
      },
      {
        id: "semi-realistic",
        name: "Semi-Realistic",
        resources: [
          {
            id: "semi-realistic-techniques",
            title: "Semi-Realistic Digital Painting",
            description: "Balancing stylization and realism in digital art",
            date: "2023-11-15",
            imageSrc: "/assets/StuffApp/semi-realistic.jpg",
            link: "https://example.com/semi-realistic"
          }
        ]
      }
    ]
  },
  {
    id: "animating",
    name: "Animating",
    subcategories: [
      {
        id: "animating-all",
        name: "All",
        resources: [
          {
            id: "animation-principles",
            title: "12 Principles of Animation",
            description: "Understanding the fundamental principles of animation",
            date: "2023-06-20",
            imageSrc: "/assets/StuffApp/animation-principles.jpg",
            link: "https://example.com/animation-principles"
          }
        ]
      },
      {
        id: "character-animation",
        name: "Characters",
        resources: [
          {
            id: "character-rigging",
            title: "Character Rigging for Animation",
            description: "Creating flexible and effective character rigs",
            date: "2023-08-25",
            imageSrc: "/assets/StuffApp/character-rigging.jpg",
            link: "https://example.com/character-rigging"
          }
        ]
      },
      {
        id: "movie",
        name: "Movie",
        resources: [
          {
            id: "cinematic-animation",
            title: "Cinematic Animation Techniques",
            description: "Creating engaging animated sequences for film",
            date: "2023-09-30",
            imageSrc: "/assets/StuffApp/cinematic-animation.jpg",
            link: "https://example.com/cinematic-animation"
          }
        ]
      },
      {
        id: "environment-animation",
        name: "Environments",
        resources: [
          {
            id: "environment-fx",
            title: "Environment Animation and Effects",
            description: "Bringing life to environmental elements in animation",
            date: "2023-10-10",
            imageSrc: "/assets/StuffApp/environment-animation.jpg",
            link: "https://example.com/environment-animation"
          }
        ]
      }
    ]
  },
  {
    id: "visual-effects",
    name: "Visual Effects",
    subcategories: [
      {
        id: "vfx-all",
        name: "All",
        resources: [
          {
            id: "vfx-fundamentals",
            title: "VFX Fundamentals",
            description: "Introduction to visual effects creation",
            date: "2023-07-05",
            imageSrc: "/assets/StuffApp/vfx-fundamentals.jpg",
            link: "https://example.com/vfx-fundamentals"
          }
        ]
      },
      {
        id: "lighting",
        name: "Lighting",
        resources: [
          {
            id: "digital-lighting",
            title: "Digital Lighting Techniques",
            description: "Creating mood and atmosphere with digital lighting",
            date: "2023-08-18",
            imageSrc: "/assets/StuffApp/digital-lighting.jpg",
            link: "https://example.com/digital-lighting"
          }
        ]
      },
      {
        id: "particles",
        name: "Particles",
        resources: [
          {
            id: "particle-systems",
            title: "Particle System Design",
            description: "Creating complex particle effects for games and animation",
            date: "2023-09-12",
            imageSrc: "/assets/StuffApp/particle-systems.jpg",
            link: "https://example.com/particle-systems"
          }
        ]
      },
      {
        id: "weapons",
        name: "Weapons",
        resources: [
          {
            id: "weapon-effects",
            title: "Weapon Visual Effects",
            description: "Creating impactful weapon effects for games and film",
            date: "2023-10-25",
            imageSrc: "/assets/StuffApp/weapon-effects.jpg",
            link: "https://example.com/weapon-effects"
          }
        ]
      }
    ]
  },
  {
    id: "programming",
    name: "Programming",
    subcategories: [
      {
        id: "programming-all",
        name: "All",
        resources: [
          {
            id: "programming-basics",
            title: "Programming Fundamentals",
            description: "Core concepts of programming and software development",
            date: "2023-05-30",
            imageSrc: "/assets/StuffApp/programming-basics.jpg",
            link: "https://example.com/programming-basics"
          }
        ]
      },
      {
        id: "luau",
        name: "LuaU",
        resources: [
          {
            id: "luau-guide",
            title: "LuaU Programming Guide",
            description: "Comprehensive guide to Luau programming language",
            date: "2023-07-15",
            imageSrc: "/assets/StuffApp/luau-guide.jpg",
            link: "https://example.com/luau-guide"
          }
        ]
      },
      {
        id: "python",
        name: "Python",
        resources: [
          {
            id: "python-for-graphics",
            title: "Python for Graphics Programming",
            description: "Using Python for graphics processing and visualization",
            date: "2023-08-05",
            imageSrc: "/assets/StuffApp/python-graphics.jpg",
            link: "https://example.com/python-graphics"
          }
        ]
      }
    ]
  }
];

export const getAllResources = (): ResourceItem[] => {
  return resourceCategories.flatMap(category => 
    category.subcategories.flatMap(subcategory => 
      subcategory.resources
    )
  );
};

export const findCategoryById = (id: string): Category | undefined => {
  return resourceCategories.find(category => category.id === id);
};

export const findSubcategoryById = (categoryId: string, subcategoryId: string): SubCategory | undefined => {
  const category = findCategoryById(categoryId);
  return category?.subcategories.find(subcategory => subcategory.id === subcategoryId);
};

export const searchResources = (query: string): ResourceItem[] => {
  const lowercaseQuery = query.toLowerCase();
  
  return getAllResources().filter(resource => 
    resource.title.toLowerCase().includes(lowercaseQuery) || 
    resource.description.toLowerCase().includes(lowercaseQuery)
  );
};

export const sortResourcesByDate = (resources: ResourceItem[], ascending: boolean = false): ResourceItem[] => {
  return [...resources].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}; 