import { createApp } from './app';
import { connectDatabase } from './shared/infra/database';
import { env } from './shared/infra/env';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`Servidor a correr em http://localhost:${env.PORT}`);
    console.log(`Documentação Swagger em http://localhost:${env.PORT}/doc`);
  });
}

bootstrap().catch((error) => {
  console.error('Falha ao iniciar o servidor:', error);
  process.exit(1);
});
