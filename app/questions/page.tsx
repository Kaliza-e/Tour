import { Search } from "lucide-react";
import { QuestionCard } from "@/components/question-card";
import { prisma } from "@/lib/prisma";

const categories = ["All", "Biology", "Earth Science", "Medicine", "Computer Science", "Physics", "Psychology"];

async function getQuestions() {
  try {
    return await prisma.question.findMany({
      include: { author: true, category: true, likes: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
  } catch {
    // DB not connected yet in this environment — fall back to sample data
    return null;
  }
}

const fallback = [
  { id: "q1", title: "Why do octopuses have three hearts?", category: "Biology", askedBy: "Amara O.", interestedResearchers: 12, likes: 84, views: 512, status: "BEING_RESEARCHED" as const },
  { id: "q2", title: "Could AI predict earthquakes before they happen?", category: "Earth Science", askedBy: "Diego R.", interestedResearchers: 21, likes: 143, views: 980, status: "OPEN" as const },
  { id: "q3", title: "Why do some diseases affect only certain populations?", category: "Medicine", askedBy: "Priya K.", interestedResearchers: 9, likes: 67, views: 401, status: "RESEARCH_COMPLETED" as const },
  { id: "q4", title: "Can mushrooms be used to break down plastic waste?", category: "Biology", askedBy: "Noah F.", interestedResearchers: 15, likes: 96, views: 640, status: "OPEN" as const },
  { id: "q5", title: "Does screen time before bed actually affect memory?", category: "Psychology", askedBy: "Wei L.", interestedResearchers: 6, likes: 41, views: 310, status: "ANSWERED" as const },
  { id: "q6", title: "Why do some batteries degrade faster in cold climates?", category: "Physics", askedBy: "Elena V.", interestedResearchers: 8, likes: 52, views: 275, status: "OPEN" as const },
];

export default async function QuestionsPage() {
  const dbQuestions = await getQuestions();
  const questions =
    dbQuestions?.map((q) => ({
      id: q.id,
      title: q.title,
      category: q.category.name,
      askedBy: q.author.name,
      interestedResearchers: 0,
      likes: q.likes.length,
      views: q.views,
      status: q.status,
    })) ?? fallback;

  return (
    <div className="container-tour py-20">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">Question Hub</span>
        <h1 className="mt-3 font-heading text-4xl font-bold text-navy">Explore questions</h1>
        <p className="mt-3 text-navy/60">
          Browse what other students are curious about — and claim a question to turn
          into your own research project.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/40" size={18} />
          <input
            type="search"
            placeholder="Search questions..."
            className="h-12 w-full rounded-pill border border-navy/10 bg-white pl-11 pr-5 text-sm outline-none focus-visible:border-sapphire"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              className="rounded-pill border border-navy/10 bg-white px-4 py-2 text-xs font-semibold text-navy/70 hover:border-navy hover:text-navy"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {questions.map((q) => (
          <QuestionCard key={q.id} {...q} />
        ))}
      </div>
    </div>
  );
}
