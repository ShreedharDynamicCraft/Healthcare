'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  ArrowLeft, 
  Home, 
  LogIn, 
  Clock,
  Sparkles,
  Quote,
  RefreshCw
} from 'lucide-react';

const wellbeingQuotes = [
  {
    quote: "Sexual health is a fundamental aspect of overall wellbeing, deserving of care, respect, and understanding.",
    author: "World Health Organization"
  },
  {
    quote: "Healthy relationships and open communication are the foundation of sexual wellness and personal happiness.",
    author: "Dr. Emily Nagoski"
  },
  {
    quote: "Understanding your body and its needs is the first step toward a fulfilling and healthy intimate life.",
    author: "American Sexual Health Association"
  },
  {
    quote: "Sexual wellness is not just about physical health—it encompasses emotional, mental, and relational wellbeing.",
    author: "International Society for Sexual Medicine"
  },
  {
    quote: "Every person deserves access to comprehensive sexual health information and care without judgment.",
    author: "Planned Parenthood Federation"
  },
  {
    quote: "Consent, communication, and mutual respect are the pillars of healthy intimate relationships.",
    author: "Sexual Health Alliance"
  },
  {
    quote: "Your sexual health journey is unique to you—embrace it with self-compassion and professional guidance when needed.",
    author: "National Sexual Health Association"
  },
  {
    quote: "Breaking the silence around sexual health creates space for healing, growth, and authentic connections.",
    author: "Center for Sexual Health"
  },
  {
    quote: "Sexual wellness education empowers individuals to make informed decisions about their bodies and relationships.",
    author: "Sexual Information and Education Council"
  },
  {
    quote: "Celebrating diversity in sexual expression and identity creates a healthier, more inclusive world for everyone.",
    author: "Global Alliance for Sexual Health"
  }
];

export default function NotFoundPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Countdown timer for auto-redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true);
          router.push('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  // Quote rotation
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % wellbeingQuotes.length);
    }, 4000);

    return () => clearInterval(quoteTimer);
  }, []);

  const handleManualRedirect = () => {
    setIsRedirecting(true);
    router.push('/login');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* 404 Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            404
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center"
          >
            <Heart className="h-8 w-8 text-white" />
          </motion.div>
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Oops! The page you're looking for seems to have wandered off. 
            Don't worry, we'll help you find your way back to better health.
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl p-6 shadow-lg border border-purple-100 dark:border-purple-900 max-w-md mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="h-6 w-6 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Auto Redirect
            </h3>
          </div>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {countdown}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Redirecting to login in {countdown} second{countdown !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: `${(countdown / 5) * 100}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Sexual Wellbeing Quote */}
        <motion.div
          key={currentQuote}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl p-8 shadow-lg border border-purple-200 dark:border-purple-800 max-w-3xl mx-auto"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Quote className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300">
                  Sexual Wellbeing Wisdom
                </h3>
              </div>
              <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 leading-relaxed">
                "{wellbeingQuotes[currentQuote].quote}"
              </blockquote>
              <cite className="text-sm font-medium text-purple-600 dark:text-purple-400 block">
                — {wellbeingQuotes[currentQuote].author}
              </cite>
            </div>
          </div>
          
          {/* Quote indicator dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {wellbeingQuotes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuote(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentQuote 
                    ? 'bg-purple-500 w-6' 
                    : 'bg-purple-300 dark:bg-purple-600 hover:bg-purple-400'
                }`}
              />
            ))}
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
            onClick={handleManualRedirect}
            disabled={isRedirecting}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white shadow-lg transition-all duration-300 ${
              isRedirecting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            }`}
          >
            {isRedirecting ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                Go to Login
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoHome}
            className="flex items-center gap-3 px-8 py-4 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold border border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300"
          >
            <Home className="h-5 w-5" />
            Go Home
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="flex items-center gap-3 px-8 py-4 bg-transparent text-purple-600 dark:text-purple-400 rounded-2xl font-semibold border-2 border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
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
          className="bg-white/50 backdrop-blur-xl dark:bg-gray-800/50 rounded-2xl p-6 max-w-2xl mx-auto border border-purple-100 dark:border-purple-800"
        >
          <div className="flex items-center gap-3 mb-3">
            <Heart className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Health Journey Continues
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            At Allo Health, we believe that every aspect of your wellbeing—including sexual health—deserves 
            professional care and attention. Our comprehensive healthcare platform is here to support you 
            on your journey to optimal health.
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-gray-500 dark:text-gray-400 space-y-2"
        >
          <p>If you believe this is an error, please contact our support team.</p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <span>© 2025 Allo Health</span>
            <span>•</span>
            <span>Comprehensive Healthcare Solutions</span>
            <span>•</span>
            <span>Sexual Wellness & Beyond</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
