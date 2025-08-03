import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function resetDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    console.log('🗑️  Dropping existing tables...');
    
    // Drop tables in correct order (foreign keys first)
    await dataSource.query('DROP TABLE IF EXISTS appointments CASCADE');
    await dataSource.query('DROP TABLE IF EXISTS queue_items CASCADE');
    await dataSource.query('DROP TABLE IF EXISTS doctors CASCADE');
    await dataSource.query('DROP TABLE IF EXISTS users CASCADE');
    
    // Drop enum types
    await dataSource.query('DROP TYPE IF EXISTS appointments_status_enum CASCADE');
    await dataSource.query('DROP TYPE IF EXISTS appointments_type_enum CASCADE');
    await dataSource.query('DROP TYPE IF EXISTS queue_items_status_enum CASCADE');
    await dataSource.query('DROP TYPE IF EXISTS queue_items_priority_enum CASCADE');
    await dataSource.query('DROP TYPE IF EXISTS doctors_specialization_enum CASCADE');
    await dataSource.query('DROP TYPE IF EXISTS doctors_gender_enum CASCADE');
    await dataSource.query('DROP TYPE IF EXISTS doctors_status_enum CASCADE');
    
    console.log('✅ Tables dropped successfully');
    
    // Let TypeORM recreate the schema
    console.log('🏗️  Recreating database schema...');
    await dataSource.synchronize(true);
    
    console.log('✅ Database reset completed successfully!');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  } finally {
    await app.close();
  }
}

resetDatabase()
  .then(() => {
    console.log('🎉 Database reset script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database reset script failed:', error);
    process.exit(1);
  });
