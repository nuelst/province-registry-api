import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

export const createMunicipalitySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'O nome deve ter no mínimo 2 caracteres'),
    province: objectIdSchema,
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateMunicipalitySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).optional(),
    province: objectIdSchema.optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

export const municipalityIdParamSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

export const listMunicipalitiesQuerySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    province: objectIdSchema.optional(),
  }),
});
