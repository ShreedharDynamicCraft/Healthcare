import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AppointmentsService } from '../appointments/appointments.service';
import { QueueService } from '../queue/queue.service';
import { DoctorsService } from '../doctors/doctors.service';
import { Logger } from '@nestjs/common';

async function testAnalyticsAPI() {
  const logger = new Logger('TestAnalyticsAPI');
  logger.log('🧪 Testing analytics API endpoints...');

  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    
    const appointmentsService = app.get(AppointmentsService);
    const queueService = app.get(QueueService);
    const doctorsService = app.get(DoctorsService);

    // Test appointments
    logger.log('📅 Fetching appointments...');
    const appointments = await appointmentsService.findAll({});
    logger.log(`✅ Found ${appointments.appointments.length} appointments`);
    
    if (appointments.appointments.length > 0) {
      const recent = appointments.appointments.slice(0, 3);
      recent.forEach((apt, i) => {
        logger.log(`   ${i + 1}. ${apt.patientName} - ${apt.appointmentDate} - ${apt.status}`);
      });
    }

    // Test queue
    logger.log('🏥 Fetching queue items...');
    const queueItems = await queueService.findAll();
    logger.log(`✅ Found ${queueItems.length} queue items`);
    
    if (queueItems.length > 0) {
      const recent = queueItems.slice(0, 3);
      recent.forEach((item, i) => {
        logger.log(`   ${i + 1}. ${item.patientName} - ${item.priority} - ${item.status}`);
      });
    }

    // Test doctors
    logger.log('👨‍⚕️ Fetching doctors...');
    const doctors = await doctorsService.findAll({});
    logger.log(`✅ Found ${doctors.doctors.length} doctors`);
    
    if (doctors.doctors.length > 0) {
      const recent = doctors.doctors.slice(0, 3);
      recent.forEach((doc, i) => {
        logger.log(`   ${i + 1}. Dr. ${doc.firstName} ${doc.lastName} - ${doc.specialization}`);
      });
    }

    // Analyze appointment dates
    logger.log('📊 Analyzing appointment dates...');
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentAppointments = appointments.appointments.filter(apt => 
      new Date(apt.appointmentDate) >= last30Days
    );
    
    logger.log(`📈 Appointments in last 30 days: ${recentAppointments.length}`);
    
    if (recentAppointments.length > 0) {
      const statusCount = recentAppointments.reduce((acc: any, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1;
        return acc;
      }, {});
      
      logger.log('📊 Status distribution:');
      Object.entries(statusCount).forEach(([status, count]) => {
        logger.log(`   - ${status}: ${count}`);
      });
    }

    await app.close();
    logger.log('✅ Analytics API test completed successfully!');
  } catch (error) {
    logger.error('❌ Error testing analytics API:', error);
  }
}

if (require.main === module) {
  testAnalyticsAPI().catch(console.error);
}

export default testAnalyticsAPI;
