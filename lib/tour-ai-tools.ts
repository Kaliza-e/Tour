// Strictly Validated Server-Side Tools for Tour AI
// Model never touches database. Strict enum and schema validation.

import { PAGE_MAP, getRouteForPageKey } from "./tour-ai-config";

export const ALLOWED_NAVIGATE_PAGES = [
  "home",
  "about",
  "research",
  "publish",
  "volunteer",
  "contact",
] as const;

export type AllowedNavigatePage = (typeof ALLOWED_NAVIGATE_PAGES)[number];

export const ALLOWED_POLICY_TOPICS = [
  "ai_use",
  "originality",
  "editing",
  "referencing",
  "certificate",
] as const;

export type AllowedPolicyTopic = (typeof ALLOWED_POLICY_TOPICS)[number];

// Tool Schemas for OpenRouter / OpenAI compatibility
export const TOUR_AI_TOOLS = [
  {
    type: "function",
    function: {
      name: "navigate_to",
      description: "Direct student to a verified page on the Tour platform with a button link.",
      parameters: {
        type: "object",
        properties: {
          page: {
            type: "string",
            enum: ALLOWED_NAVIGATE_PAGES,
            description: "Target page name: home, about, research, publish, volunteer, or contact.",
          },
        },
        required: ["page"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_policy",
      description: "Retrieve exact policy and guideline text from Tour's approved Knowledge Base.",
      parameters: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            enum: ALLOWED_POLICY_TOPICS,
            description: "Policy topic: ai_use, originality, editing, referencing, or certificate.",
          },
        },
        required: ["topic"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "suggest_submission_type",
      description: "Determine whether Research Paper, Review Article, or Research Essay fits the student's project.",
      parameters: {
        type: "object",
        properties: {
          hasOwnData: {
            type: "boolean",
            description: "True if student collected their own experimental, survey, or empirical data.",
          },
          isLiteratureSummaryOnly: {
            type: "boolean",
            description: "True if project synthesizes existing published research with no new data.",
          },
          isReflectiveDiscussion: {
            type: "boolean",
            description: "True if exploring a societal, ethical, or conceptual idea with evidence and reflection.",
          },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_categories",
      description: "List the 4 official Tour research categories and their subtopics.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "contact_team",
      description: "Provide the official Contact button for unconfirmed questions or direct team inquiries.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
];

// Execution Handlers
export function executeNavigateTo(args: { page?: string }) {
  const page = args?.page?.toLowerCase()?.trim() as AllowedNavigatePage;
  if (!ALLOWED_NAVIGATE_PAGES.includes(page)) {
    return {
      error: `Invalid page. Allowed pages: ${ALLOWED_NAVIGATE_PAGES.join(", ")}`,
    };
  }
  const path = getRouteForPageKey(page);
  const labels: Record<AllowedNavigatePage, string> = {
    home: "Home",
    about: "About Tour",
    research: "Research Board",
    publish: "Publish Paper",
    volunteer: "Volunteer Info",
    contact: "Contact Team",
  };
  return {
    button: {
      label: labels[page],
      pageKey: page,
      href: path,
    },
  };
}

export function executeGetPolicy(args: { topic?: string }) {
  const topic = args?.topic?.toLowerCase()?.trim() as AllowedPolicyTopic;
  if (!ALLOWED_POLICY_TOPICS.includes(topic)) {
    return {
      error: `Invalid topic. Allowed topics: ${ALLOWED_POLICY_TOPICS.join(", ")}`,
    };
  }

  const policies: Record<AllowedPolicyTopic, { text: string; source: string }> = {
    ai_use: {
      text: "All research submitted to TOUR must be 100% original work produced by the student author(s). TOUR strictly forbids AI-written research (no essays, abstracts, introductions, conclusions, or paragraphs). The ONLY permitted use of AI is using external grammar check tools to check spelling and grammar. Tour AI will never edit or fix student text.",
      source: "Publishing Guidelines",
    },
    originality: {
      text: "Plagiarism is strictly prohibited and results in immediate paper rejection. Plagiarism includes copying text without proper citation and presenting AI-generated text as original student work.",
      source: "Publishing Guidelines",
    },
    editing: {
      text: "Tour may make minor formatting or publication edits only, without altering the student's main ideas or conclusions. Authors are notified and can approve or reject the edits before publication.",
      source: "Publishing Guidelines",
    },
    referencing: {
      text: "All sources must be cited clearly in one consistent reference style. Missing or incorrect references will lead to revision requests or rejection.",
      source: "Publishing Guidelines",
    },
    certificate: {
      text: "All authors receive an official digital publication certificate after their paper is published on TOUR.",
      source: "Publishing Guidelines",
    },
  };

  return policies[topic];
}

export function executeSuggestSubmissionType(args: {
  hasOwnData?: boolean;
  isLiteratureSummaryOnly?: boolean;
  isReflectiveDiscussion?: boolean;
}) {
  if (args.hasOwnData) {
    return {
      recommendedType: "Research Paper",
      description:
        "Original empirical, experimental, or data-driven research study (e.g., surveying classmates, lab or field experiments, data analysis).",
      button: { label: "Publish", pageKey: "publish", href: PAGE_MAP.publish },
    };
  }
  if (args.isLiteratureSummaryOnly) {
    return {
      recommendedType: "Review Article",
      description:
        "Comprehensive summary and analysis of existing scientific literature and published research without new primary data (e.g., summarizing sleep and grades research).",
      button: { label: "Publish", pageKey: "publish", href: PAGE_MAP.publish },
    };
  }
  if (args.isReflectiveDiscussion) {
    return {
      recommendedType: "Research Essay",
      description:
        "Reflective, evidence-based analytical discussion investigating a thesis, societal question, or topic (e.g., discussing evidence on whether social media changes friendships).",
      button: { label: "Publish", pageKey: "publish", href: PAGE_MAP.publish },
    };
  }

  return {
    types: [
      {
        name: "Research Paper",
        description: "Original empirical, experimental, or data-driven research study.",
      },
      {
        name: "Review Article",
        description: "Comprehensive summary and analysis of existing scientific literature without new data.",
      },
      {
        name: "Research Essay",
        description: "Reflective, evidence-based analytical discussion on a thesis or societal question.",
      },
    ],
    guidingQuestions: [
      "Are you collecting your own data (surveys, experiments)? -> Research Paper",
      "Are you summarizing what scientists already know without new data? -> Review Article",
      "Are you exploring an idea with structured evidence and reflection? -> Research Essay",
    ],
    button: { label: "Publish", pageKey: "publish", href: PAGE_MAP.publish },
  };
}

export function executeListCategories() {
  return {
    categories: [
      {
        name: "Science & Innovation (STEM)",
        subtopics:
          "Natural sciences, physics, chemistry, biology, technology, engineering, climate change, environment & future science.",
      },
      {
        name: "Health & Society",
        subtopics:
          "Medicine, public health, psychology, mental health, school stress, and social wellbeing.",
      },
      {
        name: "Education & Development",
        subtopics:
          "Learning methods, educational initiatives, academic growth, and student development.",
      },
      {
        name: "Humanities & Perspectives",
        subtopics:
          "History, philosophy, literature, ethics, culture, and reflective perspectives.",
      },
    ],
  };
}

export function executeContactTeam() {
  return {
    button: {
      label: "Contact Team",
      pageKey: "contact",
      href: PAGE_MAP.contact,
    },
    message: "Reach out to the student-led Tour team directly through our Contact form.",
  };
}

// Stubs for future releases (Out of Scope for v1.0)
// TODO (v1.1): Implement search_papers(query, category)
// TODO (v1.2): Implement list_research_questions(topic)

export async function executeTool(name: string, args: any) {
  switch (name) {
    case "navigate_to":
      return executeNavigateTo(args);
    case "get_policy":
      return executeGetPolicy(args);
    case "suggest_submission_type":
      return executeSuggestSubmissionType(args);
    case "list_categories":
      return executeListCategories();
    case "contact_team":
      return executeContactTeam();
    default:
      return { error: `Unknown tool: ${name}` };
  }
}
