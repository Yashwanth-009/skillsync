# SkillSync 🎓⚡
> **Smart Student Management, Academic Tracking & AI-Powered Career Platform**

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20&%20DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Pro-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📌 Overview

**SkillSync** is an all-in-one student management and career accelerator tailored for engineering and university students. It eliminates campus friction by unifying timetable management, attendance percentage monitoring, academic progress tracking, ATS-ready resume generation, peer doubt exchange, and Gemini-powered AI career mentoring into a single cohesive platform.

Built with performance, strict data isolation, and enterprise-grade security at its core.

---

## ✨ Key Features

### 1. 📊 Smart Command Center & Attendance Tracker
- **Attendance Margin Calculator**: Instantly calculates your attendance margin against 75% or 85% university requirements, showing how many lectures you can safely miss or must attend to avoid condonation/detention.
- **Subject-Wise Performance**: Real-time interactive charts displaying performance metrics across all registered semester subjects.
- **Study Streak Counter**: Visual progress rings tracking daily productive study hours and unbroken streaks.
- **Upcoming Lecture Widget**: Next-class schedule alerts synced with your weekly timetable.

### 2. 📚 Study Hub & Practice Test Engine
- **Timed Mock Tests**: Dynamic exam simulator with randomized question pools, countdown timers, and immediate score breakdowns.
- **Curated Subject Hub**: Visual academic roadmap covering core subjects (Data Structures, DBMS, Cloud Architecture, Operating Systems).
- **Topic Knowledge Checks**: Self-paced interactive quizzes with rationale explanations for wrong answers.

### 3. 📄 Dynamic ATS Resume Builder & Analyzer
- **ATS-Compliant Templates**: Generates professional, single-page, recruiter-approved technical resumes.
- **Profile Data Auto-Sync**: Pulls verified skills, CGPA, semester milestones, and projects directly from your profile.
- **AI Keyword Density Analyzer**: Audits your resume against target job descriptions and highlights missing industry keywords.
- **Client-Side High-Res PDF Export**: Instant, zero-server PDF generation via `jsPDF`.

### 4. 🎯 Career Roadmap & Placement Readiness
- **Company-Specific Roadmaps**: Curriculum targets mapped against hiring benchmarks of Tier-1 and product companies.
- **Skill Gap Evaluator**: Identifies missing libraries, concepts, and project types required for your target engineering domain.
- **Placement Readiness Score**: Weighted assessment of GPA, practical coding assessments, and resume completeness.

### 5. 💡 PeerSolve Doubt Resolution Hub
- **Campus Community Q&A**: Post technical questions, attach code snippets, and receive peer solutions.
- **Gamified Reputation System**: Earn credits, badges, and verified status by answering doubts from other students.

### 6. 🤖 Gemini 2.5 Pro AI Career Mentor
- **Context-Aware Chatbot**: Mock interview preparation, syllabus debugging, and career advice.
- **Safe Evaluation Engine**: Rate-limited AI queries with sanitized responses and math-expression parsing.

---

## 🛡️ Security & Privacy Engineering

SkillSync enforces strict production hardening to ensure zero credential or state leakage:

- 🔒 **Client-Side PBKDF2 Password Hashing**: Passwords undergo 100,000 iterations of SHA-256 derivation via the Web Crypto API before local caching. Plaintext passwords are never saved.
- 🧹 **Strict XSS Sanitization**: All user inputs (notes, doubt posts, attendance updates) are sanitized using `DOMPurify`.
- ⚡ **Client-Side Rate Limiting**: Built-in sliding-window limiter blocks brute-force login attempts and restricts AI token consumption.
- 🚫 **Offline-Safe Guard (`Offline404Page`)**: Detects network disconnects and cleanly displays a 404 security blocker to prevent stale, untracked offline state corruption.
- 🗄️ **Per-Account Data Isolation**: Multi-tenant state isolation in Zustand stores guarantees that switching accounts completely flushes and isolates private user data.
- 🔑 **Zero Secrets in Git**: Enforced via `.gitignore`, environment variable management (`.env`), and GitHub Secret Scanning.

---

## 🎨 Design System

SkillSync follows a calibrated **Emerald Obsidian** visual language:

| Token | Hex Code | Role |
| :--- | :--- | :--- |
| **Primary** | `#10B981` | Vibrant Emerald Green |
| **Secondary** | `#14B8A6` | Soft Teal Accent |
| **Accent** | `#84CC16` | Bright Lime Accent |
| **Dark BG** | `#021814` / `#022C22` | Deep Obsidian Night |
| **Surface Card** | `#062B23` / `#064E3B` | Glassmorphic Dark Emerald Card |
| **Typography** | `Poppins`, `Inter`, `Fira Code` | Headings, Body, and Metrics |

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + [PostCSS](https://postcss.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: [Zustand 5](https://github.com/pmndrs/zustand)
- **Document Export**: [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/)
- **Backend & Cloud Auth**: [Supabase](https://supabase.com/)
- **AI Integration**: [Google Gemini 2.5 API](https://ai.google.dev/)
- **Sanitization & Security**: [DOMPurify](https://github.com/cure53/DOMPurify) + Web Crypto API (PBKDF2)
- **Mobile Container**: [Capacitor](https://capacitorjs.com/) (Android APK build support)

---

## 📂 Project Structure

```text
skillbridge/
├── .github/                 # Workflows & CI/CD
├── public/                  # Static assets & SVG icons (logo.svg)
├── src/
│   ├── components/
│   │   ├── academics/       # Attendance requests & study planner
│   │   ├── auth/            # Login, Signup, Onboarding, ForgotPassword
│   │   ├── careerconnect/   # Job notifications & placement boards
│   │   ├── careerguide/     # Skill gap analysis & placement readiness
│   │   ├── chat/            # Gemini AI chat interface & rate limiting
│   │   ├── dashboard/       # Command center, streaks & attendance charts
│   │   ├── layout/          # Top HeaderBar & BottomNav
│   │   ├── peersolve/       # Peer doubt resolution community
│   │   ├── practice/        # Mock test runner & quiz engine
│   │   ├── profile/         # Student profile, avatar selector & certificates
│   │   ├── resume/          # ATS resume builder & templates
│   │   ├── timetable/       # Class timetable manager & calendar notes
│   │   └── ui/              # Buttons, Cards, Modals, Offline404Page, ErrorBoundary
│   ├── data/                # Mock datasets & initial syllabus catalogs
│   ├── lib/
│   │   ├── security.js      # PBKDF2 hashing, RateLimiter, DOMPurify sanitization
│   │   └── utils.js         # Class merging & utility helpers
│   ├── services/
│   │   ├── gemini.js        # Google Gemini AI client integration
│   │   ├── aiResumeService.js # AI resume analyzer
│   │   └── supabase.js      # Supabase database & authentication client
│   ├── store/               # Zustand multi-account isolated state stores
│   ├── App.jsx              # Application router, guards & offline listener
│   ├── index.css            # Tailwind directives & glassmorphic utilities
│   └── main.jsx             # React DOM entry point & error isolation
├── .env.example             # Safe placeholder template for credentials
├── tailwind.config.js       # Custom design tokens & emerald themes
├── vite.config.js           # Security headers & build optimizations
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher (Recommended: v20+ / v22+)
- **npm**: v9.0.0 or higher
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Yashwanth-009/skillsync.git
   cd skillsync
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (based on `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Add your API keys:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:5173/`.

---

## 🏗️ Production Build

To build the optimized static assets for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📱 Building the Android APK

SkillSync can be built as a native Android application using Capacitor:

```bash
# Sync web build to Android platform
npx cap sync android

# Open in Android Studio to build APK
npx cap open android
```

Alternatively, download pre-built APK releases directly from the [SkillSync Official Showcase Website](https://github.com/Yashwanth-009/skillsync).

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author & Maintainer

- **GitHub**: [@Yashwanth-009](https://github.com/Yashwanth-009)
- **Repository**: [https://github.com/Yashwanth-009/skillsync](https://github.com/Yashwanth-009/skillsync)
