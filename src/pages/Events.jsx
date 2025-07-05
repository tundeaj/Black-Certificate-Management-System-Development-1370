import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCertificate } from '../context/CertificateContext';

const { FiPlus, FiCalendar, FiUsers, FiAward, FiEdit, FiTrash2, FiEye, FiSearch, FiFilter } = FiIcons;

function Events() {
  const { events, templates, dispatch } = useCertificate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    type: 'webinar',
    templateId: '',
    signingAuthority: {
      name: '',
      title: '',
      signature: null
    },
    attendees: [],
    status: 'upcoming'
  });

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateEvent = (e) => {
    e.preventDefault();
    dispatch({ type: 'ADD_EVENT', payload: newEvent });
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      duration: '',
      type: 'webinar',
      templateId: '',
      signingAuthority: { name: '', title: '', signature: null },
      attendees: [],
      status: 'upcoming'
    });
    setShowCreateModal(false);
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch({ type: 'DELETE_EVENT', payload: id });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-600';
      case 'ongoing': return 'bg-green-600';
      case 'completed': return 'bg-netflix-red';
      case 'cancelled': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Events</h1>
            <p className="text-netflix-lightgray">Manage your webinars, courses, and workshops</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
            Create Event
          </button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-netflix-lightgray w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-netflix-dark border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
            />
          </div>
          <div className="relative">
            <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-netflix-lightgray w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-3 bg-netflix-dark border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input appearance-none"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="event-card rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 truncate">{event.title}</h3>
                  <p className="text-netflix-lightgray text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-netflix-lightgray text-sm">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                  {event.date} at {event.time}
                </div>
                <div className="flex items-center text-netflix-lightgray text-sm">
                  <SafeIcon icon={FiUsers} className="w-4 h-4 mr-2" />
                  {event.attendees?.length || 0} attendees
                </div>
                <div className="flex items-center text-netflix-lightgray text-sm">
                  <SafeIcon icon={FiAward} className="w-4 h-4 mr-2" />
                  {event.templateId ? 'Template assigned' : 'No template'}
                </div>
              </div>

              <div className="flex space-x-2">
                <Link
                  to={`/events/${event.id}`}
                  className="flex-1 bg-netflix-red text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 text-center text-sm font-medium"
                >
                  <SafeIcon icon={FiEye} className="w-4 h-4 inline mr-2" />
                  View
                </Link>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                  title="Delete"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <SafeIcon icon={FiCalendar} className="w-16 h-16 text-netflix-lightgray mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No events found' : 'No events yet'}
            </h3>
            <p className="text-netflix-lightgray mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first event to get started'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
            >
              <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
              Create Event
            </button>
          </motion.div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-netflix-dark rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Event</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-netflix-lightgray hover:text-white"
              >
                <SafeIcon icon={FiTrash2} className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                  Description
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                    Event Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                  >
                    <option value="webinar">Webinar</option>
                    <option value="course">Course</option>
                    <option value="workshop">Workshop</option>
                    <option value="certification">Certification</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                    Certificate Template
                  </label>
                  <select
                    value={newEvent.templateId}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, templateId: e.target.value }))}
                    className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                  >
                    <option value="">Select template</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                    Signing Authority Name
                  </label>
                  <input
                    type="text"
                    value={newEvent.signingAuthority.name}
                    onChange={(e) => setNewEvent(prev => ({
                      ...prev,
                      signingAuthority: { ...prev.signingAuthority, name: e.target.value }
                    }))}
                    className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                    Signing Authority Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.signingAuthority.title}
                    onChange={(e) => setNewEvent(prev => ({
                      ...prev,
                      signingAuthority: { ...prev.signingAuthority, title: e.target.value }
                    }))}
                    className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                    placeholder="Director of Training"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
                >
                  Create Event
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Events;