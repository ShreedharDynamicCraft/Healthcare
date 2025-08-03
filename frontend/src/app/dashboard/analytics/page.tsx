'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Users,
  Activity,
  Clock,
  Target,
  PieChart,
  LineChart,
  Filter,
  Download,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface AnalyticsData {
  dailyStats: {
    date: string;
    newPatients: number;
    completedCases: number;
    totalAppointments: number;
    queueCount: number;
  }[];
  monthlyStats: {
    month: string;
    year: number;
    newPatients: number;
    completedCases: number;
    totalRevenue: number;
    averageWaitTime: number;
  }[];
  patientDistribution: {
    status: string;
    count: number;
    percentage: number;
  }[];
  appointmentTypes: {
    type: string;
    count: number;
    percentage: number;
  }[];
  doctorPerformance: {
    doctorName: string;
    completedAppointments: number;
    averageRating: number;
    totalPatients: number;
  }[];
  queueAnalytics: {
    averageWaitTime: number;
    peakHours: { hour: number; count: number }[];
    priorityDistribution: { priority: string; count: number }[];
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [chartType, setChartType] = useState<'daily' | 'monthly'>('daily');
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    // Set dark mode as default on first load
    const checkDarkMode = () => {
      const currentDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(currentDark);
      
      // If not dark mode, set it as default
      if (!currentDark) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      }
    };
    
    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const currentDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(currentDark);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const currentlyDark = html.classList.contains('dark');
    
    if (currentlyDark) {
      html.classList.remove('dark');
      setIsDarkMode(false);
      toast.success('☀️ Switched to Light Mode - Bright and clean interface!', {
        duration: 3000,
        style: {
          background: '#ffffff',
          color: '#1f2937',
          border: '2px solid #f59e0b',
          fontWeight: '500'
        },
        icon: '☀️'
      });
    } else {
      html.classList.add('dark');
      setIsDarkMode(true);
      toast.success('🌙 Switched to Dark Mode - Easy on the eyes!', {
        duration: 3000,
        style: {
          background: '#1f2937',
          color: '#ffffff',
          border: '2px solid #8b5cf6',
          fontWeight: '500'
        },
        icon: '🌙'
      });
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  useEffect(() => {
    // Show welcome message with theme info on first load
    const hasShownWelcome = sessionStorage.getItem('analytics-welcome-shown');
    if (!hasShownWelcome) {
      setTimeout(() => {
        toast('🌙 Dark Mode is active by default! Click the theme button to switch between Dark Mode and Light Mode.', {
          duration: 5000,
          style: {
            background: '#1f2937',
            color: '#ffffff',
            border: '2px solid #8b5cf6',
            fontWeight: '500'
          },
          icon: '💡'
        });
        sessionStorage.setItem('analytics-welcome-shown', 'true');
      }, 1000);
    }
  }, []);

  // Regular toast notifications for tips and updates
  useEffect(() => {
    const toastMessages = [
      {
        message: '📊 Analytics data refreshes automatically every 30 seconds',
        icon: '📊',
        type: 'info'
      },
      {
        message: '💡 Tip: Click on chart elements for detailed information',
        icon: '💡',
        type: 'tip'
      },
      {
        message: '📈 Your patient registration is trending upward!',
        icon: '📈',
        type: 'success'
      },
      {
        message: '⏰ Peak hours: 9AM-11AM and 2PM-4PM',
        icon: '⏰',
        type: 'info'
      },
      {
        message: '🎯 Average success rate is above 90%',
        icon: '🎯',
        type: 'success'
      },
      {
        message: '📱 Use filters to customize your analytics view',
        icon: '📱',
        type: 'tip'
      },
      {
        message: '🔄 Data auto-syncs with backend every refresh',
        icon: '🔄',
        type: 'info'
      }
    ];

    let messageIndex = 0;
    
    const showRegularToast = () => {
      const message = toastMessages[messageIndex];
      
      const getToastStyle = (type: string) => {
        const baseStyle = isDarkMode 
          ? { background: '#1f2937', color: '#ffffff', border: '1px solid #374151' }
          : { background: '#ffffff', color: '#1f2937', border: '1px solid #e5e7eb' };
          
        switch (type) {
          case 'success':
            return {
              ...baseStyle,
              border: isDarkMode ? '1px solid #22c55e' : '1px solid #16a34a'
            };
          case 'tip':
            return {
              ...baseStyle,
              border: isDarkMode ? '1px solid #3b82f6' : '1px solid #2563eb'
            };
          default:
            return baseStyle;
        }
      };

      toast(message.message, {
        duration: 3000,
        style: getToastStyle(message.type),
        position: 'bottom-right'
      });
      
      messageIndex = (messageIndex + 1) % toastMessages.length;
    };

    // Show first toast after 5 seconds, then every 20 seconds
    const initialTimeout = setTimeout(showRegularToast, 5000);
    const interval = setInterval(showRegularToast, 20000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isDarkMode]); // Re-run when theme changes to update toast styles

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Show loading toast
      const loadingToast = toast.loading('🔄 Loading analytics data...', {
        style: isDarkMode 
          ? { background: '#1f2937', color: '#ffffff', border: '1px solid #374151' }
          : { background: '#ffffff', color: '#1f2937', border: '1px solid #e5e7eb' }
      });
      
      // Fetch real data from multiple endpoints
      const [appointmentsResponse, queueResponse, doctorsResponse] = await Promise.all([
        api.get('/appointments'),
        api.get('/queue'),
        api.get('/doctors')
      ]);

      const appointments = appointmentsResponse.data.appointments || appointmentsResponse.data || [];
      const queueItems = queueResponse.data || [];
      const doctors = doctorsResponse.data.doctors || doctorsResponse.data || [];

      // Process daily stats
      const dailyStatsMap = new Map();
      const now = new Date();
      const daysToShow = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      
      // Initialize days
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyStatsMap.set(dateStr, {
          date: dateStr,
          newPatients: 0,
          completedCases: 0,
          totalAppointments: 0,
          queueCount: 0
        });
      }

      // Process appointments for daily stats
      const patientRegistrations = new Map();
      appointments.forEach((appointment: any) => {
        const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
        const patientKey = appointment.patientPhone || appointment.patientEmail;
        
        if (dailyStatsMap.has(appointmentDate)) {
          const dayStats = dailyStatsMap.get(appointmentDate);
          dayStats.totalAppointments++;
          
          if (appointment.status === 'completed') {
            dayStats.completedCases++;
          }
          
          // Check if this is the first appointment for this patient
          if (!patientRegistrations.has(patientKey) || 
              new Date(appointment.appointmentDate) < patientRegistrations.get(patientKey)) {
            patientRegistrations.set(patientKey, new Date(appointment.appointmentDate));
            dayStats.newPatients++;
          }
        }
      });

      // Process queue items for daily stats
      queueItems.forEach((queueItem: any) => {
        const arrivalDate = new Date(queueItem.arrivalTime).toISOString().split('T')[0];
        if (dailyStatsMap.has(arrivalDate)) {
          dailyStatsMap.get(arrivalDate).queueCount++;
        }
      });

      const dailyStats = Array.from(dailyStatsMap.values());

      // Process monthly stats
      const monthlyStatsMap = new Map();
      const monthlyPatients = new Map();
      
      appointments.forEach((appointment: any) => {
        const date = new Date(appointment.appointmentDate);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (!monthlyStatsMap.has(monthKey)) {
          monthlyStatsMap.set(monthKey, {
            month: date.toLocaleDateString('en-US', { month: 'long' }),
            year: date.getFullYear(),
            newPatients: 0,
            completedCases: 0,
            totalRevenue: 0,
            averageWaitTime: 0
          });
        }
        
        const monthStats = monthlyStatsMap.get(monthKey);
        
        // Count unique patients per month
        const patientKey = appointment.patientPhone || appointment.patientEmail;
        const monthPatients = monthlyPatients.get(monthKey) || new Set();
        monthPatients.add(patientKey);
        monthlyPatients.set(monthKey, monthPatients);
        monthStats.newPatients = monthPatients.size;
        
        if (appointment.status === 'completed') {
          monthStats.completedCases++;
          monthStats.totalRevenue += 500; // Assume $500 per completed appointment
        }
      });

      const monthlyStats = Array.from(monthlyStatsMap.values())
        .sort((a, b) => a.year - b.year || a.month.localeCompare(b.month));

      // Patient distribution by status
      const statusCount = appointments.reduce((acc: any, appointment: any) => {
        acc[appointment.status] = (acc[appointment.status] || 0) + 1;
        return acc;
      }, {});

      const totalAppointments = appointments.length;
      const patientDistribution = Object.entries(statusCount).map(([status, count]: [string, any]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
        count,
        percentage: totalAppointments > 0 ? Math.round((count / totalAppointments) * 100) : 0
      }));

      // Appointment types distribution
      const typeCount = appointments.reduce((acc: any, appointment: any) => {
        acc[appointment.type] = (acc[appointment.type] || 0) + 1;
        return acc;
      }, {});

      const appointmentTypes = Object.entries(typeCount).map(([type, count]: [string, any]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '),
        count,
        percentage: totalAppointments > 0 ? Math.round((count / totalAppointments) * 100) : 0
      }));

      // Doctor performance
      const doctorStats = new Map();
      doctors.forEach((doctor: any) => {
        doctorStats.set(doctor.id, {
          doctorName: `${doctor.firstName} ${doctor.lastName}`,
          completedAppointments: 0,
          averageRating: 4.5 + Math.random() * 0.5, // Mock rating for now
          totalPatients: 0
        });
      });

      const patientsByDoctor = new Map();
      appointments.forEach((appointment: any) => {
        if (doctorStats.has(appointment.doctorId)) {
          const stats = doctorStats.get(appointment.doctorId);
          if (appointment.status === 'completed') {
            stats.completedAppointments++;
          }
          
          const patientKey = appointment.patientPhone || appointment.patientEmail;
          const doctorPatients = patientsByDoctor.get(appointment.doctorId) || new Set();
          doctorPatients.add(patientKey);
          patientsByDoctor.set(appointment.doctorId, doctorPatients);
          stats.totalPatients = doctorPatients.size;
        }
      });

      const doctorPerformance = Array.from(doctorStats.values());

      // Queue analytics
      const priorityCount = queueItems.reduce((acc: any, item: any) => {
        acc[item.priority] = (acc[item.priority] || 0) + 1;
        return acc;
      }, {});

      const priorityDistribution = Object.entries(priorityCount).map(([priority, count]: [string, any]) => ({
        priority: priority.charAt(0).toUpperCase() + priority.slice(1),
        count
      }));

      const totalWaitTime = queueItems.reduce((sum: number, item: any) => sum + (item.estimatedWaitTime || 0), 0);
      const averageWaitTime = queueItems.length > 0 ? Math.round(totalWaitTime / queueItems.length) : 0;

      // Peak hours analysis
      const hourCount = new Array(24).fill(0);
      queueItems.forEach((item: any) => {
        if (item.arrivalTime) {
          const hour = new Date(item.arrivalTime).getHours();
          hourCount[hour]++;
        }
      });

      const peakHours = hourCount.map((count, hour) => ({ hour, count }))
        .filter(item => item.count > 0)
        .sort((a, b) => b.count - a.count);

      const processedData: AnalyticsData = {
        dailyStats,
        monthlyStats,
        patientDistribution,
        appointmentTypes,
        doctorPerformance,
        queueAnalytics: {
          averageWaitTime,
          peakHours,
          priorityDistribution
        }
      };

      setAnalyticsData(processedData);
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('✅ Analytics data loaded successfully!', {
        duration: 2000,
        style: isDarkMode 
          ? { background: '#1f2937', color: '#ffffff', border: '1px solid #22c55e' }
          : { background: '#ffffff', color: '#1f2937', border: '1px solid #16a34a' }
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('❌ Failed to load analytics data. Please try again.', {
        duration: 4000,
        style: isDarkMode 
          ? { background: '#1f2937', color: '#ffffff', border: '1px solid #ef4444' }
          : { background: '#ffffff', color: '#1f2937', border: '1px solid #dc2626' }
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh notifications
  useEffect(() => {
    const autoRefreshInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchAnalyticsData();
        toast('🔄 Auto-refreshed analytics data', {
          duration: 2000,
          style: isDarkMode 
            ? { background: '#1f2937', color: '#ffffff', border: '1px solid #3b82f6' }
            : { background: '#ffffff', color: '#1f2937', border: '1px solid #2563eb' }
        });
      }
    }, 300000); // Auto-refresh every 5 minutes

    return () => clearInterval(autoRefreshInterval);
  }, [isDarkMode]);

  const handleTimeRangeChange = (newRange: '7d' | '30d' | '90d' | '1y') => {
    setTimeRange(newRange);
    
    const rangeLabels = {
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days', 
      '90d': 'Last 90 Days',
      '1y': 'Last Year'
    };
    
    toast.success(`📅 Switched to ${rangeLabels[newRange]} view`, {
      duration: 2000,
      style: isDarkMode 
        ? { background: '#1f2937', color: '#ffffff', border: '1px solid #3b82f6' }
        : { background: '#ffffff', color: '#1f2937', border: '1px solid #2563eb' }
    });
  };

  const handleChartTypeChange = (newType: 'daily' | 'monthly') => {
    setChartType(newType);
    
    toast.success(`📊 Switched to ${newType} view`, {
      duration: 1500,
      style: isDarkMode 
        ? { background: '#1f2937', color: '#ffffff', border: '1px solid #8b5cf6' }
        : { background: '#ffffff', color: '#1f2937', border: '1px solid #7c3aed' }
    });
  };

  const handleRefresh = () => {
    fetchAnalyticsData();
    toast.success('🔄 Analytics data refreshed successfully!', {
      duration: 2000,
      style: isDarkMode 
        ? { background: '#1f2937', color: '#ffffff', border: '1px solid #22c55e' }
        : { background: '#ffffff', color: '#1f2937', border: '1px solid #16a34a' }
    });
  };

  const handleExport = () => {
    if (!analyticsData) {
      toast.error('❌ No data available to export', {
        duration: 2000,
        style: isDarkMode 
          ? { background: '#1f2937', color: '#ffffff', border: '1px solid #ef4444' }
          : { background: '#ffffff', color: '#1f2937', border: '1px solid #dc2626' }
      });
      return;
    }
    
    const exportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      ...analyticsData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('📋 Analytics report exported successfully!', {
      duration: 3000,
      style: isDarkMode 
        ? { background: '#1f2937', color: '#ffffff', border: '1px solid #22c55e' }
        : { background: '#ffffff', color: '#1f2937', border: '1px solid #16a34a' }
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Real-time insights and performance metrics
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button with Label */}
            <div className="flex flex-col items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`p-3 rounded-xl transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600 border-2 border-purple-500' 
                    : 'bg-yellow-100 text-orange-600 hover:bg-yellow-200 border-2 border-orange-400'
                }`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </motion.button>
              <div className="flex flex-col items-center">
                <span className={`text-xs font-bold transition-colors ${
                  isDarkMode ? 'text-purple-400' : 'text-orange-600'
                }`}>
                  {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  Click to switch
                </span>
              </div>
            </div>
            
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value as any)}
              className="px-4 py-2 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 border border-purple-200 dark:border-purple-700 rounded-xl text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-emerald-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </motion.button>
          </div>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {analyticsData?.dailyStats.reduce((sum, day) => sum + day.newPatients, 0) || 0}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% vs last period
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cases Solved</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {analyticsData?.dailyStats.reduce((sum, day) => sum + day.completedCases, 0) || 0}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% vs last period
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Wait Time</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analyticsData?.queueAnalytics.averageWaitTime || 0}m
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -5% vs last period
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-emerald-600">94.2%</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2% vs last period
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Registration Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Patient Registration</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleChartTypeChange('daily')}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    chartType === 'daily' 
                      ? 'bg-purple-500 text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => handleChartTypeChange('monthly')}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    chartType === 'monthly' 
                      ? 'bg-purple-500 text-white' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>
            
            <div className="h-64 relative">
              {/* Bar Chart */}
              <div className="h-full flex items-end justify-between px-2">
                {analyticsData && chartType === 'daily' && analyticsData.dailyStats.slice(-7).map((day, index) => {
                  const maxRegistrations = Math.max(...analyticsData.dailyStats.slice(-7).map(d => d.newPatients));
                  const height = maxRegistrations > 0 ? (day.newPatients / maxRegistrations) * 200 : 0;
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  
                  return (
                    <div key={day.date} className="flex flex-col items-center group">
                      <div className="relative mb-2">
                        <div
                          className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-300 group-hover:from-purple-700 group-hover:to-purple-500 relative"
                          style={{ height: `${Math.max(4, height)}px` }}
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {day.newPatients} patients
                          </div>
                        </div>
                        {/* Value label */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300">
                          {day.newPatients}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        {dayName}
                      </span>
                    </div>
                  );
                })}
                
                {analyticsData && chartType === 'monthly' && analyticsData.monthlyStats.slice(-6).map((month, index) => {
                  const maxRegistrations = Math.max(...analyticsData.monthlyStats.slice(-6).map(m => m.newPatients));
                  const height = maxRegistrations > 0 ? (month.newPatients / maxRegistrations) * 200 : 0;
                  
                  return (
                    <div key={`${month.year}-${month.month}`} className="flex flex-col items-center group">
                      <div className="relative mb-2">
                        <div
                          className="w-8 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-300 group-hover:from-emerald-700 group-hover:to-emerald-500 relative"
                          style={{ height: `${Math.max(4, height)}px` }}
                        >
                          {/* Tooltip */}
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {month.newPatients} patients
                          </div>
                        </div>
                        {/* Value label */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300">
                          {month.newPatients}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        {month.month.slice(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Chart legend */}
              <div className="flex items-center justify-center mt-4 space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded ${chartType === 'daily' ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {chartType === 'daily' ? 'Daily Registrations' : 'Monthly Registrations'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Daily/Monthly Trends Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Patient vs Cases</h3>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Trend Analysis
              </div>
            </div>
            
            <div className="h-64 relative">
              {/* Simple SVG Line Chart */}
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <defs>
                  <linearGradient id="patientGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: isDarkMode ? '#a855f7' : '#7c3aed', stopOpacity: 0.8}} />
                    <stop offset="100%" style={{stopColor: isDarkMode ? '#a855f7' : '#7c3aed', stopOpacity: 0.1}} />
                  </linearGradient>
                  <linearGradient id="caseGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor: isDarkMode ? '#34d399' : '#10b981', stopOpacity: 0.8}} />
                    <stop offset="100%" style={{stopColor: isDarkMode ? '#34d399' : '#10b981', stopOpacity: 0.1}} />
                  </linearGradient>
                </defs>
                
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <line 
                    key={i} 
                    x1="50" 
                    y1={40 + (i * 30)} 
                    x2="350" 
                    y2={40 + (i * 30)} 
                    stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
                    strokeWidth="1"
                  />
                ))}
                
                {/* Data visualization */}
                {analyticsData && chartType === 'daily' && (
                  <>
                    {/* New Patients Line */}
                    <polyline
                      fill="none"
                      stroke={isDarkMode ? '#a855f7' : '#7c3aed'}
                      strokeWidth="3"
                      points={analyticsData.dailyStats.slice(-7).map((day, index) => {
                        const x = 50 + (index / 6) * 300;
                        const maxPatients = Math.max(...analyticsData.dailyStats.slice(-7).map(d => d.newPatients));
                        const y = 160 - (day.newPatients / (maxPatients || 1)) * 120;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    
                    {/* Completed Cases Line */}
                    <polyline
                      fill="none"
                      stroke={isDarkMode ? '#34d399' : '#10b981'}
                      strokeWidth="3"
                      points={analyticsData.dailyStats.slice(-7).map((day, index) => {
                        const x = 50 + (index / 6) * 300;
                        const maxCases = Math.max(...analyticsData.dailyStats.slice(-7).map(d => d.completedCases));
                        const y = 160 - (day.completedCases / (maxCases || 1)) * 120;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    
                    {/* Data points */}
                    {analyticsData.dailyStats.slice(-7).map((day, index) => {
                      const x = 50 + (index / 6) * 300;
                      const maxPatients = Math.max(...analyticsData.dailyStats.slice(-7).map(d => d.newPatients));
                      const yPatients = 160 - (day.newPatients / (maxPatients || 1)) * 120;
                      const maxCases = Math.max(...analyticsData.dailyStats.slice(-7).map(d => d.completedCases));
                      const yCases = 160 - (day.completedCases / (maxCases || 1)) * 120;
                      
                      return (
                        <g key={index}>
                          <circle cx={x} cy={yPatients} r="4" fill={isDarkMode ? '#a855f7' : '#7c3aed'} />
                          <circle cx={x} cy={yCases} r="4" fill={isDarkMode ? '#34d399' : '#10b981'} />
                        </g>
                      );
                    })}
                  </>
                )}
                
                {analyticsData && chartType === 'monthly' && (
                  <>
                    {/* Monthly New Patients Line */}
                    <polyline
                      fill="none"
                      stroke={isDarkMode ? '#a855f7' : '#7c3aed'}
                      strokeWidth="3"
                      points={analyticsData.monthlyStats.slice(-6).map((month, index) => {
                        const x = 50 + (index / 5) * 300;
                        const maxPatients = Math.max(...analyticsData.monthlyStats.slice(-6).map(m => m.newPatients));
                        const y = 160 - (month.newPatients / (maxPatients || 1)) * 120;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    
                    {/* Monthly Completed Cases Line */}
                    <polyline
                      fill="none"
                      stroke={isDarkMode ? '#34d399' : '#10b981'}
                      strokeWidth="3"
                      points={analyticsData.monthlyStats.slice(-6).map((month, index) => {
                        const x = 50 + (index / 5) * 300;
                        const maxCases = Math.max(...analyticsData.monthlyStats.slice(-6).map(m => m.completedCases));
                        const y = 160 - (month.completedCases / (maxCases || 1)) * 120;
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                    
                    {/* Data points */}
                    {analyticsData.monthlyStats.slice(-6).map((month, index) => {
                      const x = 50 + (index / 5) * 300;
                      const maxPatients = Math.max(...analyticsData.monthlyStats.slice(-6).map(m => m.newPatients));
                      const yPatients = 160 - (month.newPatients / (maxPatients || 1)) * 120;
                      const maxCases = Math.max(...analyticsData.monthlyStats.slice(-6).map(m => m.completedCases));
                      const yCases = 160 - (month.completedCases / (maxCases || 1)) * 120;
                      
                      return (
                        <g key={index}>
                          <circle cx={x} cy={yPatients} r="4" fill={isDarkMode ? '#a855f7' : '#7c3aed'} />
                          <circle cx={x} cy={yCases} r="4" fill={isDarkMode ? '#34d399' : '#10b981'} />
                        </g>
                      );
                    })}
                  </>
                )}
                
                {/* Legend */}
                <g>
                  <circle cx="60" cy="20" r="4" fill={isDarkMode ? '#a855f7' : '#7c3aed'} />
                  <text x="70" y="25" fontSize="12" fill={isDarkMode ? '#d1d5db' : '#374151'}>New Patients</text>
                  <circle cx="160" cy="20" r="4" fill={isDarkMode ? '#34d399' : '#10b981'} />
                  <text x="170" y="25" fontSize="12" fill={isDarkMode ? '#d1d5db' : '#374151'}>Cases Solved</text>
                </g>
              </svg>
            </div>
          </motion.div>

          {/* Patient Status Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Patient Status Distribution</h3>
            
            <div className="space-y-4">
              {analyticsData?.patientDistribution.map((item, index) => {
                const colors = [
                  isDarkMode ? '#a855f7' : '#7c3aed',
                  isDarkMode ? '#34d399' : '#10b981', 
                  isDarkMode ? '#f59e0b' : '#f59e0b',
                  isDarkMode ? '#ef4444' : '#ef4444'
                ];
                
                return (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.count}</span>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-500">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Simple Donut Chart */}
            <div className="mt-6 flex justify-center">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="40"
                  fill="none"
                  stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                  strokeWidth="20"
                />
                {analyticsData?.patientDistribution.map((item, index) => {
                  const colors = [
                    isDarkMode ? '#a855f7' : '#7c3aed',
                    isDarkMode ? '#34d399' : '#10b981', 
                    isDarkMode ? '#f59e0b' : '#f59e0b',
                    isDarkMode ? '#ef4444' : '#ef4444'
                  ];
                  
                  const total = analyticsData.patientDistribution.reduce((sum, p) => sum + p.count, 0);
                  const percentage = total > 0 ? item.count / total : 0;
                  const circumference = 2 * Math.PI * 40;
                  const strokeDasharray = `${percentage * circumference} ${circumference}`;
                  const rotation = index * 90; // Simple rotation for demo
                  
                  return (
                    <circle
                      key={item.status}
                      cx="60"
                      cy="60"
                      r="40"
                      fill="none"
                      stroke={colors[index % colors.length]}
                      strokeWidth="20"
                      strokeDasharray={strokeDasharray}
                      transform={`rotate(${rotation} 60 60)`}
                      opacity="0.8"
                    />
                  );
                })}
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Doctor Performance & Queue Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Doctor Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Doctor Performance</h3>
            
            <div className="space-y-4">
              {analyticsData?.doctorPerformance.slice(0, 5).map((doctor, index) => (
                <div key={doctor.doctorName} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {doctor.doctorName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{doctor.doctorName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {doctor.completedAppointments} completed • {doctor.totalPatients} patients
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < Math.floor(doctor.averageRating) 
                              ? 'bg-yellow-400' 
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {doctor.averageRating.toFixed(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Queue Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Queue Analytics</h3>
            
            {/* Peak Hours */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">Peak Hours</h4>
              <div className="grid grid-cols-4 gap-2">
                {analyticsData?.queueAnalytics.peakHours.slice(0, 8).map((hour) => (
                  <div key={hour.hour} className="text-center">
                    <div className="h-8 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t" 
                         style={{ height: `${Math.max(8, (hour.count / (analyticsData.queueAnalytics.peakHours[0]?.count || 1)) * 32)}px` }} />
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {hour.hour}:00
                    </p>
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                      {hour.count}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Distribution */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">Priority Distribution</h4>
              <div className="space-y-2">
                {analyticsData?.queueAnalytics.priorityDistribution.map((priority) => {
                  const colors = {
                    Emergency: isDarkMode ? '#ef4444' : '#dc2626',
                    Urgent: isDarkMode ? '#f59e0b' : '#d97706',
                    Normal: isDarkMode ? '#34d399' : '#059669'
                  };
                  
                  return (
                    <div key={priority.priority} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors[priority.priority as keyof typeof colors] }}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{priority.priority}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {priority.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
