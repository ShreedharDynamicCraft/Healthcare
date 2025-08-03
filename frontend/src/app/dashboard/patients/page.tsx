'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText,
  Eye,
  CalendarDays,
  SortAsc,
  SortDesc,
  X,
  Activity,
  Clock,
  User
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Patient {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  registrationDate: string;
  lastVisitDate?: string;
  totalVisits: number;
  appointments: any[];
  queueEntries: any[];
}

interface FilterOptions {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  name: string;
  location: string;
  sortBy: 'name' | 'registrationDate' | 'lastVisitDate' | 'totalVisits';
  sortOrder: 'asc' | 'desc';
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {
      startDate: '',
      endDate: new Date().toISOString().split('T')[0] // Today
    },
    name: '',
    location: '',
    sortBy: 'registrationDate',
    sortOrder: 'desc' // Most recent first by default
  });

  useEffect(() => {
    fetchPatientRecords();
  }, []);

  const fetchPatientRecords = async () => {
    try {
      setLoading(true);
      
      // Fetch appointments and queue data
      const [appointmentsResponse, queueResponse] = await Promise.all([
        api.get('/appointments'),
        api.get('/queue')
      ]);
      
      const appointments = appointmentsResponse.data.appointments || appointmentsResponse.data || [];
      const queueEntries = queueResponse.data || [];
      
      // Create comprehensive patient records
      const patientMap = new Map<string, Patient>();
      
      // Process appointments
      appointments.forEach((appointment: any) => {
        const key = appointment.patientPhone || appointment.patientEmail || appointment.patientName;
        
        if (!patientMap.has(key)) {
          patientMap.set(key, {
            id: appointment.id,
            patientName: appointment.patientName,
            patientPhone: appointment.patientPhone,
            patientEmail: appointment.patientEmail,
            registrationDate: appointment.appointmentDate,
            lastVisitDate: appointment.appointmentDate,
            totalVisits: 1,
            appointments: [appointment],
            queueEntries: []
          });
        } else {
          const patient = patientMap.get(key)!;
          patient.appointments.push(appointment);
          patient.totalVisits++;
          
          // Update last visit date if this appointment is more recent
          if (new Date(appointment.appointmentDate) > new Date(patient.lastVisitDate || '')) {
            patient.lastVisitDate = appointment.appointmentDate;
          }
          
          // Update registration date if this appointment is older
          if (new Date(appointment.appointmentDate) < new Date(patient.registrationDate)) {
            patient.registrationDate = appointment.appointmentDate;
          }
        }
      });
      
      // Process queue entries
      queueEntries.forEach((queueEntry: any) => {
        const key = queueEntry.patientPhone || queueEntry.patientName;
        
        if (!patientMap.has(key)) {
          patientMap.set(key, {
            id: queueEntry.id,
            patientName: queueEntry.patientName,
            patientPhone: queueEntry.patientPhone,
            registrationDate: queueEntry.arrivalTime,
            totalVisits: 1,
            appointments: [],
            queueEntries: [queueEntry]
          });
        } else {
          const patient = patientMap.get(key)!;
          patient.queueEntries.push(queueEntry);
        }
      });
      
      const patientsArray = Array.from(patientMap.values());
      setPatients(patientsArray);
      
    } catch (error) {
      console.error('Error fetching patient records:', error);
      toast.error('Failed to load patient records');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort patients
  const filteredAndSortedPatients = patients
    .filter(patient => {
      // Search filter
      const searchMatch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.patientPhone.includes(searchTerm) ||
                         (patient.patientEmail && patient.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Name filter
      const nameMatch = !filters.name || patient.patientName.toLowerCase().includes(filters.name.toLowerCase());
      
      // Location filter (if address is available)
      const locationMatch = !filters.location || 
                           (patient.address && patient.address.toLowerCase().includes(filters.location.toLowerCase()));
      
      // Date range filter
      let dateMatch = true;
      if (filters.dateRange.startDate) {
        dateMatch = dateMatch && new Date(patient.registrationDate) >= new Date(filters.dateRange.startDate);
      }
      if (filters.dateRange.endDate) {
        dateMatch = dateMatch && new Date(patient.registrationDate) <= new Date(filters.dateRange.endDate);
      }
      
      return searchMatch && nameMatch && locationMatch && dateMatch;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.patientName.toLowerCase();
          bValue = b.patientName.toLowerCase();
          break;
        case 'lastVisitDate':
          aValue = new Date(a.lastVisitDate || a.registrationDate).getTime();
          bValue = new Date(b.lastVisitDate || b.registrationDate).getTime();
          break;
        case 'totalVisits':
          aValue = a.totalVisits;
          bValue = b.totalVisits;
          break;
        case 'registrationDate':
        default:
          aValue = new Date(a.registrationDate).getTime();
          bValue = new Date(b.registrationDate).getTime();
          break;
      }
      
      if (filters.sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleExportCSV = () => {
    const csvData = filteredAndSortedPatients.map(patient => ({
      Name: patient.patientName,
      Phone: patient.patientPhone,
      Email: patient.patientEmail || 'N/A',
      Address: patient.address || 'N/A',
      'Registration Date': new Date(patient.registrationDate).toLocaleDateString(),
      'Last Visit': patient.lastVisitDate ? new Date(patient.lastVisitDate).toLocaleDateString() : 'N/A',
      'Total Visits': patient.totalVisits,
      'Total Appointments': patient.appointments.length,
      'Queue Entries': patient.queueEntries.length
    }));
    
    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-records-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Patient records exported to CSV');
  };

  const handleExportPDF = () => {
    // Create a simple HTML content for PDF
    const htmlContent = `
      <html>
        <head>
          <title>Patient Records Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #7c3aed; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #7c3aed; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Patient Records Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Total Patients: ${filteredAndSortedPatients.length}</p>
          
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Registration Date</th>
                <th>Last Visit</th>
                <th>Total Visits</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAndSortedPatients.map(patient => `
                <tr>
                  <td>${patient.patientName}</td>
                  <td>${patient.patientPhone}</td>
                  <td>${patient.patientEmail || 'N/A'}</td>
                  <td>${new Date(patient.registrationDate).toLocaleDateString()}</td>
                  <td>${patient.lastVisitDate ? new Date(patient.lastVisitDate).toLocaleDateString() : 'N/A'}</td>
                  <td>${patient.totalVisits}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-records-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Patient records exported as HTML (can be printed as PDF)');
  };

  const resetFilters = () => {
    setFilters({
      dateRange: { startDate: '', endDate: new Date().toISOString().split('T')[0] },
      name: '',
      location: '',
      sortBy: 'registrationDate',
      sortOrder: 'desc'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Patient Records
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive patient database with detailed records and analytics
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 text-purple-600 dark:text-purple-400 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg border border-purple-100 dark:border-purple-900"
            >
              <Filter className="h-4 w-4" />
              Filters
            </motion.button>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportCSV}
                className="bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:bg-emerald-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                CSV
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExportPDF}
                className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:bg-red-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                PDF
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {filteredAndSortedPatients.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Appointments</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredAndSortedPatients.reduce((sum, p) => sum + p.appointments.length, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">New This Month</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {filteredAndSortedPatients.filter(p => {
                    const regDate = new Date(p.registrationDate);
                    const thisMonth = new Date();
                    return regDate.getMonth() === thisMonth.getMonth() && regDate.getFullYear() === thisMonth.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Visits/Patient</p>
                <p className="text-2xl font-bold text-pink-600">
                  {filteredAndSortedPatients.length > 0 
                    ? (filteredAndSortedPatients.reduce((sum, p) => sum + p.totalVisits, 0) / filteredAndSortedPatients.length).toFixed(1)
                    : '0'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter & Sort Options</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    Reset All
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Registration Date Range
                    </label>
                    <div className="space-y-2">
                      <input
                        type="date"
                        value={filters.dateRange.startDate}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, startDate: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Start Date"
                      />
                      <input
                        type="date"
                        value={filters.dateRange.endDate}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, endDate: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="End Date"
                      />
                    </div>
                  </div>
                  
                  {/* Name Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={filters.name}
                      onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Filter by name"
                    />
                  </div>
                  
                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Filter by location"
                    />
                  </div>
                  
                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <div className="space-y-2">
                      <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="registrationDate">Registration Date</option>
                        <option value="name">Name</option>
                        <option value="lastVisitDate">Last Visit</option>
                        <option value="totalVisits">Total Visits</option>
                      </select>
                      
                      <button
                        onClick={() => setFilters(prev => ({ 
                          ...prev, 
                          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
                        }))}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        {filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                        {filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search patients by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 border border-purple-200 dark:border-purple-700 rounded-2xl text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-lg"
          />
        </motion.div>

        {/* Patient Records Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-purple-100 dark:border-purple-700 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Patient Database
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {loading ? 'Loading...' : `${filteredAndSortedPatients.length} patients found`}
            </p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full"
              />
            </div>
          ) : filteredAndSortedPatients.length === 0 ? (
            <div className="px-8 py-16 text-center">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No patients found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {patients.length === 0 ? 'No patient records available' : 'Try adjusting your search or filters'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Patient Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Registration
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Visit
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Visits
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
                      className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                            {patient.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {patient.patientName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              ID: {patient.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center mb-1">
                            <Phone className="h-3 w-3 mr-1" />
                            {patient.patientPhone}
                          </div>
                          {patient.patientEmail && (
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                              <Mail className="h-3 w-3 mr-1" />
                              {patient.patientEmail}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(patient.registrationDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {Math.floor((new Date().getTime() - new Date(patient.registrationDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {patient.lastVisitDate 
                            ? new Date(patient.lastVisitDate).toLocaleDateString()
                            : 'No visits'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                            {patient.totalVisits} visits
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300">
                            {patient.appointments.length} appointments
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowPatientDetail(true);
                          }}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Patient Detail Modal */}
        <AnimatePresence>
          {showPatientDetail && selectedPatient && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowPatientDetail(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white/90 backdrop-blur-xl dark:bg-gray-800/90 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-purple-100 dark:border-purple-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {selectedPatient.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedPatient.patientName}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">Patient ID: {selectedPatient.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPatientDetail(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact Information</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-purple-600 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300">{selectedPatient.patientPhone}</span>
                        </div>
                        {selectedPatient.patientEmail && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-gray-700 dark:text-gray-300">{selectedPatient.patientEmail}</span>
                          </div>
                        )}
                        {selectedPatient.address && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-gray-700 dark:text-gray-300">{selectedPatient.address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-pink-50 dark:bg-pink-900/20 rounded-2xl p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Visit Statistics</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Total Visits:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{selectedPatient.totalVisits}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Appointments:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{selectedPatient.appointments.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Queue Entries:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{selectedPatient.queueEntries.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Registration:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {new Date(selectedPatient.registrationDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Appointments History */}
                  {selectedPatient.appointments.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                        Appointment History
                      </h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedPatient.appointments
                          .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
                          .map((appointment, index) => (
                          <div key={appointment.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {new Date(appointment.appointmentDate).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {appointment.startTime} - {appointment.endTime}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Type: {appointment.type}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  appointment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                  appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                }`}>
                                  {appointment.status}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Queue History */}
                  {selectedPatient.queueEntries.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                        <Clock className="h-5 w-5 text-purple-600 mr-2" />
                        Queue History
                      </h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {selectedPatient.queueEntries
                          .sort((a, b) => new Date(b.arrivalTime).getTime() - new Date(a.arrivalTime).getTime())
                          .map((queueEntry, index) => (
                          <div key={queueEntry.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">
                                  {new Date(queueEntry.arrivalTime).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  Arrival: {new Date(queueEntry.arrivalTime).toLocaleTimeString()}
                                </div>
                                {queueEntry.symptoms && (
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Symptoms: {queueEntry.symptoms}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  queueEntry.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                                  queueEntry.status === 'with_doctor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                }`}>
                                  {queueEntry.status}
                                </div>
                                <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ml-2 ${
                                  queueEntry.priority === 'emergency' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                  queueEntry.priority === 'urgent' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                                  'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                }`}>
                                  {queueEntry.priority}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
