import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';

let app: any;

async function createApp() {
  if (!app) {
    app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    // Enable CORS for universal access
    app.enableCors({
      origin: '*', // Allow all origins
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
      preflightContinue: false,
      optionsSuccessStatus: 204
    });

    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));

    // Global filters and interceptors
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(
      new LoggingInterceptor(),
      new ResponseInterceptor()
    );

    // API prefix
    app.setGlobalPrefix('api/v1');

    // Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('Healthcare Management API')
      .setDescription('Complete clinic management system API with authentication, appointments, and queue management')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('doctors', 'Doctor management')
      .addTag('appointments', 'Appointment scheduling')
      .addTag('queue', 'Patient queue management')
      .addTag('health', 'Health check endpoints')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      customSiteTitle: 'Healthcare API Documentation',
      customfavIcon: 'https://www.allohealth.com/assets/lovable-uploads/allo-logo-v1.svg',
      customCss: '.swagger-ui .topbar { display: none }',
    });

    await app.init();
  }
  return app;
}

export default async function handler(req: any, res: any) {
  try {
    // Handle root path with welcome message
    if (req.url === '/' || req.url === '') {
      return res.status(200).json({
        success: true,
        message: '🏥 Healthcare Management API is running successfully!',
        version: '1.0.0',
        status: 'online',
        timestamp: new Date().toISOString(),
        endpoints: {
          'API Base': '/api/v1',
          'Documentation': '/api/docs',
          'Health Check': '/api/v1/health',
          'Authentication': '/api/v1/auth',
          'Appointments': '/api/v1/appointments',
          'Doctors': '/api/v1/doctors',
          'Queue': '/api/v1/queue'
        },
        documentation: 'Visit /api/docs for complete API documentation'
      });
    }

    const app = await createApp();
    const httpAdapter = app.getHttpAdapter();
    const instance = httpAdapter.getInstance();
    
    // Handle the request
    return instance(req, res);
  } catch (error: any) {
    console.error('Vercel handler error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'Something went wrong',
    });
  }
}
