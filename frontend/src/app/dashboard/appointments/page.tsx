'use client';

import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Calendar, Clock, User, Phone, MapPin } from 'lucide-react';

export default function AppointmentsPage() {
  const appointments = [
    {
      id: 1,
      time: '09:00 AM',
      patient: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      type: 'Consultation',
      doctor: 'Dr. Smith',
      status: 'confirmed'
    },
    {
      id: 2,
      time: '10:30 AM',
      patient: 'Michael Chen',
      phone: '+1 (555) 987-6543',
      type: 'Follow-up',
      doctor: 'Dr. Wilson',
      status: 'pending'
    },
    {
      id: 3,
      time: '02:00 PM',
      patient: 'Emily Davis',
      phone: '+1 (555) 456-7890',
      type: 'Wellness Check',
      doctor: 'Dr. Brown',
      status: 'confirmed'
    }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950 dark:via-gray-900 dark:to-pink-950">
        <div className="p-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Appointments
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and schedule patient appointments
            </p>
          </motion.div>

          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800/30"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Clock className="h-5 w-5 text-purple-600 mr-2" />
              Today's Schedule
            </h2>
            
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-100 dark:border-purple-800/30"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {appointment.time}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {appointment.type}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {appointment.patient}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {appointment.doctor}
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {appointment.status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
