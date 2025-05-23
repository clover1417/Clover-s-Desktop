// About window tab data structure
export interface Tag {
  name: string;
  description: string;
}

export interface TabBullet {
  content: string;
}

export interface AboutTab {
  id: string;
  title: string;
  bullets: TabBullet[];
  tags?: Tag[];
  height?: number; // To be calculated dynamically
}

// Flattened structure for automatic column calculation
export const aboutTabs: AboutTab[] = [
  {
    id: 'education',
    title: 'Education',
    bullets: [
      { content: 'Independent Study & Skill Development.' },
      { content: 'Relevant Online Coursework.' }
    ],
    tags: []
  },
  {
    id: 'programming',
    title: 'Programming',
    bullets: [
      { content: 'Core works expertise centered on LuaU.' },
      { content: 'Possess working in other languages gained through personal interest and short-term projects.' }
    ],
    tags: [
      { name: 'LuaU', description: 'My primary programming language with 5+ years of experience' },
      { name: 'Python', description: 'Used for automation and data processing tasks' },
      { name: 'C/C++', description: 'Understanding of low-level programming concepts' },
      { name: 'HTML/CSS', description: 'Web development fundamentals' },
      { name: 'Next.js', description: 'React framework for building web applications' },
      { name: 'TypeScript', description: 'Type-safe JavaScript for larger applications' },
      { name: 'C#', description: 'Used primarily with Unity engine projects' }
    ]
  },
  {
    id: '3dDesign',
    title: '3D Design',
    bullets: [
      { content: 'Creating high-quality 3D models and assets, proficient in both stylized and realistic aesthetics.' },
      { content: 'Tools:' }
    ],
    tags: [
      { name: 'Blender', description: 'Blender is my main 3D design software that I use for almost all of my works' },
      { name: 'Adobe Substance 3D', description: 'Used for creating realistic materials and textures' },
      { name: 'Maya', description: 'Additional 3D modeling expertise' },
      { name: 'Zbrush', description: 'For detailed sculpting and organic modeling' }
    ]
  },
  {
    id: '2dDesign',
    title: '2D Design',
    bullets: [
      { content: 'Designing intuitive and visually appealing 2D interfaces, including game UI/UX, plugin interfaces, and elements for web interfaces.' },
      { content: 'Tools:' }
    ],
    tags: [
      { name: 'Figma', description: 'Primary tool for UI/UX design and prototyping' },
      { name: 'Affinity Designer 2', description: 'Vector graphics editor for creating illustrations and icons' },
      { name: 'Canvas', description: 'Web-based design tool for various graphic projects' }
    ]
  },
  {
    id: 'artWorks',
    title: 'Art works',
    bullets: [
      { content: 'Producing distinct 2D artwork in anime and cartoon styles, suitable for concept art, illustration, and character design.' },
      { content: 'Tools:' }
    ],
    tags: [
      { name: 'Adobe Photoshop', description: 'For digital painting and image editing' },
      { name: 'Clip Studio Paint', description: 'Specialized software for manga and anime illustration' }
    ]
  },
  {
    id: 'visualEffects',
    title: 'Visual Effects',
    bullets: [
      { content: 'Developing dynamic particle effects and visual elements to enhance gameplay immersion and aesthetic quality.' },
      { content: 'Tools:' }
    ],
    tags: [
      { name: 'Adobe Photoshop', description: 'For texture creation and compositing' },
      { name: 'Clip Studio Paint', description: 'For frame-by-frame animation and effects' },
      { name: 'Adobe After Effect', description: 'For complex motion graphics and VFX compositing' },
      { name: 'Houdini', description: 'For procedural and simulation-based VFX' }
    ]
  },
  {
    id: 'gameEngines',
    title: 'Game Engines',
    bullets: [
      { content: 'Primary Development Platform: Roblox Studio, where I possess extensive experience.' },
      { content: 'Explored Unity and Unreal Engine for broader understanding.' }
    ],
    tags: []
  },
  {
    id: 'projectManagement',
    title: 'Project Management',
    bullets: [
      { content: 'Leading and overseeing development cycles as the head of Slime Island Studio, managing teams and ensuring project delivery to completion.' }
    ],
    tags: []
  },
  {
    id: 'storyTelling',
    title: 'StoryTelling',
    bullets: [
      { content: 'Crafting compelling narratives, including game lore, character backstories, scripts, and standalone fictional works (novels, etc.).' }
    ],
    tags: []
  },
  {
    id: 'contentCreating',
    title: 'Content Creating',
    bullets: [
      { content: 'Producing engaging content: Focused on building tutorials, animations, and sharing development insights.' },
      { content: 'Tools:' }
    ],
    tags: [
      { name: 'Adobe Premiere', description: 'For video editing and post-production' },
      { name: 'Adobe After Effect', description: 'For motion graphics and visual effects' },
      { name: 'Capcut PC', description: 'For quick edits and social media content' }
    ]
  }
];

export const profileData = {
  name: 'Clover Jam',
  japaneseName: '五木海翔',
  greeting: 'Hello there!',
  description: `I'm Clover Jam, a seasoned Roblox Studio developer with 5 years of experience. I specialize in LuaU programming for complex game systems and excel in graphic design, creating 3D models and UI/UX.

My skills also extend to 3D rendering, animation, and video editing for my projects and YouTube channel. Additionally, I'm currently studying music and language to support my future career goals.

In short, my work encompasses: LuaU scripting, 3D/2D design (including UI/UX), animation, rendering, and project management, alongside content creation, storytelling, and music/sound composition.`,
  avatarPath: '/assets/CloverAvater.jpg',
  seeMoreLink: 'works'
};  