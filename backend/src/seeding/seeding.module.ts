import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedingService } from './seeding.service';
import { Doctor } from '../doctors/entities/doctor.entity';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor, User]),
  ],
  providers: [SeedingService],
  exports: [SeedingService],
})
export class SeedingModule {}
