export interface WikiSection {
  id: string;
  title: string;
  content: string;
  icon?: string;
  subsections?: WikiSubsection[];
}

export interface WikiSubsection {
  id: string;
  title: string;
  content: string;
  details?: TeamMemberDetails | PartnerDetails;
}

export interface TeamMemberDetails {
  type: 'team';
  avatar: string;
  skills: string[];
  experience: string;
}

export interface PartnerDetails {
  type: 'partner';
  avatar: string;
}

export const wikiCategories = [
  'About',
  'Team',
  'Projects',
  'Partners',
  'Values',
];

export const wikiData: WikiSection[] = [
  {
    id: 'about',
    title: 'About Slime Island',
    icon: '/assets/wiki/about-icon.png',
    content: `Slime Island is a creative collective founded in 2022, built as a community where developers, artists, and storytellers learn and grow together. Rather than a traditional studio, it operates as a cooperative platform—focused on shared creation, mutual growth, and collaborative projects. Our work spans Roblox game development, digital art, media, storytelling, and soon, animation and film.`,
    subsections: [
      {
        id: 'mission',
        title: 'Our Mission',
        content: "To create innovative, emotionally engaging digital experiences through community-driven collaboration—where every member contributes not just to projects, but to the growth of the group itself."
      },
      {
        id: 'vision',
        title: 'Our Vision',
        content: "We aim to become a recognized space for original, high-quality digital content—from games to cinematic media—powered by a passionate team and fueled by creative freedom and long-term growth."
      },
      {
        id: 'history',
        title: 'History',
        content: "Founded in 2022, Slime Island began as a small group of like-minded creators passionate about interactive media and visual storytelling. What started as casual experimentation has grown into a collective committed to crafting impactful digital works and building a sustainable future together."
      }
    ]
  },
  {
    id: 'team',
    title: 'Team',
    icon: '/assets/wiki/team-icon.png',
    content: 'Slime Island brings together talented individuals with diverse skills and a shared passion for creative excellence.',
    subsections: [
      {
        id: 'clover',
        title: 'Clover',
        content: 'Founder & Creative Director. A seasoned Roblox developer with 5+ years of experience in LuaU scripting, 3D/2D design, UI/UX, animation, and rendering. Also skilled in video editing, storytelling, and project management. Currently exploring music and language to broaden creative direction.',
        details: {
          type: 'team',
          avatar: '/assets/CloverAvater.jpg',
          skills: ['All Fields', 'Multitasking', 'Creative Direction', 'Project Management'],
          experience: '5+ years in creative technology and digital design'
        }
      },
      {
        id: 'tofu',
        title: 'Tofu Axolotlbark',
        content: 'Programming & Character Design. With over two years of experience in programming and storytelling, Tofu brings a creative and technical perspective to our projects. Their expertise encompasses a range of skills crucial to game development, including Programming, Storytelling, Concept Creative, and Character Design.',
        details: {
          type: 'team',
          avatar: '/wiki/Team/Boykisser.png',
          skills: ['Programming', 'Storytelling', 'Concept Creative', 'Character Design'],
          experience: '2+ years in programming and storytelling'
        }
      },
      {
        id: 'sigma',
        title: 'Sigma',
        content: '3D environment artist. Crafts stunning 3D environments that enhance projects with magic and wonder.',
        details: {
          type: 'team',
          avatar: '/wiki/Team/Sigma.webp',
          skills: ['3D Environment', '3D Modeling', '3D Texturing', '3D Lighting'],
          experience: '3+ years in 3D environment design'
        }
      },
      {
        id: 'binTuanAnh',
        title: 'Bin Tuấn Anh',
        content: '3D environment artist. Crafts stunning 3D environments that enhance projects with magic and wonder.',
        details: {
          type: 'team',
          avatar: '/wiki/Team/BinTuanAnh.png',
          skills: ['3D Design', 'Workspace Composition', 'Asset Creation', 'Lighting Techniques'],
          experience: '6+ years in 3D overview design'
        }
      }
    ]
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: '/assets/wiki/projects-icon.png',
    content: 'Slime Island has worked on a variety of creative projects since our founding, each showcasing our diverse capabilities and unique aesthetic.',
    subsections: [
      {
        id: 'project-1',
        title: 'Reverie Roblox',
        content: 'Ascend Mount Everest as an adventurer tasked with uncovering lost documents within an abandoned research facility. But be warned, the secrets you unearth may be more terrifying than the climb. Dare to explore and lose yourself in its mysterious worlds and haunting stories beneath dreams and reality.'
      },
      {
        id: 'project-2',
        title: 'Scientists Adventure',
        content: `Scientists' Adventure" is a genre-bending animated series following the inventive Sie and the resourceful Clover. From their unique Slime Island laboratory, they embark on dynamic multiverse travels. Expect a blend of sci-fi challenges, comedic situations, and hints of romance as they encounter diverse worlds. Featuring a large ensemble of scientific colleagues, interdimensional allies, and numerous robots, this series delivers a continuous stream of travel, fantasy, humor, and thrills.`
      },

    ]
  },
  {
    id: 'partners',
    title: 'Partners',
    icon: '/assets/wiki/partners-icon.png',
    content: 'We collaborate with like-minded creators and organizations to bring creative visions to life.',
    subsections: [
      
    ]
  },
  {
    id: 'values',
    title: 'Values',
    icon: '/assets/wiki/values-icon.png',
    content: 'At Slime Island, we value creativity, collaboration, and growth. We believe in learning by doing, supporting each other, and building meaningful experiences through shared passion. Every project is a step forward—both for the group and each individual.',
    subsections: [
      {
        id: 'creativity',
        title: 'Creativity',
        content: 'We value originality and the courage to explore new ideas and approaches.'
      },
      {
        id: 'quality',
        title: 'Quality',
        content: 'We strive for excellence in execution, paying attention to even the smallest details.'
      },
      {
        id: 'playfulness',
        title: 'Playfulness',
        content: 'We believe that creativity thrives in an environment that embraces fun and experimentation.'
      }
    ]
  }
];

// Helper functions for accessing team and partner data
export const getTeamMemberDetails = (memberId: string): TeamMemberDetails | undefined => {
  const teamSection = wikiData.find(section => section.id === 'team');
  const memberSubsection = teamSection?.subsections?.find(sub => sub.id === memberId);
  return memberSubsection?.details as TeamMemberDetails | undefined;
};

export const getPartnerDetails = (partnerId: string): PartnerDetails | undefined => {
  const partnersSection = wikiData.find(section => section.id === 'partners');
  const partnerSubsection = partnersSection?.subsections?.find(sub => sub.id === partnerId);
  return partnerSubsection?.details as PartnerDetails | undefined;
};

export const getWikiSectionById = (id: string): WikiSection | undefined => {
  return wikiData.find(section => section.id === id);
};

export const getWikiSubsectionById = (sectionId: string, subsectionId: string): WikiSubsection | undefined => {
  const section = getWikiSectionById(sectionId);
  if (!section || !section.subsections) return undefined;
  return section.subsections.find(subsection => subsection.id === subsectionId);
}; 