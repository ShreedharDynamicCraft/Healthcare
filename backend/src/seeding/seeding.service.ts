import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Doctor } from '../doctors/entities/doctor.entity';
import { User, UserRole } from '../auth/entities/user.entity';

@Injectable()
export class SeedingService {
  private readonly logger = new Logger(SeedingService.name);

  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seedDoctors(): Promise<void> {
    const existingDoctors = await this.doctorRepository.count();
    if (existingDoctors > 0) {
      this.logger.log('Doctors already seeded');
      return;
    }

    const specializations = [
      'Sexual Health',
      'Reproductive Health',
      'Gynecology',
      'Urology',
      'Endocrinology',
      'Psychology',
      'Counseling',
      'General Medicine',
    ];

    const genders = ['Male', 'Female', 'Non-binary'];

    const doctors = [];

    // Create specific doctors for sexual well-being clinic
    const specificDoctors = [
      {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@clinic.com',
        specialization: 'Sexual Health',
        experience: 12,
        gender: 'Female',
        phoneNumber: '+1-555-0101',
        about: 'Specialized in sexual wellness and intimate health counseling. Expert in treating sexual dysfunction and relationship therapy.',
        isActive: true,
      },
      {
        firstName: 'Dr. Michael',
        lastName: 'Chen',
        email: 'michael.chen@clinic.com',
        specialization: 'Urology',
        experience: 15,
        gender: 'Male',
        phoneNumber: '+1-555-0102',
        about: 'Board-certified urologist with expertise in male sexual health and reproductive medicine.',
        isActive: true,
      },
      {
        firstName: 'Dr. Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@clinic.com',
        specialization: 'Gynecology',
        experience: 10,
        gender: 'Female',
        phoneNumber: '+1-555-0103',
        about: 'Women\'s health specialist focusing on reproductive health and sexual wellness.',
        isActive: true,
      },
      {
        firstName: 'Dr. Alex',
        lastName: 'Thompson',
        email: 'alex.thompson@clinic.com',
        specialization: 'Psychology',
        experience: 8,
        gender: 'Non-binary',
        phoneNumber: '+1-555-0104',
        about: 'Licensed psychologist specializing in sexual health counseling and LGBTQ+ affirmative therapy.',
        isActive: true,
      },
      {
        firstName: 'Dr. James',
        lastName: 'Williams',
        email: 'james.williams@clinic.com',
        specialization: 'Endocrinology',
        experience: 18,
        gender: 'Male',
        phoneNumber: '+1-555-0105',
        about: 'Hormone specialist with focus on sexual health and hormonal balance affecting intimacy.',
        isActive: true,
      },
    ];

    // Add specific doctors
    doctors.push(...specificDoctors);

    // Generate additional random doctors
    for (let i = 0; i < 10; i++) {
      const gender = faker.helpers.arrayElement(genders);
      const firstName = gender === 'Female' ? faker.person.firstName('female') : 
                       gender === 'Male' ? faker.person.firstName('male') : 
                       faker.person.firstName();
      
      doctors.push({
        firstName: `Dr. ${firstName}`,
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        specialization: faker.helpers.arrayElement(specializations),
        experience: faker.number.int({ min: 2, max: 25 }),
        gender: gender,
        phoneNumber: `+1-555-${faker.string.numeric(4)}`,
        about: faker.lorem.paragraph({ min: 2, max: 4 }),
        isActive: faker.datatype.boolean(0.9), // 90% active
      });
    }

    const savedDoctors = await this.doctorRepository.save(doctors);
    this.logger.log(`Seeded ${savedDoctors.length} doctors`);
  }

  async seedUsers(): Promise<void> {
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 1) { // More than just admin
      this.logger.log('Users already seeded');
      return;
    }

    const users = [];

    // Create staff users
    const staffUsers = [
      {
        email: 'receptionist@clinic.com',
        password: 'Staff123!',
        firstName: 'Jane',
        lastName: 'Smith',
        role: UserRole.STAFF,
        department: 'Reception',
        phoneNumber: '+1-555-0201',
        isActive: true,
      },
      {
        email: 'nurse@clinic.com',
        password: 'Staff123!',
        firstName: 'Robert',
        lastName: 'Brown',
        role: UserRole.STAFF,
        department: 'Nursing',
        phoneNumber: '+1-555-0202',
        isActive: true,
      },
      {
        email: 'coordinator@clinic.com',
        password: 'Staff123!',
        firstName: 'Lisa',
        lastName: 'Davis',
        role: UserRole.STAFF,
        department: 'Patient Coordination',
        phoneNumber: '+1-555-0203',
        isActive: true,
      },
    ];

    users.push(...staffUsers);

    // Generate additional staff
    for (let i = 0; i < 5; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      
      users.push({
        email: faker.internet.email({ firstName, lastName }),
        password: 'Staff123!',
        firstName,
        lastName,
        role: UserRole.STAFF,
        department: faker.helpers.arrayElement([
          'Reception', 'Nursing', 'Administration', 'Patient Care', 'Billing'
        ]),
        phoneNumber: `+1-555-${faker.string.numeric(4)}`,
        isActive: faker.datatype.boolean(0.95), // 95% active
      });
    }

    const savedUsers = await this.userRepository.save(users);
    this.logger.log(`Seeded ${savedUsers.length} users`);
  }

  async seedAll(): Promise<void> {
    this.logger.log('Starting database seeding...');
    
    try {
      await this.seedDoctors();
      await this.seedUsers();
      
      this.logger.log('Database seeding completed successfully!');
    } catch (error) {
      this.logger.error('Database seeding failed:', error);
      throw error;
    }
  }
}
