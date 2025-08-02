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
  Shield
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: Home, description: 'Overview & analytics', href: '/dashboard' },
  { name: 'Patient Queue', icon: Clock, description: 'Manage patient flow', href: '/dashboard' },
  { name: 'Healthcare Team', icon: Users, description: 'Specialist management', href: '/dashboard' },
  { name: 'Consultations', icon: Calendar, description: 'Schedule appointments', href: '/dashboard' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
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
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative flex-1 flex flex-col max-w-xs w-full bg-white/95 backdrop-blur-xl shadow-2xl border-r border-purple-200/50"
            >
              <div className="flex items-center justify-between p-6 border-b border-purple-100/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img 
                      src="https://www.allohealth.com/assets/lovable-uploads/allo-logo-v1.svg" 
                      alt="Allo Health Logo" 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Allo Health</h1>
                    <p className="text-sm text-purple-600">Sexual Wellness Platform</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-gray-400 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <nav className="flex-1 px-6 py-4 space-y-2">
                {navigation.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200"
                    >
                      <Icon className="h-5 w-5 text-purple-500" />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </motion.a>
                  );
                })}
              </nav>

              {/* User Profile Section */}
              <div className="p-6 border-t border-purple-100/50 bg-gradient-to-r from-purple-50/30 to-pink-50/30">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold text-sm">
                      {user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 rounded-xl transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0">
        <motion.div 
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex-1 flex flex-col min-h-0 bg-white/95 backdrop-blur-xl border-r border-purple-200/50 shadow-xl"
        >
          <div className="flex items-center justify-between p-6 border-b border-purple-100/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="https://www.allohealth.com/assets/lovable-uploads/allo-logo-v1.svg" 
                  alt="Allo Health Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Allo Health</h1>
                <p className="text-sm text-purple-600">Sexual Wellness Platform</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-6 py-6 space-y-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-4 rounded-2xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 transition-all duration-200 group"
                >
                  <Icon className="h-5 w-5 text-purple-500 group-hover:text-purple-600" />
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                </motion.a>
              );
            })}
          </nav>

          {/* Trust Indicator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mx-6 mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-800">Secure & Confidential</span>
            </div>
            <p className="text-xs text-purple-600">Your patient data is protected with enterprise-grade security.</p>
          </motion.div>

          {/* User Profile Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="p-6 border-t border-purple-100/50 bg-gradient-to-r from-purple-50/30 to-pink-50/30"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-sm">
                  {user?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm text-gray-500">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 rounded-xl transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80 flex flex-col flex-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/95 backdrop-blur-xl shadow-sm border-b border-purple-200/50"
        >
          <div className="flex items-center justify-between w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Display */}
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-purple-600">{user?.email}</div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-semibold text-sm">
                    {user?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 