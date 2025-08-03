import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { QueueItem } from '../queue/entities/queue-item.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseUrl = this.configService.get<string>('DATABASE_URL');
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');

    // Use PostgreSQL if DATABASE_URL is provided, otherwise fallback to SQLite
    if (databaseUrl && databaseUrl.length > 0) {
      // PostgreSQL configuration
      return {
        type: 'postgres',
        url: databaseUrl,
        entities: [User, Doctor, Appointment, QueueItem],
        synchronize: nodeEnv === 'development', // Only sync in development
        migrationsRun: nodeEnv === 'production', // Run migrations in production
        logging: nodeEnv === 'development',
        ssl: {
          rejectUnauthorized: false,
        },
      };
    }

    // SQLite fallback for local development without DATABASE_URL
    return {
      type: 'sqlite',
      database: 'data/clinic.db',
      entities: [User, Doctor, Appointment, QueueItem],
      synchronize: true,
      logging: nodeEnv === 'development',
    };
  }
}
