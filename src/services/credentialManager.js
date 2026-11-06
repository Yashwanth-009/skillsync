/**
 * Google Password Manager & Browser Credential Management API Integration
 * Prompts Google Password Manager / Browser Keychain to save and update credentials.
 */

export const credentialManager = {
  // Save credentials to Google Password Manager
  async saveCredentials(email, password, name = '', formElement = null) {
    if (typeof window === 'undefined' || !navigator.credentials) return;

    try {
      if (window.PasswordCredential) {
        let cred = null;
        if (formElement && formElement instanceof HTMLFormElement) {
          try {
            cred = new window.PasswordCredential(formElement);
          } catch (e) {
            // fallback to object constructor
          }
        }

        if (!cred && email && password) {
          cred = new window.PasswordCredential({
            id: email.trim(),
            password: password,
            name: name ? name.trim() : email.trim(),
            iconURL: `${window.location.origin}/logo.svg`
          });
        }

        if (cred) {
          await navigator.credentials.store(cred);
        }
      }
    } catch (err) {
      // Silent handling of non-HTTPS or user dismissed prompt
      console.debug('Google Password Manager notice:', err);
    }
  },

  // Prevent auto-prompts from blocking
  async preventSilentAccess() {
    if (typeof window !== 'undefined' && navigator.credentials?.preventSilentAccess) {
      try {
        await navigator.credentials.preventSilentAccess();
      } catch (e) {
        // ignore
      }
    }
  }
};

export default credentialManager;
