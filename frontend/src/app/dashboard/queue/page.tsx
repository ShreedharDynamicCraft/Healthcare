'use client';

import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

export default function QueuePage() {
  const queueItems = [
    {
      id: 1,
      ticketNumber: 'A001',
      patient: 'Sarah Johnson',
      waitTime: '15 min',
      status: 'waiting',
      priority: 'normal',
      service: 'Consultation'
    },
    {
      id: 2,
      ticketNumber: 'A002',
      patient: 'Michael Chen',
      waitTime: '8 min',
      status: 'in-progress',
      priority: 'urgent',
      service: 'Follow-up'
    },
    {
      id: 3,
      ticketNumber: 'A003',
      patient: 'Emily Davis',
      waitTime: '3 min',
      status: 'waiting',
      priority: 'normal',
      service: 'Wellness Check'
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
              <Clock className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Client Queue
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time patient queue management
            </p>
          </motion.div>

          {/* Queue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Waiting</p>
                  <p className="text-2xl font-bold text-purple-600">8</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Wait Time</p>
                  <p className="text-2xl font-bold text-green-600">12 min</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Served Today</p>
                  <p className="text-2xl font-bold text-blue-600">24</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </motion.div>
          </div>

          {/* Live Queue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800/30"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Live Queue</h2>
            
            <div className="space-y-4">
              {queueItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-100 dark:border-purple-800/30"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-white font-bold">
                      {item.ticketNumber}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {item.patient}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.service}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.waitTime}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        wait time
                      </div>
                    </div>
                    
                    {item.priority === 'urgent' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'in-progress' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {item.status === 'in-progress' ? 'In Progress' : 'Waiting'}
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
