export interface ResumeTemplate {
  id: string;
  title: string;
  description: string;
  category: string[];
  imageUrl: string;
  features: string[];
  tips: string[];
  rating: number;
  downloads: string;
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: "1",
    title: "Modern Software Engineer",
    description: "Clean, technical resume perfect for software developers",
    category: ["Compsci", "softwareEngineer"],
    imageUrl: "./images/portfolio1.png",
    features: [
      "ATS-Friendly",
      "Skills Section",
      "Project Highlights",
      "Clean Typography",
    ],
    tips: [
      "Highlight your technical skills prominently",
      "Include links to GitHub and portfolio",
      "Quantify your achievements with metrics",
      "Keep it to 1-2 pages maximum",
    ],
    rating: 4.8,
    downloads: "12.5k",
  },
  {
    id: "2",
    title: "Neetcode Resume Copy",
    description: "Passed through Google screening",
    category: ["Software Engineer"],
    imageUrl: "./images/portfolio2.jpg",
    features: [
      "Visual Elements",
      "Portfolio Section",
      "Color Accent",
      "Creative Layout",
    ],
    tips: [
      "Showcase your design portfolio prominently",
      "Use colors that reflect your personal brand",
      "Include links to your online portfolio",
      "Balance creativity with readability",
    ],
    rating: 4.9,
    downloads: "8.2k",
  },
  {
    id: "3",
    title: "Business Professional",
    description: "Traditional, elegant resume for corporate roles",
    category: ["Business"],
    imageUrl: "./images/portfolio3.png",
    features: [
      "Professional Layout",
      "Achievement Focus",
      "Leadership Skills",
      "Corporate Style",
    ],
    tips: [
      "Emphasize leadership and management experience",
      "Include measurable business impact",
      "Use professional language and formatting",
      "Highlight relevant certifications",
    ],
    rating: 4.7,
    downloads: "15.1k",
  },
  {
    id: "4",
    title: "Marketing Specialist",
    description: "Results-driven resume for marketing professionals",
    category: ["Marketing"],
    imageUrl: "./images/portfolio4.webp",
    features: [
      "Campaign Highlights",
      "Analytics Focus",
      "Brand Colors",
      "Social Proof",
    ],
    tips: [
      "Showcase successful marketing campaigns",
      "Include ROI and conversion metrics",
      "Highlight digital marketing skills",
      "Add links to successful projects",
    ],
    rating: 4.6,
    downloads: "9.8k",
  },
];
