import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { templateLibrary, getTemplatesByCategory } from '../data/templateLibrary';

const { FiSearch, FiFilter, FiStar, FiDownload, FiEye, FiEdit3, FiUpload, FiPlus, FiX } = FiIcons;

function TemplateLibrary({ onSelectTemplate, onCreateCustom }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    { id: 'all', name: 'All Templates', icon: FiFilter },
    { id: 'webinar', name: 'Webinar Certificates', icon: FiStar },
    { id: 'course', name: 'Course Completion', icon: FiStar },
    { id: 'workshop', name: 'Workshop Certificates', icon: FiStar },
    { id: 'training', name: 'Training Certificates', icon: FiStar }
  ];

  const getFilteredTemplates = () => {
    let templates = selectedCategory === 'all' 
      ? Object.values(templateLibrary).flat() 
      : getTemplatesByCategory(selectedCategory);
    
    if (searchTerm) {
      templates = templates.filter(template => 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return templates;
  };

  const handleTemplateSelect = (template) => {
    onSelectTemplate(template);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = [...e.dataTransfer.files];
    handleCustomUpload(files);
  };

  const handleCustomUpload = (files) => {
    if (files && files.length > 0) {
      console.log('Uploading custom templates:', files);
      const fileList = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      }));
      
      alert(`Successfully uploaded ${fileList.length} template(s):\n${fileList.map(f => f.name).join('\n')}`);
      setShowUploadModal(false);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files) {
      handleCustomUpload(Array.from(files));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Professional Certificate Templates
        </motion.h2>
        <p className="text-netflix-lightgray">
          Choose from our curated collection of beautiful, professionally designed templates
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
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
        
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center px-4 py-3 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
        >
          <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
          Upload Custom
        </button>
        
        <button
          onClick={onCreateCustom}
          className="flex items-center px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create New
        </button>
      </div>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedCategory === category.id
                ? 'bg-netflix-red text-white'
                : 'bg-netflix-dark text-netflix-lightgray hover:text-white hover:bg-netflix-gray'
            }`}
          >
            <SafeIcon icon={category.icon} className="w-4 h-4 mr-2" />
            {category.name}
          </motion.button>
        ))}
      </div>

      {/* Templates Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {getFilteredTemplates().map((template, index) => (
            <motion.div
              key={template.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-netflix-dark rounded-xl border border-netflix-gray overflow-hidden hover:border-netflix-red transition-all duration-300 cursor-pointer"
              onClick={() => handleTemplateSelect(template)}
            >
              {/* Template Preview */}
              <div className="relative aspect-video bg-netflix-gray overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ 
                    background: template.background?.gradient || template.background?.color || '#2f2f2f'
                  }}
                >
                  {template.thumbnail && (
                    <img 
                      src={template.thumbnail} 
                      alt={template.name}
                      className="w-full h-full object-cover mix-blend-overlay opacity-30"
                    />
                  )}
                  
                  {/* Preview Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="text-lg font-bold mb-1">CERTIFICATE</h3>
                      <p className="text-sm opacity-80">OF ACHIEVEMENT</p>
                    </div>
                  </div>
                </div>

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-netflix-red rounded-full flex items-center justify-center text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateSelect(template);
                    }}
                  >
                    <SafeIcon icon={FiEdit3} className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Previewing ${template.name}`);
                    }}
                  >
                    <SafeIcon icon={FiEye} className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Premium Badge */}
                {template.isPremium && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-medium rounded-full">
                      <SafeIcon icon={FiStar} className="w-3 h-3 mr-1" />
                      Pro
                    </span>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-netflix-red transition-colors">
                  {template.name}
                </h3>
                <p className="text-netflix-lightgray text-sm mb-3 line-clamp-2">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-netflix-lightgray bg-netflix-gray px-2 py-1 rounded-full capitalize">
                    {template.category}
                  </span>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-netflix-red hover:text-red-400 text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateSelect(template);
                    }}
                  >
                    Use Template
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {getFilteredTemplates().length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <SafeIcon icon={FiSearch} className="w-16 h-16 text-netflix-lightgray mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
          <p className="text-netflix-lightgray mb-6">
            Try adjusting your search terms or browse different categories
          </p>
          <button
            onClick={onCreateCustom}
            className="inline-flex items-center px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
          >
            <SafeIcon icon={FiPlus} className="w-5 h-5 mr-2" />
            Create Custom Template
          </button>
        </motion.div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 modal-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-netflix-dark rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Upload Custom Templates</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-netflix-lightgray hover:text-white"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  dragActive 
                    ? 'border-netflix-red bg-netflix-red bg-opacity-10' 
                    : 'border-netflix-gray hover:border-netflix-red hover:bg-netflix-red hover:bg-opacity-5'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <SafeIcon icon={FiUpload} className="w-12 h-12 text-netflix-lightgray mx-auto mb-4" />
                <p className="text-white mb-2">Click to upload or drag and drop</p>
                <p className="text-netflix-lightgray text-sm mb-4">
                  Supports: PDF, PNG, JPG, SVG (Max 10MB each)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.svg"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="template-upload"
                />
                <label
                  htmlFor="template-upload"
                  className="cursor-pointer px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 inline-block"
                >
                  Choose Files
                </label>
              </div>
              
              <div className="text-xs text-netflix-lightgray">
                <p className="mb-2">Tips for best results:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use high-resolution images (300 DPI min)</li>
                  <li>Landscape orientation (16:9 or 4:3) works best</li>
                  <li>Keep text areas clearly defined for editing</li>
                  <li>Ensure good contrast for readability</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default TemplateLibrary;