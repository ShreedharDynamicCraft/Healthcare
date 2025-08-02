'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DarkModeToggle from '@/components/DarkModeToggle';
import { 
  Users, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Download, 
  Plus,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  MoreVertical,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { doctorsAPI, analyticsAPI } from '@/lib/api';
import { exportToPDF, exportToCSV } from '@/lib/exportUtils';
import { toast } from 'react-hot-toast';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  avatar?: string;
  isActive: boolean;
  rating?: number;
  location?: string;
  consultationFee?: number;
  availableSlots?: number;
  totalPatients?: number;
  createdAt: string;
}

interface SortConfig {
  key: keyof Doctor;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  specialization: string;
  experience: string;
  isActive: string;
  search: string;
}

export default function SpecialistsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'firstName', direction: 'asc' });
  const [filters, setFilters] = useState<FilterConfig>({
    specialization: '',
    experience: '',
    isActive: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  // Fetch doctors data
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorsAPI.getAll();
      // Add mock additional data for better UI
      const enrichedDoctors = response.map((doctor: any) => ({
        ...doctor,
        rating: Math.random() * 2 + 3, // 3-5 star rating
        location: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
        consultationFee: Math.floor(Math.random() * 200) + 100, // $100-300
        availableSlots: Math.floor(Math.random() * 10) + 1, // 1-10 slots
        totalPatients: Math.floor(Math.random() * 500) + 50, // 50-550 patients
      }));
      setDoctors(enrichedDoctors);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      toast.error('Failed to load specialists data');
      // Fallback data for development
      setDoctors([
        {
          id: '1',
          firstName: 'Dr. Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@alloheath.com',
          phone: '+1 (555) 123-4567',
          specialization: 'Sexual Health',
          experience: 8,
          avatar: '',
          isActive: true,
          rating: 4.8,
          location: 'New York',
          consultationFee: 250,
          availableSlots: 5,
          totalPatients: 324,
          createdAt: '2023-01-15T10:00:00Z'
        },
        {
          id: '2',
          firstName: 'Dr. Michael',
          lastName: 'Chen',
          email: 'michael.chen@alloheath.com',
          phone: '+1 (555) 987-6543',
          specialization: 'Reproductive Health',
          experience: 12,
          avatar: '',
          isActive: true,
          rating: 4.9,
          location: 'Los Angeles',
          consultationFee: 300,
          availableSlots: 3,
          totalPatients: 456,
          createdAt: '2022-06-20T14:30:00Z'
        },
        {
          id: '3',
          firstName: 'Dr. Emily',
          lastName: 'Davis',
          email: 'emily.davis@alloheath.com',
          phone: '+1 (555) 456-7890',
          specialization: 'Wellness Counseling',
          experience: 6,
          avatar: '',
          isActive: false,
          rating: 4.6,
          location: 'Chicago',
          consultationFee: 180,
          availableSlots: 0,
          totalPatients: 189,
          createdAt: '2023-03-10T09:15:00Z'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filtered and sorted doctors
  const filteredAndSortedDoctors = useMemo(() => {
    let filtered = doctors.filter(doctor => {
      const matchesSearch = searchTerm === '' || 
        `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecialization = filters.specialization === '' || 
        doctor.specialization === filters.specialization;
      
      const matchesExperience = filters.experience === '' || 
        (filters.experience === '0-5' && doctor.experience <= 5) ||
        (filters.experience === '6-10' && doctor.experience >= 6 && doctor.experience <= 10) ||
        (filters.experience === '10+' && doctor.experience > 10);
      
      const matchesActive = filters.isActive === '' || 
        (filters.isActive === 'active' && doctor.isActive) ||
        (filters.isActive === 'inactive' && !doctor.isActive);

      return matchesSearch && matchesSpecialization && matchesExperience && matchesActive;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      // Handle string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [doctors, searchTerm, filters, sortConfig]);

  // Handle sorting
  const handleSort = (key: keyof Doctor) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle export
  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      setExporting(true);
      const filterData = {
        selectedIds: selectedDoctors.length > 0 ? selectedDoctors : undefined,
        filters: {
          ...filters,
          search: searchTerm
        }
      };
      
      // Try API export first
      try {
        const blob = await analyticsAPI.exportData(format, 'doctors', filterData);
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `specialists-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success(`Specialists data exported as ${format.toUpperCase()}`);
      } catch (apiError) {
        // Fallback to local export
        console.log('API export failed, using local export:', apiError);
        
        const dataToExport = selectedDoctors.length > 0 
          ? doctors.filter(d => selectedDoctors.includes(d.id))
          : filteredAndSortedDoctors;
        
        const filename = `specialists-${new Date().toISOString().split('T')[0]}.${format}`;
        
        if (format === 'csv') {
          exportToCSV(dataToExport, filename);
        } else {
          exportToPDF(dataToExport, filename, 'Healthcare Specialists Report');
        }
        
        toast.success(`Specialists data exported as ${format.toUpperCase()}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  // Get unique specializations for filter
  const specializations = Array.from(new Set(doctors.map(doctor => doctor.specialization)));

  // Generate avatar URL
  const getAvatarUrl = (doctor: Doctor) => {
    if (doctor.avatar) return doctor.avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${doctor.firstName} ${doctor.lastName}`
    )}&size=128&background=random&format=png`;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950 dark:via-gray-900 dark:to-pink-950">
        <div className="p-6">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Specialists
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage healthcare specialists and their profiles
                  </p>
                </div>
              </div>
              <DarkModeToggle />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Specialists</p>
                    <p className="text-2xl font-bold text-purple-600">{doctors.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Specialists</p>
                    <p className="text-2xl font-bold text-green-600">
                      {doctors.filter(d => d.isActive).length}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-green-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Specializations</p>
                    <p className="text-2xl font-bold text-blue-600">{specializations.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {(doctors.reduce((acc, d) => acc + (d.rating || 0), 0) / doctors.length || 0).toFixed(1)}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800/30 mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search specialists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
                    showFilters
                      ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-800/30 dark:border-purple-600 dark:text-purple-300'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>

                {/* Export Dropdown */}
                <div className="relative group">
                  <button
                    disabled={exporting}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    <Download className="h-4 w-4" />
                    <span>{exporting ? 'Exporting...' : 'Export'}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl"
                    >
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      <span>Export as CSV</span>
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-xl"
                    >
                      <FileText className="h-4 w-4 text-red-600" />
                      <span>Export as PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Specialization
                      </label>
                      <select
                        value={filters.specialization}
                        onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All Specializations</option>
                        {specializations.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Experience
                      </label>
                      <select
                        value={filters.experience}
                        onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All Experience Levels</option>
                        <option value="0-5">0-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={filters.isActive}
                        onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing {filteredAndSortedDoctors.length} of {doctors.length} specialists
                    </p>
                    <button
                      onClick={() => {
                        setFilters({ specialization: '', experience: '', isActive: '', search: '' });
                        setSearchTerm('');
                      }}
                      className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Specialists Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 dark:border-purple-800/30 overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedDoctors.length === filteredAndSortedDoctors.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDoctors(filteredAndSortedDoctors.map(d => d.id));
                            } else {
                              setSelectedDoctors([]);
                            }
                          }}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                        onClick={() => handleSort('firstName')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Specialist</span>
                          {sortConfig.key === 'firstName' && (
                            sortConfig.direction === 'asc' ? 
                              <SortAsc className="h-4 w-4" /> : 
                              <SortDesc className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                        onClick={() => handleSort('specialization')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Specialization</span>
                          {sortConfig.key === 'specialization' && (
                            sortConfig.direction === 'asc' ? 
                              <SortAsc className="h-4 w-4" /> : 
                              <SortDesc className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                        onClick={() => handleSort('experience')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Experience</span>
                          {sortConfig.key === 'experience' && (
                            sortConfig.direction === 'asc' ? 
                              <SortAsc className="h-4 w-4" /> : 
                              <SortDesc className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Contact
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                        onClick={() => handleSort('rating')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Rating</span>
                          {sortConfig.key === 'rating' && (
                            sortConfig.direction === 'asc' ? 
                              <SortAsc className="h-4 w-4" /> : 
                              <SortDesc className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredAndSortedDoctors.map((doctor, index) => (
                      <motion.tr
                        key={doctor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedDoctors.includes(doctor.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDoctors(prev => [...prev, doctor.id]);
                              } else {
                                setSelectedDoctors(prev => prev.filter(id => id !== doctor.id));
                              }
                            }}
                            className="rounded border-gray-300 dark:border-gray-600"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={getAvatarUrl(doctor)}
                              alt={`${doctor.firstName} ${doctor.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {doctor.firstName} {doctor.lastName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {doctor.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                            {doctor.specialization}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {doctor.experience} years
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <div className="flex items-center space-x-1 mb-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span>{doctor.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span>{doctor.location}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {doctor.rating?.toFixed(1)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {doctor.totalPatients} patients
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doctor.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {doctor.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
