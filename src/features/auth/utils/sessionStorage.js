/**
 * Almacenamiento seguro de sesión de usuario en localStorage
 * Guarda exclusivamente información mínima requerida para rehidratación
 */

const SESSION_KEY = 'agroconnect_session_v1';

export const saveSession = (user) => {
  if (!user) return;
  const sessionData = {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    farmerId: user.farmerId || null,
    avatar: user.avatar || null,
    active: user.active ?? true,
  };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } catch (err) {
    console.error('Error al persistir sesión en localStorage:', err);
  }
};

export const getSession = () => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error al recuperar sesión de localStorage:', err);
    return null;
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error('Error al limpiar sesión de localStorage:', err);
  }
};
