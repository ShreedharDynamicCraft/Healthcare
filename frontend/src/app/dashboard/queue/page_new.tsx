'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Clock, Users, CheckCircle, AlertCircle, Plus, Search, Filter } from 'lucide-react';
import { queueAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface QueueItem {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  symptoms: string;
  status: string;
  priority: string;
  arrivalTime: string;
  estimatedWaitTime: number;
  assignedDoctor?: {
    id: string;
    firstName: string;
    lastName: string;
    specialization: string;
  };
  notes?: string;
}

export default function QueuePage() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQueue();
    // Refresh queue every 30 seconds
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const response = await queueAPI.getAll();
      setQueueItems(response || []);
    } catch (error) {
      console.error('Error fetching queue:', error);
      toast.error('Failed to load queue');
    } finally {
      setLoading(false);
    }
  };

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatArrivalTime = (timeString: string) => {
    try {
      const time = new Date(timeString);
      return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return timeString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'normal':
        return 'bg-blue-500';
      case 'low':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  const filteredQueueItems = queueItems.filter(item =>
    item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const waitingCount = queueItems.filter(item => item.status === 'waiting').length;
  const inProgressCount = queueItems.filter(item => item.status === 'in-progress').length;
  const averageWaitTime = queueItems.length > 0 
    ? Math.round(queueItems.reduce((acc, item) => acc + item.estimatedWaitTime, 0) / queueItems.length)
    : 0;

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
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Client Queue
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Real-time patient queue management
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add to Queue</span>
              </motion.button>
            </div>
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
                  <p className="text-2xl font-bold text-purple-600">{waitingCount}</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Wait Time</p>
                  <p className="text-2xl font-bold text-green-600">{formatWaitTime(averageWaitTime)}</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </motion.div>

          {/* Queue List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800/30"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="h-5 w-5 text-purple-600 mr-2" />
              {loading ? 'Loading Queue...' : `Queue (${filteredQueueItems.length})`}
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : filteredQueueItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {queueItems.length === 0 ? 'No patients in queue.' : 'No patients match your search.'}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQueueItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-100 dark:border-purple-800/30"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(item.priority)}`}></div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {item.patientName}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {item.symptoms}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          Arrived: {formatArrivalTime(item.arrivalTime)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {formatWaitTime(item.estimatedWaitTime)}
                        </div>
                        {item.assignedDoctor && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Dr. {item.assignedDoctor.firstName} {item.assignedDoctor.lastName}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                          {item.priority} Priority
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('-', ' ')}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
