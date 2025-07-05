import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCertificate } from '../context/CertificateContext';

const { FiPlus, FiFileText, FiEdit, FiTrash2, FiCopy, FiSearch, FiFilter } = FiIcons;

function Templates() {
  const { templates, dispatch } = useCertificate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || template.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteTemplate = (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      dispatch({ type: 'DELETE_TEMPLATE', payload: id });
    }
  };

  const handleDuplicateTemplate = (template) => {
    const duplicatedTemplate = {
      ...template,
      name: `${template.name} (Copy)`,
      id: undefined
    };
    dispatch({ type: 'ADD_TEMPLATE', payload: duplicatedTemplate });
  };

  const categories = ['all', 'webinar', 'course', 'workshop', 'certification'];

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
            <h1 className="text-4xl font-bold text-white mb-2">Certificate Templates</h1>
            <p className="text-netflix-lightgray">Create and manage your certificate templates</p>
          </div>
          <Link
            to="/templates/designer"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
            Create Template
          </Link>
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
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-netflix-dark border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
            />
          </div>
          <div className="relative">
            <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-netflix-lightgray w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-3 bg-netflix-dark border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input appearance-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Templates Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="template-grid"
        >
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-netflix-dark rounded-xl border border-netflix-gray overflow-hidden hover:border-netflix-red transition-all duration-300 group"
            >
              {/* Template Preview */}
              <div className="aspect-video bg-netflix-gray flex items-center justify-center relative overflow-hidden">
                <SafeIcon icon={FiFileText} className="w-16 h-16 text-netflix-lightgray" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-netflix-red text-white text-xs px-2 py-1 rounded">
                    {template.category || 'General'}
                  </span>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2 truncate">{template.name}</h3>
                <p className="text-netflix-lightgray text-sm mb-4">
                  {template.size} • {template.orientation}
                </p>
                <div className="text-netflix-lightgray text-xs mb-4">
                  Created: {new Date(template.createdAt).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    to={`/templates/designer/${template.id}`}
                    className="flex-1 bg-netflix-red text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 text-center text-sm font-medium"
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4 inline mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDuplicateTemplate(template)}
                    className="px-4 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
                    title="Duplicate"
                  >
                    <SafeIcon icon={FiCopy} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
                    title="Delete"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <SafeIcon icon={FiFileText} className="w-16 h-16 text-netflix-lightgray mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || filterType !== 'all' ? 'No templates found' : 'No templates yet'}
            </h3>
            <p className="text-netflix-lightgray mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Create your first certificate template to get started'
              }
            </p>
            <Link
              to="/templates/designer"
              className="inline-flex items-center px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
            >
              <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
              Create Template
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Templates;