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
  FileSpreadsheet,
  UserCheck,
  UserX,
  Stethoscope,
  Clock,
  Badge
} from 'lucide-react';
import { doctorsAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  gender: string;
  location: string;
  status: 'available' | 'busy' | 'off-duty';
  availability: any;
  bio: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SortConfig {
  key: keyof Doctor;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  specialization: string;
  status: string;
  gender: string;
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
    status: '',
    gender: '',
    isActive: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);

  // Fetch doctors data
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorsAPI.getAll();
      console.log('Doctors API response:', response);
      
      // Use real backend data with proper data access
      const doctorsData = response?.data || response || [];
      
      setDoctors(doctorsData);
      toast.success(`Loaded ${doctorsData.length} specialists from database`);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      toast.error('Failed to load specialists data from backend');
      setDoctors([]);
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
      
      const matchesStatus = filters.status === '' || 
        doctor.status === filters.status;
      
      const matchesGender = filters.gender === '' || 
        doctor.gender === filters.gender;
      
      const matchesActive = filters.isActive === '' || 
        (filters.isActive === 'active' && doctor.isActive) ||
        (filters.isActive === 'inactive' && !doctor.isActive);

      return matchesSearch && matchesSpecialization && matchesStatus && matchesGender && matchesActive;
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

  // Get unique specializations for filter
  const specializations = Array.from(new Set(doctors.map((doctor: Doctor) => doctor.specialization)));
  const statuses = ['available', 'busy', 'off-duty'];
  const genders = Array.from(new Set(doctors.map((doctor: Doctor) => doctor.gender)));

  // Generate avatar URL
  const getAvatarUrl = (doctor: Doctor) => {
    if (doctor.avatar) return doctor.avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${doctor.firstName} ${doctor.lastName}`
    )}&size=128&background=random&format=png`;
  };

  // Get status badge styles
  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) {
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
    
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'busy':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'off-duty':
        return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950 dark:via-gray-900 dark:to-pink-950">
          <div className="p-6">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading specialists...</span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950 dark:via-gray-900 dark:to-pink-950">
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Healthcare Specialists
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and view all healthcare specialists in the system
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <DarkModeToggle />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchDoctors()}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Users className="h-4 w-4" />
                Refresh
              </motion.button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Specialists</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{doctors.length}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
                  <p className="text-2xl font-bold text-green-600">{doctors.filter(d => d.status === 'available' && d.isActive).length}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Busy</p>
                  <p className="text-2xl font-bold text-yellow-600">{doctors.filter(d => d.status === 'busy' && d.isActive).length}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Off Duty</p>
                  <p className="text-2xl font-bold text-red-600">{doctors.filter(d => d.status === 'off-duty' || !d.isActive).length}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search specialists by name, email, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
              </motion.button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <select
                    value={filters.specialization}
                    onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>

                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Statuses</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                  </select>

                  <select
                    value={filters.gender}
                    onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Genders</option>
                    {genders.map(gender => (
                      <option key={gender} value={gender}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</option>
                    ))}
                  </select>

                  <select
                    value={filters.isActive}
                    onChange={(e) => setFilters(prev => ({ ...prev, isActive: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All States</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Specialists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredAndSortedDoctors.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getAvatarUrl(doctor)}
                        alt={`${doctor.firstName} ${doctor.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(doctor.status, doctor.isActive)}`}>
                          {!doctor.isActive ? 'Inactive' : doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Stethoscope className="h-4 w-4" />
                      <span>{doctor.specialization}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{doctor.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      <span>{doctor.phone}</span>
                    </div>

                    {doctor.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                        <span>{doctor.location}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Badge className="h-4 w-4" />
                      <span>{doctor.gender}</span>
                    </div>
                  </div>

                  {doctor.bio && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {doctor.bio}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                      <span>Joined: {new Date(doctor.createdAt).toLocaleDateString()}</span>
                      <span>ID: {doctor.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredAndSortedDoctors.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No specialists found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || Object.values(filters).some(f => f) 
                  ? "Try adjusting your search criteria or filters"
                  : "No specialists have been added to the system yet"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
