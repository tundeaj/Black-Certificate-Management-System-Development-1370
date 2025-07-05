import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiTwitter, FiLinkedin, FiFacebook, FiInstagram, FiMail, FiPhone, FiMapPin } = FiIcons;

function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FiTwitter, href: '#', label: 'Twitter' },
    { icon: FiLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FiFacebook, href: '#', label: 'Facebook' },
    { icon: FiInstagram, href: '#', label: 'Instagram' }
  ];

  const footerLinks = {
    product: [
      { name: 'Templates', href: '/templates' },
      { name: 'Events', href: '/events' },
      { name: 'Certificates', href: '/certificates' },
      { name: 'Verification', href: '/verify' }
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Press', href: '#' }
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Contact Us', href: '#' },
      { name: 'API Documentation', href: '#' },
      { name: 'Status', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Sitemap', href: '#' }
    ]
  };

  return (
    <footer className="bg-netflix-black border-t border-netflix-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-netflix-red rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiIcons.FiAward} className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CertifyPro</span>
            </div>
            <p className="text-netflix-lightgray mb-6 max-w-sm">
              Create beautiful, professional certificates with ease. Recognize achievements and celebrate success with elegantly designed certificates.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-netflix-dark rounded-lg flex items-center justify-center text-netflix-lightgray hover:text-white hover:bg-netflix-red transition-all duration-200"
                  aria-label={social.label}
                >
                  <SafeIcon icon={social.icon} className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-netflix-lightgray hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-netflix-lightgray hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-netflix-lightgray hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-netflix-lightgray hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="py-6 border-t border-netflix-gray">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-netflix-dark rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiMail} className="w-4 h-4 text-netflix-red" />
              </div>
              <div>
                <p className="text-netflix-lightgray text-sm">Email</p>
                <p className="text-white">contact@certifypro.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-netflix-dark rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiPhone} className="w-4 h-4 text-netflix-red" />
              </div>
              <div>
                <p className="text-netflix-lightgray text-sm">Phone</p>
                <p className="text-white">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-netflix-dark rounded-lg flex items-center justify-center">
                <SafeIcon icon={FiMapPin} className="w-4 h-4 text-netflix-red" />
              </div>
              <div>
                <p className="text-netflix-lightgray text-sm">Address</p>
                <p className="text-white">San Francisco, CA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-netflix-gray flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <p className="text-netflix-lightgray text-sm">
              © {currentYear} CertifyPro. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-netflix-lightgray text-sm">All systems operational</span>
            </div>
            
            <div className="text-netflix-lightgray text-sm">
              Made with ❤️ for creators
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;