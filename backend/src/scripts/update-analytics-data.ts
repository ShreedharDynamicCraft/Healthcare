import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { QueueItem } from '../queue/entities/queue-item.entity';
import { Logger } from '@nestjs/common';

async function updateAnalyticsData() {
  const logger = new Logger('UpdateAnalyticsData');
  logger.log('🚀 Starting analytics data update...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // Update appointment dates
    logger.log('🔄 Starting appointment date updates...');
    
    const appointmentRepo = dataSource.getRepository(Appointment);
    const appointments = await appointmentRepo.find();
    const now = new Date();
    
    for (let i = 0; i < appointments.length; i++) {
      const appointment = appointments[i];
      
      // Distribute appointments over the last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const newDate = new Date(now);
      newDate.setDate(newDate.getDate() - daysAgo);
      
      // Set random hour between 9 AM and 5 PM
      newDate.setHours(9 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0);
      
      appointment.appointmentDate = newDate;
      await appointmentRepo.save(appointment);
      
      logger.log(`✅ Updated appointment ${i + 1}/${appointments.length}: ${appointment.patientName} - ${newDate.toISOString()}`);
    }
    
    // Update queue times
    logger.log('🔄 Starting queue time updates...');
    
    const queueRepo = dataSource.getRepository(QueueItem);
    const queueItems = await queueRepo.find();
    
    for (let i = 0; i < queueItems.length; i++) {
      const queueItem = queueItems[i];
      
      // Distribute queue items over the last 7 days
      const daysAgo = Math.floor(Math.random() * 7);
      const newDate = new Date(now);
      newDate.setDate(newDate.getDate() - daysAgo);
      
      // Set random hour between 8 AM and 6 PM
      newDate.setHours(8 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);
      
      queueItem.arrivalTime = newDate;
      await queueRepo.save(queueItem);
      
      logger.log(`✅ Updated queue item ${i + 1}/${queueItems.length}: ${queueItem.patientName} - ${newDate.toISOString()}`);
    }
    
    logger.log('✅ Analytics data update completed successfully!');
    logger.log('📊 The analytics dashboard should now show current data');
  } catch (error) {
    logger.error('❌ Error updating analytics data:', error);
  } finally {
    await app.close();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  updateAnalyticsData().catch(console.error);
}

export default updateAnalyticsData;
