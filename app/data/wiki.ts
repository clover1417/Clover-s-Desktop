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
}

export const wikiCategories = [
  'About',
  'Team',
  'Projects',
  'Partners',
  'Values',
  'Resources',
  'Contact'
];

export const wikiData: WikiSection[] = [
  {
    id: 'about',
    title: 'About Slime Island',
    icon: '/assets/wiki/about-icon.png',
    content: `Slime Island is a creative studio founded in 2022, focused on producing innovative digital experiences across multiple disciplines. Our work spans from game development to digital art, animation, and interactive media.

The studio draws inspiration from playful aesthetics and combines them with professional execution, creating a unique blend of fun and functionality in all our projects.`,
    subsections: [
      {
        id: 'mission',
        title: 'Our Mission',
        content: "To create delightful digital experiences that inspire creativity and joy while pushing the boundaries of what's possible in interactive media."
      },
      {
        id: 'vision',
        title: 'Our Vision',
        content: "To become a recognized creative force in the digital space, known for our distinctive aesthetic and innovative approach to design and development."
      },
      {
        id: 'history',
        title: 'History',
        content: "Slime Island began as a solo project by Clover, eventually growing into a collaborative studio bringing together talented individuals from diverse creative backgrounds."
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
        content: 'Founder & Creative Director. Specializes in programming, UI/UX design, and creative direction.'
      },
      {
        id: 'team-member-2',
        title: 'Team Member 2',
        content: '3D Artist & Animator. Creates detailed 3D models and brings them to life through animation.'
      },
      {
        id: 'team-member-3',
        title: 'Team Member 3',
        content: 'Visual Effects Artist. Crafts stunning visual effects that enhance projects with magic and wonder.'
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
        title: 'Project Alpha',
        content: 'An interactive experience blending 3D environments with playful mechanics.'
      },
      {
        id: 'project-2',
        title: 'Project Beta',
        content: 'A mobile application featuring unique visual design and intuitive user experience.'
      },
      {
        id: 'project-3',
        title: 'Project Gamma',
        content: 'An animated short film exploring themes of creativity and imagination.'
      }
    ]
  },
  {
    id: 'partners',
    title: 'Partners',
    icon: '/assets/wiki/partners-icon.png',
    content: 'We collaborate with like-minded creators and organizations to bring creative visions to life.',
    subsections: [
      {
        id: 'partner-1',
        title: 'Partner Studio A',
        content: "A game development studio with whom we've collaborated on interactive projects."
      },
      {
        id: 'partner-2',
        title: 'Partner Agency B',
        content: "A digital agency specializing in web development and brand identity."
      },
      {
        id: 'partner-3',
        title: 'Independent Creator C',
        content: "An independent artist with whom we've collaborated on visual storytelling projects."
      }
    ]
  },
  {
    id: 'values',
    title: 'Values',
    icon: '/assets/wiki/values-icon.png',
    content: 'The core principles that guide our work and creative process.',
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

export const getWikiSectionById = (id: string): WikiSection | undefined => {
  return wikiData.find(section => section.id === id);
};

export const getWikiSubsectionById = (sectionId: string, subsectionId: string): WikiSubsection | undefined => {
  const section = getWikiSectionById(sectionId);
  if (!section || !section.subsections) return undefined;
  return section.subsections.find(subsection => subsection.id === subsectionId);
}; 