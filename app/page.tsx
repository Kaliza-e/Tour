import Link from "next/link";
import { ArrowRight, BookOpenText, FileCheck2, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/question-card";
import { PublicationCard } from "@/components/publication-card";

const featuredQuestions = [
  {
    id: "q1",
    title: "Why do octopuses have three hearts?",
    category: "Biology",
    askedBy: "Amara O.",
    interestedResearchers: 12,
    likes: 84,
    views: 512,
    status: "BEING_RESEARCHED" as const,
  },
  {
    id: "q2",
    title: "Could AI predict earthquakes before they happen?",
    category: "Earth Science",
    askedBy: "Diego R.",
    interestedResearchers: 21,
    likes: 143,
    views: 980,
    status: "OPEN" as const,
  },
  {
    id: "q3",
    title: "Why do some diseases affect only certain populations?",
    category: "Medicine",
    askedBy: "Priya K.",
    interestedResearchers: 9,
    likes: 67,
    views: 401,
    status: "RESEARCH_COMPLETED" as const,
  },
];


const featuredPapers = [
  {
    id: "p1",
    title: "Microplastic Accumulation in Freshwater Snails",
    author: "Leah M.",
    category: "Environmental Science",
    readingTime: "9 min read",
    views: 2140,
  },
  {
    id: "p2",
    title: "Predicting Wildfire Spread with Lightweight Neural Nets",
    author: "Kofi A.",
    category: "Computer Science",
    readingTime: "12 min read",
    views: 3320,
  },
  {
    id: "p3",
    title: "Sleep Patterns and Memory Consolidation in Teens",
    author: "Sofia N.",
    category: "Psychology",
    readingTime: "7 min read",
    views: 1870,
  },
];


const journey = [
  {
    label: "Ask a question",
    desc: "Share an idea, curiosity, or problem and transform it into a research opportunity.",
    icon: BookOpenText,
  },
  {
    label: "Build the research",
    desc: "Organize sources, notes, experiments, and drafts in one collaborative workspace.",
    icon: SearchCheck,
  },
  {
    label: "Publish your work",
    desc: "Submit your research, share discoveries, and build your reputation.",
    icon: FileCheck2,
  },
];


const stats = [
  {
    value: "4,200+",
    label: "Research Questions",
  },
  {
    value: "1,100+",
    label: "Published Papers",
  },
  {
    value: "6,800+",
    label: "Researchers",
  },
  {
    value: "312+",
    label: "Organizations",
  },
];


export default function LandingPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-tour relative py-20 md:py-28">
          <div className="mx-auto max-w-5xl text-center">

            <h1 className="mt-2 font-heading text-5xl font-extrabold leading-[1.05] text-navy md:text-hero">
              Where Curiosity Becomes Knowledge
            </h1>


            <p className="mx-auto mt-6 max-w-2xl text-lg text-navy/60">
              Tour transforms curiosity into real research.
              Explore ideas, build projects, publish discoveries,
              and connect with a global research community.
            </p>


            <div className="mt-10 flex items-center justify-center gap-6">

              <Link href="/questions">
                <Button 
                  size="lg"
                  className="rounded-full bg-navy px-8 py-4 shadow-card"
                >
                  Start Your Research Journey
                </Button>
              </Link>


              <Link href="/publications">
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-full border border-navy/20 bg-transparent text-navy px-7 py-4"
                >
                  Explore Publications
                </Button>
              </Link>

            </div>


            {/* Statistics Ribbon */}
            <div className="relative mt-16 hidden md:block w-full">

              <div className="absolute left-0 top-full w-0 h-0 border-t-[32px] border-r-[48px] border-t-navy border-r-transparent" />

              <div className="absolute right-0 top-full w-0 h-0 border-t-[32px] border-l-[48px] border-t-navy border-l-transparent" />


              <div className="bg-navy text-ivory h-14 flex items-center justify-center shadow-lg uppercase tracking-[0.25em] text-sm font-semibold">

                <div className="flex items-center gap-8">

                  <div className="flex items-center gap-3">
                    <span className="text-sapphire text-lg">•</span>
                    <span>4,200+ Questions</span>
                  </div>


                  <div className="flex items-center gap-3">
                    <span className="text-sapphire text-lg">•</span>
                    <span>1,100+ Publications</span>
                  </div>


                  <div className="flex items-center gap-3">
                    <span className="text-sapphire text-lg">•</span>
                    <span>6,800+ Researchers</span>
                  </div>


                  <div className="flex items-center gap-3">
                    <span className="text-sapphire text-lg">•</span>
                    <span>312+ Organizations</span>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* STATS */}
      <section className="border-y border-navy/8 bg-white/60">
        <div className="container-tour grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl font-extrabold text-navy md:text-4xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm text-navy/50">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>
            {/* WHY TOUR */}
      <section className="py-28">
        <div className="container-tour">

          <div className="mx-auto max-w-2xl text-center">

            <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">
              Every discovery starts with a question worth exploring
            </h2>

            <p className="mt-4 text-navy/60">
              Tour removes the barriers between curiosity and meaningful research,
              helping ideas become projects, discoveries, and published work.
            </p>

          </div>


          <div className="mt-16 grid gap-6 md:grid-cols-3">

            {[
              {
                title: "Explore without limits",
                desc:
                  "Share your ideas and research questions without needing expensive labs or resources to begin.",
              },
              {
                title: "A structured workspace",
                desc:
                  "Manage sources, notes, tasks, and drafts in one place designed for impactful research.",
              },
              {
                title: "Share your discoveries",
                desc:
                  "Publish your work, receive feedback, and showcase your contribution to the community.",
              },
            ].map((feature) => (

              <div
                key={feature.title}
                className="rounded-card bg-white p-8 shadow-card"
              >

                <h3 className="font-heading text-lg font-bold text-navy">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-navy/60">
                  {feature.desc}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>



      {/* CHOOSE YOUR PATH */}
      <section className="bg-ivory py-20">

        <div className="container-tour">

          <div className="mx-auto max-w-3xl text-center">

            <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">
              Built for researchers and organizations
            </h2>

            <p className="mt-4 text-navy/60">
              Whether you are building knowledge or discovering talent,
              Tour connects ideas with opportunities.
            </p>

          </div>



          <div className="mt-12 grid gap-8 md:grid-cols-2">


            {/* RESEARCHERS */}

            <div className="rounded-card bg-white p-8 shadow-card">

              <div className="mb-4 inline-block rounded-full bg-ivory px-3 py-1 text-xs font-semibold text-navy">
                FOR RESEARCHERS
              </div>


              <h3 className="mt-3 font-heading text-2xl font-bold text-navy">
                Build your research identity
              </h3>


              <p className="mt-4 text-sm text-navy/60">
                Create your profile, publish your work, and connect with
                organizations interested in innovation and research.
              </p>


              <ul className="mt-6 space-y-3 text-sm text-navy/70">

                <li>
                  • Create a professional research portfolio
                </li>

                <li>
                  • Publish and showcase your discoveries
                </li>

                <li>
                  • Connect with collaborators and opportunities
                </li>

              </ul>


              <div className="mt-6">

                <Link href="/questions">

                  <Button
                    variant="secondary"
                    className="rounded-full px-6 py-3"
                  >
                    Explore Research
                  </Button>

                </Link>

              </div>

            </div>




            {/* COMPANIES */}

            <div className="rounded-card bg-gradient-to-b from-sapphire to-navy p-8 text-ivory shadow-card">

              <div className="mb-4 inline-block rounded-full bg-navy/30 px-3 py-1 text-xs font-semibold text-ivory">
                FOR ORGANIZATIONS
              </div>



              <h3 className="mt-3 font-heading text-2xl font-bold">
                Discover emerging talent
              </h3>



              <p className="mt-4 text-sm text-ivory/80">
                Explore verified profiles, review real projects,
                and connect with talented researchers and innovators.
              </p>



              <ul className="mt-6 space-y-3 text-sm text-ivory/85">

                <li>
                  • Discover skilled contributors
                </li>

                <li>
                  • Review real research portfolios
                </li>

                <li>
                  • Build partnerships and collaborations
                </li>

              </ul>



              <div className="mt-6">

                <Link href="/publications">

                  <Button
                    className="rounded-full bg-ivory text-navy px-6 py-3"
                  >
                    Explore Organizations
                  </Button>

                </Link>

              </div>

            </div>


          </div>

        </div>

      </section>




      {/* FEATURED QUESTIONS */}

      <section className="bg-white py-28">

        <div className="container-tour">


          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">

            <div>

              <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">
                Question Hub
              </span>


              <h2 className="mt-3 font-heading text-3xl font-bold text-navy md:text-4xl">
                Questions researchers are exploring right now
              </h2>


            </div>



            <Link
              href="/questions"
              className="flex items-center gap-1 text-sm font-semibold text-navy hover:text-sapphire"
            >

              Browse all questions
              <ArrowRight size={15}/>

            </Link>


          </div>




          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {featuredQuestions.map((question)=>(
              <QuestionCard
                key={question.id}
                {...question}
              />
            ))}

          </div>



        </div>

      </section>
            {/* HOW IT WORKS */}
      <section className="py-28">

        <div className="container-tour">

          <div className="relative overflow-hidden rounded-card border border-navy/8 bg-white px-6 py-12 shadow-card sm:px-10 md:px-16 md:py-16">

            <h2 className="font-heading text-5xl font-extrabold leading-none text-navy md:text-6xl">
              How it works
            </h2>



            <div className="relative mt-12 min-h-[430px] md:mt-4">


              <svg
                className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[260px] w-full md:block"
                viewBox="0 0 1100 260"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >

                <path
                  d="M40 226C98 130 216 178 332 140C455 99 466 76 602 88C718 99 778 100 900 62C983 37 1033 22 1070 58"
                  stroke="#343434"
                  strokeWidth="48"
                  strokeLinecap="round"
                />

                <path
                  d="M48 220C108 147 231 170 342 130C455 89 477 75 603 86C718 96 778 96 898 60C980 35 1026 27 1064 58"
                  stroke="#9B9B9B"
                  strokeWidth="3"
                  strokeDasharray="14 14"
                  strokeLinecap="round"
                />

                <path
                  d="M672 110H750"
                  stroke="#F5F4F0"
                  strokeWidth="18"
                  strokeLinecap="square"
                />

                <ellipse
                  cx="1015"
                  cy="58"
                  rx="46"
                  ry="28"
                  fill="#343434"
                  opacity="0.68"
                />

              </svg>




              <div
                className="absolute bottom-0 left-8 top-12 w-10 rounded-full bg-[#343434] md:hidden"
                aria-hidden="true"
              >
                <div className="mx-auto mt-8 h-[calc(100%-4rem)] w-px border-l-2 border-dashed border-white/45"/>
              </div>




              <div className="relative z-10 grid gap-10 md:grid-cols-3 md:gap-14">


                {journey.map((step,index)=>{

                  const Icon = step.icon;

                  const offsets=[
                    "md:pt-8",
                    "md:pt-0",
                    "md:pt-2"
                  ];


                  return (

                    <div
                      key={step.label}
                      className={`relative flex gap-5 pl-20 text-left md:flex-col md:items-center md:pl-0 md:text-center ${offsets[index]}`}
                    >


                      <div
                        className="grid h-20 w-20 shrink-0 place-items-center bg-navy text-ivory shadow-soft"
                        style={{
                          clipPath:
                          "polygon(50% 0,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)"
                        }}
                      >

                        <Icon size={30} strokeWidth={1.9}/>

                      </div>



                      <div className="max-w-[260px]">

                        <p className="text-xs font-extrabold uppercase tracking-wider text-taupe">
                          Step {String(index + 1).padStart(2,"0")}
                        </p>


                        <h3 className="mt-2 font-heading text-2xl font-extrabold leading-tight text-navy">
                          {step.label}
                        </h3>


                        <p className="mt-3 text-sm leading-6 text-navy/70">
                          {step.desc}
                        </p>


                      </div>


                    </div>

                  );

                })}


              </div>


            </div>

          </div>

        </div>

      </section>






      {/* LATEST PUBLICATIONS */}

      <section className="bg-white py-28">

        <div className="container-tour">


          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">

            <div>

              <span className="text-xs font-semibold uppercase tracking-widest text-sapphire">
                Publications
              </span>


              <h2 className="mt-3 font-heading text-3xl font-bold text-navy md:text-4xl">
                Recently published research
              </h2>


            </div>



            <Link
              href="/publications"
              className="flex items-center gap-1 text-sm font-semibold text-navy hover:text-sapphire"
            >

              Explore the library
              <ArrowRight size={15}/>

            </Link>


          </div>




          <div className="mt-12 grid gap-6 md:grid-cols-3">


            {featuredPapers.map((paper)=>(
              <PublicationCard
                key={paper.id}
                {...paper}
              />
            ))}


          </div>



        </div>


      </section>






      {/* CTA */}

      <section className="py-28">

        <div className="container-tour">


          <div className="border-y border-navy/10 px-10 py-20 text-center">


            <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">
              Your curiosity could become the next discovery
            </h2>



            <p className="mx-auto mt-4 max-w-xl text-navy/60">

              Join researchers, innovators, and organizations
              turning questions into meaningful knowledge.

            </p>



            <div className="mt-9">

              <Link href="/join">

                <Button size="lg">

                  Join Tour — It's Free
                  <ArrowRight size={18}/>

                </Button>

              </Link>


            </div>



          </div>


        </div>


      </section>

    </>
  );
}