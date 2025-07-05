import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AdvancedDesigner from '../components/AdvancedDesigner';
import { useCertificate } from '../context/CertificateContext';

const { FiSave, FiArrowLeft, FiEye, FiDownload } = FiIcons;

function TemplateDesigner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { templates, dispatch } = useCertificate();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [template, setTemplate] = useState({
    name: '',
    size: 'A4',
    orientation: 'landscape',
    category: 'general',
    background: {
      type: 'color',
      color: '#ffffff',
      image: null,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    elements: [],
    settings: {
      margin: 20,
      dpi: 300
    }
  });

  useEffect(() => {
    if (id) {
      // Editing existing template
      const existingTemplate = templates.find(t => t.id === id);
      if (existingTemplate) {
        setTemplate(existingTemplate);
      }
    } else if (location.state?.template) {
      // Using template from library
      const libraryTemplate = location.state.template;
      setTemplate({
        ...template,
        name: libraryTemplate.name,
        category: libraryTemplate.category,
        background: libraryTemplate.background || template.background,
        elements: libraryTemplate.elements || []
      });
    }
  }, [id, location.state, templates]);

  const handleSaveTemplate = () => {
    if (!template.name.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (id) {
      dispatch({
        type: 'UPDATE_TEMPLATE',
        payload: { ...template, id }
      });
    } else {
      dispatch({
        type: 'ADD_TEMPLATE',
        payload: template
      });
    }

    navigate('/templates');
  };

  const handleUpdateTemplate = (updatedTemplate) => {
    setTemplate(updatedTemplate);
  };

  const handlePreviewToggle = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleDownload = () => {
    // Generate and download PDF preview
    console.log('Downloading template preview...');
    alert('Template preview downloaded!');
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <div className="bg-netflix-dark border-b border-netflix-gray p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/templates')}
              className="text-netflix-lightgray hover:text-white"
            >
              <SafeIcon icon={FiArrowLeft} className="w-6 h-6" />
            </motion.button>
            <div>
              <h1 className="text-xl font-semibold text-white">
                {id ? 'Edit Template' : 'Create Template'}
              </h1>
              {template.name && (
                <p className="text-netflix-lightgray text-sm">{template.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Template Name Input */}
            <div className="hidden md:flex items-center space-x-3">
              <label className="text-netflix-lightgray text-sm">Name:</label>
              <input
                type="text"
                value={template.name}
                onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Template name..."
                className="px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
              />
            </div>

            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
              Download
            </button>

            <button
              onClick={handlePreviewToggle}
              className="flex items-center px-4 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
            >
              <SafeIcon icon={FiEye} className="w-4 h-4 mr-2" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveTemplate}
              className="flex items-center px-6 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
              Save Template
            </motion.button>
          </div>
        </div>

        {/* Mobile Template Name */}
        <div className="md:hidden mt-4">
          <input
            type="text"
            value={template.name}
            onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter template name..."
            className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
          />
        </div>
      </div>

      {/* Designer Interface */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isPreviewMode ? (
          <div className="h-screen flex items-center justify-center bg-netflix-gray p-8">
            <div
              className="bg-white shadow-2xl certificate-preview"
              style={{
                width: template.orientation === 'landscape' ? '800px' : '600px',
                height: template.orientation === 'landscape' ? '600px' : '800px',
                background: template.background?.type === 'gradient' 
                  ? template.background.gradient 
                  : template.background?.color || '#ffffff',
                backgroundImage: template.background?.image ? `url(${template.background.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Preview Content */}
              <div className="relative h-full">
                {template.elements?.map((element) => (
                  <div
                    key={element.id}
                    className="absolute"
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                      transform: `rotate(${element.rotation || 0}deg)`
                    }}
                  >
                    {element.type === 'text' && (
                      <div
                        style={{
                          ...element.style,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: element.style.textAlign === 'center' ? 'center' : 'flex-start'
                        }}
                      >
                        {element.content}
                      </div>
                    )}

                    {element.type === 'image' && element.src && (
                      <img
                        src={element.src}
                        alt="Element"
                        className="w-full h-full object-cover"
                        style={{
                          borderRadius: element.style.borderRadius,
                          opacity: element.style.opacity
                        }}
                      />
                    )}

                    {element.type === 'shape' && (
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundColor: element.style.fill,
                          border: `${element.style.strokeWidth}px solid ${element.style.stroke}`,
                          borderRadius: element.shapeType === 'circle' ? '50%' : element.style.borderRadius,
                          opacity: element.style.opacity
                        }}
                      />
                    )}
                  </div>
                ))}

                {/* Sample Preview Content */}
                {template.elements?.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-800">
                      <h1 className="text-4xl font-bold mb-4">CERTIFICATE</h1>
                      <h2 className="text-2xl mb-6">OF ACHIEVEMENT</h2>
                      <div className="w-32 h-1 bg-netflix-red mx-auto mb-6"></div>
                      <p className="text-lg mb-4">This is to certify that</p>
                      <h3 className="text-3xl font-bold mb-6 border-b-2 border-gray-300 pb-2 inline-block">
                        [Recipient Name]
                      </h3>
                      <p className="text-lg mb-2">has successfully completed</p>
                      <h4 className="text-2xl font-semibold mb-6">[Course/Event Title]</h4>
                      <p className="text-lg">on [Completion Date]</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <AdvancedDesigner
            template={template}
            onUpdateTemplate={handleUpdateTemplate}
          />
        )}
      </motion.div>
    </div>
  );
}

export default TemplateDesigner;