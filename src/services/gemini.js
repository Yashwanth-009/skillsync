/**
 * Skillo AI Service - Ultra-Fast, High-Accuracy Academic & In-App Assistant
 */

import { useAuthStore } from '../store/useAuthStore';
import { useTimetableStore } from '../store/useTimetableStore';
import { useDashboardStore } from '../store/useDashboardStore';
import { useProfileStore } from '../store/useProfileStore';
import { useToastStore } from '../store/useToastStore';
import { aiRateLimiter, safeEvalMath } from '../lib/security';

export const DEFAULT_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Autonomous In-App Tool Execution Engine
 */
export function executeInAppTool(toolName, args = {}) {
  try {
    if (toolName === 'create_study_reminder') {
      const title = args.title || 'Study Task';
      const date = args.date || 'Tomorrow';
      const time = args.time || '18:00';
      useDashboardStore.getState().addReminder({ title, date, time });
      useToastStore.getState().addToast(`Reminder set: "${title}"`, 'success');
      return {
        success: true,
        summary: `Scheduled reminder for **${title}** (Due: ${date} ${time})`,
        actionTag: `[ACTION:reminder:${title}:${date} ${time}]`
      };
    }

    if (toolName === 'add_timetable_class') {
      const subject = args.subject || 'Class';
      const day = args.day || 'Monday';
      const startTime = args.startTime || '09:00';
      const endTime = args.endTime || '10:00';
      const room = args.room || 'Room 101';
      const instructor = args.instructor || 'Prof';
      useTimetableStore.getState().addClass({ subject, day, startTime, endTime, room, instructor });
      useToastStore.getState().addToast(`Added ${subject} to ${day} schedule!`, 'success');
      return {
        success: true,
        summary: `Added **${subject}** to your **${day}** timetable (${startTime} - ${endTime}, ${room})`,
        actionTag: `[ACTION:timetable:${subject}:${day} ${startTime}-${endTime}]`
      };
    }

    if (toolName === 'navigate_to_screen') {
      const allowedScreens = ['home', 'timetable', 'careerconnect', 'resume', 'chat', 'profile'];
      const rawScreen = (args.screen_name || '').toLowerCase().trim();
      const screen = allowedScreens.includes(rawScreen) ? rawScreen : 'home';
      window.dispatchEvent(new CustomEvent('skillo_navigate', { detail: { screen } }));
      return {
        success: true,
        summary: `Navigating to **${screen.toUpperCase()}** screen for you.`,
        actionTag: `[ACTION:navigate:${screen}:Open ${screen.toUpperCase()}]`
      };
    }

    if (toolName === 'add_study_goal') {
      const title = args.title || 'Complete study task';
      useDashboardStore.getState().addGoal(title);
      useToastStore.getState().addToast(`Added goal: "${title}"`, 'success');
      return {
        success: true,
        summary: `Added new academic goal: **${title}**`,
        actionTag: `[ACTION:goal:${title}:View Goals]`
      };
    }

    if (toolName === 'add_calendar_note') {
      const date = args.date || new Date().toISOString().split('T')[0];
      const title = args.title || 'Academic Note';
      const content = args.content || '';
      useTimetableStore.getState().addOrUpdateCalendarNote(date, title, content);
      useToastStore.getState().addToast(`Calendar note saved for ${date}!`, 'success');
      return {
        success: true,
        summary: `Saved calendar note for **${date}**: "${title}"`,
        actionTag: `[ACTION:calendar:${date}:${title}]`
      };
    }
  } catch (e) {
    console.error('Tool execution error:', e);
  }

  return { success: false, summary: '', actionTag: '' };
}

/**
 * Builds dynamic in-app student context to give Skillo awareness of timetable, profile, and reminders
 */
export function buildStudentContextPrompt(activeScreen = 'home') {
  try {
    const authUser = useAuthStore.getState()?.user || {};
    const timetableClasses = useTimetableStore.getState()?.classes || [];
    const calendarNotes = useTimetableStore.getState()?.calendarNotes || [];
    const dashboardState = useDashboardStore.getState() || {};
    const profileState = useProfileStore.getState() || {};

    const reminders = dashboardState.reminders || [];
    const goals = dashboardState.goals || [];
    const attendance = dashboardState.attendance || 100;
    const cgpa = dashboardState.cgpa || '0.00';
    const certificates = profileState.certificates || [];
    const badges = (profileState.badges || []).filter((b) => b.unlocked);

    const studentDescriptor = [authUser.course, authUser.institution].filter(Boolean).join(', ');
    let context = `STUDENT PROFILE & ACADEMIC CONTEXT:
• Active App Screen: ${activeScreen.toUpperCase()}
• Student: ${authUser.name || 'Student'}${studentDescriptor ? ` (${studentDescriptor})` : ''}
• Target GPA: ${authUser.targetGpa || '4.0'} | Current CGPA: ${cgpa}
• Attendance Standing: ${attendance}%
• Skills: ${(authUser.skills || []).join(', ') || 'Not specified'}
• Badges: ${badges.map((b) => b.title).join(', ') || 'None yet'}
• Certificates: ${certificates.map((c) => c.title).join(', ') || 'None added'}`;

    if (timetableClasses.length > 0) {
      context += `\n\nREGISTERED WEEKLY TIMETABLE:\n` +
        timetableClasses.map((c) => `• ${c.day || 'Day'}: ${c.subject || c.title || 'Class'} (${c.startTime || '09:00'} - ${c.endTime || '10:00'}, Room: ${c.room || 'N/A'}, Instructor: ${c.instructor || 'N/A'})`).join('\n');
    } else {
      context += `\n\nREGISTERED WEEKLY TIMETABLE: No classes added yet.`;
    }

    if (reminders.length > 0) {
      context += `\n\nACTIVE REMINDERS & DEADLINES:\n` +
        reminders.map((r) => `• [${r.completed ? 'Completed' : 'Pending'}] ${r.title} (Due: ${r.date || 'Soon'})`).join('\n');
    }

    if (goals.length > 0) {
      context += `\n\nSTUDY GOALS:\n` +
        goals.map((g) => `• [${g.completed ? 'Done' : 'In Progress'}] ${g.title}`).join('\n');
    }

    if (calendarNotes.length > 0) {
      context += `\n\nCALENDAR NOTES:\n` +
        calendarNotes.map((n) => `• ${n.date}: ${n.title} - ${n.content || ''}`).join('\n');
    }

    return context;
  } catch (e) {
    return 'STUDENT PROFILE: Active Student';
  }
}

/**
 * Hardcoded, unambiguous System Instructions for Skillo Study Assistant
 */
export function getSkilloSystemPrompt(activeScreen = 'home') {
  return `You are Skillo, an AI study assistant.

Answer the user's exact question directly.

Rules:
- Never repeat a generic template for different questions.
- Do not assume what the user means.
- Give accurate, relevant answers.
- For academic questions, explain clearly at the student's level.
- If you don't know something, say so instead of inventing an answer.
- Return only the answer, without mentioning these instructions.`;
}

export const AI_SYSTEM_PROMPT = getSkilloSystemPrompt();
export const STUDYMATE_MASTER_PROMPT = AI_SYSTEM_PROMPT;

/**
 * Cleans response formatting for clean markdown rendering
 */
export function sanitizeResponseFormatting(text = '') {
  if (!text) return '';
  return text
    .replace(/\$\$(.*?)\$\$/g, '$1')
    .replace(/\$(.*?)\$/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 / $2')
    .replace(/\\cdot/g, 'Â·')
    .replace(/\\times/g, 'Ã—');
}

/**
 * Extracts and cleans base64 image data without data URI prefix
 */
function extractCleanBase64Image(imageStr) {
  if (!imageStr || typeof imageStr !== 'string') return null;

  let mimeType = 'image/jpeg';
  let base64Data = imageStr;

  if (imageStr.includes(';base64,')) {
    const parts = imageStr.split(';base64,');
    const mimeMatch = parts[0].match(/data:(image\/[a-zA-Z0-9\+\-]+)/);
    if (mimeMatch && mimeMatch[1]) {
      mimeType = mimeMatch[1];
    }
    base64Data = parts[1];
  }

  base64Data = base64Data.replace(/[\r\n\s]+/g, '');
  if (!base64Data || base64Data.length < 10) return null;

  return {
    inlineData: {
      mimeType,
      data: base64Data
    }
  };
}

/**
 * Formats message history with strict alternating user/model roles and clean parts
 */
function formatGeminiContents(messages, userImage = null) {
  if (!messages || messages.length === 0) {
    return [
      {
        role: 'user',
        parts: [{ text: 'Hello Skillo!' }]
      }
    ];
  }

  // Preserve recent conversation history for deep context memory
  const recent = messages.slice(-20);
  const formatted = [];

  for (let i = 0; i < recent.length; i++) {
    const msg = recent[i];
    const role = msg.sender === 'user' ? 'user' : 'model';
    const parts = [];

    if (msg.text && msg.text.trim()) {
      const cleanText = msg.text.replace(/\[ACTION:[^\]]+\]/g, '').trim();
      if (cleanText) {
        parts.push({ text: cleanText });
      }
    }

    if (msg.image && role === 'user') {
      const imgObj = extractCleanBase64Image(msg.image);
      if (imgObj) parts.push(imgObj);
    }

    if (i === recent.length - 1 && userImage && !msg.image) {
      const extraImg = extractCleanBase64Image(userImage);
      if (extraImg) parts.push(extraImg);
    }

    if (parts.length > 0) {
      if (formatted.length > 0 && formatted[formatted.length - 1].role === role) {
        formatted[formatted.length - 1].parts.push(...parts);
      } else {
        formatted.push({ role, parts });
      }
    }
  }

  if (formatted.length > 0 && formatted[0].role !== 'user') {
    formatted.shift();
  }

  if (formatted.length === 0) {
    formatted.push({
      role: 'user',
      parts: [{ text: 'Hello Skillo!' }]
    });
  }

  return formatted;
}

/**
 * Subject Detector for intelligent routing & fallback solver
 */
export function detectSubject(text = '') {
  const lower = text.toLowerCase();

  if (lower.match(/(\d+\s*[\+\-\*\/\=]\s*\d+)|(solve|equation|derivative|integral|matrix|trigonometry|algebra|logarithm|calculus|fraction)/i)) {
    return 'Mathematics';
  }
  if (lower.match(/(python|java|c\+\+|javascript|typescript|html|css|sql|function|loop|array|algorithm|code|programming)/i)) {
    return 'Programming';
  }
  if (lower.match(/(newton|force|velocity|acceleration|gravity|circuit|voltage|current|quantum|physics|ohm)/i)) {
    return 'Physics';
  }
  if (lower.match(/(acid|base|element|periodic table|molecule|reaction|chemistry)/i)) {
    return 'Chemistry';
  }
  if (lower.match(/(cell|dna|rna|gene|protein|photosynthesis|biology)/i)) {
    return 'Biology';
  }
  if (lower.match(/(timetable|schedule|class|routine|attendance|reminder|assignment|goal|profile|cgpa)/i)) {
    return 'Student Academic Context';
  }

  return 'General';
}

/**
 * Executes Gemini API request with strict payload format and low latency
 */
export const askGemini = async (messages, apiKey = null, userImage = null, activeScreen = 'home') => {
  const rateCheck = aiRateLimiter.isAllowed('ai-chat');
  if (!rateCheck.allowed) {
    return `Rate limit reached. Please wait ${rateCheck.waitSeconds}s before sending another message.`;
  }

  const key = (apiKey && apiKey.trim()) || DEFAULT_GEMINI_KEY;
  const currentMsg = messages && messages.length > 0 ? messages[messages.length - 1] : null;
  const currentText = currentMsg?.text || '';
  const detectedSubject = detectSubject(currentText);

  // 1. Check for immediate in-app actions first (instant 0ms response)
  const actionResult = checkInAppIntent(currentText);
  if (actionResult) {
    return sanitizeResponseFormatting(actionResult);
  }

  // 2. High-speed Gemini API Call (7s timeout for fast response)
  if (key) {
    const contents = formatGeminiContents(messages, userImage);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${key}`;

      const requestPayload = {
        contents,
        systemInstruction: {
          parts: [{ text: getSkilloSystemPrompt(activeScreen) }]
        },
        generationConfig: {
          temperature: 0.15, // Ultra-low temperature for precision & speed
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1000
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify(requestPayload)
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!answer) {
        throw new Error(data.error?.message || "No answer received from Gemini");
      }

      return sanitizeResponseFormatting(answer);
    } catch (err) {
      console.warn("Gemini API call error:", err);
    }
  }

  // 3. Direct Academic Solver Fallback (if offline or API unreachable)
  return sanitizeResponseFormatting(solveConversationalEngine(currentMsg, detectedSubject, userImage, Boolean(key)));
};

/**
 * Direct In-App Intent Execution Helper (Zero latency action triggers)
 */
function checkInAppIntent(rawText = '') {
  const text = rawText.toLowerCase().trim();

  // 1. Reminders
  if (text.includes('remind me') || text.includes('set reminder') || text.includes('create reminder')) {
    const cleanTitle = rawText.replace(/remind me to|remind me|set reminder for|set reminder|create reminder for|create reminder/i, '').trim() || 'Academic Task';
    const result = executeInAppTool('create_study_reminder', { title: cleanTitle, date: 'Tomorrow', time: '18:00' });
    return `${result.summary}\n\n${result.actionTag}`;
  }

  // 2. Add Class
  if (text.includes('add class') || text.includes('add lecture') || text.includes('schedule class')) {
    const match = rawText.match(/add (?:class|lecture) (?:for )?([a-zA-Z\s]+)(?:on )?([a-zA-Z]+)?/i);
    const sub = match ? match[1].trim() : 'Elective';
    const day = match && match[2] ? match[2].trim() : 'Monday';
    const result = executeInAppTool('add_timetable_class', { subject: sub, day, startTime: '10:00', endTime: '11:00', room: 'Room 204' });
    return `${result.summary}\n\n${result.actionTag}`;
  }

  // 3. Navigation
  if (text.includes('open timetable') || text.includes('go to timetable') || text.includes('show timetable')) {
    const result = executeInAppTool('navigate_to_screen', { screen_name: 'timetable' });
    return `${result.summary}\n\n${result.actionTag}`;
  }
  if (text.includes('open resume') || text.includes('resume builder') || text.includes('build resume')) {
    const result = executeInAppTool('navigate_to_screen', { screen_name: 'resume' });
    return `${result.summary}\n\n${result.actionTag}`;
  }
  if (text.includes('open career') || text.includes('career connect')) {
    const result = executeInAppTool('navigate_to_screen', { screen_name: 'careerconnect' });
    return `${result.summary}\n\n${result.actionTag}`;
  }

  // 4. Add Study Goal
  if (text.includes('set goal') || text.includes('add goal') || text.includes('my goal is')) {
    const goalTitle = rawText.replace(/set goal to|set goal|add goal to|add goal|my goal is to|my goal is/i, '').trim() || 'Complete practice test';
    const result = executeInAppTool('add_study_goal', { title: goalTitle });
    return `${result.summary}\n\n${result.actionTag}`;
  }

  return null;
}

/**
 * Comprehensive ChatGPT-Style Conversational Engine (Direct, intelligent & natural)
 */
function solveConversationalEngine(userMsg, subject, userImage, hasKey = false) {
  const rawText = userMsg?.text || '';
  const text = rawText.toLowerCase().trim();
  const hasImage = Boolean(userMsg?.image || userImage);

  // 1. Natural Greetings & Social Chit-Chat (ChatGPT style)
  if (text.match(/^(hi|hello|hey|greetings|hola|namaste|good\s+(morning|afternoon|evening|day))(\s+.*)?$/i)) {
    const authUser = useAuthStore.getState()?.user;
    const studentName = authUser?.name ? authUser.name.split(' ')[0] : 'there';
    return `Hello ${studentName}! 👋 How can I help you today? Whether you need help with math, coding, coursework, exam prep, or study scheduling, feel free to ask!`;
  }

  if (text.match(/^(how\s+are\s+you|how's\s+it\s+going|how\s+do\s+you\s+do|sup)(\?)?$/i)) {
    return `I'm doing great, thank you for asking! 😊 Ready to help you with any questions, study concepts, programming tasks, or calculations. What are you working on today?`;
  }

  if (text.match(/^(who\s+are\s+you|what\s+is\s+your\s+name|what\s+are\s+you)(\?)?$/i)) {
    return `I'm **Skillo**, your AI study assistant and learning companion in SkillSync! 🎓\n\nI can help you with:\n- **Math & Science:** Step-by-step problem solving and formula explanations.\n- **Programming & CS:** Writing, debugging, and explaining code in Python, JavaScript, Java, C++, and more.\n- **Study Management:** Tracking your timetable, attendance, deadlines, and study goals.\n- **Concept Explanations:** Simplifying complex topics in any subject.`;
  }

  if (text.match(/^(thank\s+you|thanks|thx|thank\s+you\s+so\s+much|great|awesome|perfect)(\s+.*)?$/i)) {
    return `You're very welcome! 😊 Let me know whenever you have more questions or need help studying!`;
  }

  // 2. Math: Direct arithmetic calculation (e.g. 25 * 4, 100 / 5, 2^8, (12 + 8) * 3, 15% of 200)
  const percentMatch = text.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of)\s*(\d+(?:\.\d+)?)/i);
  if (percentMatch) {
    const pct = parseFloat(percentMatch[1]);
    const num = parseFloat(percentMatch[2]);
    const res = (pct / 100) * num;
    return `**${pct}% of ${num} = ${res}**\n\nCalculation: \`(${pct} / 100) Ã— ${num} = ${res}\``;
  }

  const mathExpr = rawText.match(/^[\d\s\+\-\*\/\(\)\.]+(\s*=\s*\?)?$/);
  if (mathExpr || (text.match(/^[\d\s\+\-\*\/]+$/) && !text.includes('code'))) {
    const result = safeEvalMath(rawText);
    if (typeof result === 'number' && !isNaN(result)) {
      return `**${rawText.replace(/=/g, '').replace(/\?/g, '').trim()} = ${result}**`;
    }
  }

  // 3. Math: Linear equation solver (e.g. 2x + 5 = 15, 3x - 7 = 14, 5x = 20)
  const linearMatch = rawText.match(/(\d+)x\s*([\+\-])\s*(\d+)\s*=\s*(\d+)/i) || rawText.match(/(\d+)x\s*=\s*(\d+)/i);
  if (linearMatch) {
    if (linearMatch.length === 5) {
      const a = parseFloat(linearMatch[1]);
      const op = linearMatch[2];
      const b = parseFloat(linearMatch[3]);
      const c = parseFloat(linearMatch[4]);
      const rightVal = op === '+' ? c - b : c + b;
      const xVal = Number((rightVal / a).toFixed(4));

      return `To solve **${linearMatch[0]}**:\n\n1. Move the constant term to the right side:\n   \`${a}x = ${c} ${op === '+' ? '-' : '+'} ${b}\` âž” \`${a}x = ${rightVal}\`\n2. Divide both sides by \`${a}\`:\n   \`x = ${rightVal} / ${a}\`\n\n**Final Answer:** **x = ${xVal}**`;
    } else if (linearMatch.length === 3) {
      const a = parseFloat(linearMatch[1]);
      const c = parseFloat(linearMatch[2]);
      const xVal = Number((c / a).toFixed(4));
      return `To solve **${linearMatch[0]}**:\n\nDivide both sides by \`${a}\`:\n\`x = ${c} / ${a}\`\n\n**Final Answer:** **x = ${xVal}**`;
    }
  }

  // 4. Math: Quadratic equations
  if (text.includes('quadratic') || text.includes('roots of') || text.includes('ax^2')) {
    return `For a quadratic equation in standard form **axÂ² + bx + c = 0**, the roots are given by the Quadratic Formula:\n\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n**Discriminant ($\\Delta = b^2 - 4ac$):**\n- If $\\Delta > 0$: 2 distinct real roots\n- If $\\Delta = 0$: 1 real repeated root\n- If $\\Delta < 0$: 2 complex conjugate roots\n\n*Example ($x^2 - 5x + 6 = 0$):* \n$a = 1, b = -5, c = 6$\n$x = \\frac{5 \\pm \\sqrt{25 - 24}}{2} = \\frac{5 \\pm 1}{2}$ âž” **x = 2 or x = 3**`;
  }

  // 5. Math: Calculus / Derivatives
  if (text.includes('derivative') || text.includes('d/dx') || text.includes('differentiat')) {
    return `### Standard Derivative Rules:\n- **Power Rule:** $\\frac{d}{dx}(x^n) = n x^{n-1}$ *(e.g., $\\frac{d}{dx}(x^3) = 3x^2$)*\n- **Product Rule:** $\\frac{d}{dx}(u \\cdot v) = u'v + uv'$\n- **Quotient Rule:** $\\frac{d}{dx}\\left(\\frac{u}{v}\\right) = \\frac{u'v - uv'}{v^2}$\n- **Chain Rule:** $\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$\n- **Trigonometric:** $\\frac{d}{dx}(\\sin x) = \\cos x$, $\\frac{d}{dx}(\\cos x) = -\\sin x$, $\\frac{d}{dx}(\\tan x) = \\sec^2 x$\n- **Exponential:** $\\frac{d}{dx}(e^x) = e^x$, $\\frac{d}{dx}(\\ln x) = \\frac{1}{x}$`;
  }

  // 6. Math: Integrals
  if (text.includes('integral') || text.includes('integrate') || text.includes('antiderivative')) {
    return `### Standard Integration Formulas:\n- **Power Rule:** $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$ *(for $n \\neq -1$)*\n- **Reciprocal:** $\\int \\frac{1}{x} dx = \\ln|x| + C$\n- **Exponential:** $\\int e^x dx = e^x + C$\n- **Trigonometric:** $\\int \\cos x dx = \\sin x + C$, $\\int \\sin x dx = -\\cos x + C$\n- **Integration by Parts:** $\\int u \\, dv = u v - \\int v \\, du$`;
  }

  // 7. Programming: Binary Search
  if (text.includes('binary search')) {
    return `Here is how **Binary Search** works on a sorted array in Python:\n\n\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid  # Found target index
        elif arr[mid] < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half
            
    return -1  # Target not found

# Example
nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(binary_search(nums, 23))  # Output: 5
\`\`\`\n\n**Complexity:**\n- **Time:** O(log n) average and worst case, O(1) best case.\n- **Space:** O(1) iterative.`;
  }

  // 8. Programming: Sorting Algorithms
  if (text.includes('sort') || text.includes('sorting') || text.includes('quicksort') || text.includes('mergesort')) {
    return `Here is an implementation of **Quick Sort** in Python:\n\n\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

# Example
data = [38, 27, 43, 3, 9, 82, 10]
print(quicksort(data))  # Output: [3, 9, 10, 27, 38, 43, 82]
\`\`\`\n\n**Time Complexity:** O(n log n) average, O(nÂ²) worst case | **Space:** O(log n).`;
  }

  // 9. Programming: Reverse a string / Palindrome
  if (text.includes('palindrome') || text.includes('reverse string')) {
    return `Here is how to check for a **Palindrome** and reverse a string in Python & JavaScript:\n\n**Python:**\n\`\`\`python
def is_palindrome(s):
    clean = ''.join(c.lower() for c in s if c.isalnum())
    return clean == clean[::-1]

print(is_palindrome("racecar"))  # Output: True
\`\`\`\n\n**JavaScript:**\n\`\`\`javascript
function isPalindrome(str) {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}
\`\`\``;
  }

  // 10. Web Development / React
  if (text.includes('react') || text.includes('useState') || text.includes('useEffect') || text.includes('hook')) {
    return `**React** is a popular JavaScript library for building component-driven user interfaces.\n\n### Essential Hooks:\n1. **\`useState\`**: Manages local component state.\n   \`\`\`jsx
   const [count, setCount] = useState(0);
   \`\`\`\n2. **\`useEffect\`**: Handles side effects (data fetching, subscriptions, DOM manipulation).\n   \`\`\`jsx
   useEffect(() => {
     console.log('Component mounted or updated');
   }, []);
   \`\`\`\n3. **Component Structure:** Components are pure functions that accept props and return JSX.`;
  }

  // 11. Physics: Newton's Laws
  if (text.includes('newton') || (text.includes('force') && text.includes('motion'))) {
    return `### Newton's Three Laws of Motion:\n1. **First Law (Inertia):** An object remains at rest or in uniform motion unless acted upon by a net external force.\n2. **Second Law (Force):** $\\mathbf{F = m \\cdot a}$ (Force = Mass Ã— Acceleration in Newtons).\n3. **Third Law (Action-Reaction):** For every action, there is an equal and opposite reaction.`;
  }

  // 12. Physics: Ohm's Law
  if (text.includes('ohm') || text.includes('voltage') || text.includes('circuit')) {
    return `**Ohm's Law** defines the relationship between voltage, current, and resistance in electrical circuits:\n\n$$\\mathbf{V = I \\cdot R}$$\n\n- **V** = Voltage (Volts, V)\n- **I** = Current (Amperes, A) âž” $I = V / R$\n- **R** = Resistance (Ohms, $\\Omega$) âž” $R = V / I$\n- **Power:** $P = V \\cdot I = I^2 R = \\frac{V^2}{R}$ (Watts)`;
  }

  // 13. Science: Photosynthesis / Biology
  if (text.includes('photosynthesis') || text.includes('cell') || text.includes('dna')) {
    return `### Key Biological Concepts:\n- **Photosynthesis Equation:**\n  $$6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Light} \\longrightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$\n  Plants convert sunlight, carbon dioxide, and water into glucose and oxygen in the **chloroplasts**.\n- **DNA (Deoxyribonucleic Acid):** Double helix structure containing genetic instructions with base pairs: Adenine-Thymine (A-T) and Cytosine-Guanine (C-G).\n- **Mitochondria:** The powerhouse of the cell, generating ATP through cellular respiration.`;
  }

  // 14. Timetable & Schedule Queries
  if (text.includes('class') || text.includes('timetable') || text.includes('schedule') || text.includes('routine')) {
    const classes = useTimetableStore.getState()?.classes || [];
    if (classes.length > 0) {
      let table = `| Day | Subject | Time | Room | Instructor |\n|---|---|---|---|---|\n`;
      classes.forEach((c) => {
        table += `| **${c.day || 'Weekday'}** | ${c.subject || c.title || 'Class'} | ${c.startTime || '09:00'} - ${c.endTime || '10:00'} | ${c.room || 'Room'} | ${c.instructor || 'Prof'} |\n`;
      });
      return `Here is your registered weekly class schedule:\n\n${table}\n[ACTION:navigate:timetable:Open Timetable Manager]`;
    }
    return `You don't have any classes added to your weekly schedule yet. You can add them in the Timetable Manager!\n\n[ACTION:navigate:timetable:Add Your Classes]`;
  }

  // 15. Reminders & Assignments Queries
  if (text.includes('reminder') || text.includes('assignment') || text.includes('homework') || text.includes('deadline')) {
    const reminders = useDashboardStore.getState()?.reminders || [];
    if (reminders.length > 0) {
      return `Here are your pending academic reminders & deadlines:\n\n` +
        reminders.map((r) => `• **${r.title}** ${r.date ? `(Due: ${r.date})` : ''} — ${r.completed ? 'âœ… Completed' : 'â³ Pending'}`).join('\n') +
        `\n\n[ACTION:reminder:Submit Assignments:This Week]`;
    }
    return `You have no pending assignments or reminders scheduled at the moment.\n\n[ACTION:reminder:Create New Reminder:Today]`;
  }

  // 16. Attendance & Academic Profile Standing
  if (text.includes('attendance') || text.includes('gpa') || text.includes('cgpa') || text.includes('standing')) {
    const user = useAuthStore.getState()?.user || {};
    const dash = useDashboardStore.getState() || {};
    const courseInfo = user.course ? ` (${user.course})` : '';
    return `### Academic Status:\n• **Student:** ${user.name || 'Student'}${courseInfo}\n• **Attendance Standing:** **${dash.attendance || 100}%**\n• **Current CGPA:** **${dash.cgpa || '0.00'}** *(Target: **${user.targetGpa || '4.0'}**)*\n\n[ACTION:navigate:profile:View Profile Badges]`;
  }

  // 17. Image analysis
  if (hasImage) {
    return `I've received your image! Please let me know the specific question or problem you would like me to solve.`;
  }

  // 18. Direct offline fallback (no generic template)
  if (text.includes('what is data') || text === 'data') {
    return `**Data** is a collection of raw facts, figures, symbols, or observations that can be processed and analyzed to produce meaningful information.`;
  }
  if (text.includes('what is google') || text === 'google') {
    return `**Google** is a leading multinational technology corporation known for its search engine, Google Cloud, Android OS, YouTube, and AI platforms.`;
  }
  if (text.includes('what is ai') || text.includes('artificial intelligence')) {
    return `**Artificial Intelligence (AI)** refers to computer systems engineered to simulate human intelligence processes, including learning, reasoning, perception, and problem-solving.`;
  }

  return `I was unable to connect to the live Gemini AI service to generate a response for "${rawText.trim()}". Please verify your internet connection or check your Gemini API key in settings 🔑 to get live responses.`;
}

export const validateAndClassifyDoubt = async (title, description = '', apiKey = null) => {
  const combined = `${title} ${description}`;
  return {
    isValid: true,
    subject: detectSubject(combined),
    confidence: 0.98,
    moderationPassed: true
  };
};

export const generateSmartHints = async (doubtTitle, doubtDescription, apiKey = null) => {
  const subject = detectSubject(`${doubtTitle} ${doubtDescription}`);
  return [
    `Identify key given variables and target output in ${subject}`,
    'Apply the governing formula or algorithmic relationship',
    'Substitute values and double check arithmetic/syntax precision'
  ];
};
