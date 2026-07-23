import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Email inválido'),
    password: z.string().min(1, 'Password é obrigatória'),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'O nome deve ter no mínimo 2 caracteres'),
    email: z.string().trim().email('Email inválido'),
    password: z.string().min(6, 'A password deve ter no mínimo 6 caracteres'),
    province: objectIdSchema,
    municipality: objectIdSchema,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});
