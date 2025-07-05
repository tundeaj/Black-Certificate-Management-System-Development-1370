import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCertificate } from '../context/CertificateContext';

const { FiAward, FiDownload, FiMail, FiEye, FiSearch, FiFilter, FiCalendar, FiUser } = FiIcons;

function Certificates() {
  const { certificates, events } = useCertificate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterEvent, setFilterEvent] = useState('all');

  const filteredCertificates = certificates.filter(certificate => {
    const matchesSearch = certificate.attendeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificate.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificate.eventTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || certificate.status === filterStatus;
    const matchesEvent = filterEvent === 'all' || certificate.eventId === filterEvent;
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const handleDownloadCertificate = (certificate) => {
    // This would typically generate and download the PDF
    console.log('Downloading certificate:', certificate.certificateId);
    alert(`Certificate ${certificate.certificateId} downloaded!`);
  };

  const handleEmailCertificate = (certificate) => {
    // This would typically send email with certificate
    console.log('Emailing certificate:', certificate.certificateId);
    alert(`Certificate ${certificate.certificateId} emailed to ${certificate.attendeeEmail}!`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'generated': return 'bg-green-600';
      case 'sent': return 'bg-blue-600';
      case 'downloaded': return 'bg-netflix-red';
      case 'expired': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const stats = [
    {
      title: 'Total Certificates',
      value: certificates.length,
      icon: FiAward,
      color: 'from-netflix-red to-red-600'
    },
    {
      title: 'Generated',
      value: certificates.filter(c => c.status === 'generated').length,
      icon: FiAward,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Sent',
      value: certificates.filter(c => c.status === 'sent').length,
      icon: FiMail,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Downloaded',
      value: certificates.filter(c => c.status === 'downloaded').length,
      icon: FiDownload,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-netflix-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Certificates</h1>
          <p className="text-netflix-lightgray">View and manage all generated certificates</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.05 }}
              className={`bg-gradient-to-r ${stat.color} rounded-xl p-6 text-white shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <SafeIcon icon={stat.icon} className="w-8 h-8 opacity-80" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-netflix-lightgray w-5 h-5" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-netflix-dark border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-netflix-lightgray w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 bg-netflix-dark border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input appearance-none"
              >
                <option value="all">All Status</option>
                <option value="generated">Generated</option>
                <option value="sent">Sent</option>
                <option value="downloaded">Downloaded</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div className="relative">
              <SafeIcon icon={FiCalendar} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-netflix-lightgray w-5 h-5" />
              <select
                value={filterEvent}
                onChange={(e) => setFilterEvent(e.target.value)}
                className="pl-10 pr-8 py-3 bg-netflix-dark border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input appearance-none"
              >
                <option value="all">All Events</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Certificates Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredCertificates.length > 0 ? (
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
                        Event
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
                    {filteredCertificates.map((certificate) => (
                      <tr key={certificate.id} className="table-row">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white font-mono">
                            {certificate.certificateId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-netflix-red rounded-full flex items-center justify-center mr-3">
                              <SafeIcon icon={FiUser} className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{certificate.attendeeName}</div>
                              <div className="text-sm text-netflix-lightgray">{certificate.attendeeEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{certificate.eventTitle}</div>
                          <div className="text-sm text-netflix-lightgray">{certificate.templateName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-netflix-lightgray">
                            {new Date(certificate.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(certificate.status)}`}>
                            {certificate.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              to={`/certificates/preview/${certificate.id}`}
                              className="text-netflix-red hover:text-red-400"
                              title="Preview"
                            >
                              <SafeIcon icon={FiEye} className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDownloadCertificate(certificate)}
                              className="text-netflix-red hover:text-red-400"
                              title="Download"
                            >
                              <SafeIcon icon={FiDownload} className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEmailCertificate(certificate)}
                              className="text-netflix-red hover:text-red-400"
                              title="Email"
                            >
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
            <div className="text-center py-16">
              <SafeIcon icon={FiAward} className="w-16 h-16 text-netflix-lightgray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchTerm || filterStatus !== 'all' || filterEvent !== 'all' 
                  ? 'No certificates found' 
                  : 'No certificates generated yet'
                }
              </h3>
              <p className="text-netflix-lightgray mb-6">
                {searchTerm || filterStatus !== 'all' || filterEvent !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Generate certificates from your events to see them here'
                }
              </p>
              <Link
                to="/events"
                className="inline-flex items-center px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
              >
                <SafeIcon icon={FiCalendar} className="w-5 h-5 mr-2" />
                View Events
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Certificates;