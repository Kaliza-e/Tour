export interface TourCategoryConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  subtopics: string[];
}

export const OFFICIAL_CATEGORIES: TourCategoryConfig[] = [
  {
    id: "science-innovation",
    name: "Science & Innovation (STEM)",
    slug: "science-innovation",
    description: "Exploring natural sciences, technological breakthroughs, engineering solutions, and environmental sustainability.",
    icon: "Flask",
    subtopics: [
      "Life Sciences",
      "Technology & Engineering",
      "Environment & Future Science",
    ],
  },
  {
    id: "health-society",
    name: "Health & Society",
    slug: "health-society",
    description: "Investigating public health systems, psychological well-being, medical ethics, and healthcare policy.",
    icon: "Heart",
    subtopics: [
      "Public & Global Health",
      "Mental Health & Psychology",
      "Health Policy & Ethics",
    ],
  },
  {
    id: "education-development",
    name: "Education & Development",
    slug: "education-development",
    description: "Analyzing educational systems, youth empowerment, human development, and equitable learning access.",
    icon: "Book",
    subtopics: [
      "Education & Learning",
      "Youth & Human Development",
      "Access & Equity in Education",
    ],
  },
  {
    id: "humanities-perspectives",
    name: "Humanities & Perspectives",
    slug: "humanities-perspectives",
    description: "Studying historical insights, philosophical inquiry, social structures, cultural analysis, and ethics.",
    icon: "Graduation",
    subtopics: [
      "History & Philosophy",
      "Society & Culture",
      "Ethics & Social Issues",
    ],
  },
];

export function getSubtopicsForCategory(catNameOrSlug: string): string[] {
  if (!catNameOrSlug) return [];
  const normalized = catNameOrSlug.toLowerCase().trim();
  const matched = OFFICIAL_CATEGORIES.find(
    (c) =>
      c.slug.toLowerCase() === normalized ||
      c.name.toLowerCase() === normalized ||
      c.id.toLowerCase() === normalized ||
      normalized.includes(c.slug) ||
      c.slug.includes(normalized)
  );
  return matched ? matched.subtopics : [];
}
