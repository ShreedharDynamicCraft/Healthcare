import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Compression middleware
  app.use(compression());

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS configuration
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages:
        configService.get<string>('NODE_ENV') === 'production',
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Clinic Front Desk API')
    .setDescription(
      `
      🏥 **Sexual Well-being Clinic Front Desk Management System**
      
      A comprehensive API for managing clinic front desk operations including:
      - 👥 **Authentication & User Management**: Secure login, role-based access
      - 📅 **Appointment Management**: Book, reschedule, cancel appointments
      - 👨‍⚕️ **Doctor Management**: Manage doctor profiles, specializations
      - 📋 **Queue Management**: Real-time patient queue with priority handling
      - 📊 **Analytics**: Dashboard with appointment statistics
      
      **Security Features:**
      - JWT authentication with secure token handling
      - Account lockout after failed login attempts
      - Role-based authorization (Admin/Staff)
      - Input validation and sanitization
      
      **Default Admin Credentials:**
      - Email: admin@clinic.com
      - Password: AdminPass123!
    `,
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Users', 'User management operations')
    .addTag('Doctors', 'Doctor profile management')
    .addTag('Appointments', 'Appointment booking and management')
    .addTag('Queue', 'Patient queue management')
    .addTag('Health', 'Application health checks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
    },
    customSiteTitle: 'Clinic Front Desk API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info hgroup.main h2 { color: #4f46e5; }
      .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
    `,
  });

  const port = configService.get<number>('PORT', 3001);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  await app.listen(port, '0.0.0.0');

  // Create default admin user
  try {
    const authService = app.get(AuthService);
    await authService.createDefaultAdmin();
  } catch (error) {
    logger.error('Failed to create default admin user:', error);
  }

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  logger.log(`🏥 Health Check: http://localhost:${port}/api/v1/health`);
  logger.log(`🔧 Environment: ${nodeEnv}`);
  logger.log(
    `🌐 CORS Origin: ${configService.get<string>('CORS_ORIGIN', 'http://localhost:3000')}`,
  );
}

bootstrap();
