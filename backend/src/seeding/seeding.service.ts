import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Doctor, DoctorSpecialization, DoctorGender } from '../doctors/entities/doctor.entity';
import { User, UserRole } from '../auth/entities/user.entity';
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
} from '../appointments/entities/appointment.entity';
import {
  QueueItem,
  QueueStatus,
  QueuePriority,
} from '../queue/entities/queue-item.entity';

@Injectable()
export class SeedingService {
  private readonly logger = new Logger(SeedingService.name);

  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(QueueItem)
    private queueRepository: Repository<QueueItem>,
  ) {}

  async seedDoctors(): Promise<void> {
    const existingDoctors = await this.doctorRepository.count();
    if (existingDoctors > 0) {
      this.logger.log('Doctors already seeded');
      return;
    }

    const specializations = Object.values(DoctorSpecialization);
    const genders = Object.values(DoctorGender);

    // Standard availability schedule
    const standardAvailability = {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '10:00', end: '14:00', available: true },
      sunday: { start: '00:00', end: '00:00', available: false },
    };

    const doctors = [];

    // Create specific doctors for sexual well-being clinic
    const specificDoctors = [
      {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@clinic.com',
        specialization: DoctorSpecialization.INTIMATE_HEALTH,
        experience: 12,
        gender: DoctorGender.FEMALE,
        phone: '+1-555-0101',
        location: 'New York, NY',
        availability: standardAvailability,
        about:
          'Specialized in sexual wellness and intimate health counseling. Expert in treating sexual dysfunction and relationship therapy.',
        isActive: true,
      },
      {
        firstName: 'Dr. Michael',
        lastName: 'Chen',
        email: 'michael.chen@clinic.com',
        specialization: DoctorSpecialization.MENS_HEALTH,
        experience: 15,
        gender: DoctorGender.MALE,
        phone: '+1-555-0102',
        location: 'Los Angeles, CA',
        availability: standardAvailability,
        about:
          'Board-certified urologist with expertise in male sexual health and reproductive medicine.',
        isActive: true,
      },
      {
        firstName: 'Dr. Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@clinic.com',
        specialization: DoctorSpecialization.WOMENS_HEALTH,
        experience: 10,
        gender: DoctorGender.FEMALE,
        phone: '+1-555-0103',
        location: 'Chicago, IL',
        availability: standardAvailability,
        about:
          "Women's health specialist focusing on reproductive health and sexual wellness.",
        isActive: true,
      },
      {
        firstName: 'Dr. Alex',
        lastName: 'Thompson',
        email: 'alex.thompson@clinic.com',
        specialization: DoctorSpecialization.RELATIONSHIP_THERAPY,
        experience: 8,
        gender: DoctorGender.OTHER,
        phone: '+1-555-0104',
        location: 'San Francisco, CA',
        availability: standardAvailability,
        about:
          'Licensed psychologist specializing in sexual health counseling and LGBTQ+ affirmative therapy.',
        isActive: true,
      },
      {
        firstName: 'Dr. James',
        lastName: 'Williams',
        email: 'james.williams@clinic.com',
        specialization: DoctorSpecialization.HORMONAL_HEALTH,
        experience: 18,
        gender: DoctorGender.MALE,
        phone: '+1-555-0105',
        location: 'Boston, MA',
        availability: standardAvailability,
        about:
          'Hormone specialist with focus on sexual health and hormonal balance affecting intimacy.',
        isActive: true,
      },
    ];

    // Add specific doctors
    doctors.push(...specificDoctors);

    // Generate additional random doctors
    for (let i = 0; i < 10; i++) {
      const gender = faker.helpers.arrayElement(genders);
      const firstName =
        gender === DoctorGender.FEMALE
          ? faker.person.firstName('female')
          : gender === DoctorGender.MALE
            ? faker.person.firstName('male')
            : faker.person.firstName();

      doctors.push({
        firstName: `Dr. ${firstName}`,
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        specialization: faker.helpers.arrayElement(specializations),
        experience: faker.number.int({ min: 2, max: 25 }),
        gender: gender,
        phone: `+1-555-${faker.string.numeric(4)}`,
        location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
        availability: standardAvailability,
        about: faker.lorem.paragraph({ min: 2, max: 4 }),
        isActive: faker.datatype.boolean(0.9), // 90% active
      });
    }

    const savedDoctors = await this.doctorRepository.save(doctors);
    this.logger.log(`Seeded ${savedDoctors.length} doctors`);
  }

  async seedUsers(): Promise<void> {
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 1) {
      // More than just admin
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
          'Reception',
          'Nursing',
          'Administration',
          'Patient Care',
          'Billing',
        ]),
        phoneNumber: `+1-555-${faker.string.numeric(4)}`,
        isActive: faker.datatype.boolean(0.95), // 95% active
      });
    }

    const savedUsers = await this.userRepository.save(users);
    this.logger.log(`Seeded ${savedUsers.length} users`);
  }

  async seedIndianPatients(): Promise<void> {
    const existingAppointments = await this.appointmentRepository.count();
    if (existingAppointments > 0) {
      this.logger.log('Indian patient records already seeded');
      return;
    }

    // Get all doctors to assign appointments
    const doctors = await this.doctorRepository.find();
    if (doctors.length === 0) {
      this.logger.warn('No doctors found, seeding doctors first');
      await this.seedDoctors();
      const newDoctors = await this.doctorRepository.find();
      doctors.push(...newDoctors);
    }

    // Indian patient data with diverse locations
    const indianPatients = [
      {
        patientName: 'Rajesh Kumar Sharma',
        patientPhone: '+91-9876543210',
        patientEmail: 'rajesh.sharma@gmail.com',
        address: 'Connaught Place, New Delhi, Delhi',
        symptoms: 'General wellness consultation',
        type: AppointmentType.CONSULTATION,
        priority: QueuePriority.NORMAL,
      },
      {
        patientName: 'Priya Nair',
        patientPhone: '+91-9123456789',
        patientEmail: 'priya.nair@gmail.com',
        address: 'Marine Drive, Mumbai, Maharashtra',
        symptoms: 'Reproductive health concerns',
        type: AppointmentType.SPECIALIST_VISIT,
        priority: QueuePriority.NORMAL,
      },
      {
        patientName: 'Arjun Patel',
        patientPhone: '+91-9234567890',
        patientEmail: 'arjun.patel@yahoo.com',
        address: 'Satellite, Ahmedabad, Gujarat',
        symptoms: 'Stress and anxiety related issues',
        type: AppointmentType.CONSULTATION,
        priority: QueuePriority.URGENT,
      },
      {
        patientName: 'Meera Reddy',
        patientPhone: '+91-9345678901',
        patientEmail: 'meera.reddy@hotmail.com',
        address: 'Banjara Hills, Hyderabad, Telangana',
        symptoms: 'Hormonal imbalance consultation',
        type: AppointmentType.FOLLOW_UP,
        priority: QueuePriority.NORMAL,
      },
      {
        patientName: 'Vikram Singh',
        patientPhone: '+91-9456789012',
        patientEmail: 'vikram.singh@gmail.com',
        address: 'Civil Lines, Jaipur, Rajasthan',
        symptoms: 'Male health concerns',
        type: AppointmentType.CONSULTATION,
        priority: QueuePriority.NORMAL,
      },
      {
        patientName: 'Deepika Iyer',
        patientPhone: '+91-9567890123',
        patientEmail: 'deepika.iyer@gmail.com',
        address: 'Koramangala, Bangalore, Karnataka',
        symptoms: 'Relationship counseling needed',
        type: AppointmentType.CONSULTATION,
        priority: QueuePriority.NORMAL,
      },
      {
        patientName: 'Amit Ghosh',
        patientPhone: '+91-9678901234',
        patientEmail: 'amit.ghosh@rediffmail.com',
        address: 'Salt Lake, Kolkata, West Bengal',
        symptoms: 'Sexual health education',
        type: AppointmentType.ROUTINE_CHECKUP,
        priority: QueuePriority.NORMAL,
      },
      {
        patientName: 'Kavya Menon',
        patientPhone: '+91-9789012345',
        patientEmail: 'kavya.menon@gmail.com',
        address: 'Fort Kochi, Kochi, Kerala',
        symptoms: 'Pre-marital counseling',
        type: AppointmentType.CONSULTATION,
        priority: QueuePriority.NORMAL,
      },
      {
        patientName: 'Rohit Gupta',
        patientPhone: '+91-9890123456',
        patientEmail: 'rohit.gupta@outlook.com',
        address: 'Sector 17, Chandigarh, Punjab',
        symptoms: 'Performance anxiety consultation',
        type: AppointmentType.SPECIALIST_VISIT,
        priority: QueuePriority.URGENT,
      },
      {
        patientName: 'Sneha Joshi',
        patientPhone: '+91-9901234567',
        patientEmail: 'sneha.joshi@gmail.com',
        address: 'Deccan Gymkhana, Pune, Maharashtra',
        symptoms: 'Post-pregnancy wellness check',
        type: AppointmentType.FOLLOW_UP,
        priority: QueuePriority.NORMAL,
      },
    ];

    const appointments = [];
    const queueItems = [];

    // Create appointments and queue entries for each patient
    for (let i = 0; i < indianPatients.length; i++) {
      const patient = indianPatients[i];
      const doctor = doctors[i % doctors.length]; // Distribute among available doctors

      // Create multiple appointments per patient (historical data)
      const appointmentCount = faker.number.int({ min: 1, max: 5 });

      for (let j = 0; j < appointmentCount; j++) {
        const appointmentDate = faker.date.between({
          from: new Date('2023-01-01'),
          to: new Date(),
        });

        const hour = faker.number.int({ min: 9, max: 17 });
        const minute = faker.helpers.arrayElement(['00', '15', '30', '45']);
        const startTime = `${hour.toString().padStart(2, '0')}:${minute}`;

        const endHour = hour + (minute === '45' ? 1 : 0);
        const endMinute =
          minute === '45'
            ? '00'
            : (parseInt(minute) + 15).toString().padStart(2, '0');
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute}`;

        const appointment = {
          patientName: patient.patientName,
          patientPhone: patient.patientPhone,
          patientEmail: patient.patientEmail,
          patientNotes: `Address: ${patient.address}`,
          appointmentDate,
          startTime,
          endTime,
          status:
            j === appointmentCount - 1
              ? faker.helpers.arrayElement([
                  AppointmentStatus.SCHEDULED,
                  AppointmentStatus.CONFIRMED,
                ])
              : faker.helpers.arrayElement([
                  AppointmentStatus.COMPLETED,
                  AppointmentStatus.CANCELLED,
                ]),
          type: patient.type,
          notes: `Symptoms: ${patient.symptoms}. Patient from ${patient.address.split(',').pop()?.trim()}.`,
          isUrgent:
            patient.priority === QueuePriority.URGENT ||
            patient.priority === QueuePriority.EMERGENCY,
          doctorId: doctor.id,
        };

        appointments.push(appointment);
      }

      // Add some patients to current queue
      if (i < 4) {
        // First 4 patients in queue
        const queueItem = {
          patientName: patient.patientName,
          patientPhone: patient.patientPhone,
          patientEmail: patient.patientEmail,
          patientNotes: `Address: ${patient.address}`,
          symptoms: patient.symptoms,
          status:
            i === 0
              ? QueueStatus.WITH_DOCTOR
              : i === 1
                ? QueueStatus.COMPLETED
                : QueueStatus.WAITING,
          priority: patient.priority,
          arrivalTime: new Date(),
          estimatedWaitTime: faker.number.int({ min: 10, max: 60 }),
          notes: `Patient from ${patient.address}`,
          assignedDoctorId: doctor.id,
        };

        queueItems.push(queueItem);
      }
    }

    // Save appointments
    const savedAppointments =
      await this.appointmentRepository.save(appointments);
    this.logger.log(
      `Seeded ${savedAppointments.length} appointments for Indian patients`,
    );

    // Save queue items
    const savedQueueItems = await this.queueRepository.save(queueItems);
    this.logger.log(
      `Seeded ${savedQueueItems.length} queue entries for Indian patients`,
    );
  }

  async seedAll(): Promise<void> {
    this.logger.log('Starting database seeding...');

    try {
      await this.seedDoctors();
      await this.seedUsers();
      await this.seedIndianPatients();

      this.logger.log('Database seeding completed successfully!');
    } catch (error) {
      this.logger.error('Database seeding failed:', error);
      throw error;
    }
  }
}
