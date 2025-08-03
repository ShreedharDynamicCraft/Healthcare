'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { User, Clock, MapPin, Stethoscope, Plus, Calendar, Grid, Edit, Trash2, Phone, Mail, Award, Activity, Heart, Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import DoctorForm from './DoctorForm';
import CalendarView from './CalendarView';

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
  bio?: string;
  avatar?: string;
  availability: any;
}

interface AvailableDoctorsProps {
  onStatsUpdate?: () => void;
}

export default function AvailableDoctors({ onStatsUpdate }: AvailableDoctorsProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [selectedDoctorSchedule, setSelectedDoctorSchedule] = useState<Doctor | null>(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/doctors');
      console.log('Specialists response:', response.data);
      
      // Handle both response formats
      const doctorsData = response.data.doctors || response.data || [];
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
    } catch (error: any) {
      console.error('Error loading specialists:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to load specialists');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white';
      case 'busy':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'off_duty':
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Heart className="h-4 w-4 text-emerald-500" />;
      case 'busy':
        return <Shield className="h-4 w-4 text-purple-500" />;
      case 'off_duty':
        return <User className="h-4 w-4 text-gray-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getNextAvailableTime = (doctor: Doctor) => {
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[now.getDay()];
    const currentTime = now.toTimeString().slice(0, 5);

    const todayAvailability = doctor.availability[currentDay];
    
    if (!todayAvailability.available) {
      return 'Not available today';
    }

    if (currentTime < todayAvailability.start) {
      return `Today at ${todayAvailability.start}`;
    }

    if (currentTime >= todayAvailability.start && currentTime < todayAvailability.end) {
      return 'Now';
    }

    return 'Not available today';
  };

  const handleAddDoctor = async (formData: any) => {
    try {
      console.log('Adding specialist with data:', formData);
      const response = await api.post('/doctors', formData);
      console.log('Add specialist response:', response.data);
      toast.success('Specialist added successfully');
      setShowAddForm(false);
      loadDoctors();
      onStatsUpdate?.();
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
      loadDoctors();
      onStatsUpdate?.();
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
      loadDoctors();
      onStatsUpdate?.();
    } catch (error) {
      toast.error('Failed to remove specialist');
    }
  };

  const stats = {
    total: doctors.length,
    available: doctors.filter(d => d.status === 'available').length,
    busy: doctors.filter(d => d.status === 'busy').length,
    offDuty: doctors.filter(d => d.status === 'off_duty').length
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
          <p className="text-gray-600 dark:text-gray-400">Loading wellness specialists...</p>
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
      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Wellness Specialists
          </h2>
          <p className="text-gray-600 dark:text-gray-400">Expert healthcare professionals for your intimate wellness</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center gap-4"
        >
          {/* View Mode Toggle */}
          <div className="flex bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 border border-purple-200 dark:border-purple-700 rounded-2xl p-1 shadow-lg">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                viewMode === 'calendar'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Add Specialist Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            Add Specialist
          </motion.button>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Specialists</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-emerald-100 dark:border-emerald-900 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.available}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Session</p>
              <p className="text-3xl font-bold text-purple-600">{stats.busy}</p>
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
              <p className="text-sm font-medium text-gray-600">Off Duty</p>
              <p className="text-3xl font-bold text-gray-600">{stats.offDuty}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center">
              <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Add/Edit Doctor Modal */}
      {(showAddForm || editingDoctor) && (
        <DoctorForm
          doctor={editingDoctor}
          onSubmit={editingDoctor ? (data) => handleEditDoctor(editingDoctor.id, data) : handleAddDoctor}
          onCancel={() => {
            setShowAddForm(false);
            setEditingDoctor(null);
          }}
        />
      )}

      {/* Doctor Schedule Modal */}
      {selectedDoctorSchedule && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDoctorSchedule(null)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={selectedDoctorSchedule.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctorSchedule.firstName + ' ' + selectedDoctorSchedule.lastName)}&size=48&background=${selectedDoctorSchedule.gender === 'female' ? 'ec4899' : selectedDoctorSchedule.gender === 'male' ? '8b5cf6' : '6366f1'}&color=ffffff&bold=true&format=png`}
                      alt={`Dr. ${selectedDoctorSchedule.firstName} ${selectedDoctorSchedule.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Dr. {selectedDoctorSchedule.firstName} {selectedDoctorSchedule.lastName}
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">{selectedDoctorSchedule.specialization}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedDoctorSchedule(null)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {/* Current Status */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(selectedDoctorSchedule.status)}
                      <span className="font-semibold text-gray-900 dark:text-white">Current Status</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedDoctorSchedule.status)}`}>
                      {selectedDoctorSchedule.status === 'busy' ? 'In Session' : selectedDoctorSchedule.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{getNextAvailableTime(selectedDoctorSchedule)}</span>
                  </div>
                </div>

                {/* Weekly Schedule */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                    Weekly Schedule
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(selectedDoctorSchedule.availability || {}).map(([day, schedule]: [string, any]) => (
                      <div key={day} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                          <span className="font-medium text-gray-900 dark:text-white capitalize">
                            {day}
                          </span>
                        </div>
                        <div className="text-sm">
                          {schedule?.available ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              {schedule.start} - {schedule.end}
                            </span>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">Not available</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-purple-600" />
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <Phone className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-900 dark:text-white">{selectedDoctorSchedule.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <Mail className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-900 dark:text-white">{selectedDoctorSchedule.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <MapPin className="h-4 w-4 text-purple-600" />
                      <span className="text-gray-900 dark:text-white">{selectedDoctorSchedule.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedDoctorSchedule(null)}
                  className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-xl font-semibold transition-colors"
                >
                  Close
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedDoctorSchedule(null);
                    setViewMode('calendar');
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  View Full Calendar
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Content */}
      {viewMode === 'grid' ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {doctors.map((doctor, index) => (
              <motion.div 
                key={doctor.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg group"
                    >
                      <img
                        src={doctor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.firstName + ' ' + doctor.lastName)}&size=64&background=${doctor.gender === 'female' ? 'ec4899' : doctor.gender === 'male' ? '8b5cf6' : '6366f1'}&color=ffffff&bold=true&format=png`}
                        alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // If custom avatar fails, try UI Avatars
                          if (doctor.avatar && target.src === doctor.avatar) {
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.firstName + ' ' + doctor.lastName)}&size=64&background=${doctor.gender === 'female' ? 'ec4899' : doctor.gender === 'male' ? '8b5cf6' : '6366f1'}&color=ffffff&bold=true&format=png`;
                          } else {
                            // If both fail, show fallback
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }
                        }}
                      />
                      <div className="hidden w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="text-purple-600 dark:text-purple-400 font-semibold">{doctor.specialization}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setEditingDoctor(doctor)}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      title="Edit specialist"
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteDoctor(doctor.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Remove specialist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{doctor.location}</span>
                  </motion.div>

                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg flex items-center justify-center">
                      <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{doctor.phone}</span>
                  </motion.div>

                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{doctor.email}</span>
                  </motion.div>

                  <div className="flex items-center justify-between pt-4 border-t border-purple-100 dark:border-purple-800">
                    <motion.span 
                      whileHover={{ scale: 1.05 }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(doctor.status)}`}
                    >
                      {doctor.status === 'busy' ? 'In Session' : doctor.status.replace('_', ' ')}
                    </motion.span>
                    <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{getNextAvailableTime(doctor)}</span>
                    </div>
                  </div>

                  {doctor.bio && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-4 border-t border-purple-100 dark:border-purple-800"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Professional Bio</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{doctor.bio}</p>
                    </motion.div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-purple-100 dark:border-purple-800">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDoctorSchedule(doctor)}
                    className="w-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 py-3 rounded-2xl font-semibold text-sm hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800 dark:hover:to-pink-800 transition-all duration-300"
                  >
                    View Schedule
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <CalendarView doctors={doctors} />
      )}

      {doctors.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl border-2 border-dashed border-purple-200 dark:border-purple-700"
        >
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Heart className="h-10 w-10 text-purple-500 dark:text-purple-400" />
          </motion.div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            No wellness specialists available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Add your first specialist to start providing intimate health services</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-5 w-5" />
            Add First Specialist
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
} 