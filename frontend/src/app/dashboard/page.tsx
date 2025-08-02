'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth-store';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import QueueManagement from '@/components/dashboard/QueueManagement';
import AvailableDoctors from '@/components/dashboard/AvailableDoctors';
import AppointmentManagement from '@/components/dashboard/AppointmentManagement';
import { 
  Clock, 
  Users, 
  Calendar, 
  Activity, 
  Heart, 
  TrendingUp, 
  Sparkles, 
  BarChart3, 
  PieChart, 
  TrendingDown,
  Shield
} from 'lucide-react';
import api from '@/lib/api';

interface DashboardStats {
  queueStats: {
    total: number;
    waiting: number;
    withDoctor: number;
    completed: number;
  };
  doctorStats: {
    total: number;
    available: number;
    busy: number;
    offDuty: number;
  };
  appointmentStats: {
    total: number;
    scheduled: number;
    confirmed: number;
    inProgress: number;
    completed: number;
  };
}

// Overview Section Component
function OverviewSection({ stats, isLoading }: { stats: DashboardStats, isLoading: boolean }) {
  return (
    <div className="space-y-8">
      {/* Key Metrics Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white p-6 rounded-3xl shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6" />
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 className="text-2xl font-bold">{isLoading ? '...' : stats.queueStats.total}</h3>
          <p className="text-white/80 text-sm">Total Clients Today</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700 text-white p-6 rounded-3xl shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+8%</span>
          </div>
          <h3 className="text-2xl font-bold">{isLoading ? '...' : stats.appointmentStats.total}</h3>
          <p className="text-white/80 text-sm">Consultations Scheduled</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 text-white p-6 rounded-3xl shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+15%</span>
          </div>
          <h3 className="text-2xl font-bold">{isLoading ? '...' : stats.doctorStats.available}</h3>
          <p className="text-white/80 text-sm">Specialists Available</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 text-white p-6 rounded-3xl shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6" />
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">98%</span>
          </div>
          <h3 className="text-2xl font-bold">4.9</h3>
          <p className="text-white/80 text-sm">Satisfaction Rating</p>
        </motion.div>
      </motion.div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Queue Status Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Client Queue Status</h3>
            <PieChart className="h-6 w-6 text-purple-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Waiting</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.queueStats.waiting}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">In Session</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.queueStats.withDoctor}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Completed</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.queueStats.completed}</span>
            </div>
          </div>
        </motion.div>

        {/* Specialist Availability */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Specialist Availability</h3>
            <BarChart3 className="h-6 w-6 text-purple-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Available</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.doctorStats.available}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Busy</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.doctorStats.busy}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">Off Duty</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{stats.doctorStats.offDuty}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-800"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
        
        <div className="space-y-4">
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center gap-4 p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-xl"
          >
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">New client registered</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">2 minutes ago</p>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center gap-4 p-4 bg-pink-50/50 dark:bg-pink-900/20 rounded-xl"
          >
            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">Consultation scheduled</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">5 minutes ago</p>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center gap-4 p-4 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl"
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">Session completed successfully</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">12 minutes ago</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    queueStats: { total: 0, waiting: 0, withDoctor: 0, completed: 0 },
    doctorStats: { total: 0, available: 0, busy: 0, offDuty: 0 },
    appointmentStats: { total: 0, scheduled: 0, confirmed: 0, inProgress: 0, completed: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (isAuthenticated) {
        loadDashboardStats();
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, router, isClient]);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch queue data
      const queueResponse = await api.get('/queue');
      const queueItems = queueResponse.data || [];
      
      // Fetch doctors data
      const doctorsResponse = await api.get('/doctors');
      const doctors = doctorsResponse.data.doctors || doctorsResponse.data || [];
      
      // Fetch appointments data
      const appointmentsResponse = await api.get('/appointments');
      const appointments = appointmentsResponse.data.appointments || appointmentsResponse.data || [];
      
      // Calculate stats
      const queueStats = {
        total: queueItems.length,
        waiting: queueItems.filter((item: any) => item.status === 'waiting').length,
        withDoctor: queueItems.filter((item: any) => item.status === 'with_doctor').length,
        completed: queueItems.filter((item: any) => item.status === 'completed').length,
      };
      
      const doctorStats = {
        total: doctors.length,
        available: doctors.filter((doctor: any) => doctor.status === 'available').length,
        busy: doctors.filter((doctor: any) => doctor.status === 'busy').length,
        offDuty: doctors.filter((doctor: any) => doctor.status === 'off_duty').length,
      };
      
      const appointmentStats = {
        total: appointments.length,
        scheduled: appointments.filter((apt: any) => apt.status === 'scheduled').length,
        confirmed: appointments.filter((apt: any) => apt.status === 'confirmed').length,
        inProgress: appointments.filter((apt: any) => apt.status === 'in_progress').length,
        completed: appointments.filter((apt: any) => apt.status === 'completed').length,
      };
      
      setStats({ queueStats, doctorStats, appointmentStats });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6">
            <img 
              src="https://www.allohealth.com/assets/lovable-uploads/allo-logo-v1.svg" 
              alt="Allo Health Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-3 border-purple-200 border-t-purple-500 rounded-full mx-auto mb-4"
          />
          <p className="text-purple-700 font-medium">Loading Allo Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const tabs = [
    {
      id: 'overview',
      name: 'Overview',
      icon: TrendingUp,
      description: 'Dashboard insights and analytics',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'queue',
      name: 'Client Queue',
      icon: Clock,
      description: 'Manage client flow and priorities',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'doctors',
      name: 'Wellness Team',
      icon: Users,
      description: 'Specialist profiles and availability',
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'appointments',
      name: 'Consultations',
      icon: Calendar,
      description: 'Schedule wellness consultations',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 dark:from-purple-700 dark:via-pink-600 dark:to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-purple-200/40 dark:shadow-purple-900/40 relative overflow-hidden"
        >
          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent dark:from-white/5 dark:to-transparent"></div>
          <motion.div 
            animate={{ 
              x: [0, 50, 0],
              y: [0, -30, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-8 right-8 w-48 h-48 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              x: [0, -30, 0],
              y: [0, 20, 0],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-8 left-8 w-32 h-32 bg-pink-300/10 rounded-full blur-2xl"
          />
          
          <div className="relative z-10">
            {/* Header with Logo */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
              <div className="flex items-center gap-6 mb-6 lg:mb-0">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-20 h-20 md:w-24 md:h-24 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-xl"
                >
                  <img 
                    src="https://www.allohealth.com/assets/lovable-uploads/allo-logo-v1.svg" 
                    alt="Allo Health Logo" 
                    className="w-12 h-12 md:w-16 md:h-16 object-contain filter brightness-0 invert"
                  />
                </motion.div>
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2"
                  >
                    Welcome back, {user?.firstName}! 
                    <motion.span
                      animate={{ rotate: [0, 20, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-block ml-2"
                    >
                      👋
                    </motion.span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-base md:text-lg lg:text-xl text-white/90 flex items-center gap-2"
                  >
                    <Shield className="h-5 w-5 md:h-6 md:w-6" />
                    Admin Control Center - Allo Health Platform
                  </motion.p>
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="hidden lg:block"
              >
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm relative">
                  <Heart className="h-16 w-16 text-white/60" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-white/5 rounded-full"
                  />
                </div>
              </motion.div>
            </div>
            
            {/* Enhanced Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs md:text-sm font-medium mb-1">Clients in Queue</p>
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold">
                      {isLoading ? (
                        <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          ...
                        </motion.span>
                      ) : (
                        <motion.span
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          {stats.queueStats.total}
                        </motion.span>
                      )}
                    </p>
                    <p className="text-white/60 text-xs mt-1">Active today</p>
                  </div>
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 md:h-8 md:w-8" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs md:text-sm font-medium mb-1">Available Specialists</p>
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold">
                      {isLoading ? (
                        <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          ...
                        </motion.span>
                      ) : (
                        <motion.span
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          {stats.doctorStats.available}
                        </motion.span>
                      )}
                    </p>
                    <p className="text-white/60 text-xs mt-1">Ready to help</p>
                  </div>
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 md:h-8 md:w-8" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs md:text-sm font-medium mb-1">Today's Consultations</p>
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold">
                      {isLoading ? (
                        <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          ...
                        </motion.span>
                      ) : (
                        <motion.span
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          {stats.appointmentStats.total}
                        </motion.span>
                      )}
                    </p>
                    <p className="text-white/60 text-xs mt-1">Scheduled</p>
                  </div>
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center">
                    <Calendar className="h-6 w-6 md:h-8 md:w-8" />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/15 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs md:text-sm font-medium mb-1">Care Rating</p>
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold">4.9</p>
                    <p className="text-white/60 text-xs mt-1">Patient satisfaction</p>
                  </div>
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center">
                    <Activity className="h-6 w-6 md:h-8 md:w-8" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl shadow-purple-100/50 dark:shadow-purple-900/50 border border-purple-100/50 dark:border-purple-800/50 overflow-hidden"
        >
          <div className="border-b border-purple-100/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm">
            <nav className="flex overflow-x-auto space-x-1 p-3 md:p-4 scrollbar-hide">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 min-w-[140px] md:min-w-[160px] flex flex-col items-center py-4 md:py-6 px-3 md:px-4 rounded-xl md:rounded-2xl font-medium text-sm transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-xl shadow-purple-200/50 dark:shadow-purple-900/50`
                        : 'text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50/80 dark:hover:bg-purple-900/20'
                    }`}
                  >
                    <motion.div
                      animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className={`h-5 w-5 md:h-7 md:w-7 mb-2 md:mb-3 ${isActive ? 'text-white' : 'text-purple-500 dark:text-purple-400'}`} />
                    </motion.div>
                    <span className="font-semibold text-sm md:text-base">{tab.name}</span>
                    <span className={`text-xs mt-1 md:mt-2 text-center leading-tight hidden md:block ${isActive ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'}`}>
                      {tab.description}
                    </span>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Enhanced Tab Content */}
          <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-br from-gray-50/50 to-purple-50/30 dark:from-gray-900/50 dark:to-purple-900/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {activeTab === 'overview' && <OverviewSection stats={stats} isLoading={isLoading} />}
                {activeTab === 'queue' && <QueueManagement onStatsUpdate={loadDashboardStats} />}
                {activeTab === 'doctors' && <AvailableDoctors onStatsUpdate={loadDashboardStats} />}
                {activeTab === 'appointments' && <AppointmentManagement onStatsUpdate={loadDashboardStats} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
} 