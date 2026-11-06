import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    })
  : null;

/**
 * Authentic Supabase Authentication & Profile Service
 * All identities originate directly from Supabase Auth & Google OAuth.
 */
export const supabaseAuthService = {
  // 1. Sign In with Google OAuth (Official Google Account Chooser & Auth flow)
  async signInWithGoogle() {
    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
      );
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          prompt: 'select_account',
          access_type: 'offline'
        }
      }
    });

    if (error) {
      throw error;
    }

    return data;
  },

  // 2. Sign In with Email & Password
  async signInWithEmail(email, password) {
    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
      );
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });

    if (error) {
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('invalid login credentials')) {
        throw new Error('Invalid email or password. If you haven\'t created an account yet, please click "Sign Up" below.');
      }
      if (msg.includes('email not confirmed')) {
        throw new Error('Your email is not confirmed yet. Please check your inbox or spam folder for the confirmation link.');
      }
      throw error;
    }

    return data;
  },

  // 3. Sign Up with Email & Password
  async signUpWithEmail(email, password, metadata = {}) {
    if (!supabase) {
      throw new Error(
        'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
      );
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: metadata.name || metadata.fullName || 'Student',
          institution: metadata.institution || '',
          course: metadata.course || ''
        }
      }
    });

    if (error) {
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('user already registered')) {
        throw new Error('An account with this email already exists. Please Sign In or use Forgot Password.');
      }
      throw error;
    }

    return data;
  },

  // 4. Send Email OTP for Password Reset (Recovery Flow)
  async sendPasswordResetOtp(email) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please check your connection.');
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    // Sends recovery OTP to user's registered email
    const { data, error } = await supabase.auth.resetPasswordForEmail(cleanEmail);

    if (error) {
      // If error mentions signup not allowed or user not found
      if (error.message?.toLowerCase().includes('signups not allowed') || error.message?.toLowerCase().includes('user not found')) {
        throw new Error('No registered account found with this email. Please check the spelling or sign up first.');
      }
      throw error;
    }

    return data;
  },

  // 5. Verify 6-digit Recovery OTP
  async verifyOtp(email, token) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please check your connection.');
    }

    const cleanEmail = (email || '').trim().toLowerCase();
    // For password reset, Supabase expects type: 'recovery'
    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: token.trim(),
      type: 'recovery'
    });

    if (error) {
      // Attempt fallback with type: 'email'
      const fallback = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token: token.trim(),
        type: 'email'
      });
      if (fallback.error) {
        throw error;
      }
      return fallback.data;
    }

    return data;
  },

  // 6. Update User Password (after OTP verification)
  async updatePassword(newPassword) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please check your connection.');
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }

    return data;
  },

  // 7. Get Current Authenticated Session
  async getSession() {
    if (!supabase) return null;
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // 5. Get Authenticated User
  async getUser() {
    if (!supabase) return null;
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  // 6. Sign Out
  async signOut() {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn('Error during Supabase sign out:', error.message);
      }
    }
  },

  // 7. Get User Profile from Database (Strict User-Data Ownership Verification)
  async getUserProfile(userId) {
    if (!supabase || !userId) return null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id !== userId) {
        throw new Error('Unauthorized: You can only access your own profile.');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Supabase profile fetch notice:', error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn('Error fetching Supabase profile:', err);
      return null;
    }
  },

  // 8. Save/Upsert Profile in Supabase Database (Strict User-Data Ownership Verification)
  async saveUserProfile(userId, profileData) {
    if (!supabase || !userId) return null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.id !== userId) {
        throw new Error('Unauthorized: You can only update your own profile.');
      }

      const payload = {
        id: userId,
        full_name: profileData.name || profileData.full_name || '',
        email: profileData.email || '',
        avatar_url: profileData.avatar || profileData.avatar_url || '',
        phone: profileData.phone || '',
        institution: profileData.institution || '',
        course: profileData.course || '',
        student_id: profileData.studentId || profileData.student_id || '',
        academic_year: profileData.academicYear || profileData.academic_year || '',
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.warn('Supabase profile upsert notice:', error.message);
      }
      return data;
    } catch (err) {
      console.warn('Error saving Supabase profile:', err);
      return null;
    }
  }
};
