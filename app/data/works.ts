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
    id: 'combat-clash',
    title: 'Combat Clash - Fighting',
    description: 'Combat Clash represents my initial project aimed at developing a comprehensive skillset across game development. This game, a collaborative effort with friends and contributors who assisted with ideation and debugging, is a combat arena where players utilize weapons to battle for points, which can then be used to acquire new armaments. As my first undertaking, its primary purpose was practical learning and skill application within the game development spectrum.',
    category: ['Programming', '3D Design', 'Animating', 'UI/UX'],
    thumbnail: '/works/CombatClash/CombatClash_1.webp',
    images: ['/works/CombatClash/CombatClash_1.webp',
      '/works/CombatClash/CombatClash_2.png',
      '/works/CombatClash/CombatClash_3.png'
    ],
    date: '26/10/2021 - 04/01/2022',
    featured: true
  },
  {
    id: 'forest-base-commision',
    title: 'Forest Base Commision',
    description: 'This project was a commission for a client who wanted a forest exploration base for their Roblox game. I was tasked with creating a base that was both functional and aesthetically pleasing. The base features a main building, a workshop, and a garage. I focused on creating an immersive environment with carefully designed lighting, foliage, and architectural details to blend with the natural surroundings.',
    category: ['3D Design', 'Animating', 'Visual Effects'],
    thumbnail: '/works/ForestBaseCommision/ForestExplorationBase_1.png',
    images: ['/works/ForestBaseCommision/ForestExplorationBase_1.png',
      '/works/ForestBaseCommision/ForestExplorationBase_2.png',
      '/works/ForestBaseCommision/ForestExplorationBase_3.png'
    ],
    date: '26/11/2021 - 03/12/2021',
    featured: true
  },
  {
    id: 'the-corrupted',
    title: 'The Corrupted - Horror',
    description: 'The Corrupted marks my second project, a horror experience challenging players to traverse an eerie forest while evading a persistent spectral entity. This project was undertaken as a rapid development challenge, with all narrative and gameplay elements completed within a two-week timeframe. I created unique atmospheric lighting and sound design to enhance the horror experience, implemented AI systems for enemy behavior, and designed puzzle mechanics that required players to explore the haunting environment thoroughly.',
    category: ['3D Design', 'Visual Effects', 'Programming'],
    thumbnail: '/works/TheCorrupted/TheCorrupted_1.png',
    images: ['/works/TheCorrupted/TheCorrupted_1.png',
      '/works/TheCorrupted/TheCorrupted_2.png',
      '/works/TheCorrupted/TheCorrupted_3.png',
      '/works/TheCorrupted/TheCorrupted_4.png',
    ],
    date: '17/03/2022 - 24/03/2022',
    featured: true
  },
  {
    id: 'malitiza-island',
    title: 'Malitiza Island Commision',
    description: 'For this commission, I undertook the creation of a tropical island tailored for a Roblox game. The design focused on achieving both aesthetic appeal and providing opportunities for engaging exploration within the game world. I developed a comprehensive terrain system with diverse biomes, created custom vegetation assets to enhance environmental diversity, implemented dynamic weather systems, and designed points of interest that encourage player exploration and discovery throughout the island landscape.',
    category: ['3D Design', 'Artworks', 'Animating', 'Programming'],
    thumbnail: '/works/MalitizaIsland/MalitizaIsland_1.png',
    images: ['/works/MalitizaIsland/MalitizaIsland_1.png',
      '/works/MalitizaIsland/MalitizaIsland_2.png',
      '/works/MalitizaIsland/MalitizaIsland_3.png'
    ],
    date: '17/03/2022 - 24/03/2022',
    featured: true
  },
  {
    id: 'decayded-dungeon',
    title: 'Dungeon Commision',
    description: 'This commission involved designing a visually atmospheric and explorable dungeon for a Roblox game. The environment features dimly lit, overgrown stone interiors with warm lighting, suggesting a blend of ancient architecture and natural decay. Elements like chandeliers and market stalls hint at a forgotten history, creating a mysterious and engaging space for players. I designed intricate architectural details to convey the dungeon\'s history, implemented dynamic lighting systems to create mood and guide exploration, and crafted custom-aged materials to effectively portray the passage of time.',
    category: ['3D Design', 'Visual Effects'],
    thumbnail: '/works/DecaydedDungeon/DecaydedDungeon_1.png',
    images: ['/works/DecaydedDungeon/DecaydedDungeon_1.png',
      '/works/DecaydedDungeon/DecaydedDungeon_2.png',
      '/works/DecaydedDungeon/DecaydedDungeon_3.png',
      '/works/DecaydedDungeon/DecaydedDungeon_4.png',
      '/works/DecaydedDungeon/DecaydedDungeon_5.png',
    ],
    date: '17/03/2022 - 24/03/2022',
    featured: true
  },
  {
    id: 'project-kozen',
    title: 'Project こぜん - Environment',
    description: 'This project is a personal exploration of a unique and visually striking concept. The environment features a dark, eerie atmosphere with a focus on creating a sense of mystery and intrigue. The design includes elements like a mysterious structure and a dark, ominous background, creating a visually engaging and immersive experience. I developed a custom atmospheric system to create the surreal visual effects, designed a narrative-driven environmental storytelling approach, implemented interactive elements that respond to player proximity, and created a cohesive artistic direction that blends Japanese aesthetic influences with science fiction elements.',
    category: ['3D Design', 'Visual Effects', 'Programming', 'Animating'],
    thumbnail: '/works/Kozen/Kozen_1.png',
    images: ['/works/Kozen/Kozen_1.png',
      '/works/Kozen/Kozen_2.png', 
      '/works/Kozen/Kozen_3.png',
      '/works/Kozen/Kozen_4.png',
      '/works/Kozen/Kozen_5.png',
      '/works/Kozen/Kozen_6.png',
      '/works/Kozen/Kozen_7.png',
      '/works/Kozen/Kozen_8.png',
      '/works/Kozen/Kozen_9.png',
      '/works/Kozen/Kozen_10.png',
      '/works/Kozen/Kozen_11.png',
      '/works/Kozen/Kozen_12.png'
    ],
    date: '17/03/2022 - 24/03/2022',
    featured: true
  },
  {
    id: 'myth-lands',
    title: 'Myth Lands - MMORPG',
    description: 'Myth Lands is an expansive MMORPG project set in a world inspired by diverse mythologies. The game features rich environments, character customization, and quest-based gameplay. I designed a comprehensive progression system with balanced character development paths, created immersive world regions with distinct cultural and mythological influences, implemented a dynamic quest system with branching narratives, and developed social gameplay systems to encourage player cooperation and community building within the game world.',
    category: ['3D Design', 'Visual Effects', 'Animating'],
    thumbnail: '/works/MythLands/MythLands_1.png',
    images: ['/works/MythLands/MythLands_1.png',
      '/works/MythLands/MythLands_2.png',
      '/works/MythLands/MythLands_3.png',
      '/works/MythLands/MythLands_4.png',
      '/works/MythLands/MythLands_5.png',
      '/works/MythLands/MythLands_6.png',
      '/works/MythLands/MythLands_7.png'
    ],
    date: '17/03/2022 - 24/03/2022',
    featured: true
  },
  {
    id: 'abyssal-bloom',
    title: 'Abyssal Bloom - Adventure',
    description: 'Abyssal Bloom is an adventure game set in a surreal underwater world. Players explore vast oceanic landscapes filled with strange flora and fauna while uncovering the mysteries of an ancient civilization. I created a unique art direction blending bioluminescent aesthetics with alien architecture, developed a physics-based swimming locomotion system for fluid player movement, designed puzzle mechanisms that utilize water currents and pressure dynamics, and implemented an adaptive ecosystem where creatures respond realistically to player interactions and environmental changes.',
    category: ['3D Design', 'Visual Effects', 'Programming', 'Artworks'],
    thumbnail: '/works/AbyssalBloom/AbyssalBloom_1.png',
    images: ['/works/AbyssalBloom/AbyssalBloom_1.png',
      '/works/AbyssalBloom/AbyssalBloom_2.png',
      '/works/AbyssalBloom/AbyssalBloom_3.png',
      '/works/AbyssalBloom/AbyssalBloom_4.png',
      '/works/AbyssalBloom/AbyssalBloom_5.png',
      '/works/AbyssalBloom/AbyssalBloom_6.png',
      '/works/AbyssalBloom/AbyssalBloom_7.png',
      '/works/AbyssalBloom/AbyssalBloom_8.png',
      '/works/AbyssalBloom/AbyssalBloom_9.png',
      '/works/AbyssalBloom/AbyssalBloom_10.png',
      '/works/AbyssalBloom/AbyssalBloom_11.png',
      '/works/AbyssalBloom/AbyssalBloom_12.png',
      '/works/AbyssalBloom/AbyssalBloom_13.png',
      '/works/AbyssalBloom/AbyssalBloom_15.png',
      '/works/AbyssalBloom/AbyssalBloom_17.webp',
      '/works/AbyssalBloom/AbyssalBloom_18.webp',
      '/works/AbyssalBloom/AbyssalBloom_19.webp',
      '/works/AbyssalBloom/AbyssalBloom_20.webp',
      '/works/AbyssalBloom/AbyssalBloom_21.webp',
      '/works/AbyssalBloom/AbyssalBloom_22.webp',
      '/works/AbyssalBloom/AbyssalBloom_23.webp',
      '/works/AbyssalBloom/AbyssalBloom_24.webp',
      '/works/AbyssalBloom/AbyssalBloom_25.webp',
    ],
    date: '17/03/2022 - 24/03/2022',
    featured: true
  },
  {
    id: 'depth-bound',
    title: 'Depth Bound - Adventure',
    description: 'Depth Bound is an adventure game set in a vast archipelago world where players explore islands, dive into underwater ruins, and uncover a story of an ancient civilization. I designed a seamless transition system between sailing, swimming, and on-foot exploration, created a dynamic weather and ocean system that affects gameplay and navigation, developed a comprehensive crafting and upgrade system for player equipment, and implemented an emergent ecosystem where island wildlife and marine creatures interact realistically with each other and the environment.',
    category: ['3D Design', 'Programming', 'Artworks'],
    thumbnail: '/works/DepthBound/Map.png',
    images: ['/works/DepthBound/Map.png',
      '/works/DepthBound/StarterIsland.png',
      '/works/DepthBound/StarterIsland_2.png',
      '/works/DepthBound/Armors.png',
      '/works/DepthBound/Assets.png',
      '/works/DepthBound/Weapon.png',
      '/works/DepthBound/Clothes.png',
      '/works/DepthBound/Cutlass.webp',
      '/works/DepthBound/Trees.png',
      '/works/DepthBound/Palms.png',
      '/works/DepthBound/Peddles.png',
    ],
    date: '17/03/2022 - 24/03/2022',
    featured: true
  },
  {
    id: 'arc-flight',
    title: 'Arc Flight - Commission',
    description: 'Arc Flight was a commissioned project for a futuristic flying game. The project focused on creating highly detailed aircraft models with realistic physics and control systems. I designed aerodynamically plausible vehicle models with attention to mechanical detail, implemented a physics-based flight model with realistic response to environmental conditions, created custom particle systems for engine effects and weather interactions, and developed a modular damage system that affects aircraft performance and visual appearance based on impact locations.',
    category: ['3D Design'],
    thumbnail: '/works/ArcFlight/ArcFlight_1.png',
    images: [
      '/works/ArcFlight/ArcFlight_1.png',
      '/works/ArcFlight/ArcFlight_2.png',
      '/works/ArcFlight/ArcFlight_3.png',
      '/works/ArcFlight/ArcFlight_4.png',
      '/works/ArcFlight/ArcFlight_5.png',
      '/works/ArcFlight/ArcFlight_6.png',
      '/works/ArcFlight/ArcFlight_7.png',
      '/works/ArcFlight/ArcFlight_8.png',
      '/works/ArcFlight/ArcFlight_9.png',
    ],
    date: '17/03/2022 - 24/03/2022',
    featured: true
  },
  {
    id: 'nivea-tower-run',
    title: 'Nivea Tower Run',
    description: 'Nivea Tower Run was a branded game project featuring vertical platforming challenges in a stylized skyscraper environment. Players climb the tower while collecting brand items and avoiding obstacles. I developed procedurally generated level elements to ensure replayability, created a precise character controller with satisfying movement physics, implemented progressive difficulty scaling to maintain player engagement, and designed visually appealing branded elements that were naturally integrated into the gameplay experience without feeling intrusive.',
    category: ['Programming', '3D Design', 'Animating'],
    thumbnail: '/works/Nivea/Nivea_1.webp',
    images: [
      '/works/Nivea/Nivea_1.webp',
      '/works/Nivea/Nivea_2.webp',
      '/works/Nivea/Nivea_3.webp',
    ],
    date: '17/03/2022 - 24/03/2022',
    featured: true
  },
];

export const getWorksByCategory = (category: Category): WorkItem[] => {
  if (category === 'All') {
    return works;
  }
  return works.filter(work => work.category.includes(category));
};

export const getWorkById = (id: string): WorkItem | undefined => {
  return works.find(work => work.id === id);
}; 