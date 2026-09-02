import { Heart, Eye, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  // In production this fetches the Question by params.id via prisma,
  // including author, category, likes, and linked project/paper if completed.
  return (
    <div className="container-tour max-w-3xl py-20">
      <span className="rounded-pill bg-champagne px-3 py-1 text-xs font-semibold text-navy">Biology</span>
      <h1 className="mt-5 font-heading text-2xl font-semibold text-navy md:text-3xl">
        Why do octopuses have three hearts?
      </h1>
      <p className="mt-2 text-sm text-navy/50">Asked by Amara O. · Question #{params.id}</p>

      <div className="mt-6 flex items-center gap-6 text-sm text-navy/50">
        <span className="flex items-center gap-1.5"><Heart size={16} /> 84 likes</span>
        <span className="flex items-center gap-1.5"><Users size={16} /> 12 researching</span>
        <span className="flex items-center gap-1.5"><Eye size={16} /> 512 views</span>
      </div>

      <div className="mt-10 rounded-card bg-white p-8 shadow-card">
        <h2 className="font-heading text-lg font-bold text-navy">Description</h2>
        <p className="mt-3 leading-relaxed text-navy/65">
          Two of an octopus's hearts pump blood to its gills, and a third pumps it to
          the rest of the body — but the systemic heart actually stops when the
          octopus swims. I want to understand the evolutionary tradeoff: why did
          octopuses evolve this instead of a single, more efficient heart?
        </p>
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 rounded-card bg-navy p-8 text-ivory sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold">Ready to research this?</h3>
          <p className="mt-1 text-sm text-ivory/60">
            Claiming a question creates a project in your Workspace, pre-filled with
            this question as your research starting point.
          </p>
        </div>
        <Button variant="champagne" className="shrink-0">
          I'd Like to Research This
        </Button>
      </div>
    </div>
  );
}
