'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { 
  Heart, 
  ArrowLeft, 
  Home, 
  Calendar,
  Clock,
  Sparkles,
  Quote,
  Search,
  Shield
} from 'lucide-react';

const healthQuotes = [
  {
    quote: "Sexual health is an integral part of overall health and wellbeing. It requires positive and respectful approaches to sexuality.",
    author: "World Health Organization"
  },
  {
    quote: "Open communication about sexual health creates stronger relationships and better healthcare outcomes.",
    author: "American Medical Association"
  },
  {
    quote: "Every individual has the right to sexual health information, education, and services without discrimination.",
    author: "Sexual Rights Declaration"
  },
  {
    quote: "Understanding your body and its needs is fundamental to maintaining both physical and emotional wellness.",
    author: "International Federation of Gynecology"
  },
  {
    quote: "Sexual wellness encompasses physical health, emotional balance, and the freedom to express oneself authentically.",
    author: "Global Sexual Health Institute"
  }
];

export default function DashboardNotFound() {
  const router = useRouter();
  const [currentQuote, setCurrentQuote] = useState(0);

  // Quote rotation
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % healthQuotes.length);
    }, 5000);

    return () => clearInterval(quoteTimer);
  }, []);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleGoBack = () => {
    router.back();
  };

  const quickLinks = [
    { name: 'Dashboard Overview', href: '/dashboard', icon: Home },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Patient Queue', href: '/dashboard/queue', icon: Clock },
    { name: 'Analytics', href: '/dashboard/analytics', icon: Search }
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen flex items-center justify-center p-4 -mt-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* 404 Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              404
            </div>
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
            >
              <Heart className="h-6 w-6 text-white" />
            </motion.div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Page Not Found in Healthcare System
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The healthcare resource you're looking for might have been moved, deleted, or is temporarily unavailable. 
              Let's get you back to managing your health services.
            </p>
          </motion.div>

          {/* Sexual Wellbeing Quote */}
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl p-6 shadow-lg border border-purple-200 dark:border-purple-800 max-w-3xl mx-auto"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                <Quote className="h-5 w-5 text-white" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <h3 className="text-base font-semibold text-purple-900 dark:text-purple-300">
                    Health & Wellness Insight
                  </h3>
                </div>
                <blockquote className="text-base italic text-gray-700 dark:text-gray-300 leading-relaxed">
                  "{healthQuotes[currentQuote].quote}"
                </blockquote>
                <cite className="text-sm font-medium text-purple-600 dark:text-purple-400 block">
                  — {healthQuotes[currentQuote].author}
                </cite>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl p-6 shadow-lg border border-purple-100 dark:border-purple-900"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              Quick Navigation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(link.href)}
                    className="flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300"
                  >
                    <Icon className="h-6 w-6 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                      {link.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoToDashboard}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              <Home className="h-5 w-5" />
              Go to Dashboard
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoBack}
              className="flex items-center gap-3 px-8 py-4 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold border border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </motion.button>
          </motion.div>

          {/* Healthcare Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-6 max-w-2xl mx-auto border border-emerald-200 dark:border-emerald-800"
          >
            <div className="flex items-center gap-3 mb-3">
              <Heart className="h-6 w-6 text-emerald-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Comprehensive Healthcare Support
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Our healthcare management system provides complete support for all aspects of wellness, 
              including sexual health services. We're committed to creating a safe, professional 
              environment for all your healthcare needs.
            </p>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
