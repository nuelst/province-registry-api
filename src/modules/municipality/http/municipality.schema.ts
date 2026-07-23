import { z } from 'zod';
import { MAX_LIMIT } from '../../../shared/utils/pagination';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');
const pageSchema = z.coerce.number().int().min(1).optional();
const limitSchema = z.coerce.number().int().min(1).max(MAX_LIMIT).optional();

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
    name: z.string().trim().min(1).optional(),
    page: pageSchema,
    limit: limitSchema,
  }),
});
