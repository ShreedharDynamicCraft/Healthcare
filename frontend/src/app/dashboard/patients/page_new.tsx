'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { 
  Users, 
  Search, 
  Filter, 
  Plus,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText
} from 'lucide-react';
import { appointmentsAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

export default function PatientsPage() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      // Fetch appointments to get patient information
      const response = await appointmentsAPI.getAll();
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      toast.error('Failed to load patient information');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique patients from appointments
  const patients = appointments.reduce((acc: any[], appointment: any) => {
    const existingPatient = acc.find(p => p.email === appointment.patientEmail);
    if (!existingPatient) {
      acc.push({
        id: appointment.id,
        name: appointment.patientName,
        email: appointment.patientEmail,
        phone: appointment.patientPhone,
        lastAppointment: appointment.appointmentDate,
        doctor: appointment.doctor,
        status: appointment.status,
        type: appointment.type
      });
    }
    return acc;
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Patients
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Patient records and information
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Patient</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Recent Appointments</p>
                  <p className="text-2xl font-bold text-blue-600">{appointments.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Cases</p>
                  <p className="text-2xl font-bold text-green-600">{appointments.filter(a => a.status === 'confirmed').length}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </motion.div>

          {/* Patients List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-800/30"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="h-5 w-5 text-purple-600 mr-2" />
              {loading ? 'Loading Patients...' : `Patients (${filteredPatients.length})`}
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {patients.length === 0 ? 'No patient records found.' : 'No patients match your search.'}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-100 dark:border-purple-800/30"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                        {patient.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {patient.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-4">
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {patient.email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {patient.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">
                          Last Visit
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(patient.lastAppointment).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          Dr. {patient.doctor.firstName} {patient.doctor.lastName}
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        patient.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : patient.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {patient.status}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Notice about full patient management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
          >
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-300">Patient Management System</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Full patient records management with detailed medical history, insurance information, and comprehensive profiles is coming soon. 
                  Currently showing patient information from appointment records.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
