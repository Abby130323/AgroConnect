/**
 * Modelo de Usuario y Roles del Sistema AgroConnect
 */

export const USER_ROLES = {
  ADMIN: 'admin',
  CLIENTE: 'cliente',
  EMPLEADO_INVENTARIO: 'empleado_inventario',
  EMPLEADO_PEDIDOS: 'empleado_pedidos',
  EMPLEADO_ATENCION: 'empleado_atencion',
  GANADERO_PORCINO: 'ganadero_porcino',
  GANADERO_BOVINO: 'ganadero_bovino',
  GANADERO_AVICOLA: 'ganadero_avicola',
  AGRICULTOR: 'agricultor',
};

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrador General',
  [USER_ROLES.CLIENTE]: 'Cliente Consumidor',
  [USER_ROLES.EMPLEADO_INVENTARIO]: 'Especialista en Inventario',
  [USER_ROLES.EMPLEADO_PEDIDOS]: 'Coordinador de Pedidos y Despachos',
  [USER_ROLES.EMPLEADO_ATENCION]: 'Atención al Cliente y Promociones',
  [USER_ROLES.GANADERO_PORCINO]: 'Productor / Ganadero Porcino',
  [USER_ROLES.GANADERO_BOVINO]: 'Productor / Ganadero Bovino',
  [USER_ROLES.GANADERO_AVICOLA]: 'Productor / Ganadero Avícola',
  [USER_ROLES.AGRICULTOR]: 'Productor / Agricultor (Fruver y Huerta)',
};

/**
 * 10 Usuarios Predefinidos para Demostración Académica
 */
export const INITIAL_USERS = [
  // 1. Administrador
  {
    name: 'Administrador',
    email: 'admin@agroconnect.com',
    password: 'Admin123',
    role: USER_ROLES.ADMIN,
    active: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    title: 'Dirección de Operaciones y Plataforma',
  },
  // 2, 3, 4. Clientes
  {
    name: 'Cliente 1',
    email: 'cliente1@agroconnect.com',
    password: 'Cliente123',
    role: USER_ROLES.CLIENTE,
    active: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    title: 'Comprador Frecuente',
    city: 'Medellín, Antioquia',
    address: 'Calle 10 # 43E-20, El Poblado',
    phone: '+57 300 456 7890',
  },
  {
    name: 'Cliente 2',
    email: 'cliente2@agroconnect.com',
    password: 'Cliente123',
    role: USER_ROLES.CLIENTE,
    active: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    title: 'Comprador Institucional',
    city: 'Envigado, Antioquia',
    address: 'Carrera 43A # 25Sur-15',
    phone: '+57 311 234 5678',
  },
  {
    name: 'Cliente 3',
    email: 'cliente3@agroconnect.com',
    password: 'Cliente123',
    role: USER_ROLES.CLIENTE,
    active: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    title: 'Consumidor Familiar',
    city: 'Rionegro, Antioquia',
    address: 'Vereda San Antonio, Casa 4',
    phone: '+57 315 890 1234',
  },
  // 5, 6, 7. Empleados con funciones diferenciadas
  {
    name: 'Empleado 1',
    email: 'empleado1@agroconnect.com',
    password: 'Empleado123',
    role: USER_ROLES.EMPLEADO_INVENTARIO,
    active: true,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    title: 'Gestor de Bodega y Stock',
  },
  {
    name: 'Empleado 2',
    email: 'empleado2@agroconnect.com',
    password: 'Empleado123',
    role: USER_ROLES.EMPLEADO_PEDIDOS,
    active: true,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    title: 'Coordinador de Envíos y Logística',
  },
  {
    name: 'Empleado 3',
    email: 'empleado3@agroconnect.com',
    password: 'Empleado123',
    role: USER_ROLES.EMPLEADO_ATENCION,
    active: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    title: 'Especialista en Soporte y Fidelización',
  },
  // 8, 9, 10. Ganaderos especializados
  {
    name: 'Ganadero porcino',
    email: 'porcino@agroconnect.com',
    password: 'Ganadero123',
    role: USER_ROLES.GANADERO_PORCINO,
    active: true,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    title: 'Granja Porcina La Fértil',
    farmerId: '6',
    specialty: 'Carne de Cerdo y Embutidos',
  },
  {
    name: 'Ganadero bovino',
    email: 'bovino@agroconnect.com',
    password: 'Ganadero123',
    role: USER_ROLES.GANADERO_BOVINO,
    active: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    title: 'Ganadería Los Guayacanes',
    farmerId: '3',
    specialty: 'Carne de Res Madurada',
  },
  {
    name: 'Ganadero avícola',
    email: 'avicola@agroconnect.com',
    password: 'Ganadero123',
    role: USER_ROLES.GANADERO_AVICOLA,
    active: true,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    title: 'Granja Avícola Villa Hermosa',
    farmerId: '4',
    specialty: 'Huevos Campesinos y Aves de Corral',
  },
  // 11. Agricultor Campesino (Fruver, Hortalizas y Tubérculos)
  {
    name: 'Agricultor Don Carlos',
    email: 'agricultor@agroconnect.com',
    password: 'Agricultor123',
    role: USER_ROLES.AGRICULTOR,
    active: true,
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    title: 'Finca El Mirador - Marinilla',
    farmerId: '1',
    specialty: 'Frutas, Verduras y Hortalizas Campesinas (Fruver)',
    city: 'Marinilla, Antioquia',
    address: 'Vereda La Esmeralda, Finca El Mirador',
    phone: '+57 312 458 9012',
  },
];
