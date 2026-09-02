# Tour — Where Curiosity Becomes Knowledge

> **Transforming curiosity into research, and research into impact.**

Tour is a student-led, non-profit research platform designed to help students begin their research journey early. Rather than being just another research publishing website, Tour is a complete ecosystem that guides students from asking meaningful scientific questions to publishing original research and building an academic portfolio.

---

# Research Journey

Every great discovery begins with curiosity.

Tour is built around a unique research workflow:

```text
Question
   ↓
Research Project
   ↓
Workspace
   ↓
Research
   ↓
Writing
   ↓
Review
   ↓
Publication
   ↓
Recognition
```

Students don't need to begin with a finished idea—they can begin with a simple question.

---

# Vision

To create opportunities for young researchers around the world by providing an accessible platform where curiosity can become knowledge and ideas can become meaningful contributions to science.

---

# Mission

Tour empowers students to:

* Ask meaningful scientific questions
* Discover research opportunities
* Develop research projects
* Learn research skills
* Publish academic work
* Collaborate with peers
* Build an academic portfolio before university

---

# Core Philosophy

Unlike traditional research platforms that begin with completed papers, Tour begins with curiosity.

Students can post scientific questions they are genuinely interested in, while other students can choose those questions as research topics. Once a student begins investigating a question, it becomes a research project inside their personal workspace. When the research is completed and published, the original question is automatically linked to the published paper, creating a complete journey from curiosity to contribution.

---

# Features

## Public Platform

* Modern landing page
* Research discovery
* Question Hub
* Publications library
* Research paper pages
* Responsive design
* SEO-friendly architecture

## Authentication

* Secure authentication using NextAuth
* Login
* Session management
* Protected routes

## Question Hub

Students can:

* Ask scientific questions
* Browse questions
* Filter by category
* Search questions
* Save questions
* Start researching a question

Every question progresses through a lifecycle:

* Open
* Being Researched
* Research Completed

---

## Research Workspace

Each student has a personalized workspace to manage their research journey.

Features include:

* Research projects
* Progress tracking
* Draft management
* Notes
* References
* Tasks
* Files
* Collaborators

---

## Publications

Students can:

* Submit research papers
* View published papers
* Read abstracts
* Download papers
* Bookmark publications
* Browse related research

---

## Database

The platform includes a scalable Prisma data model supporting:

* Users
* Research Questions
* Research Projects
* Publications
* Categories
* Files
* References
* Collaborators
* Comments
* Bookmarks
* Notifications
* Challenges
* Community Posts
* Achievements

---

# Technology Stack

## Frontend

* Next.js 14 (App Router)
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion
* React Hook Form
* Zod
* TanStack Query

## Backend

* Next.js API Routes
* Prisma ORM
* PostgreSQL
* NextAuth

## Deployment

* Vercel
* Railway / Render

---

# Design System

Tour follows a clean, modern design inspired by premium educational and technology platforms.

## Color Palette

| Color     | Hex     |
| --------- | ------- |
| Navy      | #112250 |
| Ivory     | #F5F4F0 |
| Sapphire  | #3B507D |
| Champagne | #E7E2CE |
| Taupe     | #BEB7A7 |
| White     | #FFFFFF |

Typography:

* **Headings:** Outfit
* **Body:** Outfit

Design principles:

* Minimalist interface
* Large typography
* Rounded components
* Soft shadows
* Generous whitespace
* Fully responsive layouts

---

# Current MVP

The current version focuses on validating Tour's core concept:

**Question → Research → Publication**

Implemented features include:

* Landing page
* Question Hub
* Question detail page
* Research workflow
* Research Workspace
* Publications library
* Publication detail page
* Authentication
* Complete Prisma database schema
* Production-ready project structure

---

# Planned Features

## Phase 1

* Registration
* Student profiles
* Paper submission workflow
* Admin moderation
* Categories

## Phase 2

* Learning Hub
* Community discussions
* Research challenges
* Notifications
* File uploads

## Phase 3

* Mentor program
* AI Research Assistant
* Research topic generator
* Paper summarization
* Grammar and writing assistance
* Citation assistant

## Phase 4

* Collaboration tools
* Peer review system
* Research analytics
* Events and webinars
* Mobile application
* Multi-language support

---

# Getting Started

Clone the repository:

```bash
git clone 
cd tour
```

Install dependencies:

```bash
npm install
```

Configure environment variables:

```bash
cp .env.example .env
```

Add your database credentials and authentication secrets.

Push the Prisma schema:

```bash
npx prisma db push
```

Seed the database:

```bash
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

---

# Project Structure

```
app/
components/
lib/
prisma/
public/
types/
hooks/
styles/
```

---

# Future Vision

Tour aims to become the leading global platform where students begin their research journey.

By lowering barriers to research and making scientific exploration accessible to everyone, Tour empowers the next generation of researchers to ask better questions, develop meaningful ideas, publish original work, and contribute to the world's knowledge—regardless of their background or access to traditional research opportunities.

---

## License

This project is developed as part of the Tour initiative, a student-led non-profit platform dedicated to making research accessible for everyone.
