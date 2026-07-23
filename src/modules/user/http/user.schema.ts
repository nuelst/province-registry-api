import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');
const roleSchema = z.enum(['admin', 'user']);

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'O nome deve ter no mínimo 2 caracteres'),
    email: z.string().trim().email('Email inválido'),
    password: z.string().min(6, 'A password deve ter no mínimo 6 caracteres'),
    province: objectIdSchema,
    municipality: objectIdSchema,
    role: roleSchema.optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).optional(),
    email: z.string().trim().email().optional(),
    password: z.string().min(6).optional(),
    province: objectIdSchema.optional(),
    municipality: objectIdSchema.optional(),
    role: roleSchema.optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

export const userIdParamSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});
