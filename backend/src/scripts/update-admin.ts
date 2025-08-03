import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

async function updateAdminPassword() {
  const logger = new Logger('UpdateAdmin');

  try {
    logger.log('🔧 Starting admin password update...');

    const app = await NestFactory.createApplicationContext(AppModule);
    const userRepository = app.get<Repository<User>>(getRepositoryToken(User));

    // Find the admin user
    const admin = await userRepository.findOne({
      where: { email: 'admin@clinic.com' },
    });

    if (!admin) {
      logger.log('❌ Admin user not found, creating new admin...');
      
      // Create new admin with correct password
      const newAdmin = userRepository.create({
        email: 'admin@clinic.com',
        password: 'AdminPass123!',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin' as any,
        department: 'Administration',
        isActive: true,
      });

      await userRepository.save(newAdmin);
      logger.log('✅ New admin user created with email: admin@clinic.com');
    } else {
      logger.log('👤 Admin user found, updating password...');
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash('AdminPass123!', 12);
      
      // Update the admin user
      await userRepository.update(admin.id, {
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
      });
      
      logger.log('✅ Admin password updated successfully!');
    }

    await app.close();
    
    logger.log('🎉 Admin update completed!');
    logger.log('📧 Email: admin@clinic.com');
    logger.log('🔐 Password: AdminPass123!');
    
    process.exit(0);
  } catch (error) {
    logger.error('❌ Admin update failed:', error);
    process.exit(1);
  }
}

updateAdminPassword();
