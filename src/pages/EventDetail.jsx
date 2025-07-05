import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCertificate } from '../context/CertificateContext';
import { certificateEmailService } from '../services/certificateEmailService';

const { FiArrowLeft, FiEdit, FiUsers, FiUserPlus, FiAward, FiDownload, FiMail, FiTrash2, FiUpload, FiSend } = FiIcons;

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, attendees, templates, certificates, settings, dispatch } = useCertificate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddAttendeeModal, setShowAddAttendeeModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailResults, setEmailResults] = useState(null);
  const [newAttendee, setNewAttendee] = useState({
    name: '',
    email: '',
    status: 'registered'
  });

  const event = events.find(e => e.id === id);
  const eventAttendees = attendees.filter(a => a.eventId === id);
  const eventCertificates = certificates.filter(c => c.eventId === id);
  const template = templates.find(t => t.id === event?.templateId);

  if (!event) {
    return (
      <div className="min-h-screen bg-netflix-black p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Event not found</h1>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const handleAddAttendee = (e) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_ATTENDEE',
      payload: { ...newAttendee, eventId: id }
    });
    setNewAttendee({ name: '', email: '', status: 'registered' });
    setShowAddAttendeeModal(false);
  };

  const handleGenerateCertificates = async () => {
    const completedAttendees = eventAttendees.filter(a => a.status === 'completed');
    
    if (completedAttendees.length === 0) {
      alert('No attendees have completed the event yet.');
      return;
    }

    if (!template) {
      alert('Please assign a certificate template to this event first.');
      return;
    }

    const newCertificates = completedAttendees.map(attendee => ({
      eventId: id,
      attendeeId: attendee.id,
      attendeeName: attendee.name,
      attendeeEmail: attendee.email,
      eventTitle: event.title,
      templateId: template.id,
      templateName: template.name,
      completionDate: new Date().toISOString(),
      signingAuthority: event.signingAuthority,
      status: 'generated'
    }));

    dispatch({
      type: 'BULK_ADD_CERTIFICATES',
      payload: newCertificates
    });

    alert(`${newCertificates.length} certificates generated successfully!`);
  };

  const handleSendCertificateEmails = async () => {
    const certificatesToSend = eventCertificates.filter(c => c.status === 'generated');
    
    if (certificatesToSend.length === 0) {
      alert('No certificates available to send. Please generate certificates first.');
      return;
    }

    setEmailSending(true);
    setEmailResults(null);

    try {
      const results = await certificateEmailService.sendBulkCertificateEmails(
        certificatesToSend,
        settings
      );

      setEmailResults(results);
      
      // Update certificate statuses
      results.successfulEmails.forEach(result => {
        dispatch({
          type: 'UPDATE_CERTIFICATE_STATUS',
          payload: {
            id: certificatesToSend.find(c => c.certificateId === result.certificateId)?.id,
            status: 'sent'
          }
        });
      });

      setShowEmailModal(true);
    } catch (error) {
      alert(`Failed to send emails: ${error.message}`);
    } finally {
      setEmailSending(false);
    }
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      
      const newAttendees = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',');
          return {
            name: values[0]?.trim() || '',
            email: values[1]?.trim() || '',
            status: values[2]?.trim() || 'registered',
            eventId: id
          };
        })
        .filter(attendee => attendee.name && attendee.email);

      dispatch({
        type: 'BULK_ADD_ATTENDEES',
        payload: newAttendees
      });

      setShowBulkUploadModal(false);
      alert(`${newAttendees.length} attendees added successfully!`);
    };

    reader.readAsText(file);
  };

  const updateAttendeeStatus = (attendeeId, status) => {
    dispatch({
      type: 'UPDATE_ATTENDEE',
      payload: { id: attendeeId, status }
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiUsers },
    { id: 'attendees', label: 'Attendees', icon: FiUsers },
    { id: 'certificates', label: 'Certificates', icon: FiAward }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'registered': return 'bg-blue-600';
      case 'attended': return 'bg-green-600';
      case 'completed': return 'bg-netflix-red';
      case 'absent': return 'bg-gray-600';
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
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/events')}
              className="text-netflix-lightgray hover:text-white"
            >
              <SafeIcon icon={FiArrowLeft} className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">{event.title}</h1>
              <p className="text-netflix-lightgray mt-1">{event.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSendCertificateEmails}
              disabled={emailSending || eventCertificates.length === 0}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
            >
              {emailSending ? (
                <div className="loading-spinner mr-2"></div>
              ) : (
                <SafeIcon icon={FiSend} className="w-4 h-4 mr-2" />
              )}
              {emailSending ? 'Sending...' : 'Send Certificates'}
            </button>
            <button className="flex items-center px-4 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200">
              <SafeIcon icon={FiEdit} className="w-4 h-4 mr-2" />
              Edit Event
            </button>
            <button
              onClick={handleGenerateCertificates}
              className="flex items-center px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
            >
              <SafeIcon icon={FiAward} className="w-4 h-4 mr-2" />
              Generate Certificates
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="border-b border-netflix-gray mb-8">
          <div className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-netflix-red border-b-2 border-netflix-red'
                    : 'text-netflix-lightgray hover:text-white'
                }`}
              >
                <SafeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Event Details */}
              <div className="lg:col-span-2">
                <div className="bg-netflix-dark rounded-xl p-6 border border-netflix-gray">
                  <h2 className="text-xl font-semibold text-white mb-6">Event Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        Date & Time
                      </label>
                      <p className="text-white">{event.date} at {event.time}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        Duration
                      </label>
                      <p className="text-white">{event.duration} hours</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        Event Type
                      </label>
                      <p className="text-white capitalize">{event.type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        Status
                      </label>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        Signing Authority
                      </label>
                      <p className="text-white">
                        {event.signingAuthority.name}
                        {event.signingAuthority.title && (
                          <span className="text-netflix-lightgray">
                            {' '}- {event.signingAuthority.title}
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        Certificate Template
                      </label>
                      <p className="text-white">
                        {template ? template.name : 'No template assigned'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-6">
                <div className="bg-netflix-dark rounded-xl p-6 border border-netflix-gray">
                  <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-netflix-lightgray">Total Attendees</span>
                      <span className="text-white font-semibold">{eventAttendees.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-netflix-lightgray">Completed</span>
                      <span className="text-white font-semibold">
                        {eventAttendees.filter(a => a.status === 'completed').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-netflix-lightgray">Certificates Generated</span>
                      <span className="text-white font-semibold">{eventCertificates.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-netflix-lightgray">Certificates Sent</span>
                      <span className="text-white font-semibold">
                        {eventCertificates.filter(c => c.status === 'sent').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-netflix-lightgray">Completion Rate</span>
                      <span className="text-white font-semibold">
                        {eventAttendees.length > 0
                          ? Math.round((eventAttendees.filter(a => a.status === 'completed').length / eventAttendees.length) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendees' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Attendees ({eventAttendees.length})</h2>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowBulkUploadModal(true)}
                    className="flex items-center px-4 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
                  >
                    <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
                    Bulk Upload
                  </button>
                  <button
                    onClick={() => setShowAddAttendeeModal(true)}
                    className="flex items-center px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
                  >
                    <SafeIcon icon={FiUserPlus} className="w-4 h-4 mr-2" />
                    Add Attendee
                  </button>
                </div>
              </div>

              {eventAttendees.length > 0 ? (
                <div className="bg-netflix-dark rounded-xl border border-netflix-gray overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-netflix-gray">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-netflix-lightgray uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-netflix-lightgray uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-netflix-lightgray uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-netflix-lightgray uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-netflix-gray">
                        {eventAttendees.map((attendee) => (
                          <tr key={attendee.id} className="table-row">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">{attendee.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-netflix-lightgray">{attendee.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={attendee.status}
                                onChange={(e) => updateAttendeeStatus(attendee.id, e.target.value)}
                                className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(attendee.status)} form-input`}
                              >
                                <option value="registered">Registered</option>
                                <option value="attended">Attended</option>
                                <option value="completed">Completed</option>
                                <option value="absent">Absent</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-netflix-red hover:text-red-400">
                                  <SafeIcon icon={FiMail} className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-400">
                                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <SafeIcon icon={FiUsers} className="w-16 h-16 text-netflix-lightgray mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No attendees yet</h3>
                  <p className="text-netflix-lightgray mb-6">Add attendees to start managing your event</p>
                  <button
                    onClick={() => setShowAddAttendeeModal(true)}
                    className="inline-flex items-center px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
                  >
                    <SafeIcon icon={FiUserPlus} className="w-5 h-5 mr-2" />
                    Add First Attendee
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'certificates' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Certificates ({eventCertificates.length})</h2>
                <div className="flex space-x-4">
                  <button
                    onClick={handleSendCertificateEmails}
                    disabled={emailSending || eventCertificates.filter(c => c.status === 'generated').length === 0}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {emailSending ? (
                      <div className="loading-spinner mr-2"></div>
                    ) : (
                      <SafeIcon icon={FiSend} className="w-4 h-4 mr-2" />
                    )}
                    {emailSending ? 'Sending...' : 'Send All'}
                  </button>
                  <button
                    onClick={handleGenerateCertificates}
                    className="flex items-center px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
                  >
                    <SafeIcon icon={FiAward} className="w-4 h-4 mr-2" />
                    Generate Certificates
                  </button>
                </div>
              </div>

              {eventCertificates.length > 0 ? (
                <div className="bg-netflix-dark rounded-xl border border-netflix-gray overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-netflix-gray">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-netflix-lightgray uppercase tracking-wider">
                            Certificate ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-netflix-lightgray uppercase tracking-wider">
                            Attendee
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-netflix-lightgray uppercase tracking-wider">
                            Generated
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-netflix-lightgray uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-netflix-lightgray uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-netflix-gray">
                        {eventCertificates.map((certificate) => (
                          <tr key={certificate.id} className="table-row">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white font-mono">
                                {certificate.certificateId}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-white">{certificate.attendeeName}</div>
                              <div className="text-sm text-netflix-lightgray">{certificate.attendeeEmail}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-netflix-lightgray">
                                {new Date(certificate.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                                certificate.status === 'generated' ? 'bg-green-600' :
                                certificate.status === 'sent' ? 'bg-blue-600' :
                                certificate.status === 'downloaded' ? 'bg-netflix-red' : 'bg-gray-600'
                              }`}>
                                {certificate.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-netflix-red hover:text-red-400">
                                  <SafeIcon icon={FiDownload} className="w-4 h-4" />
                                </button>
                                <button className="text-netflix-red hover:text-red-400">
                                  <SafeIcon icon={FiMail} className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <SafeIcon icon={FiAward} className="w-16 h-16 text-netflix-lightgray mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No certificates generated yet</h3>
                  <p className="text-netflix-lightgray mb-6">
                    Generate certificates for attendees who have completed the event
                  </p>
                  <button
                    onClick={handleGenerateCertificates}
                    className="inline-flex items-center px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
                  >
                    <SafeIcon icon={FiAward} className="w-5 h-5 mr-2" />
                    Generate Certificates
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Attendee Modal */}
      {showAddAttendeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-netflix-dark rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add Attendee</h2>
              <button
                onClick={() => setShowAddAttendeeModal(false)}
                className="text-netflix-lightgray hover:text-white"
              >
                <SafeIcon icon={FiTrash2} className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddAttendee} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAttendee.name}
                  onChange={(e) => setNewAttendee(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                  placeholder="Enter attendee name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={newAttendee.email}
                  onChange={(e) => setNewAttendee(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                  placeholder="Enter attendee email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                  Status
                </label>
                <select
                  value={newAttendee.status}
                  onChange={(e) => setNewAttendee(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                >
                  <option value="registered">Registered</option>
                  <option value="attended">Attended</option>
                  <option value="completed">Completed</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAttendeeModal(false)}
                  className="px-6 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
                >
                  Add Attendee
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-netflix-dark rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Bulk Upload Attendees</h2>
              <button
                onClick={() => setShowBulkUploadModal(false)}
                className="text-netflix-lightgray hover:text-white"
              >
                <SafeIcon icon={FiTrash2} className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-netflix-lightgray text-sm mb-4">
                  Upload a CSV file with columns: Name, Email, Status
                </p>
                <div className="border-2 border-dashed border-netflix-gray rounded-lg p-6 text-center">
                  <SafeIcon icon={FiUpload} className="w-8 h-8 text-netflix-lightgray mx-auto mb-2" />
                  <p className="text-netflix-lightgray text-sm mb-2">
                    Click to select CSV file
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleBulkUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="cursor-pointer px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 inline-block"
                  >
                    Select File
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowBulkUploadModal(false)}
                  className="px-6 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Email Results Modal */}
      {showEmailModal && emailResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-netflix-dark rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Email Results</h2>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-netflix-lightgray hover:text-white"
              >
                <SafeIcon icon={FiTrash2} className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-netflix-gray rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-white">{emailResults.total}</p>
                    <p className="text-netflix-lightgray text-sm">Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-400">{emailResults.successful}</p>
                    <p className="text-netflix-lightgray text-sm">Successful</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-400">{emailResults.failed}</p>
                    <p className="text-netflix-lightgray text-sm">Failed</p>
                  </div>
                </div>
              </div>

              {/* Failed Emails */}
              {emailResults.failed > 0 && (
                <div className="bg-red-900 bg-opacity-30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Failed Emails</h3>
                  <div className="space-y-2">
                    {emailResults.failedEmails.map((failure, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-red-800 bg-opacity-30 rounded">
                        <span className="text-white">{failure.email}</span>
                        <span className="text-red-400 text-sm">{failure.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Successful Emails */}
              {emailResults.successful > 0 && (
                <div className="bg-green-900 bg-opacity-30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Successful Emails</h3>
                  <div className="space-y-2">
                    {emailResults.successfulEmails.map((success, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-green-800 bg-opacity-30 rounded">
                        <span className="text-white">{success.email}</span>
                        <span className="text-green-400 text-sm">✓ Sent</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-6 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default EventDetail;