import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty('El correo electrónico es obligatorio')
    .email('Ingresa un formato de correo electrónico válido (ejemplo@agroconnect.com)'),
  password: z
    .string()
    .nonempty('La contraseña es obligatoria')
    .min(6, 'La contraseña debe contener al menos 6 caracteres'),
});
