'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Clock, 
  Users, 
  Calendar, 
  Menu, 
  X, 
  LogOut,
  Heart,
  Sparkles,
  Shield,
  Settings,
  BarChart3,
  UserPlus,
  FileText,
  Bell,
  ChevronDown,
  Activity
} from 'lucide-react';

const navigation = [
  { 
    name: 'Overview', 
    icon: Home, 
    description: 'Dashboard analytics', 
    href: '/dashboard',
    section: 'main'
  },
  { 
    name: 'Client Queue', 
    icon: Clock, 
    description: 'Live patient flow', 
    href: '/dashboard',
    section: 'main'
  },
  { 
    name: 'Specialists', 
    icon: Users, 
    description: 'Team management', 
    href: '/dashboard',
    section: 'main'
  },
  { 
    name: 'Appointments', 
    icon: Calendar, 
    description: 'Schedule & booking', 
    href: '/dashboard',
    section: 'main'
  },
  { 
    name: 'Analytics', 
    icon: BarChart3, 
    description: 'Reports & insights', 
    href: '/dashboard',
    section: 'admin'
  },
  { 
    name: 'User Management', 
    icon: UserPlus, 
    description: 'Staff & access', 
    href: '/dashboard',
    section: 'admin'
  },
  { 
    name: 'Settings', 
    icon: Settings, 
    description: 'System config', 
    href: '/dashboard',
    section: 'admin'
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const mainNavItems = navigation.filter(item => item.section === 'main');
  const adminNavItems = navigation.filter(item => item.section === 'admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <motion.div 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative flex-1 flex flex-col max-w-xs w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-r border-purple-200/50 dark:border-purple-800/50"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b border-purple-100/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/30 dark:to-pink-900/30">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <img 
                      src="https://www.allohealth.com/assets/lovable-uploads/allo-logo-v1.svg" 
                      alt="Allo Health" 
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Allo Health</h1>
                    <p className="text-xs text-purple-600 dark:text-purple-400">Admin Panel</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Mobile Navigation */}
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {/* Main Section */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2">Main</p>
                  {mainNavItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.a
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        href={item.href}
                        className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 group"
                      >
                        <Icon className="h-4 w-4 text-purple-500 group-hover:text-purple-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.description}</div>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>

                {/* Admin Section */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2">Administration</p>
                  {adminNavItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.a
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (mainNavItems.length + index) * 0.05 }}
                        href={item.href}
                        className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 group"
                      >
                        <Icon className="h-4 w-4 text-purple-500 group-hover:text-purple-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.description}</div>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </nav>

              {/* Mobile User Profile */}
              <div className="p-4 border-t border-purple-100/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/30 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {user?.firstName?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/30 dark:hover:to-red-800/30 hover:text-red-700 dark:hover:text-red-300 rounded-xl transition-all duration-200 text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <motion.div 
          initial={{ x: -256 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex-1 flex flex-col min-h-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-purple-200/50 dark:border-purple-800/50 shadow-xl"
        >
          {/* Desktop Header */}
          <div className="flex items-center justify-between p-4 border-b border-purple-100/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/30 dark:to-pink-900/30">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src="https://www.allohealth.com/assets/lovable-uploads/allo-logo-v1.svg" 
                  alt="Allo Health" 
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Allo Health</h1>
                <p className="text-xs text-purple-600 dark:text-purple-400">Admin Panel</p>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {/* Main Section */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2">Main</p>
              {mainNavItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 group"
                  >
                    <Icon className="h-5 w-5 text-purple-500 group-hover:text-purple-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Admin Section */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2">Administration</p>
              {adminNavItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (mainNavItems.length + index) * 0.05 + 0.2 }}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 group"
                  >
                    <Icon className="h-5 w-5 text-purple-500 group-hover:text-purple-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </nav>

          {/* Status Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mx-3 mb-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">System Status</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">All systems operational</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </motion.div>

          {/* Desktop User Profile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="p-4 border-t border-purple-100/50 dark:border-purple-800/50 bg-gradient-to-r from-purple-50/30 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/20"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-semibold">
                  {user?.firstName?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 dark:text-white truncate">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/30 dark:hover:to-red-800/30 hover:text-red-700 dark:hover:text-red-300 rounded-xl transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-10 flex-shrink-0 flex h-14 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-sm border-b border-purple-200/50 dark:border-purple-800/50"
        >
          <div className="flex items-center justify-between w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 relative">
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </button>

              {/* Live Status */}
              <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Live</span>
              </div>

              {/* User Display */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400">Administrator</div>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-xs">
                    {user?.firstName?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <main className="flex-1">
          <div className="py-4 lg:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 