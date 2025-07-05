import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMenu, FiX, FiHome, FiFileText, FiCalendar, FiAward, FiShield, FiSettings } = FiIcons;

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/templates', label: 'Templates', icon: FiFileText },
    { path: '/events', label: 'Events', icon: FiCalendar },
    { path: '/certificates', label: 'Certificates', icon: FiAward },
    { path: '/verify', label: 'Verify', icon: FiShield },
    { path: '/settings', label: 'Settings', icon: FiSettings },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-netflix-black border-b border-netflix-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-netflix-red rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiAward} className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CertifyPro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-netflix-red text-white'
                    : 'text-netflix-lightgray hover:text-white hover:bg-netflix-gray'
                }`}
              >
                <SafeIcon icon={item.icon} className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-netflix-lightgray hover:text-white p-2"
            >
              <SafeIcon icon={isOpen ? FiX : FiMenu} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-netflix-dark border-t border-netflix-gray"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-netflix-red text-white'
                    : 'text-netflix-lightgray hover:text-white hover:bg-netflix-gray'
                }`}
              >
                <SafeIcon icon={item.icon} className="w-5 h-5" />
                <span className="text-base font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;