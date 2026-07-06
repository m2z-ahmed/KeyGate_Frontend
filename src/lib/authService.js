const AUTH_STORAGE_KEY = 'app_auth_state';

const getStoredAuth = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveAuth = (authState) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  } catch {
    // ignore
  }
};

const clearAuth = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
};

const makeUser = (email) => ({
  email,
  name: email?.split('@')[0] || 'User',
  role: email === 'admin@example.com' ? 'admin' : 'user',
});

const auth = {
  auth: {
    isAuthenticated: async () => {
      return !!getStoredAuth()?.token;
    },

    me: async () => {
      const stored = getStoredAuth();
      if (!stored?.token) {
        const err = new Error('Not authenticated');
        err.status = 401;
        throw err;
      }
      return stored.user;
    },

    logout: (redirectUrl) => {
      clearAuth();
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },

    redirectToLogin: (url) => {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },

    loginViaEmailPassword: async (email) => {
      const user = makeUser(email);
      saveAuth({ token: `demo-token-${Date.now()}`, user });
      return { user };
    },

    loginWithProvider: (provider, redirect) => {
      const user = makeUser(`${provider}@example.com`);
      saveAuth({ token: `demo-token-${Date.now()}`, user });
      if (redirect) {
        window.location.href = redirect;
      }
    },

    resetPasswordRequest: async () => {
      return { success: true };
    },

    register: async ({ email }) => {
      const user = makeUser(email);
      saveAuth({ token: `demo-token-${Date.now()}`, user });
      return { user };
    },

    verifyOtp: async ({ email }) => {
      const user = makeUser(email);
      const token = `demo-token-${Date.now()}`;
      saveAuth({ token, user });
      return { access_token: token };
    },

    setToken: (token) => {
      const stored = getStoredAuth() || {};
      saveAuth({ ...stored, token });
    },

    resendOtp: async () => {
      return { success: true };
    },

    resetPassword: async () => {
      return { success: true };
    },
  },
  entities: new Proxy({}, {
    get: () => ({
      filter: async () => [],
      get: async () => null,
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    }),
  }),
  integrations: {
    Core: {
      UploadFile: async () => ({ file_url: '' }),
    },
  },
};

export const db = auth;
export default db;
