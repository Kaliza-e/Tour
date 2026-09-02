"use client";

import Link from "next/link";
import { ArrowRight, BookOpenText, FileCheck2, SearchCheck, Lightbulb } from "lucide-react";
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
    label: "Start with a Question",
    desc: "Transform your curiosity into research opportunities by sharing questions and ideas with our community.",
    icon: Lightbulb,
  },
  {
    label: "Explore and Plan",
    desc: "Gather sources, review literature, and develop a structured methodology with clear objectives.",
    icon: SearchCheck,
  },
  {
    label: "Conduct Research",
    desc: "Execute your plan systematically in a collaborative workspace designed for organizing notes and analyzing data.",
    icon: BookOpenText,
  },
  {
    label: "Share Discoveries",
    desc: "Publish your findings, contribute to global knowledge, and build your academic reputation.",
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

            <h1 className="mt-2 font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-[1.1] text-navy uppercase overflow-hidden" aria-label="Take a Tour Between Minds">
              {["Take", "a", "Tour", "Between", "Minds"].map((word, i) => (
                <span
                  key={word + i}
                  className="hero-word mr-[0.2em] sm:mr-[0.3em] last:mr-0 inline-block"
                  style={{ animationDelay: `${i * 0.13}s` }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <p className="fade-up mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-navy/60 px-2" style={{ animationDelay: "0.85s" }}>
              Tour is a student-led, non-profit research and educational platform empowering young minds to explore, write, and share knowledge.
            </p>

            <div className="fade-up mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-xs sm:max-w-none mx-auto" style={{ animationDelay: "1.05s" }}>
              <Link href="/join" className="w-full sm:w-auto">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-navy px-8 py-4 shadow-card text-xs sm:text-sm uppercase tracking-wider hover:scale-105 transition-transform duration-200"
                >
                  Join the journey
                </Button>
              </Link>

              <Link href="/publications" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto rounded-full border border-navy/20 bg-transparent text-navy px-7 py-4 hover:scale-105 transition-transform duration-200 text-xs sm:text-sm"
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

            <h2 className="font-heading text-2xl font-semibold text-navy md:text-3xl">
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
            <h2 className="font-heading text-2xl font-semibold text-navy md:text-3xl">
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

            <h2 className="font-heading text-2xl font-semibold text-navy md:text-3xl">
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
      <section className="py-28 bg-gradient-to-b from-ivory/30 to-white">

        <div className="container-tour">

          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-sapphire/10 text-sapphire text-xs font-semibold uppercase tracking-wider mb-4">
              How It Works
            </span>
            <h2 className="font-heading text-3xl font-semibold text-navy md:text-4xl mb-4">
              Your Research Journey
            </h2>
            <p className="text-navy/60 max-w-2xl mx-auto">
              From curiosity to contribution, discover how Tour transforms questions into published research
            </p>
          </div>

          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-sapphire/0 via-sapphire/30 to-sapphire/0 hidden md:block" />

            <div className="relative z-10 grid gap-8 md:grid-cols-4 md:gap-6">

              {journey.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.label}
                    className="group relative"
                  >
                    {/* Step number badge */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-navy text-ivory text-sm font-bold flex items-center justify-center shadow-lg z-20">
                      {index + 1}
                    </div>

                    {/* Card */}
                    <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-navy/5 hover:shadow-xl hover:border-sapphire/20 transition-all duration-300 group-hover:-translate-y-1">
                      {/* Icon container */}
                      <div className="w-14 h-14 rounded-xl bg-navy flex items-center justify-center mb-4 shadow-md">
                        <Icon size={28} className="text-ivory" strokeWidth={2} />
                      </div>

                      {/* Content */}
                      <h3 className="font-heading text-lg font-bold text-navy mb-2">
                        {step.label}
                      </h3>
                      <p className="text-sm text-navy/60 leading-relaxed">
                        {step.desc}
                      </p>

                      {/* Decorative elements */}
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-sapphire/20 group-hover:bg-sapphire/40 transition-colors" />
                    </div>

                    {/* Connector line (desktop) */}
                    {index < 3 && (
                      <div className="hidden md:block absolute top-12 right-0 w-6 h-0.5 bg-gradient-to-r from-sapphire/30 to-transparent" />
                    )}
                  </div>
                );
              })}

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


            <h2 className="font-heading text-2xl font-semibold text-navy md:text-3xl">
              Your curiosity could become the next discovery
            </h2>



            <p className="mx-auto mt-4 max-w-xl text-navy/60">

              Join researchers, innovators, and organizations
              turning questions into meaningful knowledge.

            </p>

            <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-sapphire/15 bg-champagne/40 px-6 py-4">
              <p className="text-sm font-semibold text-navy/80 leading-relaxed">
                <span className="inline-block mr-1.5">⚠️</span>
                <span className="font-bold">TOUR is not yet a registered 501(c)(3) organization.</span>{" "}
                However, we are happy to provide verification or confirmation of participation for schools or clubs upon request.
              </p>
            </div>

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
