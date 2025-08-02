'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth-store';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import QueueManagement from '@/components/dashboard/QueueManagement';
import AvailableDoctors from '@/components/dashboard/AvailableDoctors';
import AppointmentManagement from '@/components/dashboard/AppointmentManagement';
import { Clock, Users, Calendar, TrendingUp, Activity, Heart, Sparkles } from 'lucide-react';
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

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('queue');
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
      id: 'queue',
      name: 'Patient Queue',
      icon: Clock,
      description: 'Manage patient flow and priorities',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'doctors',
      name: 'Healthcare Team',
      icon: Users,
      description: 'View specialist availability',
      color: 'from-pink-500 to-purple-500'
    },
    {
      id: 'appointments',
      name: 'Consultations',
      icon: Calendar,
      description: 'Schedule wellness appointments',
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
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-3xl p-8 text-white shadow-xl shadow-purple-200/25 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <motion.div 
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <img 
                    src="https://www.allohealth.com/assets/lovable-uploads/allo-logo-v1.svg" 
                    alt="Allo Health Logo" 
                    className="w-8 h-8 object-contain filter brightness-0 invert"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">
                    Welcome back, {user?.firstName}! 
                    <motion.span
                      animate={{ rotate: [0, 20, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-block ml-2"
                    >
                      👋
                    </motion.span>
                  </h1>
                  <p className="text-xl text-white/90 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Your sexual wellness clinic dashboard
                  </p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">Patients in Queue</p>
                      <p className="text-3xl font-bold mt-1">
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
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                      <Clock className="h-7 w-7" />
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">Available Specialists</p>
                      <p className="text-3xl font-bold mt-1">
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
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                      <Users className="h-7 w-7" />
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">Today's Consultations</p>
                      <p className="text-3xl font-bold mt-1">
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
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                      <Calendar className="h-7 w-7" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <div className="hidden lg:block ml-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="w-36 h-36 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm relative"
              >
                <Heart className="h-20 w-20 text-white/60" />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white/5 rounded-full"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl shadow-purple-100/25 border border-purple-100/50 overflow-hidden"
        >
          <div className="border-b border-purple-100/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
            <nav className="flex space-x-1 p-3">
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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 flex flex-col items-center py-5 px-6 rounded-2xl font-medium text-sm transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-purple-200/50`
                        : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50/50'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mb-2 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                    <span className="font-semibold">{tab.name}</span>
                    <span className={`text-xs mt-1 ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                      {tab.description}
                    </span>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
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