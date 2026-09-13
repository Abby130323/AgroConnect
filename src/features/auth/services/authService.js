import httpClient from '../../../services/http/httpClient.js';
import { API_ENDPOINTS } from '../../../config/api.js';
import { INITIAL_USERS } from '../models/userModel.js';

/**
 * Normaliza un usuario de MockAPI
 */
const normalizeUser = (user) => {
  if (!user) return null;
  return {
    id: String(user.id),
    name: user.name || user.nombre || 'Usuario',
    email: (user.email || user.correo || '').toLowerCase().trim(),
    password: user.password || user.clave || '',
    role: user.role || 'cliente',
    active: user.active ?? (user.estado ?? true),
    avatar: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    title: user.title || '',
    farmerId: user.farmerId ? String(user.farmerId) : null,
    city: user.city || '',
    address: user.address || user.direccion || '',
    phone: user.phone || user.telefono || '',
  };
};

export const authService = {
  /**
   * Obtiene todos los usuarios registrados en MockAPI
   */
  async getUsers() {
    const rawUsers = await httpClient.get(API_ENDPOINTS.USERS);
    return Array.isArray(rawUsers) ? rawUsers.map(normalizeUser) : [];
  },

  /**
   * Obtiene un usuario específico por su ID
   */
  async getUserById(id) {
    const rawUser = await httpClient.get(`${API_ENDPOINTS.USERS}/${id}`);
    return normalizeUser(rawUser);
  },

  /**
   * Autentica credenciales contra los usuarios reales de MockAPI
   */
  async login(email, password) {
    const cleanEmail = String(email || '').toLowerCase().trim();
    const cleanPassword = String(password || '').trim();

    // 1. Consultar usuarios en MockAPI
    const users = await this.getUsers();

    // Si MockAPI no tiene los usuarios sembrados, sembramos automáticamente
    let targetUser = users.find((u) => u.email === cleanEmail);
    if (!targetUser && users.length === 0) {
      await this.seedUsers();
      const freshUsers = await this.getUsers();
      targetUser = freshUsers.find((u) => u.email === cleanEmail);
    }

    if (!targetUser) {
      throw new Error('Credenciales incorrectas. El correo no está registrado en AgroConnect.');
    }

    // 2. Comparar credenciales de demostración académica
    if (targetUser.password !== cleanPassword) {
      throw new Error('Contraseña incorrecta. Verifica e intenta nuevamente.');
    }

    // 3. Verificar estado de la cuenta
    if (!targetUser.active) {
      throw new Error('Tu cuenta se encuentra inactiva. Comunícate con el Administrador.');
    }

    return targetUser;
  },

  /**
   * Registra un nuevo usuario en MockAPI
   */
  async createUser(userData) {
    const payload = {
      name: userData.name,
      nombre: userData.name,
      email: (userData.email || '').toLowerCase().trim(),
      password: userData.password,
      clave: userData.password,
      role: userData.role || 'cliente',
      active: userData.active ?? true,
      estado: userData.active ?? true,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      title: userData.title || '',
      farmerId: userData.farmerId || null,
      city: userData.city || '',
      address: userData.address || '',
      phone: userData.phone || '',
    };
    const created = await httpClient.post(API_ENDPOINTS.USERS, payload);
    return normalizeUser(created);
  },

  /**
   * Actualiza los datos de un usuario en MockAPI
   */
  async updateUser(id, userData) {
    const payload = {
      ...userData,
      nombre: userData.name,
      clave: userData.password,
      estado: userData.active,
    };
    const updated = await httpClient.put(`${API_ENDPOINTS.USERS}/${id}`, payload);
    return normalizeUser(updated);
  },

  /**
   * Siembra controlada: verifica qué usuarios faltan y crea únicamente los ausentes
   */
  async seedUsers() {
    const existingUsers = await this.getUsers();
    const existingEmails = new Set(existingUsers.map((u) => u.email));

    const missingUsers = INITIAL_USERS.filter((u) => !existingEmails.has(u.email.toLowerCase()));

    if (missingUsers.length === 0) {
      return { seededCount: 0, total: existingUsers.length };
    }

    for (const u of missingUsers) {
      await this.createUser(u);
    }

    const finalUsers = await this.getUsers();
    return { seededCount: missingUsers.length, total: finalUsers.length };
  },
};

export default authService;
