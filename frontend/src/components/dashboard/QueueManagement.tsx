'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Clock, User, AlertTriangle, CheckCircle, X, Phone, MapPin, Activity, Users as UsersIcon, Users, Trash2, FileText, Heart, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface QueueItem {
  id: string;
  patientName: string;
  patientPhone: string;
  status: 'waiting' | 'with_doctor' | 'completed' | 'cancelled';
  priority: 'normal' | 'urgent' | 'emergency';
  arrivalTime: string;
  estimatedWaitTime: number;
  symptoms?: string;
  notes?: string;
}

interface QueueManagementProps {
  onStatsUpdate?: () => void;
}

export default function QueueManagement({ onStatsUpdate }: QueueManagementProps) {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    loadQueueItems();
  }, []);

  const loadQueueItems = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/queue');
      console.log('Queue items loaded:', response.data);
      setQueueItems(response.data || []);
    } catch (error: any) {
      console.error('Error loading queue items:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to load queue items');
    } finally {
      setIsLoading(false);
    }
  };

  const addPatientToQueue = async (patientData: any) => {
    try {
      await api.post('/queue', patientData);
      toast.success('Patient added to queue');
      setShowAddForm(false);
      loadQueueItems();
      onStatsUpdate?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add patient');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQueueItemStatus = async (id: string, status: string) => {
    try {
      const response = await api.patch(`/queue/${id}/status`, { status });
      console.log('Status update response:', response.data);
      toast.success('Status updated successfully');
      
      // Update the local state immediately for better UX
      setQueueItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, status: status as any } : item
        )
      );
      
      // Refresh from server after a short delay to ensure consistency
      setTimeout(() => {
        loadQueueItems();
      }, 1000);
      
      // Update dashboard stats
      onStatsUpdate?.();
    } catch (error: any) {
      console.error('Error updating status:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const removeFromQueue = async (id: string) => {
    try {
      await api.delete(`/queue/${id}`);
      toast.success('Patient removed from queue');
      loadQueueItems();
      onStatsUpdate?.();
    } catch (error: any) {
      toast.error('Failed to remove patient');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock className="h-5 w-5 text-warning-500" />;
      case 'with_doctor':
        return <User className="h-5 w-5 text-primary-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'urgent':
        return 'bg-gradient-to-r from-purple-500 to-pink-400 text-white';
      default:
        return 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'with_doctor':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return <AlertTriangle className="h-4 w-4" />;
      case 'urgent':
        return <Clock className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  // Calculate actual wait time in minutes
  const calculateWaitTime = (arrivalTime: string) => {
    const arrival = new Date(arrivalTime);
    const now = new Date();
    const diffMs = now.getTime() - arrival.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes;
  };

  // Sort items by priority and arrival time
  const sortQueueItems = (items: QueueItem[]) => {
    return items.sort((a, b) => {
      // Priority order: emergency > urgent > normal
      const priorityOrder = { emergency: 3, urgent: 2, normal: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 1;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 1;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }
      
      // If same priority, sort by arrival time (earlier first)
      const aArrival = new Date(a.arrivalTime);
      const bArrival = new Date(b.arrivalTime);
      return aArrival.getTime() - bArrival.getTime();
    });
  };

  // Filter items based on both status and priority
  const filteredItems = sortQueueItems(queueItems.filter(item => {
    const statusMatch = statusFilter === 'all' || item.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || item.priority === priorityFilter;
    return statusMatch && priorityMatch;
  }));

  const stats = {
    waiting: queueItems.filter(item => item.status === 'waiting').length,
    withDoctor: queueItems.filter(item => item.status === 'with_doctor').length,
    completed: queueItems.filter(item => item.status === 'completed').length,
    total: queueItems.length
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
          <p className="text-gray-600 dark:text-gray-400">Loading client queue...</p>
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
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Client Queue Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage client flow with care and discretion
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="hidden md:flex items-center gap-6 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-2xl p-4 shadow-lg border border-purple-100 dark:border-purple-900"
        >
          <div className="text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.total}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.waiting}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Waiting</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stats.withDoctor}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">In Session</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
          </div>
        </motion.div>
        
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          onClick={() => setShowAddForm(true)} 
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="h-5 w-5" /> Add Client
        </motion.button>
      </div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clients</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Waiting</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.waiting}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-pink-100 dark:border-pink-900 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Session</p>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stats.withDoctor}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 p-6 rounded-3xl shadow-lg border border-emerald-100 dark:border-emerald-900 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="px-4 py-2 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 border border-purple-200 dark:border-purple-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          >
            <option value="all">All Status</option>
            <option value="waiting">Waiting</option>
            <option value="with_doctor">In Session</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</label>
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)} 
            className="px-4 py-2 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 border border-purple-200 dark:border-purple-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          >
            <option value="all">All Priority</option>
            <option value="normal">Normal</option>
            <option value="urgent">Urgent</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Showing {filteredItems.length} of {queueItems.length} clients</span>
        </div>
      </motion.div>

      {/* Queue List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 rounded-3xl shadow-lg border border-purple-100 dark:border-purple-900 overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-purple-100 dark:border-purple-700 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20">
          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Current Client Queue</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage client appointments with privacy and care</p>
        </div>
        
        {filteredItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-8 py-16 text-center"
          >
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="h-10 w-10 text-purple-500 dark:text-purple-400" />
            </motion.div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              No clients in queue
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Ready to welcome your first client with professional care</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)} 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-5 w-5" /> Add First Client
            </motion.button>
          </motion.div>
        ) : (
          <div className="divide-y divide-purple-100 dark:divide-purple-800">
            <AnimatePresence>
              {filteredItems.map((item, index) => {
                const waitTime = calculateWaitTime(item.arrivalTime);
                const isEmergency = item.priority === 'emergency';
                const isUrgent = item.priority === 'urgent';
                
                return (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.05)' }}
                    className={`px-8 py-6 transition-all duration-300 ${
                      isEmergency ? 'border-l-4 border-l-red-500 bg-red-50/30 dark:bg-red-900/10' :
                      isUrgent ? 'border-l-4 border-l-purple-500 bg-purple-50/30 dark:bg-purple-900/10' :
                      'border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                              isEmergency ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                              isUrgent ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                              'bg-gradient-to-r from-purple-400 to-pink-400'
                            }`}
                          >
                            <span className="text-white font-bold text-lg">
                              {item.patientName.charAt(0).toUpperCase()}
                            </span>
                          </motion.div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{item.patientName}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Phone className="h-3 w-3" />
                              {item.patientPhone}
                            </div>
                          </div>
                        </div>
                      </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Priority Badge */}
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-full text-xs font-semibold shadow-sm ${getPriorityColor(item.priority)}`}
                      >
                        {getPriorityIcon(item.priority)}
                        <span className="capitalize">{item.priority}</span>
                      </motion.div>
                      
                      {/* Status Badge */}
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-full text-xs font-semibold border shadow-sm ${getStatusColor(item.status)}`}
                      >
                        {getStatusIcon(item.status)}
                        <span className="capitalize">{item.status === 'with_doctor' ? 'In Session' : item.status.replace('_', ' ')}</span>
                      </motion.div>
                      
                      {/* Status Update Dropdown */}
                      <select
                        value={item.status}
                        onChange={(e) => updateQueueItemStatus(item.id, e.target.value)}
                        className="px-3 py-2 text-sm border border-purple-200 dark:border-purple-600 rounded-xl bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <option value="waiting">Waiting</option>
                        <option value="with_doctor">In Session</option>
                        <option value="completed">Completed</option>
                      </select>
                      
                      {/* Remove Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromQueue(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 shadow-sm hover:shadow-md"
                        title="Remove from queue"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Arrival: {new Date(item.arrivalTime).toLocaleTimeString()}</span>
                      </div>
                      <span className={`font-semibold px-2 py-1 rounded-lg ${
                        waitTime > 60 ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20' :
                        waitTime > 30 ? 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20' :
                        'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20'
                      }`}>
                        Wait: {waitTime} min
                      </span>
                    </div>
                    <motion.span 
                      whileHover={{ scale: 1.1 }}
                      className="text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full"
                    >
                      #{index + 1}
                    </motion.span>
                  </div>
                  
                  {/* Symptoms Section */}
                  {item.symptoms && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Symptoms</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.symptoms}</p>
                    </div>
                  )}
                  
                  {/* Notes Section */}
                  {item.notes && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Notes</span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{item.notes}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {showAddForm && (
        <AddPatientForm onClose={() => setShowAddForm(false)} onSubmit={addPatientToQueue} />
      )}
    </motion.div>
  );
}

interface AddPatientFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

function AddPatientForm({ onClose, onSubmit }: AddPatientFormProps) {
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    symptoms: '',
    priority: 'normal',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white/90 backdrop-blur-xl dark:bg-gray-800/90 rounded-3xl shadow-2xl max-w-md w-full border border-purple-100 dark:border-purple-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-purple-100 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <Plus className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Add New Client</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Register a new client with privacy and care</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="h-6 w-6" />
            </motion.button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Client Name *</label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="w-full px-4 py-3 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 border border-purple-200 dark:border-purple-700 rounded-xl text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm"
              placeholder="Enter client name"
              required
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
            <input
              type="tel"
              value={formData.patientPhone}
              onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
              className="w-full px-4 py-3 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 border border-purple-200 dark:border-purple-700 rounded-xl text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm"
              placeholder="Enter phone number"
              required
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Concern/Symptoms</label>
            <textarea
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              className="w-full px-4 py-3 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 border border-purple-200 dark:border-purple-700 rounded-xl text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm"
              rows={3}
              placeholder="Describe consultation needs (optional)..."
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-3 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 border border-purple-200 dark:border-purple-700 rounded-xl text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm"
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Private Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-3 bg-white/70 backdrop-blur-xl dark:bg-gray-800/70 border border-purple-200 dark:border-purple-700 rounded-xl text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 shadow-sm"
              rows={2}
              placeholder="Confidential notes (optional)..."
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-end space-x-3 pt-6 border-t border-purple-100 dark:border-purple-700"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-600 dark:text-gray-400 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Add Client
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
} 