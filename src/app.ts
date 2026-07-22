import cors from 'cors';
import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { authRoutes } from './modules/auth/http/auth.routes';
import { municipalityRoutes } from './modules/municipality/http/municipality.routes';
import { provinceRoutes } from './modules/province/http/province.routes';
import { userRoutes } from './modules/user/http/user.routes';
import { env } from './shared/infra/env';
import { swaggerSpec } from './shared/infra/swagger';
import { errorHandlerMiddleware } from './shared/middlewares/error-handler.middleware';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  if (env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/provinces', provinceRoutes);
  app.use('/api/municipalities', municipalityRoutes);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Rota não encontrada' });
  });

  app.use((err: unknown, req: Request, res: Response, next: NextFunction) =>
    errorHandlerMiddleware(err, req, res, next),
  );

  return app;
}
