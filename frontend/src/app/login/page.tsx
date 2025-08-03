'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/stores/auth-store';
import { authAPI } from '@/lib/api';
import type { AuthResponse } from '@/lib/stores/auth-store';
import { 
  Eye, 
  EyeOff, 
  Heart, 
  Shield, 
  Award, 
  Users, 
  CheckCircle,
  Star,
  Lock,
  Mail,
  Sparkles
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    email: 'admin@clinic.com',
    password: 'AdminPass123!'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router, isClient]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const authResponse: AuthResponse = await authAPI.login(formData.email, formData.password);
      login(authResponse.user, authResponse.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Don't render until client-side
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
          <p className="text-purple-700 font-medium">Loading Allo Health...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-64 h-64 bg-purple-100/40 dark:bg-purple-800/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 80, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 right-20 w-48 h-48 bg-pink-100/40 dark:bg-pink-800/30 rounded-full blur-2xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/30 dark:bg-indigo-800/20 rounded-full blur-3xl"
        />
      </div>

      {/* Left Side - Branding Section */}
      <div className="lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full text-center lg:text-left"
        >
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center lg:justify-start mb-8"
          >
            <div className="w-20 h-20 bg-white/90 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-gray-200/50 shadow-xl">
              <img 
                src="https://www.allohealth.com/assets/lovable-uploads/allo-logo-v1.svg" 
                alt="Allo Health Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
          </motion.div>

          {/* Branding Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="mb-6">
              <h1 className="text-4xl lg:text-5xl font-bold text-purple-800 dark:text-purple-300 mb-2">
                Welcome to Allo
              </h1>
              <h2 className="text-2xl lg:text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Your trusted sexual wellness clinic
              </h2>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-200/50 dark:border-gray-700/50"
            >
              <p className="text-lg font-medium text-center text-gray-700 dark:text-gray-300 mb-2">
                Professional • Confidential • Caring
              </p>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-lg text-gray-600 dark:text-gray-400 text-center lg:text-left"
            >
              Science-backed solutions for sexual health, delivered with care
            </motion.p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
                <Award className="h-8 w-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">85%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Improved Performance</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-1">92%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Improved Relationships</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
                <Users className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">Doctor + Therapist</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Follow-up Included</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">Labs + Protocols</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Clinically Certified</p>
            </div>
          </motion.div>

          {/* Additional Trust Elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-10 pt-8 border-t border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-semibold">4.9/5 Rating</span>
              <span>•</span>
              <span>50,000+ Happy Clients</span>
              <span>•</span>
              <span>NABL Certified</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 lg:p-10">
            {/* Form Header */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Admin Portal
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Access your Allo Health dashboard
              </p>
              
              {/* Demo Credentials */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">Demo Access</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300">
                      <strong>Email:</strong> admin@clinic.com
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300">
                      <strong>Password:</strong> AdminPass123!
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Login Form */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    placeholder="admin@clinic.com"
                    defaultValue="admin@clinic.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    placeholder="AdminPass123!"
                    defaultValue="AdminPass123!"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3"
                  >
                    <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Access Dashboard</span>
                    <Sparkles className="h-5 w-5" />
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Secured by Allo Health</span>
                <span>•</span>
                <span>ISO 27001 Certified</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
