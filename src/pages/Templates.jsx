import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import TemplateLibrary from '../components/TemplateLibrary';
import Footer from '../components/Footer';
import { useCertificate } from '../context/CertificateContext';

const { FiPlus, FiFileText, FiEdit, FiTrash2, FiCopy, FiSearch, FiFilter, FiStar } = FiIcons;

function Templates() {
  const navigate = useNavigate();
  const { templates, dispatch } = useCertificate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showLibrary, setShowLibrary] = useState(templates.length === 0); // Show library by default if no templates

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

  const handleSelectTemplate = (template) => {
    // When a template is selected from the library, navigate to designer with template data
    navigate('/templates/designer', { state: { template } });
    setShowLibrary(false);
  };

  const handleCreateCustom = () => {
    navigate('/templates/designer');
    setShowLibrary(false);
  };

  const categories = ['all', 'webinar', 'course', 'workshop', 'training'];

  if (showLibrary) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Template Library</h1>
              <p className="text-netflix-lightgray">Choose from our professional collection</p>
            </div>
            {templates.length > 0 && (
              <button
                onClick={() => setShowLibrary(false)}
                className="px-6 py-3 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
              >
                Back to My Templates
              </button>
            )}
          </div>

          <TemplateLibrary
            onSelectTemplate={handleSelectTemplate}
            onCreateCustom={handleCreateCustom}
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Certificate Templates</h1>
            <p className="text-netflix-lightgray">Create and manage your custom certificate templates</p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowLibrary(true)}
              className="inline-flex items-center px-6 py-3 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
            >
              <SafeIcon icon={FiStar} className="w-5 h-5 mr-2" />
              Browse Library
            </button>
            <Link
              to="/templates/designer"
              className="inline-flex items-center px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
            >
              <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
              Create Template
            </Link>
          </div>
        </motion.div>

        {/* Quick Start Section */}
        {templates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-netflix-red to-red-600 rounded-xl p-8 mb-8 text-white"
          >
            <h2 className="text-2xl font-bold mb-4">Get Started with Professional Templates</h2>
            <p className="text-lg mb-6 opacity-90">
              Choose from our curated collection of beautiful, professionally designed templates or create your own from scratch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowLibrary(true)}
                className="flex items-center justify-center px-6 py-3 bg-white text-netflix-red rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold"
              >
                <SafeIcon icon={FiStar} className="w-5 h-5 mr-2" />
                Browse Template Library
              </button>
              <Link
                to="/templates/designer"
                className="flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-netflix-red transition-all duration-200 font-semibold"
              >
                <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
                Create from Scratch
              </Link>
            </div>
          </motion.div>
        )}

        {/* Search and Filter */}
        {templates.length > 0 && (
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
        )}

        {/* Templates Grid */}
        {templates.length > 0 && (
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
                  <div
                    className="w-full h-full"
                    style={{
                      background: template.background?.gradient || template.background?.color || '#2f2f2f',
                      backgroundImage: template.background?.image ? `url(${template.background.image})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-lg font-bold mb-1">CERTIFICATE</h3>
                        <p className="text-sm opacity-80">OF ACHIEVEMENT</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-netflix-red text-white text-xs px-2 py-1 rounded capitalize">
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
        )}

        {/* Empty State */}
        {filteredTemplates.length === 0 && templates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <SafeIcon icon={FiFileText} className="w-16 h-16 text-netflix-lightgray mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
            <p className="text-netflix-lightgray mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => setShowLibrary(true)}
              className="inline-flex items-center px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
            >
              <SafeIcon icon={FiStar} className="w-5 h-5 mr-2" />
              Browse Template Library
            </button>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Templates;