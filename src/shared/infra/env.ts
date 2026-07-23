import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().min(1, 'MONGO_URI é obrigatório'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET deve ter no mínimo 8 caracteres'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  APP_URL: z.string().url('APP_URL deve ser uma URL válida').optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variáveis de ambiente inválidas:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export const baseUrl = env.APP_URL ?? `http://localhost:${env.PORT}`;
