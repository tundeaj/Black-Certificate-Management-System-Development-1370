import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCertificate } from '../context/CertificateContext';

const { FiSave, FiArrowLeft, FiType, FiImage, FiSquare, FiCircle, FiUpload, FiEye, FiDownload, FiFileText } = FiIcons;

function TemplateDesigner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { templates, dispatch } = useCertificate();
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const [template, setTemplate] = useState({
    name: '',
    size: 'A4',
    orientation: 'landscape',
    category: 'general',
    background: {
      type: 'color',
      color: '#ffffff',
      image: null
    },
    elements: [],
    settings: {
      margin: 20,
      dpi: 300
    }
  });

  const [selectedElement, setSelectedElement] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);

  useEffect(() => {
    if (id) {
      const existingTemplate = templates.find(t => t.id === id);
      if (existingTemplate) {
        setTemplate(existingTemplate);
      }
    }
  }, [id, templates]);

  const handleSaveTemplate = () => {
    if (!template.name.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (id) {
      dispatch({ type: 'UPDATE_TEMPLATE', payload: { ...template, id } });
    } else {
      dispatch({ type: 'ADD_TEMPLATE', payload: template });
    }

    navigate('/templates');
  };

  const addTextElement = () => {
    const newElement = {
      id: Date.now(),
      type: 'text',
      content: 'Sample Text',
      x: 100,
      y: 100,
      width: 200,
      height: 40,
      style: {
        fontSize: 24,
        fontFamily: 'Arial',
        color: '#000000',
        fontWeight: 'normal',
        textAlign: 'left'
      }
    };
    setTemplate(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
  };

  const addImageElement = () => {
    const newElement = {
      id: Date.now(),
      type: 'image',
      src: null,
      x: 150,
      y: 150,
      width: 100,
      height: 100,
      style: {
        borderRadius: 0,
        opacity: 1
      }
    };
    setTemplate(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
  };

  const addShapeElement = (shapeType) => {
    const newElement = {
      id: Date.now(),
      type: 'shape',
      shapeType,
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      style: {
        fill: '#e50914',
        stroke: '#000000',
        strokeWidth: 2
      }
    };
    setTemplate(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
  };

  const updateElement = (elementId, updates) => {
    setTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      )
    }));
  };

  const deleteElement = (elementId) => {
    setTemplate(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId)
    }));
    setSelectedElement(null);
  };

  const handleElementClick = (element) => {
    setSelectedElement(element);
  };

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic', icon: FiType },
    { id: 'elements', label: 'Elements', icon: FiSquare },
    { id: 'background', label: 'Background', icon: FiImage },
    { id: 'settings', label: 'Settings', icon: FiUpload }
  ];

  const predefinedTemplates = [
    { name: 'Webinar Certificate', category: 'webinar', elements: [] },
    { name: 'Course Completion', category: 'course', elements: [] },
    { name: 'Workshop Certificate', category: 'workshop', elements: [] },
    { name: 'Training Certificate', category: 'certification', elements: [] }
  ];

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <div className="bg-netflix-dark border-b border-netflix-gray p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/templates')}
              className="text-netflix-lightgray hover:text-white"
            >
              <SafeIcon icon={FiArrowLeft} className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-white">
              {id ? 'Edit Template' : 'Create Template'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center px-4 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
            >
              <SafeIcon icon={FiEye} className="w-4 h-4 mr-2" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handleSaveTemplate}
              className="flex items-center px-6 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
              Save Template
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Left Sidebar */}
        {!isPreviewMode && (
          <div className="w-80 bg-netflix-dark border-r border-netflix-gray overflow-y-auto">
            {/* Tabs */}
            <div className="border-b border-netflix-gray">
              <div className="flex">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-netflix-red text-white border-b-2 border-netflix-red'
                        : 'text-netflix-lightgray hover:text-white'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                      Template Name
                    </label>
                    <input
                      type="text"
                      value={template.name}
                      onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                      placeholder="Enter template name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                      Category
                    </label>
                    <select
                      value={template.category}
                      onChange={(e) => setTemplate(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                    >
                      <option value="general">General</option>
                      <option value="webinar">Webinar</option>
                      <option value="course">Course</option>
                      <option value="workshop">Workshop</option>
                      <option value="certification">Certification</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        Size
                      </label>
                      <select
                        value={template.size}
                        onChange={(e) => setTemplate(prev => ({ ...prev, size: e.target.value }))}
                        className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                      >
                        <option value="A4">A4</option>
                        <option value="Letter">Letter</option>
                        <option value="Legal">Legal</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        Orientation
                      </label>
                      <select
                        value={template.orientation}
                        onChange={(e) => setTemplate(prev => ({ ...prev, orientation: e.target.value }))}
                        className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                      >
                        <option value="landscape">Landscape</option>
                        <option value="portrait">Portrait</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                      Quick Start Templates
                    </label>
                    <div className="space-y-2">
                      {predefinedTemplates.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => setTemplate(prev => ({ ...prev, name: preset.name, category: preset.category }))}
                          className="w-full text-left px-3 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200 text-sm"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'elements' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-netflix-lightgray mb-3">Add Elements</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={addTextElement}
                        className="flex items-center justify-center px-4 py-3 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
                      >
                        <SafeIcon icon={FiType} className="w-4 h-4 mr-2" />
                        Text
                      </button>
                      <button
                        onClick={addImageElement}
                        className="flex items-center justify-center px-4 py-3 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
                      >
                        <SafeIcon icon={FiImage} className="w-4 h-4 mr-2" />
                        Image
                      </button>
                      <button
                        onClick={() => addShapeElement('rectangle')}
                        className="flex items-center justify-center px-4 py-3 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
                      >
                        <SafeIcon icon={FiSquare} className="w-4 h-4 mr-2" />
                        Rectangle
                      </button>
                      <button
                        onClick={() => addShapeElement('circle')}
                        className="flex items-center justify-center px-4 py-3 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
                      >
                        <SafeIcon icon={FiCircle} className="w-4 h-4 mr-2" />
                        Circle
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-netflix-lightgray mb-3">Dynamic Fields</h3>
                    <div className="space-y-2">
                      {[
                        '[[AttendeeName]]',
                        '[[CourseEventTitle]]',
                        '[[CompletionDate]]',
                        '[[SigningAuthorityName]]',
                        '[[SigningAuthorityTitle]]',
                        '[[CertificateID]]'
                      ].map((field, index) => (
                        <button
                          key={index}
                          onClick={() => addTextElement()}
                          className="w-full text-left px-3 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200 text-sm font-mono"
                        >
                          {field}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedElement && (
                    <div className="border-t border-netflix-gray pt-4">
                      <h3 className="text-sm font-medium text-netflix-lightgray mb-3">Element Properties</h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-netflix-lightgray mb-1">X Position</label>
                            <input
                              type="number"
                              value={selectedElement.x}
                              onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) })}
                              className="w-full px-2 py-1 bg-netflix-gray border border-netflix-gray rounded text-white text-sm form-input"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-netflix-lightgray mb-1">Y Position</label>
                            <input
                              type="number"
                              value={selectedElement.y}
                              onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) })}
                              className="w-full px-2 py-1 bg-netflix-gray border border-netflix-gray rounded text-white text-sm form-input"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-netflix-lightgray mb-1">Width</label>
                            <input
                              type="number"
                              value={selectedElement.width}
                              onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) })}
                              className="w-full px-2 py-1 bg-netflix-gray border border-netflix-gray rounded text-white text-sm form-input"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-netflix-lightgray mb-1">Height</label>
                            <input
                              type="number"
                              value={selectedElement.height}
                              onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) })}
                              className="w-full px-2 py-1 bg-netflix-gray border border-netflix-gray rounded text-white text-sm form-input"
                            />
                          </div>
                        </div>

                        {selectedElement.type === 'text' && (
                          <>
                            <div>
                              <label className="block text-xs text-netflix-lightgray mb-1">Content</label>
                              <textarea
                                value={selectedElement.content}
                                onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                                className="w-full px-2 py-1 bg-netflix-gray border border-netflix-gray rounded text-white text-sm form-input"
                                rows={3}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-netflix-lightgray mb-1">Font Size</label>
                                <input
                                  type="number"
                                  value={selectedElement.style.fontSize}
                                  onChange={(e) => updateElement(selectedElement.id, { 
                                    style: { ...selectedElement.style, fontSize: parseInt(e.target.value) }
                                  })}
                                  className="w-full px-2 py-1 bg-netflix-gray border border-netflix-gray rounded text-white text-sm form-input"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-netflix-lightgray mb-1">Color</label>
                                <input
                                  type="color"
                                  value={selectedElement.style.color}
                                  onChange={(e) => updateElement(selectedElement.id, { 
                                    style: { ...selectedElement.style, color: e.target.value }
                                  })}
                                  className="w-full h-8 bg-netflix-gray border border-netflix-gray rounded form-input"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <button
                          onClick={() => deleteElement(selectedElement.id)}
                          className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 text-sm"
                        >
                          Delete Element
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'background' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                      Background Type
                    </label>
                    <select
                      value={template.background.type}
                      onChange={(e) => setTemplate(prev => ({
                        ...prev,
                        background: { ...prev.background, type: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                    >
                      <option value="color">Solid Color</option>
                      <option value="gradient">Gradient</option>
                      <option value="image">Image</option>
                    </select>
                  </div>

                  {template.background.type === 'color' && (
                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        Background Color
                      </label>
                      <input
                        type="color"
                        value={template.background.color}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          background: { ...prev.background, color: e.target.value }
                        }))}
                        className="w-full h-12 bg-netflix-gray border border-netflix-gray rounded-lg form-input"
                      />
                    </div>
                  )}

                  {template.background.type === 'image' && (
                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        Background Image
                      </label>
                      <div className="border-2 border-dashed border-netflix-gray rounded-lg p-6 text-center">
                        <SafeIcon icon={FiUpload} className="w-8 h-8 text-netflix-lightgray mx-auto mb-2" />
                        <p className="text-netflix-lightgray text-sm">
                          Click to upload or drag and drop
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setTemplate(prev => ({
                                  ...prev,
                                  background: { ...prev.background, image: e.target.result }
                                }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                      Margin (px)
                    </label>
                    <input
                      type="number"
                      value={template.settings.margin}
                      onChange={(e) => setTemplate(prev => ({
                        ...prev,
                        settings: { ...prev.settings, margin: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                      DPI
                    </label>
                    <select
                      value={template.settings.dpi}
                      onChange={(e) => setTemplate(prev => ({
                        ...prev,
                        settings: { ...prev.settings, dpi: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                    >
                      <option value={72}>72 DPI (Screen)</option>
                      <option value={150}>150 DPI (Draft)</option>
                      <option value={300}>300 DPI (Print)</option>
                      <option value={600}>600 DPI (High Quality)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 bg-netflix-gray p-8 overflow-auto">
          <div className="flex items-center justify-center min-h-full">
            <div
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="relative bg-white shadow-2xl"
              style={{
                width: template.orientation === 'landscape' ? '800px' : '600px',
                height: template.orientation === 'landscape' ? '600px' : '800px',
                backgroundColor: template.background.color,
                backgroundImage: template.background.image ? `url(${template.background.image})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Grid */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />

              {/* Elements */}
              {template.elements.map((element) => (
                <div
                  key={element.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleElementClick(element);
                  }}
                  className={`absolute cursor-pointer border-2 ${
                    selectedElement?.id === element.id 
                      ? 'border-netflix-red' 
                      : 'border-transparent hover:border-netflix-red'
                  }`}
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height
                  }}
                >
                  {element.type === 'text' && (
                    <div
                      style={{
                        fontSize: element.style.fontSize,
                        color: element.style.color,
                        fontFamily: element.style.fontFamily,
                        fontWeight: element.style.fontWeight,
                        textAlign: element.style.textAlign,
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

                  {element.type === 'image' && (
                    <div
                      className="w-full h-full bg-netflix-gray flex items-center justify-center"
                      style={{
                        borderRadius: element.style.borderRadius,
                        opacity: element.style.opacity
                      }}
                    >
                      {element.src ? (
                        <img
                          src={element.src}
                          alt="Element"
                          className="w-full h-full object-cover"
                          style={{ borderRadius: element.style.borderRadius }}
                        />
                      ) : (
                        <SafeIcon icon={FiImage} className="w-8 h-8 text-netflix-lightgray" />
                      )}
                    </div>
                  )}

                  {element.type === 'shape' && (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: element.style.fill,
                        border: `${element.style.strokeWidth}px solid ${element.style.stroke}`,
                        borderRadius: element.shapeType === 'circle' ? '50%' : '0'
                      }}
                    />
                  )}

                  {/* Resize handles */}
                  {selectedElement?.id === element.id && !isPreviewMode && (
                    <>
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-netflix-red rounded-full cursor-nw-resize" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-netflix-red rounded-full cursor-ne-resize" />
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-netflix-red rounded-full cursor-sw-resize" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-netflix-red rounded-full cursor-se-resize" />
                    </>
                  )}
                </div>
              ))}

              {/* Placeholder content for empty template */}
              {template.elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <SafeIcon icon={FiFileText} className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Your certificate template</p>
                    <p className="text-sm">Add elements from the sidebar to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateDesigner;