import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Doctor } from '../doctors/entities/doctor.entity';
import { Logger } from '@nestjs/common';
import { AppointmentStatus, AppointmentType } from '../appointments/entities/appointment.entity';

async function addMoreAppointments() {
  const logger = new Logger('AddMoreAppointments');
  logger.log('🚀 Adding more appointments for better analytics...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    const appointmentRepo = dataSource.getRepository(Appointment);
    const doctorRepo = dataSource.getRepository(Doctor);
    
    // Get available doctors
    const doctors = await doctorRepo.find();
    if (doctors.length === 0) {
      logger.error('❌ No doctors found in database');
      return;
    }

    const patientNames = [
      'Arjun Kumar', 'Priya Sharma', 'Vikram Singh', 'Anita Patel', 'Rohit Mehta',
      'Kavya Iyer', 'Suresh Gupta', 'Meera Jain', 'Amit Verma', 'Sneha Reddy',
      'Rajesh Nair', 'Pooja Agarwal', 'Karan Malhotra', 'Divya Sinha', 'Varun Das',
      'Ritu Chopra', 'Sanjay Tiwari', 'Nisha Bansal', 'Manish Yadav', 'Shreya Pillai'
    ];

    const phones = [
      '+91-9876543210', '+91-9123456789', '+91-8765432109', '+91-7654321098',
      '+91-9234567890', '+91-8123456789', '+91-7123456789', '+91-9345678901',
      '+91-8234567890', '+91-7234567890', '+91-9456789012', '+91-8345678901',
      '+91-7345678901', '+91-9567890123', '+91-8456789012', '+91-7456789012',
      '+91-9678901234', '+91-8567890123', '+91-7567890123', '+91-9789012345'
    ];

    const statuses = [
      AppointmentStatus.SCHEDULED, 
      AppointmentStatus.COMPLETED, 
      AppointmentStatus.CANCELLED, 
      AppointmentStatus.IN_PROGRESS,
      AppointmentStatus.CONFIRMED
    ];
    const types = [
      AppointmentType.CONSULTATION, 
      AppointmentType.SPECIALIST_VISIT, 
      AppointmentType.FOLLOW_UP, 
      AppointmentType.ROUTINE_CHECKUP
    ];
    
    const now = new Date();
    
    // Create 25 new appointments over the last 30 days
    for (let i = 0; i < 25; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const appointmentDate = new Date(now);
      appointmentDate.setDate(appointmentDate.getDate() - daysAgo);
      appointmentDate.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0);
      
      const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
      const randomPatient = patientNames[i % patientNames.length];
      const randomPhone = phones[i % phones.length];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      const appointment = appointmentRepo.create({
        patientName: randomPatient,
        patientPhone: randomPhone,
        patientEmail: `${randomPatient.toLowerCase().replace(' ', '.')}@email.com`,
        patientNotes: `Address: ${['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'][Math.floor(Math.random() * 5)]}, India`,
        appointmentDate: appointmentDate,
        startTime: `${9 + Math.floor(Math.random() * 8)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`,
        endTime: `${10 + Math.floor(Math.random() * 8)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`,
        status: randomStatus,
        type: randomType,
        notes: `${randomType.charAt(0).toUpperCase() + randomType.slice(1).replace('_', ' ')} appointment`,
        isUrgent: Math.random() < 0.1, // 10% chance of being urgent
        doctorId: randomDoctor.id
      });
      
      await appointmentRepo.save(appointment);
      logger.log(`✅ Created appointment ${i + 1}/25: ${randomPatient} - ${appointmentDate.toISOString().split('T')[0]} (${randomStatus})`);
    }
    
    logger.log('🎉 Successfully added 25 new appointments!');
    logger.log('📊 Analytics dashboard should now show much richer data');
  } catch (error) {
    logger.error('❌ Error adding appointments:', error);
  } finally {
    await app.close();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  addMoreAppointments().catch(console.error);
}

export default addMoreAppointments;
