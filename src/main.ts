// src/main.ts → VERSIÓN QUE FUNCIONA EN RENDER AL 100% (2025)

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'; // ← IMPORTANTE: usar el middleware directamente

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // FORZAR CORS CON MIDDLEWARE DIRECTO (esto sí funciona en Render)
  app.use(
    cors({
      origin: true, // permite todo en desarrollo
      // origin: ['http://localhost:3001', 'https://vitaltrack-frontend.onrender.com'],
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true,
    })
  );

  // También puedes usar app.enableCors() como respaldo
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Servidor corriendo en puerto ${port}`);
}

bootstrap();