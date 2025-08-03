'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { 
  BookOpen, 
  Users, 
  Calendar,
  UserCheck,
  Clock,
  BarChart3,
  Settings,
  Database,
  Shield,
  Smartphone,
  Globe,
  Code,
  Heart,
  Activity,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lightbulb,
  Star,
  CheckCircle
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'features' | 'technical' | 'analytics';
}

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const sections = [
    { id: 'overview', title: 'Project Overview', icon: BookOpen },
    { id: 'features', title: 'Core Features', icon: Star },
    { id: 'modules', title: 'System Modules', icon: Settings },
    { id: 'analytics', title: 'Analytics & Reports', icon: BarChart3 },
    { id: 'technical', title: 'Technical Details', icon: Code },
    { id: 'faq', title: 'FAQ', icon: HelpCircle }
  ];

  const coreFeatures = [
    {
      icon: Users,
      title: 'Patient Management',
      description: 'Complete patient registration, profile management, and medical history tracking',
      details: [
        'Patient registration with Indian demographics',
        'Medical history and appointment tracking',
        'Contact information management',
        'Patient search and filtering'
      ]
    },
    {
      icon: UserCheck,
      title: 'Doctor Management',
      description: 'Comprehensive doctor profiles with specializations and availability',
      details: [
        'Doctor registration and profiles',
        'Specialization categorization',
        'Availability scheduling',
        'Performance tracking'
      ]
    },
    {
      icon: Calendar,
      title: 'Appointment Scheduling',
      description: 'Smart appointment booking with real-time availability',
      details: [
        'Real-time appointment booking',
        'Calendar integration',
        'Appointment status tracking',
        'Automated notifications'
      ]
    },
    {
      icon: Clock,
      title: 'Queue Management',
      description: 'Intelligent queue system with priority-based management',
      details: [
        'Priority-based queue system',
        'Real-time wait time estimation',
        'Queue status updates',
        'Emergency case handling'
      ]
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics with real-time data visualization',
      details: [
        'Real-time data visualization',
        'Patient registration trends',
        'Doctor performance metrics',
        'Custom reports and exports'
      ]
    },
    {
      icon: Shield,
      title: 'Security & Authentication',
      description: 'Secure authentication with role-based access control',
      details: [
        'JWT-based authentication',
        'Role-based access control',
        'Secure API endpoints',
        'Data encryption'
      ]
    }
  ];

  const technicalStack = [
    {
      category: 'Frontend',
      technologies: [
        { name: 'Next.js 14', description: 'React framework with App Router' },
        { name: 'TypeScript', description: 'Type-safe JavaScript' },
        { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
        { name: 'Framer Motion', description: 'Animation library' },
        { name: 'React Hot Toast', description: 'Notification system' }
      ]
    },
    {
      category: 'Backend',
      technologies: [
        { name: 'NestJS', description: 'Progressive Node.js framework' },
        { name: 'TypeORM', description: 'Object-Relational Mapping' },
        { name: 'PostgreSQL', description: 'Relational database' },
        { name: 'JWT', description: 'JSON Web Tokens for auth' },
        { name: 'Class Validator', description: 'Data validation' }
      ]
    },
    {
      category: 'Features',
      technologies: [
        { name: 'Real-time Updates', description: 'Live data synchronization' },
        { name: 'Dark/Light Mode', description: 'Theme switching system' },
        { name: 'Responsive Design', description: 'Mobile-first approach' },
        { name: 'Data Export', description: 'JSON report generation' },
        { name: 'Search & Filter', description: 'Advanced data filtering' }
      ]
    }
  ];

  const faqs: FAQItem[] = [
    {
      question: 'How do I register a new patient?',
      answer: 'Navigate to the Patients section, click "Add New Patient", fill in the required information including name, contact details, and medical history. The system supports Indian demographics and phone number formats.',
      category: 'general'
    },
    {
      question: 'How does the queue management system work?',
      answer: 'The queue system automatically prioritizes patients based on urgency (Emergency, Urgent, Normal). It calculates estimated wait times and provides real-time updates to both patients and staff.',
      category: 'features'
    },
    {
      question: 'Can I export analytics data?',
      answer: 'Yes! The analytics dashboard includes an export feature that generates comprehensive JSON reports with all metrics, charts data, and timestamps for external analysis.',
      category: 'analytics'
    },
    {
      question: 'What data does the analytics dashboard show?',
      answer: 'The dashboard displays patient registration trends, appointment statistics, doctor performance metrics, queue analytics, peak hours analysis, and success rates with interactive charts.',
      category: 'analytics'
    },
    {
      question: 'Is the application mobile-friendly?',
      answer: 'Absolutely! The application is built with a mobile-first approach using responsive design principles. It works seamlessly on desktops, tablets, and smartphones.',
      category: 'technical'
    },
    {
      question: 'How secure is the patient data?',
      answer: 'We use JWT-based authentication, role-based access control, encrypted data transmission, and follow healthcare data security best practices to protect patient information.',
      category: 'technical'
    },
    {
      question: 'Can I switch between dark and light modes?',
      answer: 'Yes! The application features a comprehensive theme system. Dark mode is enabled by default, and you can switch themes using the toggle button in the top navigation.',
      category: 'features'
    },
    {
      question: 'How often does the data refresh?',
      answer: 'The application features real-time data updates. Analytics data auto-refreshes every 5 minutes, and you can manually refresh using the refresh button for immediate updates.',
      category: 'technical'
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    activeSection === 'faq' || faq.category === activeSection
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Healthcare Management System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comprehensive guide to understanding and using our complete healthcare management solution
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl p-4 shadow-lg border border-purple-100 dark:border-purple-900"
        >
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.title}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content Sections */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Project Overview */}
          {activeSection === 'overview' && (
            <div className="space-y-8">
              <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl p-8 shadow-lg border border-purple-100 dark:border-purple-900">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="h-8 w-8 text-red-500" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Project Overview</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What is this system?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      A comprehensive healthcare management system designed to streamline clinic operations, 
                      manage patient appointments, track medical records, and provide real-time analytics 
                      for healthcare providers.
                    </p>
                    
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Benefits</h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Streamlined patient registration and management
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Intelligent appointment scheduling system
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Real-time queue management with priority handling
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Comprehensive analytics and reporting
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Secure authentication and data protection
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Target Users</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <UserCheck className="h-6 w-6 text-blue-500 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Healthcare Administrators</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Manage overall clinic operations, view analytics, and oversee staff performance
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Activity className="h-6 w-6 text-green-500 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Medical Staff</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Access patient information, manage appointments, and track medical records
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Users className="h-6 w-6 text-purple-500 mt-1" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">Reception Staff</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Handle patient registration, appointment booking, and queue management
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Core Features */}
          {activeSection === 'features' && (
            <div className="space-y-8">
              <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl p-8 shadow-lg border border-purple-100 dark:border-purple-900">
                <div className="flex items-center gap-3 mb-8">
                  <Star className="h-8 w-8 text-yellow-500" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Core Features</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {coreFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <Icon className="h-6 w-6 text-purple-500" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {feature.description}
                        </p>
                        <ul className="space-y-2">
                          {feature.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* System Modules */}
          {activeSection === 'modules' && (
            <div className="space-y-8">
              <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl p-8 shadow-lg border border-purple-100 dark:border-purple-900">
                <div className="flex items-center gap-3 mb-8">
                  <Settings className="h-8 w-8 text-blue-500" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">System Modules</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="border-l-4 border-purple-500 pl-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Dashboard</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        Central hub providing overview of all system activities with quick access to key metrics.
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Real-time statistics display</li>
                        <li>• Quick navigation to all modules</li>
                        <li>• System notifications and alerts</li>
                        <li>• Dark/Light theme toggle</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Patients Module</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        Comprehensive patient management with Indian demographics and medical history.
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Patient registration and profiles</li>
                        <li>• Medical history tracking</li>
                        <li>• Contact information management</li>
                        <li>• Search and filter capabilities</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 pl-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Specialists Module</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        Doctor management with specializations and performance tracking.
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Doctor profiles and credentials</li>
                        <li>• Specialization categorization</li>
                        <li>• Availability management</li>
                        <li>• Performance analytics</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-orange-500 pl-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Appointments Module</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        Smart scheduling system with calendar integration and real-time updates.
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Calendar-based booking interface</li>
                        <li>• Appointment status management</li>
                        <li>• Automated conflict detection</li>
                        <li>• Notification system</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Queue Management</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        Intelligent queue system with priority handling and wait time estimation.
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Priority-based queue ordering</li>
                        <li>• Real-time wait time calculation</li>
                        <li>• Emergency case handling</li>
                        <li>• Queue status updates</li>
                      </ul>
                    </div>
                    
                    <div className="border-l-4 border-yellow-500 pl-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analytics Module</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        Comprehensive reporting with interactive charts and data visualization.
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Real-time data visualization</li>
                        <li>• Custom time range analysis</li>
                        <li>• Export functionality</li>
                        <li>• Performance metrics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics & Reports */}
          {activeSection === 'analytics' && (
            <div className="space-y-8">
              <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl p-8 shadow-lg border border-purple-100 dark:border-purple-900">
                <div className="flex items-center gap-3 mb-8">
                  <BarChart3 className="h-8 w-8 text-green-500" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Available Analytics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6">
                        <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">Patient Registration Trends</h4>
                        <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                          <li>• Daily/Monthly registration charts</li>
                          <li>• Interactive bar graphs</li>
                          <li>• Trend analysis with percentages</li>
                          <li>• Peak registration periods</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6">
                        <h4 className="font-semibold text-green-900 dark:text-green-300 mb-3">Appointment Analytics</h4>
                        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                          <li>• Appointment status distribution</li>
                          <li>• Completion rates</li>
                          <li>• Appointment type analysis</li>
                          <li>• Success rate metrics</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">Doctor Performance</h4>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• Individual doctor metrics</li>
                          <li>• Patient satisfaction ratings</li>
                          <li>• Appointment completion rates</li>
                          <li>• Performance comparisons</li>
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-6">
                        <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-3">Queue Analytics</h4>
                        <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                          <li>• Average wait times</li>
                          <li>• Peak hour analysis</li>
                          <li>• Priority distribution</li>
                          <li>• Queue efficiency metrics</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Chart Types</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Bar Charts</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Patient registration trends</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <Activity className="h-5 w-5 text-green-500" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Line Charts</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Trend analysis over time</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="h-5 w-5 bg-blue-500 rounded-full" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Donut Charts</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Distribution percentages</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Export Features</h4>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• JSON data export</li>
                        <li>• Timestamped reports</li>
                        <li>• Complete analytics package</li>
                        <li>• Custom date ranges</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Technical Details */}
          {activeSection === 'technical' && (
            <div className="space-y-8">
              <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl p-8 shadow-lg border border-purple-100 dark:border-purple-900">
                <div className="flex items-center gap-3 mb-8">
                  <Code className="h-8 w-8 text-indigo-500" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Technical Details</h2>
                </div>
                
                <div className="space-y-8">
                  {technicalStack.map((stack, index) => (
                    <motion.div
                      key={stack.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                        {stack.category} Technologies
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stack.technologies.map((tech, techIndex) => (
                          <div
                            key={tech.name}
                            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                          >
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                              {tech.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {tech.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Architecture Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Full-Stack TypeScript</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        End-to-end type safety from database to user interface, reducing bugs and improving development experience.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Real-time Data</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Live data synchronization with automatic updates, ensuring users always see current information.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Responsive Design</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mobile-first approach with adaptive layouts that work seamlessly across all device sizes.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Security First</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        JWT authentication, role-based access, and encrypted data transmission for healthcare compliance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {activeSection === 'faq' && (
            <div className="space-y-8">
              <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl p-8 shadow-lg border border-purple-100 dark:border-purple-900">
                <div className="flex items-center gap-3 mb-8">
                  <HelpCircle className="h-8 w-8 text-purple-500" />
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                </div>
                
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="font-medium text-gray-900 dark:text-white pr-4">
                          {faq.question}
                        </span>
                        {expandedFAQ === index ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFAQ === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4"
                        >
                          <p className="text-gray-600 dark:text-gray-400">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Need More Help?</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    If you have additional questions or need technical support, here are some resources:
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                    <li>• Check the system status indicators in each module</li>
                    <li>• Use the search functionality to find specific patients or appointments</li>
                    <li>• Export analytics data for detailed analysis</li>
                    <li>• Refresh the page if you experience any display issues</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
