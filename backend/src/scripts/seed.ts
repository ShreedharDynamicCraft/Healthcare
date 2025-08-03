import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SeedingService } from '../seeding/seeding.service';

async function runSeeding() {
  const logger = new Logger('Seeding');

  try {
    logger.log('🌱 Starting database seeding...');

    const app = await NestFactory.createApplicationContext(AppModule);
    const seedingService = app.get(SeedingService);

    await seedingService.seedAll();

    await app.close();
    logger.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

runSeeding();
