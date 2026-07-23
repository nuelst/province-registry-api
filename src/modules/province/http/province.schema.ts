import { z } from 'zod';
import { MAX_LIMIT } from '../../../shared/utils/pagination';

const pageSchema = z.coerce.number().int().min(1).optional();
const limitSchema = z.coerce.number().int().min(1).max(MAX_LIMIT).optional();

export const createProvinceSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const updateProvinceSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

export const provinceIdParamSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1),
  }),
  query: z.object({}).optional(),
});

export const listProvincesQuerySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    name: z.string().trim().min(1).optional(),
    page: pageSchema,
    limit: limitSchema,
  }),
});
