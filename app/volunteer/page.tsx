import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, HeartHandshake, Users } from "lucide-react";

const opportunities = [
  {
    title: "Research review support",
    description: "Help students refine ideas, provide feedback on drafts, and support the publishing process.",
  },
  {
    title: "Community building",
    description: "Support student conversations, encourage participation, and help young researchers connect with one another.",
  },
  {
    title: "Content and outreach",
    description: "Assist with communication, research discovery, platform storytelling, and welcoming new students to Tour.",
  },
];

export default function VolunteerPage() {
  return (
    <div className="bg-ivory py-16 md:py-20">
      <div className="container-tour space-y-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sapphire/20 bg-champagne/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sapphire">
            <HeartHandshake className="h-4 w-4" /> Volunteer Opportunities
          </div>
          <h1 className="mt-5 font-heading text-3xl font-semibold text-navy md:text-5xl">
            Help young students begin their research journey.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-navy/70">
            Tour is built for participation, learning, and contribution. Volunteers help create a welcoming environment where young people can ask questions, research, write, and publish with confidence.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {opportunities.map((opportunity) => (
            <div key={opportunity.title} className="rounded-3xl border border-navy/10 bg-white p-7 shadow-card">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sapphire/10 text-sapphire">
                {opportunity.title.includes("review") ? <CheckCircle2 className="h-5 w-5" /> : opportunity.title.includes("Community") ? <Users className="h-5 w-5" /> : <BriefcaseBusiness className="h-5 w-5" />}
              </div>
              <h2 className="font-heading text-xl font-bold text-navy">{opportunity.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-navy/70">{opportunity.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-navy/10 bg-navy p-8 text-ivory shadow-soft">
          <h2 className="font-heading text-2xl font-bold text-ivory">Who can participate?</h2>
          <p className="mt-4 text-base leading-relaxed text-ivory/75">
            Volunteers are welcome from students, educators, mentors, and community supporters who care about accessible research and learning. The main goal is to help make research feel welcoming and possible for young people.
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-ivory hover:text-champagne">
              Apply or ask a question <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-ivory hover:text-champagne">
              Learn about Tour <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
