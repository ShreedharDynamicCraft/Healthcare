'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, User, Plus, X, Phone, Mail, MapPin, Activity, Users as UsersIcon, CheckCircle, AlertCircle, Trash2, Heart, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface Appointment {
  id: string;
  patientName: string;
  doctorName?: string; // Optional, will be populated by backend
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  type: string;
}

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
}

interface AppointmentManagementProps {
  onStatsUpdate?: () => void;
}

export default function AppointmentManagement({ onStatsUpdate }: AppointmentManagementProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [preFilledData, setPreFilledData] = useState<{
    doctorId: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
  } | null>(null);

  useEffect(() => {
    loadAppointments();
    loadDoctors();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data.appointments || response.data);
    } catch (error) {
      toast.error('Failed to load consultations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data.doctors || response.data);
    } catch (error) {
      toast.error('Failed to load specialists');
    }
  };

  const bookAppointment = async (appointmentData: any) => {
    try {
      await api.post('/appointments', appointmentData);
      toast.success('Consultation scheduled successfully');
      setShowBookingForm(false);
      loadAppointments();
      // Refresh available slots if we have a selected doctor and date
      if (selectedDoctor) {
        loadAvailableSlots();
      }
      onStatsUpdate?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to schedule consultation');
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    try {
      await api.delete(`/appointments/${appointmentId}`);
      toast.success('Consultation cancelled successfully');
      loadAppointments();
      // Refresh available slots if we have a selected doctor and date
      if (selectedDoctor) {
        loadAvailableSlots();
      }
      onStatsUpdate?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel consultation');
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status });
      toast.success(`Consultation marked as ${status.replace('_', ' ')}`);
      loadAppointments();
      onStatsUpdate?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update consultation status');
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedDoctor) return;
    
    setIsLoadingSlots(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await api.get(`/appointments/slots/${selectedDoctor}/${dateStr}`);
      setAvailableSlots(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load available slots');
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSlotSelect = (slot: string) => {
    // Pre-fill the booking form with selected slot
    setShowBookingForm(true);
    
    // Calculate end time (30 minutes after start time)
    const startTime = new Date(`2000-01-01T${slot}`);
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // Add 30 minutes
    const endTimeStr = endTime.toTimeString().slice(0, 5);
    
    // Auto-fill the booking form with selected details
    const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    // Store the pre-filled data to pass to the booking form
    setPreFilledData({
      doctorId: selectedDoctor,
      appointmentDate: dateStr,
      startTime: slot,
      endTime: endTimeStr
    });
    
    toast.success(`Selected slot: ${slot} with Dr. ${selectedDoctorData?.lastName || 'Unknown'}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'confirmed':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white';
      case 'in_progress':
        return 'bg-gradient-to-r from-purple-600 to-purple-700 text-white';
      case 'completed':
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'in_progress':
        return <Shield className="h-4 w-4 text-purple-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(apt => apt.status === 'scheduled').length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    inProgress: appointments.filter(apt => apt.status === 'in_progress').length,
    completed: appointments.filter(apt => apt.status === 'completed').length
  };

  if (isLoading) {
    return (
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
          <p className="text-gray-600 dark:text-gray-400">Loading consultations...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Consultation Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Schedule and manage intimate wellness consultations with care</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center gap-4"
        >
          {/* Consultation Stats */}
          <div className="hidden md:flex items-center gap-6 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 border border-purple-100 dark:border-purple-900 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stats.scheduled} Scheduled
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stats.confirmed} Confirmed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stats.inProgress} In Session
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stats.completed} Completed
              </span>
            </div>
          </div>

          {/* Schedule Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowBookingForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            Schedule Consultation
          </motion.button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-6"
      >
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled</p>
              <p className="text-3xl font-bold text-purple-600">{stats.scheduled}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl flex items-center justify-center">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-emerald-100 dark:border-emerald-900 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Confirmed</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.confirmed}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Session</p>
              <p className="text-3xl font-bold text-purple-600">{stats.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-900 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Availability Calendar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Check doctor availability</p>
              </div>
            </div>
            
            {/* Doctor and Date Selection */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full px-3 py-2 bg-white/70 backdrop-blur-xl dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
                <input
                  type="date"
                  value={isNaN(selectedDate.getTime()) ? '' : selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    if (dateValue) {
                      setSelectedDate(new Date(dateValue));
                    } else {
                      setSelectedDate(new Date());
                    }
                  }}
                  className="w-full px-3 py-2 bg-white/70 backdrop-blur-xl dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              {selectedDoctor && (
                <button
                  onClick={loadAvailableSlots}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  disabled={isLoadingSlots}
                >
                  {isLoadingSlots ? 'Loading...' : 'Check Availability'}
                </button>
              )}
            </div>
            
            {/* Available Slots */}
            {availableSlots.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Available Slots</h4>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotSelect(slot)}
                      className="px-3 py-2 text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {selectedDoctor && availableSlots.length === 0 && !isLoadingSlots && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">No available slots for this date</p>
              </div>
            )}
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2">
          <div className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Appointments</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage and track all appointments</p>
            </div>
            
            {appointments.length === 0 ? (
              <div className="px-8 py-16 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No appointments scheduled</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Schedule your first appointment to get started</p>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 mx-auto hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  <Plus className="h-5 w-5" />
                  Schedule First Appointment
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="px-8 py-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              {getStatusIcon(appointment.status)}
                              <span className="text-lg font-bold text-black-900">
                                {appointment.patientName}
                              </span>
                              <span className="text-sm text-gray-500">with</span>
                              <span className="font-semibold text-primary-600">
                                Dr. {appointment.doctorName}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(appointment.appointmentDate)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Activity className="h-4 w-4" />
                                <span className="capitalize">{appointment.type.replace('_', ' ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className={`badge ${getStatusColor(appointment.status)}`}>
                          {appointment.status.replace('_', ' ')}
                        </span>
                        
                        {/* Status Update Buttons */}
                        {appointment.status === 'scheduled' && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'in_progress')}
                              className="px-3 py-1 text-xs bg-warning-100 text-warning-700 border border-warning-200 rounded-lg hover:bg-warning-200 transition-colors"
                              title="Mark as in progress"
                            >
                              Start
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                              className="px-3 py-1 text-xs bg-success-100 text-success-700 border border-success-200 rounded-lg hover:bg-success-200 transition-colors"
                              title="Mark as completed"
                            >
                              Complete
                            </button>
                          </div>
                        )}
                        
                        {appointment.status === 'in_progress' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            className="px-3 py-1 text-xs bg-success-100 text-success-700 border border-success-200 rounded-lg hover:bg-success-200 transition-colors"
                            title="Mark as completed"
                          >
                            Complete
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteAppointment(appointment.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete appointment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showBookingForm && (
        <BookingForm
          doctors={doctors}
          preFilledData={preFilledData}
          onClose={() => {
            setShowBookingForm(false);
            setPreFilledData(null);
          }}
          onSubmit={bookAppointment}
        />
      )}
    </motion.div>
  );
}

interface BookingFormProps {
  doctors: Doctor[];
  preFilledData?: {
    doctorId: string;
    appointmentDate: string;
    startTime: string;
    endTime: string;
  } | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

function BookingForm({ doctors, preFilledData, onClose, onSubmit }: BookingFormProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    doctorId: preFilledData?.doctorId || '',
    appointmentDate: preFilledData?.appointmentDate || '',
    startTime: preFilledData?.startTime || '',
    endTime: preFilledData?.endTime || '',
    type: 'consultation',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scaleIn border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Schedule New Appointment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Book a new patient appointment</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Note about checking available slots */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Important Note</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Please check the available slots using the availability calendar before selecting a time to ensure the slot is available for booking.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Patient Name *</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                className="w-full px-3 py-2 bg-white/70 backdrop-blur-xl dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter patient name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.patientPhone}
                onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                className="w-full px-3 py-2 bg-white/70 backdrop-blur-xl dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.patientEmail}
              onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
              className="w-full px-3 py-2 bg-white/70 backdrop-blur-xl dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Doctor *</label>
            <select
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              className="w-full px-3 py-2 bg-white/70 backdrop-blur-xl dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date *</label>
            <input
              type="date"
              value={formData.appointmentDate}
              onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
              className="w-full px-3 py-2 bg-white/70 backdrop-blur-xl dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Time *</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 bg-white/70 backdrop-blur-xl dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">End Time *</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 bg-white/70 backdrop-blur-xl dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Appointment Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 bg-white/70 backdrop-blur-xl dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="consultation">Consultation</option>
              <option value="follow_up">Follow-up</option>
              <option value="emergency">Emergency</option>
              <option value="routine_checkup">Routine Checkup</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-white/70 backdrop-blur-xl dark:bg-gray-700/70 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="Additional notes..."
            />
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Schedule Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 