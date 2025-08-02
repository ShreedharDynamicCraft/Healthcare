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
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { patientsAPI, analyticsAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  zipCode: string;
  emergencyContact: string;
  emergencyPhone: string;
  insuranceProvider?: string;
  policyNumber?: string;
  isActive: boolean;
  lastVisit?: string;
  nextAppointment?: string;
  totalVisits: number;
  createdAt: string;
}

interface SortConfig {
  key: keyof Patient;
  direction: 'asc' | 'desc';
}

interface FilterConfig {
  gender: string;
  city: string;
  isActive: string;
  ageRange: string;
  search: string;
}

export default function CustomersPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'firstName', direction: 'asc' });
  const [filters, setFilters] = useState<FilterConfig>({
    gender: '',
    city: '',
    isActive: '',
    ageRange: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  // Fetch patients data
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientsAPI.getAll();
      setPatients(response);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      toast.error('Failed to load patient data');
      // Fallback mock data
      setPatients([
        {
          id: '1',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 123-4567',
          dateOfBirth: '1990-05-15',
          gender: 'female',
          address: '123 Main St',
          city: 'New York',
          zipCode: '10001',
          emergencyContact: 'John Johnson',
          emergencyPhone: '+1 (555) 123-4568',
          insuranceProvider: 'Blue Cross',
          policyNumber: 'BC123456',
          isActive: true,
          lastVisit: '2025-07-15',
          nextAppointment: '2025-08-15',
          totalVisits: 12,
          createdAt: '2023-01-15T10:00:00Z'
        },
        {
          id: '2',
          firstName: 'Michael',
          lastName: 'Chen',
          email: 'michael.chen@email.com',
          phone: '+1 (555) 987-6543',
          dateOfBirth: '1985-12-20',
          gender: 'male',
          address: '456 Oak Ave',
          city: 'Los Angeles',
          zipCode: '90210',
          emergencyContact: 'Lisa Chen',
          emergencyPhone: '+1 (555) 987-6544',
          insuranceProvider: 'Aetna',
          policyNumber: 'AE789012',
          isActive: true,
          lastVisit: '2025-07-20',
          nextAppointment: '2025-08-10',
          totalVisits: 8,
          createdAt: '2023-03-10T14:30:00Z'
        },
        {
          id: '3',
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.davis@email.com',
          phone: '+1 (555) 456-7890',
          dateOfBirth: '1992-08-10',
          gender: 'female',
          address: '789 Pine St',
          city: 'Chicago',
          zipCode: '60601',
          emergencyContact: 'Robert Davis',
          emergencyPhone: '+1 (555) 456-7891',
          insuranceProvider: 'Cigna',
          policyNumber: 'CG345678',
          isActive: false,
          lastVisit: '2025-06-10',
          totalVisits: 5,
          createdAt: '2023-06-20T09:15:00Z'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Filtered and sorted patients
  const filteredAndSortedPatients = useMemo(() => {
    let filtered = patients.filter(patient => {
      const matchesSearch = searchTerm === '' || 
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm);
      
      const matchesGender = filters.gender === '' || patient.gender === filters.gender;
      const matchesCity = filters.city === '' || patient.city === filters.city;
      const matchesActive = filters.isActive === '' || 
        (filters.isActive === 'active' && patient.isActive) ||
        (filters.isActive === 'inactive' && !patient.isActive);

      const age = calculateAge(patient.dateOfBirth);
      const matchesAge = filters.ageRange === '' ||
        (filters.ageRange === '18-30' && age >= 18 && age <= 30) ||
        (filters.ageRange === '31-50' && age >= 31 && age <= 50) ||
        (filters.ageRange === '51+' && age > 50);

      return matchesSearch && matchesGender && matchesCity && matchesActive && matchesAge;
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
  }, [patients, searchTerm, filters, sortConfig]);

  // Handle sorting
  const handleSort = (key: keyof Patient) => {
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
        selectedIds: selectedPatients.length > 0 ? selectedPatients : undefined,
        filters: {
          ...filters,
          search: searchTerm
        }
      };
      
      const blob = await analyticsAPI.exportData(format, 'patients', filterData);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `patients-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Patient data exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  // Get unique cities for filter
  const cities = Array.from(new Set(patients.map(patient => patient.city)));

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
                    Patients
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage patient information and medical records
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Patients</p>
                    <p className="text-2xl font-bold text-purple-600">{patients.length}</p>
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Patients</p>
                    <p className="text-2xl font-bold text-green-600">
                      {patients.filter(p => p.isActive).length}
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">New This Month</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {patients.filter(p => {
                        const created = new Date(p.createdAt);
                        const now = new Date();
                        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Visits</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {(patients.reduce((acc, p) => acc + p.totalVisits, 0) / patients.length || 0).toFixed(1)}
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
                  placeholder="Search patients..."
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

                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg transition-all duration-200">
                  <Plus className="h-4 w-4" />
                  <span>Add Patient</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Gender
                      </label>
                      <select
                        value={filters.gender}
                        onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                      </label>
                      <select
                        value={filters.city}
                        onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All Cities</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Age Range
                      </label>
                      <select
                        value={filters.ageRange}
                        onChange={(e) => setFilters(prev => ({ ...prev, ageRange: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All Ages</option>
                        <option value="18-30">18-30 years</option>
                        <option value="31-50">31-50 years</option>
                        <option value="51+">51+ years</option>
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
                      Showing {filteredAndSortedPatients.length} of {patients.length} patients
                    </p>
                    <button
                      onClick={() => {
                        setFilters({ gender: '', city: '', isActive: '', ageRange: '', search: '' });
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

          {/* Patients Table */}
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
                          checked={selectedPatients.length === filteredAndSortedPatients.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPatients(filteredAndSortedPatients.map(p => p.id));
                            } else {
                              setSelectedPatients([]);
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
                          <span>Patient</span>
                          {sortConfig.key === 'firstName' && (
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
                        onClick={() => handleSort('dateOfBirth')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Age</span>
                          {sortConfig.key === 'dateOfBirth' && (
                            sortConfig.direction === 'asc' ? 
                              <SortAsc className="h-4 w-4" /> : 
                              <SortDesc className="h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                        onClick={() => handleSort('totalVisits')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Visits</span>
                          {sortConfig.key === 'totalVisits' && (
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
                    {filteredAndSortedPatients.map((patient, index) => (
                      <motion.tr
                        key={patient.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedPatients.includes(patient.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPatients(prev => [...prev, patient.id]);
                              } else {
                                setSelectedPatients(prev => prev.filter(id => id !== patient.id));
                              }
                            }}
                            className="rounded border-gray-300 dark:border-gray-600"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {patient.firstName} {patient.lastName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {patient.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <div className="flex items-center space-x-1 mb-1">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span>{patient.phone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="truncate max-w-32">{patient.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <div className="font-medium">{calculateAge(patient.dateOfBirth)} years</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                              {patient.gender}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span>{patient.city}</span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {patient.zipCode}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <div className="font-medium">{patient.totalVisits}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {patient.lastVisit && `Last: ${new Date(patient.lastVisit).toLocaleDateString()}`}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            patient.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {patient.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
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
