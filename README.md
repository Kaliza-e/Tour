# TOUR — Research Ecosystem Platform

> **Transforming curiosity into research, and research into impact.**

<p align="center">
  <img src="./public/tour-preview.png" alt="TOUR Platform — A space where young thinkers can begin their research journey early" width="100%" />
</p>

## About TOUR

**TOUR** is a student-led, non-profit research and educational platform designed to help young people begin exploring academic research early.

The platform provides a digital space where students can develop research ideas, organize their work, submit research for review, receive feedback, and eventually share approved research publicly.

TOUR is built around a simple idea:

> **Students should not have to wait until university to start thinking like researchers.**

The platform connects the different stages of a student's research journey in one ecosystem:

```text
Research Idea
     ↓
Research Workspace
     ↓
Research Draft
     ↓
Submission
     ↓
Review & Feedback
     ↓
Revision
     ↓
Approval
     ↓
Publication
```

---

# 🌱 Core Platform

TOUR currently focuses on four main areas:

* **Researcher Workspace**
* **Research Submission & Review**
* **Public Research**
* **Volunteer / Mentorship Applications**

The application also includes authentication and role-based access for different types of users.

---

# 🔬 Researcher Workspace

The researcher experience gives students a dedicated space to develop and manage their research work.

Depending on the current research workflow, researchers can work with:

* Research projects
* Research goals
* Research questions
* Research notes
* Tasks
* References
* Manuscript drafts
* Submission information
* Submission revisions

The goal is to make research feel like an organized process rather than a collection of disconnected documents.

### Research workflow

```text
WORKSPACE
    ↓
RESEARCH
    ↓
DRAFT
    ↓
SUBMISSION
    ↓
REVIEW
    ↓
REVISION
    ↓
PUBLICATION
```

---

# 📝 Research Submission

Researchers can submit their work through the platform for review.

A submission contains information associated with the research work and progresses through different statuses as it moves through the review process.

The system maintains submission-related information so that researchers and administrators can track where a manuscript is in the publication workflow.

The submission system is designed to support an iterative process:

```text
Draft
  ↓
Submit
  ↓
Review
  ↓
Feedback
  ↓
Revision
  ↓
Resubmit
```

---

# 🛡️ Review & Administration

TOUR includes protected administrative functionality for managing the research ecosystem.

Administrative functionality includes areas for:

* Managing users
* Managing user roles
* Reviewing research submissions
* Providing feedback
* Updating submission status
* Managing published research

Access to administrative functionality is restricted according to the user's role.

### Platform roles

The current platform supports role-based users including:

| Role       | Purpose                                           |
| ---------- | ------------------------------------------------- |
| `STUDENT`  | Researcher who develops and submits research      |
| `MENTOR`   | Mentor-oriented platform user                     |
| `REVIEWER` | Reviews submitted research                        |
| `ADMIN`    | Manages platform operations and research workflow |

---

# 📚 Public Research

Approved research can be made available through the public research area.

The public-facing research experience allows visitors to discover published work and explore research produced through the TOUR ecosystem.

The platform includes public research routes for displaying published research and associated information.

The goal is to create an accessible student research collection rather than keeping student work inside private workspaces.

---

# 🤝 Volunteer & Mentorship

TOUR also provides a volunteer pathway for people who want to contribute to the initiative.

The volunteer area is intended for people interested in supporting TOUR through areas such as:

* Mentorship
* Research support
* Peer review
* Workshops
* Educational outreach
* Other community contributions

Volunteer applications are handled separately from the researcher workflow.

---

# 🔐 Authentication & Access Control

TOUR uses authenticated user accounts and role-based access to protect private platform functionality.

Authenticated users can access functionality according to their assigned role.

The application includes authentication routes and protected areas for researcher and administrative workflows.

User profiles can contain information relevant to the research community, including information such as:

* Name
* Email
* Bio
* School
* Grade level
* Research interests
* Skills
* Location
* User role

---

# 🏗️ Technology Stack

TOUR is built as a modern full-stack web application.

### Frontend & Application

* **Next.js 14**
* **Next.js App Router**
* **React**
* **TypeScript**
* **Tailwind CSS**

### Backend

TOUR uses Next.js server-side functionality and API routes for application logic and data access.

### Database

* **PostgreSQL**
* **Neon PostgreSQL**
* **Prisma ORM**
* **Prisma Neon adapter**

### Authentication

* **NextAuth**
* Credential-based authentication
* JWT-based sessions
* Role-based authorization

### Supporting Technologies

* **Lucide React**
* **Cloudinary** for supported asset handling
* **Mammoth** for supported DOCX processing

> The exact dependencies and versions should always be treated as defined by `package.json`, rather than by this README.

---

# 🗄️ Database Architecture

TOUR uses **Prisma ORM with PostgreSQL** to manage its application data.

The database is organized around the main areas of the platform:

### Authentication & Users

User and authentication data supports:

* User accounts
* Authentication sessions
* Connected authentication accounts
* User roles
* Researcher profile information

### Research

Research-related data supports the research workspace, including:

* Research projects
* Research notes
* Tasks
* References

### Submissions

The submission system manages:

* Research submissions
* Authors
* Submission versions
* Reviews
* Submission status changes

### Publications

Approved research can be represented as public publications.

### Platform Operations

Additional application data supports platform communication and operational workflows where implemented.

> The Prisma schema is the source of truth for the current database architecture. This README intentionally does not claim a fixed number of models because the schema may evolve as legacy fields and models are removed.

---

# 🧭 Main Application Areas

The current application includes routes covering areas such as:

```text
/login
/research
/volunteer
/contact
```

Authenticated workflows also include protected researcher and administrative areas.

The exact route structure should be considered source-controlled application behavior rather than a fixed product specification.

---

# 🔄 Research Lifecycle

The central TOUR workflow can be represented as:

```text
                    ┌─────────────────┐
                    │ Research Idea   │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Research        │
                    │ Workspace       │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Draft           │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Submission      │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Review          │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Feedback /      │
                    │ Revision        │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Approval        │
                    └────────┬────────┘
                             ↓
                    ┌─────────────────┐
                    │ Publication     │
                    └─────────────────┘
```

This workflow is the core of TOUR: helping a student move from **having a question** to producing something that can be shared with others.

---

# 💻 Getting Started

## Prerequisites

Make sure you have:

* Node.js installed
* npm installed
* Access to a PostgreSQL database
* A configured environment for authentication

## Clone the repository

```bash
git clone https://github.com/Kaliza-e/Tour.git

cd Tour
```

## Install dependencies

```bash
npm install
```

## Environment Variables

Create a `.env` file based on the environment variables required by the current application.

A typical local configuration includes:

```env
DATABASE_URL="your-neon-pooled-database-url"
DIRECT_URL="your-neon-direct-database-url"

NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

Do **not** commit `.env` files or database credentials to Git.

---

# 🗃️ Database Commands

After configuring the database, use the Prisma commands defined by the project.

### Generate Prisma Client

```bash
npx prisma generate
```

### Push the current schema

```bash
npx prisma db push
```

### Open Prisma Studio

```bash
npx prisma studio
```

If the project contains a seed script:

```bash
npm run db:seed
```

> Database commands should be run carefully against production databases. `prisma db push --accept-data-loss` should not be used casually because it can remove existing database structures or data.

---

# ▶️ Run the Application

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

For a production build:

```bash
npm run build
```

Then:

```bash
npm run start
```

---

# 📜 Available Scripts

The available scripts are defined in `package.json`.

Common development commands include:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Database-related scripts, where configured, include:

```bash
npm run db:push
npm run db:seed
npm run db:studio
```

---

# 🎨 Design System

TOUR follows a calm, academic visual identity designed to feel more like a thoughtful research environment than a conventional enterprise dashboard.

| Color      | Token       | Hex       |
| ---------- | ----------- | --------- |
| Deep Navy  | `navy`      | `#122550` |
| Sapphire   | `sapphire`  | `#3B507D` |
| Warm Taupe | `taupe`     | `#BEB7A7` |
| Champagne  | `champagne` | `#E7E2CE` |
| Soft Ivory | `ivory`     | `#F5F4F0` |

The design direction emphasizes:

* Academic clarity
* Calm visual hierarchy
* Readability
* Minimal interfaces
* Research-oriented presentation
* Accessible information architecture

---

# 🌍 The TOUR Initiative

TOUR is being developed as a **student-led, non-profit initiative** focused on making research more accessible to young people.

The long-term vision is to create an ecosystem where students can:

```text
ASK
 ↓
EXPLORE
 ↓
RESEARCH
 ↓
WRITE
 ↓
REVIEW
 ↓
PUBLISH
 ↓
SHARE
```

Rather than treating research as something students encounter only after entering university, TOUR aims to make research an experience that students can begin much earlier.

---

# 📌 Project Status

TOUR is an actively developed project.

The current implementation focuses on the core research ecosystem:

* Authentication
* User roles
* Research workspace
* Research submissions
* Submission review
* Feedback and revision workflows
* Public research
* Volunteer functionality
* Administrative management

Features described in future product plans are not considered part of the current implementation unless they are present in the source code.

---

# 📄 License

TOUR is developed as part of the **TOUR Initiative**, a student-led non-profit project dedicated to making academic research more accessible to young people.

---

## Built with curiosity. Designed for research. Created for impact.

**TOUR — Transforming curiosity into research, and research into impact.**
