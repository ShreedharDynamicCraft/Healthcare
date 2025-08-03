'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DarkModeToggle from '@/components/DarkModeToggle';
import DoctorForm from '@/components/dashboard/DoctorForm';
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
  Badge,
  Award,
  Activity,
  Heart,
  Shield,
  Edit,
  Trash2,
  User,
  UserPlus
} from 'lucide-react';
import { doctorsAPI } from '@/lib/api';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  gender: 'male' | 'female' | 'other';
  location: string;
  status: 'available' | 'busy' | 'off_duty';
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  // Fetch doctors data
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors');
      console.log('Specialists response:', response.data);
      
      // Handle both response formats - same as AvailableDoctors
      const doctorsData = response.data.doctors || response.data || [];
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      toast.success(`Loaded ${doctorsData.length} specialists from database`);
    } catch (error: any) {
      console.error('Error loading specialists:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to load specialists');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleAddDoctor = async (formData: any) => {
    try {
      console.log('Adding specialist with data:', formData);
      const response = await api.post('/doctors', formData);
      console.log('Add specialist response:', response.data);
      toast.success('Specialist added successfully');
      setShowAddForm(false);
      fetchDoctors();
    } catch (error: any) {
      console.error('Error adding specialist:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to add specialist');
    }
  };

  const handleEditDoctor = async (id: string, formData: any) => {
    try {
      console.log('Updating specialist with data:', formData);
      const response = await api.patch(`/doctors/${id}`, formData);
      console.log('Update specialist response:', response.data);
      toast.success('Specialist updated successfully');
      setEditingDoctor(null);
      fetchDoctors();
    } catch (error: any) {
      console.error('Error updating specialist:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update specialist');
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm('Are you sure you want to remove this specialist?')) return;
    
    try {
      await api.delete(`/doctors/${id}`);
      toast.success('Specialist removed successfully');
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to remove specialist');
    }
  };

  // Filtered and sorted doctors
  const filteredAndSortedDoctors = useMemo(() => {
    // Ensure doctors is always an array
    const doctorsList = Array.isArray(doctors) ? doctors : [];
    
    let filtered = doctorsList.filter(doctor => {
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
  const specializations = Array.from(new Set((Array.isArray(doctors) ? doctors : []).map((doctor: Doctor) => doctor.specialization)));
  const statuses = ['available', 'busy', 'off_duty'];
  const genders = Array.from(new Set((Array.isArray(doctors) ? doctors : []).map((doctor: Doctor) => doctor.gender)));

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
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white';
      case 'busy':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'off_duty':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
    }
  };

  // Get next available time (simplified version)
  const getNextAvailableTime = (doctor: Doctor) => {
    if (!doctor.isActive) return 'Inactive';
    
    switch (doctor.status) {
      case 'available':
        return 'Available now';
      case 'busy':
        return 'In session';
      case 'off_duty':
        return 'Off duty';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950 dark:via-gray-900 dark:to-pink-950">
          <div className="p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-64"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600 dark:text-gray-400">Loading wellness specialists...</p>
              </div>
            </motion.div>
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
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8"
          >
            <div className="mb-4 sm:mb-0">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-3"
              >
                Wellness Team
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 dark:text-gray-400 text-lg"
              >
                Our elite team of wellness experts dedicated to your health journey
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <DarkModeToggle />
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchDoctors()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Users className="h-4 w-4" />
                Refresh
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
              >
                <UserPlus className="h-5 w-5" />
                Add Specialist
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Specialists</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {Array.isArray(doctors) ? doctors.length : 0}
                  </p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Available</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    {Array.isArray(doctors) ? doctors.filter(d => d.status === 'available' && d.isActive).length : 0}
                  </p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserCheck className="h-7 w-7 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Busy</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    {Array.isArray(doctors) ? doctors.filter(d => d.status === 'busy' && d.isActive).length : 0}
                  </p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="h-7 w-7 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Off Duty</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                    {Array.isArray(doctors) ? doctors.filter(d => d.status === 'off_duty' || !d.isActive).length : 0}
                  </p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserX className="h-7 w-7 text-white" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 mb-8"
          >
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
          </motion.div>

          {/* Our Wellness Team */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredAndSortedDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 group"
                >
                  {/* Professional Avatar Section */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-16 h-16 rounded-2xl p-1 ${
                          doctor.gender === 'male' 
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                            : doctor.gender === 'female'
                            ? 'bg-gradient-to-br from-pink-500 to-purple-600'
                            : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                        }`}>
                          <img
                            src={getAvatarUrl(doctor)}
                            alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${
                          doctor.isActive && doctor.status === 'available' 
                            ? 'bg-green-500' 
                            : doctor.isActive && doctor.status === 'busy'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(doctor.status, doctor.isActive)} shadow-md`}
                        >
                          {!doctor.isActive ? 'Inactive' : doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                        </motion.span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingDoctor(doctor)}
                        className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="p-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Specialization Badge */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                      <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="font-semibold text-purple-800 dark:text-purple-300">{doctor.specialization}</span>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4 mb-6">
                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <Mail className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 truncate text-sm">{doctor.email}</span>
                    </motion.div>

                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                        <Phone className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{doctor.phone}</span>
                    </motion.div>

                    {doctor.location && (
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{doctor.location}</span>
                      </motion.div>
                    )}

                    <motion.div 
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm capitalize">{doctor.gender}</span>
                    </motion.div>
                  </div>

                  {/* Bio Section */}
                  {doctor.bio && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-indigo-200/50 dark:border-indigo-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">About</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                        {doctor.bio}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-200/60 dark:border-gray-700/60">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Since {new Date(doctor.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                        #{doctor.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredAndSortedDoctors.length === 0 && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
                No specialists found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                {searchTerm || Object.values(filters).some(f => f) 
                  ? "Try adjusting your search criteria or filters to find the perfect healthcare specialist"
                  : "No specialists have been added to our wellness team yet. Our expert healthcare professionals will be available soon."
                }
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Specialist Form */}
      {showAddForm && (
        <DoctorForm
          onCancel={() => setShowAddForm(false)}
          onSubmit={handleAddDoctor}
        />
      )}

      {/* Edit Specialist Form */}
      {editingDoctor && (
        <DoctorForm
          onCancel={() => setEditingDoctor(null)}
          onSubmit={(formData) => handleEditDoctor(editingDoctor.id, formData)}
          doctor={editingDoctor}
        />
      )}
    </DashboardLayout>
  );
}
