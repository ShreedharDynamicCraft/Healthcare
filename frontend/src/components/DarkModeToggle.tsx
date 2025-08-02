'use client';

import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/lib/stores/theme-store';
import { motion } from 'framer-motion';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800/30 dark:to-pink-800/30 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-200 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDarkMode ? 180 : 0,
          scale: isDarkMode ? 0.8 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {isDarkMode ? (
          <Moon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-600" />
        )}
      </motion.div>
    </motion.button>
  );
}
