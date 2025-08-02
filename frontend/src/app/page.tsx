'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Stethoscope, Activity, Heart } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, router, isClient]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 flex items-center justify-center">
      <div className="text-center animate-fadeIn">
        <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/30">
          <img 
            src="https://www.allohealth.com/assets/lovable-uploads/allo-logo-v1.svg" 
            alt="Allo Health Logo" 
            className="w-16 h-16 object-contain filter brightness-0 invert"
          />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Allo Health
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Your trusted sexual wellness platform
        </p>
        
        <div className="flex items-center justify-center space-x-8 mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-6 text-gray-400 dark:text-gray-500">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-purple-500" />
            <span className="text-xs">Client Care</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-pink-500" />
            <span className="text-xs">Wellness Support</span>
          </div>
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-4 w-4 text-indigo-500" />
            <span className="text-xs">Expert Consultations</span>
          </div>
        </div>
      </div>
    </div>
  );
} 