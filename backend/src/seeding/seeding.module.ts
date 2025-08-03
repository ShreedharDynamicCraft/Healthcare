import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedingService } from './seeding.service';
import { Doctor } from '../doctors/entities/doctor.entity';
import { User } from '../auth/entities/user.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { QueueItem } from '../queue/entities/queue-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, User, Appointment, QueueItem])],
  providers: [SeedingService],
  exports: [SeedingService],
})
export class SeedingModule {}
