/* Tiny HTTP Basic auth helper for admin. Stores credentials in sessionStorage. */
const KEY = 'flareonix_admin_creds';

export const adminSetCreds = (email, password) => {
  sessionStorage.setItem(KEY, JSON.stringify({ email, password }));
};

export const adminGetCreds = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch { return null; }
};

export const adminClear = () => sessionStorage.removeItem(KEY);

export const adminAuthConfig = () => {
  const c = adminGetCreds();
  return c ? { auth: { username: c.email, password: c.password } } : {};
};
