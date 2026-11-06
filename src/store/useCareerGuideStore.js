import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useToastStore } from './useToastStore';

// Clean Knowledge Base for Curated Career Profiles (No pre-completed placeholder mock data)
const DEFAULT_CAREER_PROFILES = {
  'Software Engineer': {
    title: 'Software Engineer',
    category: 'Engineering & Systems',
    description: 'Design, develop, and maintain robust scalable software applications and core algorithms.',
    phases: [
      {
        id: 'phase-1',
        number: 1,
        title: 'Strengthen Programming Foundations',
        purpose: 'Foundation',
        color: 'emerald',
        description: 'Master core language syntax, OOP principles, and clean coding practices.',
        steps: [
          { id: 's1-1', title: 'Master Core Language (Java, C++, or Python)', completed: false, required: true },
          { id: 's1-2', title: 'Object-Oriented Programming (OOP) Principles', completed: false, required: true },
          { id: 's1-3', title: 'Basic Problem Solving & Complexity Analysis (Big-O)', completed: false, required: true },
          { id: 's1-4', title: 'Memory Management & Pointers / References', completed: false, required: false }
        ]
      },
      {
        id: 'phase-2',
        number: 2,
        title: 'Master Core Computer Science & DSA',
        purpose: 'Core Skills',
        color: 'teal',
        description: 'Deep dive into data structures, algorithms, databases, and operating systems.',
        steps: [
          { id: 's2-1', title: 'Linear Data Structures (Arrays, Linked Lists, Stacks, Queues)', completed: false, required: true },
          { id: 's2-2', title: 'Non-Linear Structures (Trees, Binary Heaps, Graphs)', completed: false, required: true },
          { id: 's2-3', title: 'Relational DBMS & Advanced SQL Queries', completed: false, required: true },
          { id: 's2-4', title: 'Operating Systems & Process Management / Concurrency', completed: false, required: true },
          { id: 's2-5', title: 'Computer Networks (TCP/IP, HTTP/HTTPS, DNS)', completed: false, required: true }
        ]
      },
      {
        id: 'phase-3',
        number: 3,
        title: 'Build Development & Engineering Skills',
        purpose: 'Specialization',
        color: 'cyan',
        description: 'Learn modern full-stack development, version control, APIs, and microservices.',
        steps: [
          { id: 's3-1', title: 'Version Control with Git & Professional GitHub Workflow', completed: false, required: true },
          { id: 's3-2', title: 'RESTful API Design & Authentication (JWT/OAuth)', completed: false, required: true },
          { id: 's3-3', title: 'Full-Stack Architecture (Frontend + Backend Integration)', completed: false, required: true },
          { id: 's3-4', title: 'NoSQL Databases (MongoDB / Redis Caching)', completed: false, required: false }
        ]
      },
      {
        id: 'phase-4',
        number: 4,
        title: 'Build High-Impact Portfolio & Projects',
        purpose: 'Projects & Experience',
        color: 'amber',
        description: 'Ship 3-5 production-grade full stack projects with live deployments and CI/CD.',
        steps: [
          { id: 's4-1', title: 'Develop Full Stack Web App with Live Deployment', completed: false, required: true },
          { id: 's4-2', title: 'Build Open Source Contribution or Complex Microservice', completed: false, required: false },
          { id: 's4-3', title: 'Curate Professional Developer Portfolio & Technical Readmes', completed: false, required: true },
          { id: 's4-4', title: 'Apply for Summer Internships & Practical Freelancing', completed: false, required: true }
        ]
      },
      {
        id: 'phase-5',
        number: 5,
        title: 'Placement & Industry Readiness',
        purpose: 'Placement Preparation',
        color: 'rose',
        description: 'Intense DSA problem practice, mock interviews, system design, and behavioral prep.',
        steps: [
          { id: 's5-1', title: 'Solve 150+ LeetCode DSA Problems (Medium/Hard)', completed: false, required: true },
          { id: 's5-2', title: 'High Level System Design (HLD) & Low Level Design (LLD)', completed: false, required: false },
          { id: 's5-3', title: 'Technical Mock Interviews & Live Whiteboarding', completed: false, required: true },
          { id: 's5-4', title: 'Quantitative Aptitude & HR STAR Method Prep', completed: false, required: true }
        ]
      }
    ],
    requiredSkills: [
      { name: 'Data Structures & Algorithms', level: 75, required: true, priority: 'High', reason: 'Essential for technical coding rounds and product company interviews.' },
      { name: 'Object-Oriented Programming', level: 85, required: true, priority: 'High', reason: 'Core architectural foundation for clean, maintainable software design.' },
      { name: 'Database & SQL (DBMS)', level: 70, required: true, priority: 'High', reason: 'Required for schema design, indexing, and complex data querying.' },
      { name: 'Git & GitHub Collaboration', level: 80, required: true, priority: 'High', reason: 'Standard version control for team codebases and portfolio showcases.' },
      { name: 'Operating Systems & Concurrency', level: 60, required: true, priority: 'Medium', reason: 'Crucial for understanding memory allocation, threads, and scheduling.' },
      { name: 'Computer Networks & REST APIs', level: 65, required: true, priority: 'Medium', reason: 'Enables seamless client-server communication and microservices.' }
    ],
    projects: [
      {
        id: 'p-1',
        title: 'Student Task & Habit Tracker',
        level: 'Beginner',
        status: 'not_started',
        skills: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage'],
        description: 'Interactive responsive task planner with drag-and-drop, category filtering, and offline persistence.',
        outcome: 'Mastery of DOM manipulation, asynchronous state, and modular clean JavaScript.'
      },
      {
        id: 'p-2',
        title: 'Campus Resource Management System',
        level: 'Intermediate',
        status: 'not_started',
        skills: ['React', 'Node.js', 'Express', 'PostgreSQL', 'JWT Auth'],
        description: 'Full-stack university portal for booking labs, borrowing library books, and tracking dues with role-based access.',
        outcome: 'Real-world REST API design, relational schema relationships, and secure token authentication.'
      },
      {
        id: 'p-3',
        title: 'AI Smart Career Recommendation Platform',
        level: 'Advanced',
        status: 'not_started',
        skills: ['Next.js', 'Python FastAPI', 'AI API', 'Redis', 'Docker'],
        description: 'Distributed microservice app that analyzes code submissions, provides AI optimization tips, and tracks placement readiness.',
        outcome: 'Cloud native deployment, caching pipelines, and AI API integration.'
      }
    ],
    certifications: [
      {
        id: 'c-1',
        title: 'Meta Back-End Developer Professional Certificate',
        provider: 'Coursera / Meta',
        relatedSkill: 'Backend & APIs',
        priority: 'Recommended',
        whyRecommended: 'Endorsed curriculum covering Python/Django, databases, version control, and Linux.'
      },
      {
        id: 'c-2',
        title: 'AWS Certified Cloud Practitioner',
        provider: 'Amazon Web Services',
        relatedSkill: 'Cloud Computing & DevOps',
        priority: 'Recommended',
        whyRecommended: 'Validates industry understanding of cloud infrastructure, storage, and serverless compute.'
      },
      {
        id: 'c-3',
        title: 'HackerRank Problem Solving (Advanced)',
        provider: 'HackerRank',
        relatedSkill: 'DSA & Algorithms',
        priority: 'Required',
        whyRecommended: 'Demonstrates proven algorithmic problem solving proficiency to campus recruiters.'
      }
    ],
    nextStep: {
      title: 'Programming Foundations: Master Data Structures Basics',
      why: 'Data structures account for over 40% of technical interview questions at top engineering firms.',
      actionText: 'Start Learning â†’',
      estimatedHours: '6 Hours'
    }
  },
  'AI Engineer': {
    title: 'AI Engineer',
    category: 'Artificial Intelligence & Data',
    description: 'Build, fine-tune, and deploy machine learning models, neural networks, and generative AI agents.',
    phases: [
      {
        id: 'phase-1',
        number: 1,
        title: 'Python Mastery & Applied Mathematics',
        purpose: 'Foundation',
        color: 'emerald',
        description: 'Linear algebra, calculus, statistics, NumPy, Pandas, and vector math.',
        steps: [
          { id: 'ai-s1-1', title: 'Advanced Python (OOP, Generators, Type Hints)', completed: false, required: true },
          { id: 'ai-s1-2', title: 'Linear Algebra (Matrices, Eigenvalues, SVD)', completed: false, required: true },
          { id: 'ai-s1-3', title: 'Probability & Inferential Statistics', completed: false, required: true },
          { id: 'ai-s1-4', title: 'Data Manipulation with NumPy & Pandas', completed: false, required: true }
        ]
      },
      {
        id: 'phase-2',
        number: 2,
        title: 'Classical Machine Learning Algorithms',
        purpose: 'Core Skills',
        color: 'teal',
        description: 'Supervised, unsupervised learning, model evaluation, Scikit-Learn.',
        steps: [
          { id: 'ai-s2-1', title: 'Regression & Classification (Logistic, SVM, Decision Trees)', completed: false, required: true },
          { id: 'ai-s2-2', title: 'Ensemble Methods (Random Forest, XGBoost, LightGBM)', completed: false, required: true },
          { id: 'ai-s2-3', title: 'Clustering (K-Means, DBSCAN) & Dimensionality Reduction (PCA)', completed: false, required: true },
          { id: 'ai-s2-4', title: 'Feature Engineering & Cross-Validation Metrics', completed: false, required: true }
        ]
      },
      {
        id: 'phase-3',
        number: 3,
        title: 'Deep Learning & Neural Networks',
        purpose: 'Specialization',
        color: 'cyan',
        description: 'PyTorch, CNNs for Vision, Transformers, and LLM fine-tuning.',
        steps: [
          { id: 'ai-s3-1', title: 'PyTorch Core Tensors, Autograd & Custom Training Loops', completed: false, required: true },
          { id: 'ai-s3-2', title: 'Convolutional Neural Networks (CNNs) & Computer Vision', completed: false, required: false },
          { id: 'ai-s3-3', title: 'Transformer Architecture, Attention Mechanism & HuggingFace', completed: false, required: true },
          { id: 'ai-s3-4', title: 'Retrieval Augmented Generation (RAG) & Vector DBs (Chroma/Pinecone)', completed: false, required: true }
        ]
      },
      {
        id: 'phase-4',
        number: 4,
        title: 'Production ML & LLM Application Projects',
        purpose: 'Projects & Experience',
        color: 'amber',
        description: 'Deploy real-time inference APIs with FastAPI, Docker, and LangChain.',
        steps: [
          { id: 'ai-s4-1', title: 'Build Autonomous AI Agent using LangChain & AI API', completed: false, required: true },
          { id: 'ai-s4-2', title: 'Model Serving via FastAPI, ONNX Runtime & Docker', completed: false, required: true },
          { id: 'ai-s4-3', title: 'Kaggle Competition Benchmark or Research Implementation', completed: false, required: false }
        ]
      },
      {
        id: 'phase-5',
        number: 5,
        title: 'AI Internship & Research Placement Prep',
        purpose: 'Placement Preparation',
        color: 'rose',
        description: 'Math interview questions, model debugging, and coding assessments.',
        steps: [
          { id: 'ai-s5-1', title: 'ML System Design & Inference Latency Optimization', completed: false, required: true },
          { id: 'ai-s5-2', title: 'Python LeetCode DSA (75 Essential Problems)', completed: false, required: true },
          { id: 'ai-s5-3', title: 'AI Portfolio Showcase with Live Demos & GitHub', completed: false, required: true }
        ]
      }
    ],
    requiredSkills: [
      { name: 'Python & NumPy/Pandas', level: 85, required: true, priority: 'High', reason: 'Universal foundation for all scientific computing and AI workloads.' },
      { name: 'PyTorch / Deep Learning', level: 75, required: true, priority: 'High', reason: 'Industry standard library for building and training neural networks.' },
      { name: 'Machine Learning Theory & Math', level: 70, required: true, priority: 'High', reason: 'Essential for diagnosing overfitting, loss functions, and optimization.' },
      { name: 'LLMs, RAG & Vector Databases', level: 65, required: true, priority: 'High', reason: 'Rapidly growing requirement for modern generative AI applications.' },
      { name: 'FastAPI & Docker Deployment', level: 60, required: false, priority: 'Medium', reason: 'Transforms static models into scalable production APIs.' }
    ],
    projects: [
      {
        id: 'ai-p1',
        title: 'Predictive Student Grade & Dropout Classifier',
        level: 'Beginner',
        status: 'not_started',
        skills: ['Python', 'Scikit-Learn', 'Pandas', 'Matplotlib'],
        description: 'Supervised classification model analyzing historical attendance and test scores to predict student academic risk.',
        outcome: 'Hands-on experience with feature scaling, hyperparameter tuning, and ROC-AUC curves.'
      },
      {
        id: 'ai-p2',
        title: 'Document Q&A Assistant with RAG & Vector DB',
        level: 'Intermediate',
        status: 'not_started',
        skills: ['LangChain', 'ChromaDB', 'Gemini API', 'Streamlit'],
        description: 'Upload PDF textbooks or syllabus notes, chunk embeddings into vector search, and generate grounded answers.',
        outcome: 'Mastery of semantic chunking, cosine similarity, and contextual prompt engineering.'
      },
      {
        id: 'ai-p3',
        title: 'Multi-Modal Autonomous Research Agent',
        level: 'Advanced',
        status: 'not_started',
        skills: ['PyTorch', 'FastAPI', 'Docker', 'HuggingFace'],
        description: 'Autonomous research assistant that browses scientific papers, summarizes equations, and generates audio podcast recaps.',
        outcome: 'Complex agentic tool-use, multi-modal embeddings, and low-latency API serving.'
      }
    ],
    certifications: [
      {
        id: 'ai-c1',
        title: 'Deep Learning Specialization (Andrew Ng)',
        provider: 'Coursera / DeepLearning.AI',
        relatedSkill: 'Neural Networks & PyTorch',
        priority: 'Required',
        whyRecommended: 'Gold standard global certification covering CNNs, RNNs, and backpropagation foundations.'
      },
      {
        id: 'ai-c2',
        title: 'Google Cloud Certified Professional Machine Learning Engineer',
        provider: 'Google Cloud',
        relatedSkill: 'MLOps & Vertex AI',
        priority: 'Recommended',
        whyRecommended: 'Validates ability to design, build, and productionize ML models in the cloud.'
      }
    ],
    nextStep: {
      title: 'Python Mastery: Advanced NumPy, Pandas & Calculus',
      why: 'Solid mathematical foundations are prerequisite for neural network forward and backward passes.',
      actionText: 'Start Learning â†’',
      estimatedHours: '8 Hours'
    }
  },
  'Full Stack Developer': {
    title: 'Full Stack Developer',
    category: 'Web & Cloud Development',
    description: 'Build complete end-to-end web applications with modern frontend UI and scalable backend services.',
    phases: [
      {
        id: 'fs-p1',
        number: 1,
        title: 'Modern Frontend Foundations',
        purpose: 'Foundation',
        color: 'emerald',
        description: 'HTML5 Semantic markup, Modern CSS3/Tailwind, JavaScript ES6+ Async.',
        steps: [
          { id: 'fs-s1-1', title: 'HTML5 Semantic Layouts & Accessibility (a11y)', completed: false, required: true },
          { id: 'fs-s1-2', title: 'Modern Tailwind CSS & Responsive Flex/Grid Design', completed: false, required: true },
          { id: 'fs-s1-3', title: 'JavaScript ES6+ (Promises, Async/Await, Closures, DOM)', completed: false, required: true },
          { id: 'fs-s1-4', title: 'TypeScript Fundamentals & Static Type Checking', completed: false, required: false }
        ]
      },
      {
        id: 'fs-p2',
        number: 2,
        title: 'Component Frameworks & State Management',
        purpose: 'Core Skills',
        color: 'teal',
        description: 'React.js, React Hooks, Component Lifecycle, Zustand / Redux, Vite.',
        steps: [
          { id: 'fs-s2-1', title: 'React Core (Components, Props, State, Custom Hooks)', completed: false, required: true },
          { id: 'fs-s2-2', title: 'Client Routing & Navigation (React Router)', completed: false, required: true },
          { id: 'fs-s2-3', title: 'Global State Management (Zustand / Redux Toolkit)', completed: false, required: true },
          { id: 'fs-s2-4', title: 'Server-State & Caching (TanStack Query)', completed: false, required: false }
        ]
      },
      {
        id: 'fs-p3',
        number: 3,
        title: 'Backend Systems & Database Architecture',
        purpose: 'Specialization',
        color: 'cyan',
        description: 'Node.js, Express, REST APIs, PostgreSQL, MongoDB, JWT Auth.',
        steps: [
          { id: 'fs-s3-1', title: 'Node.js Event Loop & Express Server Setup', completed: false, required: true },
          { id: 'fs-s3-2', title: 'Relational Database Modeling with PostgreSQL & Prisma ORM', completed: false, required: true },
          { id: 'fs-s3-3', title: 'Authentication, Password Hashing (bcrypt), & JWT Sessions', completed: false, required: true },
          { id: 'fs-s3-4', title: 'Realtime WebSockets (Socket.io) Communication', completed: false, required: false }
        ]
      },
      {
        id: 'fs-p4',
        number: 4,
        title: 'Full Stack Production Projects & Next.js',
        purpose: 'Projects & Experience',
        color: 'amber',
        description: 'SSR, Server Actions, Stripe Payment Gateway, Docker containers.',
        steps: [
          { id: 'fs-s4-1', title: 'Build Full Stack SaaS with Next.js App Router', completed: false, required: true },
          { id: 'fs-s4-2', title: 'Integrate Stripe Payment Gateway & Webhooks', completed: false, required: false },
          { id: 'fs-s4-3', title: 'CI/CD Pipeline with GitHub Actions & Cloud Deployment', completed: false, required: true }
        ]
      },
      {
        id: 'fs-p5',
        number: 5,
        title: 'Full Stack Placement & Interview Prep',
        purpose: 'Placement Preparation',
        color: 'rose',
        description: 'Live coding rounds, system architecture, database indexing, frontend optimizations.',
        steps: [
          { id: 'fs-s5-1', title: 'Frontend Machine Coding Rounds (Accordion, Autocomplete, Infinite Scroll)', completed: false, required: true },
          { id: 'fs-s5-2', title: 'DSA in JavaScript (Arrays, Maps, Recursion, Trees)', completed: false, required: true },
          { id: 'fs-s5-3', title: 'Full Stack Portfolio Showcase with 3 Live Demo Links', completed: false, required: true }
        ]
      }
    ],
    requiredSkills: [
      { name: 'JavaScript & TypeScript', level: 80, required: true, priority: 'High', reason: 'Universal language across both frontend and backend runtimes.' },
      { name: 'React.js & Component Architecture', level: 85, required: true, priority: 'High', reason: 'Most demanded frontend framework across enterprise & startup hiring.' },
      { name: 'Node.js & Express REST APIs', level: 70, required: true, priority: 'High', reason: 'Core engine for backend services, business logic, and API endpoints.' },
      { name: 'PostgreSQL & Database Design', level: 65, required: true, priority: 'High', reason: 'Essential for data integrity, relationships, migrations, and indexing.' },
      { name: 'Git, GitHub & Cloud Hosting', level: 75, required: true, priority: 'High', reason: 'Enables continuous deployment on Vercel, Supabase, and AWS.' }
    ],
    projects: [
      {
        id: 'fs-p1',
        title: 'Responsive Portfolio with Dark Mode',
        level: 'Beginner',
        status: 'not_started',
        skills: ['React', 'TailwindCSS', 'Framer Motion'],
        description: 'Clean personal developer portfolio with animated hero, project showcases, and theme persistence.',
        outcome: 'Strong mastery of responsive UI, Tailwind tokens, and component structure.'
      },
      {
        id: 'fs-p2',
        title: 'E-Commerce Marketplace with Cart & Auth',
        level: 'Intermediate',
        status: 'not_started',
        skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT'],
        description: 'Full featured online store with product filtering, cart drawer, authentication, and order history.',
        outcome: 'Full stack state synchronization, protected API routes, and database schemas.'
      },
      {
        id: 'fs-p3',
        title: 'Collaborative Realtime Workspace (Trello/Notion Clone)',
        level: 'Advanced',
        status: 'not_started',
        skills: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Socket.io'],
        description: 'Kanban boards with real-time drag & drop sync between multiple users, markdown notes, and team permissions.',
        outcome: 'Enterprise-grade architecture, web sockets, and high-performance server components.'
      }
    ],
    certifications: [
      {
        id: 'fs-c1',
        title: 'Meta Front-End Developer Professional Certificate',
        provider: 'Coursera / Meta',
        relatedSkill: 'React & UI Architecture',
        priority: 'Recommended',
        whyRecommended: 'Comprehensive foundation in modern web development directly from React creators.'
      }
    ],
    nextStep: {
      title: 'Frontend: Master HTML5, Modern CSS & JavaScript ES6+',
      why: 'DOM manipulation and asynchronous JavaScript are core building blocks before learning React.',
      actionText: 'Start Learning â†’',
      estimatedHours: '5 Hours'
    }
  },
  'Data Scientist': {
    title: 'Data Scientist',
    category: 'Artificial Intelligence & Data',
    description: 'Extract statistical insights, build predictive models, and communicate business intelligence from complex data.',
    phases: [
      {
        id: 'ds-p1',
        number: 1,
        title: 'Data Analysis & Scientific Python',
        purpose: 'Foundation',
        color: 'emerald',
        description: 'Python, Pandas, NumPy, Data Cleaning, Exploratory Data Analysis (EDA).',
        steps: [
          { id: 'ds-s1-1', title: 'Python for Data Analysis (NumPy, Pandas, Vectorization)', completed: false, required: true },
          { id: 'ds-s1-2', title: 'Data Cleaning, Imputation, & Outlier Detection', completed: false, required: true },
          { id: 'ds-s1-3', title: 'Data Visualization (Seaborn, Matplotlib, Plotly)', completed: false, required: true },
          { id: 'ds-s1-4', title: 'Advanced SQL (Window Functions, CTEs, Aggregations)', completed: false, required: true }
        ]
      },
      {
        id: 'ds-p2',
        number: 2,
        title: 'Applied Statistics & Hypothesis Testing',
        purpose: 'Core Skills',
        color: 'teal',
        description: 'A/B Testing, Probability distributions, Central Limit Theorem, P-values.',
        steps: [
          { id: 'ds-s2-1', title: 'Probability Distributions (Normal, Binomial, Poisson)', completed: false, required: true },
          { id: 'ds-s2-2', title: 'Hypothesis Testing & A/B Experimentation Design', completed: false, required: true },
          { id: 'ds-s2-3', title: 'Confidence Intervals & Power Analysis', completed: false, required: true }
        ]
      },
      {
        id: 'ds-p3',
        number: 3,
        title: 'Predictive Modeling & Machine Learning',
        purpose: 'Specialization',
        color: 'cyan',
        description: 'Supervised ML, Unsupervised clustering, model tuning, Scikit-Learn.',
        steps: [
          { id: 'ds-s3-1', title: 'Regression & Time Series Forecasting (ARIMA/Prophet)', completed: false, required: true },
          { id: 'ds-s3-2', title: 'Classification Models (Random Forest, XGBoost)', completed: false, required: true },
          { id: 'ds-s3-3', title: 'Clustering, Customer Segmentation, PCA', completed: false, required: false }
        ]
      },
      {
        id: 'ds-p4',
        number: 4,
        title: 'Business Dashboards & End-to-End Projects',
        purpose: 'Projects & Experience',
        color: 'amber',
        description: 'Tableau/Power BI dashboards, Streamlit interactive apps, narrative reports.',
        steps: [
          { id: 'ds-s4-1', title: 'Interactive Analytics Dashboard with Streamlit/Plotly', completed: false, required: true },
          { id: 'ds-s4-2', title: 'Business Intelligence Reporting with Power BI', completed: false, required: false },
          { id: 'ds-s4-3', title: 'Publish 2 Detailed Data Storytelling Case Studies on Medium/GitHub', completed: false, required: true }
        ]
      },
      {
        id: 'ds-p5',
        number: 5,
        title: 'Data Science Placement & Case Study Rounds',
        purpose: 'Placement Preparation',
        color: 'rose',
        description: 'Live SQL tests, business metric reasoning, ML case interview questions.',
        steps: [
          { id: 'ds-s5-1', title: 'Solve 50+ Hard LeetCode / StrataScratch SQL Problems', completed: false, required: true },
          { id: 'ds-s5-2', title: 'Product Sense & Metric Definition Case Studies', completed: false, required: true },
          { id: 'ds-s5-3', title: 'Take-Home Data Science Technical Assessment Practice', completed: false, required: true }
        ]
      }
    ],
    requiredSkills: [
      { name: 'Python & Pandas/NumPy', level: 85, required: true, priority: 'High', reason: 'Primary tool for ingesting, transforming, and modeling large datasets.' },
      { name: 'Advanced SQL & Data Warehousing', level: 75, required: true, priority: 'High', reason: 'Primary way companies extract and aggregate production data.' },
      { name: 'Applied Statistics & A/B Testing', level: 70, required: true, priority: 'High', reason: 'Critical for proving scientific validity of business decisions.' },
      { name: 'Machine Learning (Scikit-Learn/XGBoost)', level: 65, required: true, priority: 'High', reason: 'Needed to build predictive classification and regression models.' }
    ],
    projects: [
      {
        id: 'ds-p1',
        title: 'Global Tech Salary & Job Market EDA',
        level: 'Beginner',
        status: 'not_started',
        skills: ['Python', 'Pandas', 'Seaborn', 'Jupyter'],
        description: 'Comprehensive exploratory data analysis on 20,000+ developer compensation records identifying wage trends and remote work impact.',
        outcome: 'Deep mastery of data cleansing, outlier handling, and visual storytelling.'
      },
      {
        id: 'ds-p2',
        title: 'Customer Churn & Retention Predictor',
        level: 'Intermediate',
        status: 'not_started',
        skills: ['XGBoost', 'Scikit-Learn', 'Streamlit', 'SHAP'],
        description: 'Predictive churn model with explainable AI (SHAP values) allowing marketing teams to simulate retention discounts.',
        outcome: 'Model evaluation, precision-recall optimization, and feature importance analysis.'
      },
      {
        id: 'ds-p3',
        title: 'Real-Time Financial Sentiment & Trend Forecaster',
        level: 'Advanced',
        status: 'not_started',
        skills: ['Python', 'HuggingFace', 'PostgreSQL', 'FastAPI'],
        description: 'Live pipeline scraping news and social feeds, scoring market sentiment, and predicting stock movement volatility.',
        outcome: 'End-to-end streaming data pipeline and predictive machine learning.'
      }
    ],
    certifications: [
      {
        id: 'ds-c1',
        title: 'IBM Data Science Professional Certificate',
        provider: 'Coursera / IBM',
        relatedSkill: 'Data Analysis, SQL & Python',
        priority: 'Recommended',
        whyRecommended: 'Complete overview of data methodology, Python notebooks, and data science workflows.'
      }
    ],
    nextStep: {
      title: 'SQL & Data: Master Window Functions (LEAD, LAG, DENSE_RANK)',
      why: 'Window functions appear in nearly 80% of data analyst and data science campus placement assessments.',
      actionText: 'Start Learning â†’',
      estimatedHours: '4 Hours'
    }
  }
};

// Search Autocomplete Suggestions for Clean Filtering (No static cluttered walls)
export const SUGGESTED_STAGES = [
  'Intermediate / 11th & 12th',
  'Diploma Student',
  'B.Tech 1st Year',
  'B.Tech 2nd Year',
  'B.Tech 3rd Year',
  'B.Tech Final Year',
  'MCA Student',
  'BCA / B.Sc Computer Science'
];

export const SUGGESTED_BRANCHES = [
  'Computer Science (CSE)',
  'Artificial Intelligence & ML (AI/ML)',
  'Data Science (DS)',
  'Information Technology (IT)',
  'Electronics & Communication (ECE)',
  'Electrical & Electronics (EEE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Robotics & Automation'
];

export const SUGGESTED_GOALS = [
  'Software Engineer',
  'AI Engineer',
  'Full Stack Developer',
  'Data Scientist',
  'Cloud & DevOps Engineer',
  'Cybersecurity Analyst',
  'Mobile App Developer (Flutter/React Native)',
  'UI/UX Product Designer',
  'Backend Systems Engineer'
];

export const SUGGESTED_SKILLS = [
  'Python', 'Java', 'C++', 'C', 'JavaScript', 'TypeScript', 'HTML5 & CSS3',
  'React.js', 'Node.js', 'Express.js', 'SQL & DBMS', 'PostgreSQL', 'MongoDB',
  'Data Structures & Algorithms', 'Operating Systems', 'Computer Networks',
  'Git & GitHub', 'Docker', 'FastAPI', 'Machine Learning', 'PyTorch', 'AWS'
];

// Helper to generate dynamic custom profile if student inputs a unique goal
const createDynamicProfile = (goalTitle) => {
  return {
    title: goalTitle,
    category: 'Target Specialization',
    description: `Personalized curriculum and strategic milestones to become a ${goalTitle}.`,
    phases: [
      {
        id: 'dyn-p1',
        number: 1,
        title: 'Core Fundamentals & Language Syntax',
        purpose: 'Foundation',
        color: 'emerald',
        description: 'Core logic building, standard programming languages, and computational thinking.',
        steps: [
          { id: 'dp-1', title: `Learn Programming Foundations for ${goalTitle}`, completed: false, required: true },
          { id: 'dp-2', title: 'Object-Oriented Design & Clean Code Practices', completed: false, required: true },
          { id: 'dp-3', title: 'Basic Problem Solving & Complexity Estimation', completed: false, required: true }
        ]
      },
      {
        id: 'dyn-p2',
        number: 2,
        title: 'Core Tools, Frameworks & DSA',
        purpose: 'Core Skills',
        color: 'teal',
        description: 'Essential data structures, databases, and core domain libraries.',
        steps: [
          { id: 'dp-4', title: 'Essential Data Structures (Arrays, Hash Maps, Trees)', completed: false, required: true },
          { id: 'dp-5', title: 'Database Design & Relational SQL Queries', completed: false, required: true },
          { id: 'dp-6', title: 'Version Control with Git & Team Workflows', completed: false, required: true }
        ]
      },
      {
        id: 'dyn-p3',
        number: 3,
        title: 'Specialized Domain Architecture',
        purpose: 'Specialization',
        color: 'cyan',
        description: `Industry-standard tools, frameworks, and architecture for ${goalTitle}.`,
        steps: [
          { id: 'dp-7', title: `Master Industry Standard Frameworks for ${goalTitle}`, completed: false, required: true },
          { id: 'dp-8', title: 'API Integration & Cloud Deployment Basics', completed: false, required: true }
        ]
      },
      {
        id: 'dyn-p4',
        number: 4,
        title: 'Build 3 High-Impact Portfolio Projects',
        purpose: 'Projects & Experience',
        color: 'amber',
        description: 'Practical proof-of-work projects showing complete domain competency.',
        steps: [
          { id: 'dp-9', title: 'Beginner Proof-of-Concept Project with Live Demo', completed: false, required: true },
          { id: 'dp-10', title: 'Intermediate End-to-End Scalable Project', completed: false, required: true },
          { id: 'dp-11', title: 'Advanced Production Application with Clean Readme', completed: false, required: true }
        ]
      },
      {
        id: 'dyn-p5',
        number: 5,
        title: 'Interview & Placement Preparation',
        purpose: 'Placement Preparation',
        color: 'rose',
        description: 'Technical assessments, mock interviews, and resume positioning.',
        steps: [
          { id: 'dp-12', title: 'Technical Problem Solving Rounds Preparation', completed: false, required: true },
          { id: 'dp-13', title: `Mock Technical Interview Drills for ${goalTitle}`, completed: false, required: true },
          { id: 'dp-14', title: 'Portfolio & ATS Resume Fine-Tuning', completed: false, required: true }
        ]
      }
    ],
    requiredSkills: [
      { name: 'Core Programming', level: 80, required: true, priority: 'High', reason: 'Essential foundation for writing clean, efficient code.' },
      { name: 'Data Structures & Algorithms', level: 75, required: true, priority: 'High', reason: 'Primary evaluation criteria during technical hiring rounds.' },
      { name: 'Database & SQL', level: 70, required: true, priority: 'High', reason: 'Crucial for structured persistence and schema management.' },
      { name: 'Git & GitHub', level: 80, required: true, priority: 'High', reason: 'Industry standard for code versioning and open collaboration.' }
    ],
    projects: [
      {
        id: 'dyn-pr-1',
        title: `${goalTitle} Foundation Utility`,
        level: 'Beginner',
        status: 'not_started',
        skills: ['Core Language', 'Git'],
        description: `Hands-on introductory project implementing core algorithmic principles for ${goalTitle}.`,
        outcome: 'Establishes clean coding habits and baseline proficiency.'
      },
      {
        id: 'dyn-pr-2',
        title: `Full-Featured ${goalTitle} Portal`,
        level: 'Intermediate',
        status: 'not_started',
        skills: ['Frameworks', 'Database', 'API'],
        description: `Comprehensive multi-tier system with database storage, authentication, and responsive UI.`,
        outcome: 'Demonstrates end-to-end full lifecycle architecture.'
      },
      {
        id: 'dyn-pr-3',
        title: `Advanced Cloud-Deployed ${goalTitle} System`,
        level: 'Advanced',
        status: 'not_started',
        skills: ['Cloud', 'Production API', 'Security'],
        description: `Enterprise-grade system with live cloud deployment, automated testing, and CI/CD pipelines.`,
        outcome: 'High-impact portfolio showcase for campus placements.'
      }
    ],
    certifications: [
      {
        id: 'dyn-cert-1',
        title: `Professional Foundations in ${goalTitle}`,
        provider: 'Industry Accredited',
        relatedSkill: 'Domain Core',
        priority: 'Recommended',
        whyRecommended: 'Solidifies fundamental competence in target domain skills.'
      }
    ],
    nextStep: {
      title: `Start Foundation: Master Core Programming & Syntax for ${goalTitle}`,
      why: 'Every successful career roadmap begins with solid language fundamentals and problem solving.',
      actionText: 'Start Learning â†’',
      estimatedHours: '5 Hours'
    }
  };
};

export const useCareerGuideStore = create(
  persist(
    (set, get) => ({
      // User Setup: Initially EMPTY (No default mock stage or goal)
      currentStage: '',
      branch: '',
      careerGoal: '',
      skillLevel: 'Beginner', // 'Beginner' | 'Intermediate' | 'Advanced'
      knownSkills: [],

      // Active view tab inside CareerGuide
      // 'overview' | 'skills' | 'projects' | 'readiness'
      activeSubView: 'overview',

      // Dynamic profile dictionary
      careerProfiles: DEFAULT_CAREER_PROFILES,

      // Filter or custom queries
      searchQuery: '',

      // Setup State Complete Check
      isGoalConfigured: () => {
        const { currentStage, careerGoal } = get();
        return Boolean(currentStage?.trim() && careerGoal?.trim());
      },

      // Setters
      setStage: (stage) => set({ currentStage: stage }),
      setBranch: (branch) => set({ branch }),
      setCareerGoal: (goal) => {
        const trimmed = goal?.trim() || '';
        const { careerProfiles } = get();
        if (trimmed && !careerProfiles[trimmed]) {
          set({
            careerGoal: trimmed,
            careerProfiles: {
              ...careerProfiles,
              [trimmed]: DEFAULT_CAREER_PROFILES[trimmed] || createDynamicProfile(trimmed)
            }
          });
        } else {
          set({ careerGoal: trimmed });
        }
      },
      setSkillLevel: (skillLevel) => set({ skillLevel }),
      setActiveSubView: (view) => set({ activeSubView: view }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Configure entire goal in one action
      configureGoal: ({ stage, branch, goal, skillLevel, skills }) => {
        const { careerProfiles } = get();
        const trimmedGoal = goal.trim();
        let updatedProfiles = { ...careerProfiles };

        if (trimmedGoal && !updatedProfiles[trimmedGoal]) {
          updatedProfiles[trimmedGoal] = DEFAULT_CAREER_PROFILES[trimmedGoal] || createDynamicProfile(trimmedGoal);
        }

        set({
          currentStage: stage.trim(),
          branch: branch?.trim() || '',
          careerGoal: trimmedGoal,
          skillLevel: skillLevel || 'Beginner',
          knownSkills: skills || [],
          careerProfiles: updatedProfiles,
          activeSubView: 'overview'
        });
      },

      // Reset goal so student can start fresh
      resetGoal: () => {
        set({
          currentStage: '',
          branch: '',
          careerGoal: '',
          knownSkills: [],
          skillLevel: 'Beginner',
          careerProfiles: JSON.parse(JSON.stringify(DEFAULT_CAREER_PROFILES))
        });
      },

      // Toggle known skill
      toggleKnownSkill: (skill) => {
        const { knownSkills } = get();
        if (knownSkills.includes(skill)) {
          set({ knownSkills: knownSkills.filter((s) => s !== skill) });
        } else {
          set({ knownSkills: [...knownSkills, skill] });
        }
      },

      // Add a custom skill
      addCustomSkill: (skill) => {
        const trimmed = skill.trim();
        if (!trimmed) return;
        const { knownSkills } = get();
        if (!knownSkills.includes(trimmed)) {
          set({ knownSkills: [...knownSkills, trimmed] });
        }
      },

      // Remove a skill
      removeSkill: (skill) => {
        const { knownSkills } = get();
        set({ knownSkills: knownSkills.filter((s) => s !== skill) });
      },

      // Toggle a specific roadmap step completed / not completed
      toggleStepCompletion: (goalTitleOrPhaseId, maybePhaseId, maybeStepId) => {
        const currentGoal = get().careerGoal;
        let goalTitle = currentGoal;
        let phaseId = goalTitleOrPhaseId;
        let stepId = maybePhaseId;

        // If invoked as (goalTitle, phaseId, stepId)
        if (maybeStepId !== undefined) {
          goalTitle = goalTitleOrPhaseId || currentGoal;
          phaseId = maybePhaseId;
          stepId = maybeStepId;
        }

        if (!goalTitle || !goalTitle.trim()) return;
        const cleanGoal = goalTitle.trim();

        const { careerProfiles } = get();
        const profile =
          careerProfiles[cleanGoal] ||
          DEFAULT_CAREER_PROFILES[cleanGoal] ||
          createDynamicProfile(cleanGoal);

        let stepFoundAndToggled = false;
        let toggledStepTitle = '';
        let newCompletedStatus = false;

        const updatedPhases = (profile.phases || []).map((phase) => {
          // Check if this phase owns the target step, or match by phase ID or number
          const hasTargetStep = (phase.steps || []).some(
            (s) => String(s.id).trim() === String(stepId).trim()
          );
          const isTargetPhase =
            hasTargetStep ||
            String(phase.id).trim() === String(phaseId).trim() ||
            String(phase.number).trim() === String(phaseId).trim();

          if (!isTargetPhase) return phase;

          const updatedSteps = (phase.steps || []).map((step) => {
            if (String(step.id).trim() !== String(stepId).trim()) return step;
            stepFoundAndToggled = true;
            toggledStepTitle = step.title;
            newCompletedStatus = !step.completed;
            return { ...step, completed: newCompletedStatus };
          });

          return { ...phase, steps: updatedSteps };
        });

        const updatedProfile = {
          ...profile,
          phases: updatedPhases
        };

        set((state) => ({
          careerProfiles: {
            ...state.careerProfiles,
            [cleanGoal]: updatedProfile
          }
        }));

        if (stepFoundAndToggled) {
          if (newCompletedStatus) {
            useToastStore.getState().addToast(`Completed: ${toggledStepTitle || 'Task'} âœ…`, 'success');
          } else {
            useToastStore.getState().addToast(`Unmarked: ${toggledStepTitle || 'Task'}`, 'info');
          }
        }
      },

      // Update project status ('not_started' | 'in_progress' | 'completed')
      setProjectStatus: (goalTitleOrProjId, maybeProjId, maybeStatus) => {
        const currentGoal = get().careerGoal;
        let goalTitle = currentGoal;
        let projectId = goalTitleOrProjId;
        let status = maybeProjId;

        if (maybeStatus !== undefined) {
          goalTitle = goalTitleOrPhaseId || currentGoal;
          projectId = maybeProjId;
          status = maybeStatus;
        }

        if (!goalTitle || !goalTitle.trim()) return;
        const cleanGoal = goalTitle.trim();

        const { careerProfiles } = get();
        const profile =
          careerProfiles[cleanGoal] ||
          DEFAULT_CAREER_PROFILES[cleanGoal] ||
          createDynamicProfile(cleanGoal);

        const updatedProjects = (profile.projects || []).map((proj) => {
          if (String(proj.id).trim() !== String(projectId).trim()) return proj;
          return { ...proj, status };
        });

        const updatedProfile = {
          ...profile,
          projects: updatedProjects
        };

        set((state) => ({
          careerProfiles: {
            ...state.careerProfiles,
            [cleanGoal]: updatedProfile
          }
        }));

        const statusLabels = {
          completed: 'Completed! 🏆',
          in_progress: 'In Progress 🚀',
          not_started: 'Reset to Todo'
        };
        useToastStore.getState().addToast(`Project: ${statusLabels[status] || status}`, 'info');
      },

      // Get Active Profile Data - NEVER default to someone else's goal if empty
      getActiveProfile: () => {
        const { careerGoal, careerProfiles } = get();
        if (!careerGoal || !careerGoal.trim()) {
          return null;
        }
        const cleanGoal = careerGoal.trim();
        return (
          careerProfiles[cleanGoal] ||
          DEFAULT_CAREER_PROFILES[cleanGoal] ||
          createDynamicProfile(cleanGoal)
        );
      },

      // Calculated Stats
      getRoadmapStats: () => {
        const profile = get().getActiveProfile();
        if (!profile || !profile.phases) {
          return {
            totalSteps: 0,
            completedSteps: 0,
            percentage: 0,
            completedProjectsCount: 0,
            totalProjectsCount: 0
          };
        }

        let totalSteps = 0;
        let completedSteps = 0;

        profile.phases.forEach((phase) => {
          (phase.steps || []).forEach((step) => {
            totalSteps++;
            if (step.completed) completedSteps++;
          });
        });

        const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
        const completedProjectsCount = (profile.projects || []).filter((p) => p.status === 'completed').length;
        const totalProjectsCount = (profile.projects || []).length;

        return {
          totalSteps,
          completedSteps,
          percentage,
          completedProjectsCount,
          totalProjectsCount
        };
      },

      // Placement Readiness Calculator
      getPlacementReadiness: () => {
        const { knownSkills } = get();
        const profile = get().getActiveProfile();

        if (!profile || !profile.phases) {
          return {
            score: 0,
            pillars: [],
            improvements: ['Select your career goal in Career Pathway to see placement readiness analysis.']
          };
        }

        // 6 Readiness Pillars based on real user completed skills and steps
        const pillars = [
          {
            name: 'Core Programming',
            key: 'prog',
            weight: 20,
            done: knownSkills.some((s) => ['Java', 'Python', 'C++', 'C', 'JavaScript', 'TypeScript'].some((k) => s.toLowerCase().includes(k.toLowerCase())))
          },
          {
            name: 'Data Structures & Alg.',
            key: 'dsa',
            weight: 25,
            done: knownSkills.some((s) => s.toLowerCase().includes('data structure') || s.toLowerCase().includes('algorithm') || s.toLowerCase().includes('dsa')) || Boolean(profile.phases[1]?.steps[0]?.completed)
          },
          {
            name: 'Real-World Projects',
            key: 'projects',
            weight: 20,
            done: (profile.projects || []).some((p) => p.status === 'completed')
          },
          {
            name: 'Database & SQL',
            key: 'db',
            weight: 15,
            done: knownSkills.some((s) => ['sql', 'dbms', 'postgres', 'mongo'].some((k) => s.toLowerCase().includes(k)))
          },
          {
            name: 'Version Control (Git)',
            key: 'git',
            weight: 10,
            done: knownSkills.some((s) => s.toLowerCase().includes('git'))
          },
          {
            name: 'Interview & Aptitude Prep',
            key: 'interview',
            weight: 10,
            done: Boolean(profile.phases[4]?.steps?.some((s) => s.completed))
          }
        ];

        let score = 0;
        pillars.forEach((p) => {
          if (p.done) score += p.weight;
        });

        const improvements = [];
        if (!pillars[0].done) improvements.push('Select or learn at least one primary programming language (Python, Java, C++, or JavaScript).');
        if (!pillars[1].done) improvements.push('Practice Data Structures (Arrays, Trees, Graphs) on LeetCode/HackerRank.');
        if (!pillars[2].done) improvements.push('Build and mark at least one intermediate project as completed.');
        if (!pillars[3].done) improvements.push('Master relational databases and advanced SQL queries.');
        if (!pillars[4].done) improvements.push('Learn Git version control and publish repositories on GitHub.');
        if (!pillars[5].done) improvements.push('Practice technical mock interview problems and aptitude tests.');

        if (improvements.length === 0) {
          improvements.push('Maintain active practice streaks and apply for placement rounds!');
        }

        return {
          score,
          pillars,
          improvements
        };
      }
    }),
    {
      name: 'SkillSync-careerguide-store-v6',
      partialize: (state) => ({
        currentStage: state.currentStage,
        branch: state.branch,
        careerGoal: state.careerGoal,
        skillLevel: state.skillLevel,
        knownSkills: state.knownSkills,
        careerProfiles: state.careerProfiles
      })
    }
  )
);
