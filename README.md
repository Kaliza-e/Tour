# TOUR — Research Ecosystem Platform

> **Transforming curiosity into research, and research into impact.**

<p align="center">
  <img src="./public/tour-preview.png" alt="TOUR Platform — A space where young thinkers can begin their research journey early" width="100%" style="border-radius: 16px;" />
</p>

**TOUR** is a student-led, non-profit research and educational platform designed to empower young thinkers to start their academic research journey early. Tour provides a complete ecosystem that guides students from asking scientific questions to building research projects, conducting peer-reviewed manuscript submissions, and publishing original research articles.

---

## 🌟 The TOUR Ecosystem Journey

```text
Curiosity & Questions
         ↓
  Research Workspace (Goals, Hypotheses, Tasks & Citations)
         ↓
  Manuscript Submission (Draft & Revisions)
         ↓
  Peer & Admin Review (Approve, Request Revision, Reject)
         ↓
  Official Publication (Public Journal & Downloadable PDF)
```

---

## 🚀 Key Product Features & Workflows

### 1. 🎓 Student Researcher Workspace (`/researcher` & `/workspace`)
- **Project Notebook**: Organize title, research goals, hypotheses, and structured objectives.
- **Stage Tracking**: Step-by-step progress indicator (`WORKSPACE` → `RESEARCH` → `DRAFT` → `SUBMISSION` → `PUBLICATION`).
- **Research Tools**: Manage research notes, todo items/tasks with due dates, and academic citations/references.
- **Manuscript Submission**: Upload manuscript files (`.pdf`, `.docx`), set abstract, methodology, and keywords, and submit for peer review.
- **Revision Lifecycle**: Track admin feedback, view version history snapshots (`SubmissionVersion`), and resubmit updated drafts.

### 2. 🛡️ Reviewer & Admin Review System (`/admin/submissions`)
- **Role-Based Access Control**: Enforced access control for `ADMIN` and `REVIEWER` roles via server middleware.
- **Reviewer Assignment**: Admins can assign specific submissions to verified peer reviewers.
- **Structured Feedback**: Reviewers log official decisions (`APPROVE`, `REQUEST_REVISION`, `REJECT`) with detailed feedback.
- **One-Click Journal Publishing**: Admins convert approved submissions directly into public journal articles with custom summary, cover image, and author metadata.
- **User Management (`/admin/users`)**: Admins manage platform members and assign roles (`STUDENT`, `MENTOR`, `REVIEWER`, `ADMIN`).

### 3. 📚 Public Research Journal (`/publications` & `/research`)
- **Published Research Board**: Explore published student papers filtered by category (Biology, Earth Science, Medicine, Computer Science, etc.).
- **Interactive Reader**: In-browser manuscript reader dialog with table of contents, citations, and metadata.
- **File Downloads & Citation**: Direct access to uploaded PDFs and automated citation generator.

### 4. 🤝 Volunteer & Mentorship Program (`/volunteer`)
- **Onboarding Pipeline**: Form for educators, researchers, and volunteers to apply for mentorship, peer reviewing, workshop leadership, and outreach.

---

## 🏗️ Technology Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: TypeScript & React 18
- **Styling**: Tailwind CSS with custom design system tokens (`Navy`, `Ivory`, `Sapphire`, `Champagne`)
- **Icons**: Lucide React & Custom Flaticons
- **Database & ORM**: PostgreSQL ([Neon Serverless](https://neon.tech/)) & [Prisma ORM v5](https://www.prisma.io/)
- **Authentication**: NextAuth.js (JWT strategy with role-based access)
- **Document Processing**: `mammoth` (DOCX parsing) & Cloudinary asset support

---

## 🗄️ Database Architecture (Prisma Schema)

The Prisma schema is normalized into 17 high-efficiency models representing the active application:

- **Users & Auth**: `User`, `Account`, `Session`
- **Taxonomy & Questions**: `Category`, `Question`
- **Researcher Workspace**: `ResearchProject`, `ResearchNote`, `Reference`, `Task`
- **Submission & Publishing Pipeline**: `Submission`, `SubmissionAuthor`, `SubmissionVersion`, `Review`, `SubmissionStatusHistory`, `Publication`
- **Notifications & Audit Logs**: `Notification`, `EmailNotificationLog`

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL database URL (e.g. Neon PostgreSQL)

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/Kaliza-e/Tour.git
cd tour
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@ep-host-pooler.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-host.neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Sync Database Schema & Seed Initial Data
```bash
# Push schema to PostgreSQL database
npx prisma db push --accept-data-loss

# Seed default categories and test accounts
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Test Accounts (Post-Seed)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `kaliza@tour.dev` | `password123` |
| **Admin** | `admin@tour.dev` | `password123` |
| **Reviewer** | `reviewer@tour.dev` | `password123` |

---

## 💻 Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Cleans cache and creates an optimized production build.
- `npm run start`: Runs the production server.
- `npm run lint`: Runs Next.js ESLint checks.
- `npm run db:push`: Pushes `prisma/schema.prisma` directly to database.
- `npm run db:seed`: Seeds initial categories and test accounts into database.
- `npm run db:studio`: Opens interactive Prisma Studio GUI at `http://localhost:5555`.

---

## 🎨 Design Palette

| Color | Token Name | Hex Code |
| :--- | :--- | :--- |
| Deep Navy | `navy` | `#112250` |
| Soft Ivory | `ivory` | `#F5F4F0` |
| Sapphire | `sapphire` | `#3B507D` |
| Champagne | `champagne` | `#E7E2CE` |
| Taupe | `taupe` | `#BEB7A7` |

---

## 📄 License

Developed as part of the **TOUR Initiative** — a student-led non-profit platform dedicated to making academic research accessible for everyone.
