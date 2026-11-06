export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  institution: string;
  course: string;
  year: string;
  phone: string;
  dob: string;
  interests: string[];
  skills: string[];
  darkMode: boolean;
  notificationsEnabled: boolean;
  isOnboarded: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  dueDate: string; // ISO string or format "YYYY-MM-DD THH:mm"
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  category?: string;
}

export interface Activity {
  id: string;
  title: string;
  time: string;
  status: 'Pending' | 'In Progress' | 'Done';
  color: string;
}

export interface ClassEntry {
  id: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  timeSlot: string; // e.g. "09:00"
  duration: number; // in hours (1-3)
  subject: string;
  professor: string;
  room: string;
  color: string;
}

export interface CalendarNote {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  color?: string;
}

export interface ResumeData {
  template: 'modern' | 'classic' | 'creative' | 'minimal';
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    summary: string;
  };
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    grade: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string;
    link: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
  achievements: string[];
}

export interface ResumeAnalysisResult {
  overallScore: number; // 0-100
  atsScore: number;
  keywordScore: number;
  formattingScore: number;
  grammarScore: number;
  suggestions: Array<{
    id: string;
    severity: 'High' | 'Medium' | 'Low';
    category: string;
    issue: string;
    fix: string;
  }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  image?: string; // base64 or URL
  timestamp: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  imageUrl?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number; // 0-100
  unlockedAt?: string;
}
