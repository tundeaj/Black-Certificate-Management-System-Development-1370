import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCertificate } from '../context/CertificateContext';

const { FiFileText, FiCalendar, FiAward, FiUsers, FiTrendingUp, FiActivity, FiPlus } = FiIcons;

function Dashboard() {
  const { templates, events, certificates, attendees } = useCertificate();

  const stats = [
    {
      title: 'Templates',
      value: templates.length,
      icon: FiFileText,
      color: 'from-blue-500 to-blue-600',
      link: '/templates'
    },
    {
      title: 'Events',
      value: events.length,
      icon: FiCalendar,
      color: 'from-green-500 to-green-600',
      link: '/events'
    },
    {
      title: 'Certificates',
      value: certificates.length,
      icon: FiAward,
      color: 'from-netflix-red to-red-600',
      link: '/certificates'
    },
    {
      title: 'Attendees',
      value: attendees.length,
      icon: FiUsers,
      color: 'from-purple-500 to-purple-600',
      link: '/events'
    }
  ];

  const recentActivities = [
    { action: 'Created template', item: 'Webinar Certificate', time: '2 hours ago' },
    { action: 'Generated certificates', item: 'React Workshop', time: '4 hours ago' },
    { action: 'Added event', item: 'Advanced JavaScript', time: '1 day ago' },
    { action: 'Updated template', item: 'Course Completion', time: '2 days ago' }
  ];

  const quickActions = [
    { title: 'Create Template', icon: FiFileText, link: '/templates/designer', color: 'bg-blue-600' },
    { title: 'Add Event', icon: FiCalendar, link: '/events', color: 'bg-green-600' },
    { title: 'Generate Certificates', icon: FiAward, link: '/certificates', color: 'bg-netflix-red' },
    { title: 'Verify Certificate', icon: FiActivity, link: '/verify', color: 'bg-purple-600' }
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
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-netflix-lightgray">Manage your certificates, templates, and events</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Link
              key={stat.title}
              to={stat.link}
              className="block"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-gradient-to-r ${stat.color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <SafeIcon icon={stat.icon} className="w-8 h-8 opacity-80" />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-netflix-dark rounded-xl p-6 border border-netflix-gray">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <SafeIcon icon={FiTrendingUp} className="w-5 h-5 mr-2 text-netflix-red" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-netflix-gray rounded-lg p-4 hover:bg-opacity-80 transition-all duration-200 border border-transparent hover:border-netflix-red"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                          <SafeIcon icon={action.icon} className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{action.title}</p>
                          <p className="text-netflix-lightgray text-sm">Get started quickly</p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-netflix-dark rounded-xl p-6 border border-netflix-gray">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <SafeIcon icon={FiActivity} className="w-5 h-5 mr-2 text-netflix-red" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-netflix-red rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-medium">{activity.action}</span>{' '}
                        <span className="text-netflix-lightgray">{activity.item}</span>
                      </p>
                      <p className="text-netflix-lightgray text-xs mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Templates */}
        {templates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <div className="bg-netflix-dark rounded-xl p-6 border border-netflix-gray">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <SafeIcon icon={FiFileText} className="w-5 h-5 mr-2 text-netflix-red" />
                  Recent Templates
                </h2>
                <Link
                  to="/templates"
                  className="text-netflix-red hover:text-red-400 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.slice(0, 3).map((template) => (
                  <Link
                    key={template.id}
                    to={`/templates/designer/${template.id}`}
                    className="block"
                  >
                    <div className="bg-netflix-gray rounded-lg p-4 hover:bg-opacity-80 transition-all duration-200 border border-transparent hover:border-netflix-red">
                      <div className="aspect-video bg-netflix-black rounded-lg mb-3 flex items-center justify-center">
                        <SafeIcon icon={FiFileText} className="w-8 h-8 text-netflix-lightgray" />
                      </div>
                      <h3 className="text-white font-medium truncate">{template.name}</h3>
                      <p className="text-netflix-lightgray text-sm mt-1">
                        {template.orientation} • {template.size}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;