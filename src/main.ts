// src/main.ts  → VERSIÓN FINAL QUE FUNCIONA EN RENDER 100%

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ELIMINA TODO EL app.use() que tenías

  // CORS ÚNICO Y CORRECTO (funciona en localhost y Render)
  app.enableCors({
    origin: true, // en producción Render lo ignora y permite todo si no hay credenciales
    // origin: ['http://localhost:3001', 'https://vitaltrack-frontend.onrender.com'], // ← usa esto cuando quieras restringir
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // importante si usas cookies/sesiones
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}

bootstrap();