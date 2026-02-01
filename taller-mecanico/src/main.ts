import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Taller Mecánico API')
    .setDescription('API para la gestión del taller mecánico')
    .setVersion('1.0')
    .addBearerAuth() // Permitir autenticación con JWT en Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new LoggingInterceptor());

  if (process.env.RUN_SEED === 'true') {
    const seedService = app.get(SeedService);
    console.log('RUNNING SEED...');
    await seedService.runSeed();
    console.log('SEED FINISHED');
  }

  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
