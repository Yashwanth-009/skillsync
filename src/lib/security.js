/**
 * Security & Data Protection Utilities
 * Implements PBKDF2 Password Hashing, HTML/XSS Sanitization, and Client-Side Rate Limiting
 */

// 1. Cryptographically Secure Password Hashing (PBKDF2 via Web Crypto API)
export async function hashPassword(password, salt = 'SkillSync_Salt_2026') {
  if (!password) return '';
  const enc = new TextEncoder();
  try {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    const derivedKey = await window.crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: enc.encode(salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    return Array.from(new Uint8Array(derivedKey))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (err) {
    // Fallback SHA-256 if PBKDF2 is unsupported
    const data = enc.encode(`${salt}:${password}`);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

export async function verifyPassword(password, storedHash, salt = 'SkillSync_Salt_2026') {
  if (!password || !storedHash) return false;
  // If storedHash is already a PBKDF2 / SHA-256 hex string (length 64)
  if (storedHash.length === 64) {
    const computed = await hashPassword(password, salt);
    return computed === storedHash;
  }
  // Legacy migration check: if stored was unhashed plaintext
  if (storedHash === password) {
    return true;
  }
  return false;
}

// 2. Strict Input & XSS Sanitization
export function sanitizeInput(value) {
  if (typeof value !== 'string') return value;
  
  return value
    // Remove script tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove iframe, embed, object
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Strip dangerous inline event handlers (e.g. onload=, onerror=, onclick=)
    .replace(/\s*on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    // Strip javascript: pseudo-protocols
    .replace(/javascript\s*:/gi, '')
    // Escape essential HTML entities to block reflected XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase().replace(/[^\w.@+-]/g, '');
}

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }
  const result = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      result[key] = sanitizeInput(val);
    } else if (typeof val === 'object' && val !== null) {
      result[key] = sanitizeObject(val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

// 3. Sliding-Window Rate Limiter
class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  isAllowed(key = 'global') {
    const now = Date.now();
    const timestamps = (this.attempts.get(key) || []).filter((t) => now - t < this.windowMs);
    
    if (timestamps.length >= this.maxAttempts) {
      const oldest = timestamps[0];
      const waitSeconds = Math.max(1, Math.ceil((this.windowMs - (now - oldest)) / 1000));
      return { allowed: false, waitSeconds };
    }

    timestamps.push(now);
    this.attempts.set(key, timestamps);
    return { allowed: true, waitSeconds: 0 };
  }

  reset(key = 'global') {
    this.attempts.delete(key);
  }
}

// Export pre-configured limiters:
// - Auth: 5 attempts per 60s per user identifier
// - AI: 15 requests per 60s
export const authRateLimiter = new RateLimiter(5, 60000);
export const aiRateLimiter = new RateLimiter(15, 60000);

// 4. Safe Arithmetic Expression Evaluator (Zero eval() or new Function())
export function safeEvalMath(expr) {
  if (typeof expr !== 'string') return null;
  const clean = expr.replace(/\s+/g, '').replace(/=/g, '').replace(/\?/g, '');
  if (!clean || !/^[\d+\-*/().]+$/.test(clean)) return null;

  let pos = 0;
  function peek() { return clean[pos]; }
  function get() { return clean[pos++]; }

  function parseFactor() {
    if (peek() === '(') {
      get();
      const val = parseExpression();
      if (peek() === ')') get();
      return val;
    }
    let start = pos;
    if (peek() === '-') get();
    while (pos < clean.length && (/[\d.]/).test(peek())) get();
    const str = clean.slice(start, pos);
    const n = parseFloat(str);
    return isNaN(n) ? null : n;
  }

  function parseTerm() {
    let val = parseFactor();
    if (val === null) return null;
    while (pos < clean.length) {
      if (peek() === '*') {
        get();
        const next = parseFactor();
        if (next === null) return null;
        val *= next;
      } else if (peek() === '/') {
        get();
        const next = parseFactor();
        if (next === null || next === 0) return null;
        val /= next;
      } else {
        break;
      }
    }
    return val;
  }

  function parseExpression() {
    let val = parseTerm();
    if (val === null) return null;
    while (pos < clean.length) {
      if (peek() === '+') {
        get();
        const next = parseTerm();
        if (next === null) return null;
        val += next;
      } else if (peek() === '-') {
        get();
        const next = parseTerm();
        if (next === null) return null;
        val -= next;
      } else {
        break;
      }
    }
    return val;
  }

  try {
    const res = parseExpression();
    return (pos === clean.length && typeof res === 'number' && !isNaN(res)) ? res : null;
  } catch {
    return null;
  }
}


