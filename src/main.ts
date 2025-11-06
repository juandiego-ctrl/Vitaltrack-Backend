import { NestFactory } from '@nestjs/core'; // Importacion libreria clase 
import { AppModule } from './app.module'; //importanción de una clase perteneciente al proyecto

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
