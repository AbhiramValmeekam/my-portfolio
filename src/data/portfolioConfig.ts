export interface CareerMilestone {
  position: string;
  company: string;
  duration: string;
  description: string;
}

export interface ProjectItem {
  title: string;
  category: string;
  tools: string[];
  image: string;
  description: string;
  link?: string;
  github?: string;
}

export interface WhatIDoCategory {
  title: string;
  description: string;
  skills: string[];
}

export interface PortfolioConfig {
  personalInfo: {
    firstName: string;
    lastName: string;
    role1: string;
    role2: string;
    bio: string;
    email: string;
    resumeUrl?: string;
    avatarUrl?: string;
    avatarConfig?: {
      scale: number;
      position: number[];
      initialCamera?: number[];
      initialZoom?: number;
    };
  };
  theme: {
    backgroundColor: string;
    accentColor: string;
    accentGlow: string;
    accentLight: string;
  };
  socialLinks: {
    github: string;
    linkedin: string;
    twitter?: string;
    email: string;
  };
  whatIDo: WhatIDoCategory[];
  career: CareerMilestone[];
  projects: ProjectItem[];
}

export const portfolioConfig: PortfolioConfig = {
  personalInfo: {
    firstName: "ABHIRAM",
    lastName: "VALMEEKAM",
    role1: "Full Stack Developer",
    role2: "Full Stack Developer",
    bio: "I am a Computer Science Engineering student and passionate full-stack developer specializing in crafting immersive 3D web experiences, AI-powered applications, and computer vision tools.",
    email: "abhiramsharma567@gmail.com",
    resumeUrl: "/resumee.pdf",
    avatarUrl: "/models/portfolio.glb", // customizable avatar GLB path
    avatarConfig: {
      scale: 1,
      position: [0, 0, 0],
      initialCamera: [0, 13.1, 24.7],
      initialZoom: 1.1,
    },
  },
  theme: {
    backgroundColor: "#06090e", // Beautiful deep space blue/grey
    accentColor: "#38bdf8",      // Vibrant modern cyan
    accentGlow: "rgba(56, 189, 248, 0.45)", // Blue glow
    accentLight: "#bae6fd",     // Bright highlight
  },
  socialLinks: {
    github: "https://github.com/AbhiramValmeekam",
    linkedin: "https://www.linkedin.com/in/valmeekam-abhiram",
    twitter: "https://twitter.com",
    email: "mailto:abhiramsharma567@gmail.com",
  },
  whatIDo: [
    {
      title: "DEVELOP",
      description: "Building robust, interactive, and high-performance applications integrating AI APIs, computer vision libraries, and polished full-stack technologies.",
      skills: [
        "Python",
        "Java",
        "C",
        "JavaScript",
        "TypeScript",
        "React.js",
        "Next.js",
        "Node.js",
        "Express.js",
        "REST APIs",
        "MongoDB",
        "MySQL",
        "OpenCV",
        "Google Gemini API",
        "Git",
        "GitHub",
      ],
    },
    {
      title: "DESIGN & COMPUTE",
      description: "Creating responsive, user-friendly layouts using modern styling libraries and designing immersive 3D avatars with custom rigging and real-time lip sync.",
      skills: [
        "UI/UX Design",
        "HTML",
        "CSS",
        "Tailwind CSS",
        "Three.js",
        "Rhubarb Lip Sync",
        "Figma",
        "Blender",
        "3D Modeling",
        "Rigging",
        "Data Structures",
        "Algorithms",
      ],
    },
  ],
  career: [
    {
      position: "B.Tech - Computer Science Engineering",
      company: "Anurag University (CGPA: 8.72)",
      duration: "2024 - 2028",
      description: "Currently pursuing B.Tech in CSE. Placed in the Top 5 in two 24-hour Hackathons, selected for Tejas2K26 Project Expo, and organized technical workshops in the MALAI Club.",
    },
    {
      position: "Intermediate - PCM",
      company: "Narayana Junior College (85.2%)",
      duration: "2022 - 2024",
      description: "Completed Intermediate education with core focus on Physics, Chemistry, and Mathematics.",
    },
    {
      position: "Secondary Education",
      company: "NS Grammar High School (CGPA: 9.7)",
      duration: "2021 - 2022",
      description: "Completed secondary high school education with strong academic performance.",
    },
  ],
  projects: [
    {
      title: "AI Personal Tutor",
      category: "AI & 3D Dev",
      tools: ["React", "Node.js", "JavaScript", "Three.js", "Google Gemini API"],
      image: "/images/ai-tutor.png",
      description: "Developed an AI tutor with a real-time 3D avatar enabling conversational interaction and emotional responses. Integrated Google Gemini API with speech-to-text/text-to-speech achieving 95% accuracy and 1.5s latency.",
      link: "https://adamversion-0-0.pages.dev",
      github: "https://github.com/AbhiramValmeekam/AI-Personal-Tutor",
    },
    {
      title: "MANAFOLIO",
      category: "Full Stack",
      tools: ["React", "Tailwind CSS", "TypeScript"],
      image: "/images/manafolio.png",
      description: "Developed an AI-powered portfolio builder enabling developers to create customizable portfolios. Built responsive UI with React and Tailwind CSS and implemented an interactive memory game.",
      github: "https://github.com/AbhiramValmeekam/MANAFOLIO",
    },
    {
      title: "Smart Calculator",
      category: "Computer Vision & AI",
      tools: ["OpenCV", "Python", "Google Gemini API", "JavaScript"],
      image: "/images/smart-calculator.jpg",
      description: "Developed a camera-based smart calculator which recognizes handwritten equations drawn in air using OpenCV hand tracking. Sent images to Google Gemini API for mathematical interpretation.",
    },
  ],
};
