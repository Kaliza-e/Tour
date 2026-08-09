"use client";

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


export default function LandingPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-tour relative py-20 md:py-28">
          <div className="mx-auto max-w-5xl text-center">

            <h1 className="mt-2 font-heading text-5xl font-extrabold leading-[1.1] text-navy md:text-hero uppercase overflow-hidden" aria-label="Take a Tour Between Minds">
              {["Take", "a", "Tour", "Between", "Minds"].map((word, i) => (
                <span
                  key={word + i}
                  className="hero-word mr-[0.3em] last:mr-0"
                  style={{ animationDelay: `${i * 0.13}s` }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <p className="fade-up mx-auto mt-6 max-w-2xl text-lg text-navy/60" style={{ animationDelay: "0.85s" }}>
              Tour is a student-led, non-profit research and educational platform empowering young minds to explore, write, and share knowledge.
            </p>

            <div className="fade-up mt-10 flex items-center justify-center gap-6" style={{ animationDelay: "1.05s" }}>
              <Link href="/join">
                <Button 
                  size="lg"
                  className="rounded-full bg-navy px-8 py-4 shadow-card text-sm uppercase tracking-wider hover:scale-105 transition-transform duration-200"
                >
                  Join the journey
                </Button>
              </Link>

              <Link href="/publications">
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-full border border-navy/20 bg-transparent text-navy px-7 py-4 hover:scale-105 transition-transform duration-200"
                >
                  Explore Publications
                </Button>
              </Link>

            </div>


            {/* Statistics Ribbon */}
            <div className="relative mt-16">
              <div className="full-bleed">
                <div className="bg-navy/95 px-6 md:px-10 py-4 shadow-soft">
                  <div className="ribbon-marquee w-full overflow-hidden">
                    <div className="ribbon-track inline-flex items-center gap-10">
                      {[
                        "4,200+ Questions",
                        "1,100+ Publications",
                        "6,800+ Researchers",
                        "312+ Organizations",
                      ].map((item) => (
                        <span key={item} className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-ivory">
                          <span className="text-sapphire text-base">•</span>
                          {item}
                        </span>
                      ))}
                      {[
                        "4,200+ Questions",
                        "1,100+ Publications",
                        "6,800+ Researchers",
                        "312+ Organizations",
                      ].map((item) => (
                        <span key={`repeat-${item}`} className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-ivory">
                          <span className="text-sapphire text-base">•</span>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="glass-card glow-card p-8"
                style={{ animationDelay: `${i * 1.3}s` }}
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


      {/* WHAT WE OFFER */}
      <section className="py-28 bg-white border-t border-navy/5">
        <div className="container-tour">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold text-navy md:text-4xl">
              What We Offer
            </h2>
            <p className="mt-4 text-navy/60 leading-relaxed text-lg">
              Tour provides a supportive environment for students to think, research, learn, write, and share their ideas, helping them gain an early and worthwhile start in science and academic research.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {[
              { title: "Science & Innovation (STEM)", sub: "Life Sciences, Technology & Engineering, and Environment & Future Science", desc: "Exploring STEM fields, scientific research, technology, and innovation that shape our understanding of the world and drive future progress." },
              { title: "Health & Society", sub: "Public & Global Health, Mental Health & Psychology, and Health Policy & Ethics", desc: "Examining public health, health policy, psychology, and the social dimensions of health through research and critical analysis." },
              { title: "Education & Development", sub: "Education & Learning, Youth & Human Development, and Access & Equity in Education", desc: "Focusing on education, learning systems, youth development, and the role of knowledge in shaping individuals and communities." },
              { title: "Humanities & Perspectives", sub: "History & Philosophy, Society & Culture, and Ethics & Social Issues", desc: "Exploring history, philosophy, social sciences, and diverse perspectives that help us understand societies, cultures, and ideas." },
            ].map((cat, i) => (
              <div key={cat.title} className="rounded-3xl border border-navy/10 bg-ivory/50 p-8 glow-card space-y-3" style={{ animationDelay: `${i * 1.1}s` }}>
                <h3 className="font-heading text-xl font-bold text-navy">{cat.title}</h3>
                <p className="text-xs font-semibold text-sapphire uppercase tracking-wider">{cat.sub}</p>
                <p className="text-sm text-navy/70 leading-relaxed">{cat.desc}</p>
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
              Built for Student Researchers and Research Communities
            </h2>

            <p className="mt-4 text-navy/60">
              Whether you are beginning the first research journey or supporting the next generation
              of innovators,Tour provides the tools to discover,collaborate,publish and grow together.
            </p>

          </div>



          <div className="mt-12 grid gap-8 md:grid-cols-2">


            {/* RESEARCHERS */}

            <div className="glass-card glow-card p-8">

              <div className="mb-4 inline-block rounded-full bg-ivory px-3 py-1 text-xs font-semibold text-navy">
                FOR STUDENT RESEARCHERS
              </div>


              <h3 className="mt-3 font-heading text-2xl font-bold text-navy">
                Explore,Reseach and Publish
              </h3>


              <p className="mt-4 text-sm text-navy/60">
                Start your research journey with a platform designed for curious minds.
    Discover research topics, publish your work, collaborate with peers, and
    build an academic portfolio that grows with you.
              </p>


              <ul className="mt-6 space-y-3 text-sm text-navy/70">

                <li>• Publish original research papers and articles</li>
                <li>• Discover research across multiple disciplines</li>
                <li>• Collaborate with students from around the world</li>
                 <li>• Build a lasting academic portfolio</li>

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

            <div className="rounded-card glow-card bg-gradient-to-b from-sapphire to-navy p-8 text-ivory shadow-soft">

              <div className="mb-4 inline-block rounded-full bg-navy/30 px-3 py-1 text-xs font-semibold text-ivory">
                FOR EDUCATORS& RESEARCH COMMUNITIES
              </div>



              <h3 className="mt-3 font-heading text-2xl font-bold">
                Mentor, Support, and Inspire
              </h3>

              <p className="mt-4 text-sm text-ivory/80">
               Empower young researchers by mentoring projects, sharing opportunities,
    organizing research initiatives, and building collaborative scientific
    communities without barriers.
              </p>



              <ul className="mt-6 space-y-3 text-sm text-ivory/85">

                <li>
                  •Connect with promising student researchers
                </li>

                <li>
                  • Organize research initiatives and competitions
                </li>

                <li>
                  • Mentor and review student work
                </li>
                <li>
                  • Foster global scientific collaboration
                </li>

              </ul>



              <div className="mt-6">

                <Link href="/publications">

                  <Button
                    className="rounded-full bg-ivory text-navy px-6 py-3"
                  >
                    Join the Community
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
                        className="glow-icon grid h-20 w-20 shrink-0 place-items-center bg-navy text-ivory shadow-soft"
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

            <p className="mx-auto mt-4 max-w-2xl text-sm text-navy/60">
              TOUR is not yet a registered 501(c)(3) organization. However, we are happy to provide verification or confirmation of participation for schools or clubs upon request.
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
