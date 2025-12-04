// src/main.ts → VERSIÓN QUE SÍ FUNCIONA EN RENDER CON PATCH, DELETE, etc.

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS QUE FUNCIONA EN LOCALHOST Y EN RENDER (PROBADO)
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (como Postman, herramientas, etc.)
      if (!origin) return callback(null, true);

      // Lista blanca de orígenes permitidos
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://vitaltrack-frontend.onrender.com',     // ← tu frontend en Render
        'https://vitaltrack.netlify.app',               // ← si usas Netlify
        'https://tu-dominio.com',                       // ← cuando tengas dominio
      ];

      if (allowedOrigins.includes(origin) || origin.includes('localhost')) {
        callback(null, true);
      } else {
        console.log('CORS bloqueado desde:', origin);
        callback(new Error('No permitido por CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
}

bootstrap();