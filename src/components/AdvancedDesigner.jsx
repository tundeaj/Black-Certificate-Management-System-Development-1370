import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiType, FiImage, FiSquare, FiCircle, FiUpload, FiLayers, FiMove, 
  FiRotateCw, FiCopy, FiTrash2, FiAlignCenter, FiAlignLeft, FiAlignRight,
  FiBold, FiItalic, FiUnderline, FiEyeDropper, FiZap, FiGrid
} = FiIcons;

function AdvancedDesigner({ template, onUpdateTemplate }) {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const backgroundInputRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [snapGuides, setSnapGuides] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const SNAP_THRESHOLD = 10;

  useEffect(() => {
    // Initialize canvas interactions
    const canvas = canvasRef.current;
    if (canvas) {
      const handleCanvasClick = (e) => {
        if (e.target === canvas) {
          setSelectedElement(null);
        }
      };
      
      canvas.addEventListener('click', handleCanvasClick);
      return () => canvas.removeEventListener('click', handleCanvasClick);
    }
  }, []);

  const addTextElement = () => {
    const newElement = {
      id: Date.now(),
      type: 'text',
      content: 'Double-click to edit',
      x: 100,
      y: 100,
      width: 200,
      height: 40,
      rotation: 0,
      style: {
        fontSize: 24,
        fontFamily: 'Inter',
        color: '#000000',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        textAlign: 'left',
        letterSpacing: 0,
        lineHeight: 1.2
      }
    };
    
    onUpdateTemplate({
      ...template,
      elements: [...(template.elements || []), newElement]
    });
    setSelectedElement(newElement);
  };

  const addImageElement = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const newElement = {
          id: Date.now(),
          type: 'image',
          src: event.target.result,
          x: 150,
          y: 150,
          width: 200,
          height: 200,
          rotation: 0,
          style: {
            borderRadius: 0,
            opacity: 1,
            filter: 'none',
            borderWidth: 0,
            borderColor: '#000000'
          }
        };
        
        onUpdateTemplate({
          ...template,
          elements: [...(template.elements || []), newElement]
        });
        setSelectedElement(newElement);
      };
      reader.readAsDataURL(file);
    }
    
    // Reset file input
    e.target.value = '';
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
      rotation: 0,
      style: {
        fill: '#e50914',
        stroke: '#000000',
        strokeWidth: 2,
        opacity: 1,
        borderRadius: shapeType === 'circle' ? 50 : 0
      }
    };
    
    onUpdateTemplate({
      ...template,
      elements: [...(template.elements || []), newElement]
    });
    setSelectedElement(newElement);
  };

  const updateElement = (elementId, updates) => {
    const updatedElements = (template.elements || []).map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    );
    
    onUpdateTemplate({
      ...template,
      elements: updatedElements
    });
    
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement({ ...selectedElement, ...updates });
    }
  };

  const deleteElement = (elementId) => {
    const updatedElements = (template.elements || []).filter(el => el.id !== elementId);
    onUpdateTemplate({
      ...template,
      elements: updatedElements
    });
    setSelectedElement(null);
  };

  const duplicateElement = (element) => {
    const newElement = {
      ...element,
      id: Date.now(),
      x: element.x + 20,
      y: element.y + 20
    };
    
    onUpdateTemplate({
      ...template,
      elements: [...(template.elements || []), newElement]
    });
  };

  const bringToFront = (elementId) => {
    const elements = [...(template.elements || [])];
    const elementIndex = elements.findIndex(el => el.id === elementId);
    if (elementIndex > -1) {
      const element = elements.splice(elementIndex, 1)[0];
      elements.push(element);
      onUpdateTemplate({
        ...template,
        elements
      });
    }
  };

  const sendToBack = (elementId) => {
    const elements = [...(template.elements || [])];
    const elementIndex = elements.findIndex(el => el.id === elementId);
    if (elementIndex > -1) {
      const element = elements.splice(elementIndex, 1)[0];
      elements.unshift(element);
      onUpdateTemplate({
        ...template,
        elements
      });
    }
  };

  const alignElements = (alignment) => {
    if (!selectedElement) return;
    
    const canvasWidth = 800;
    const canvasHeight = 600;
    let updates = {};
    
    switch (alignment) {
      case 'left':
        updates.x = 20;
        break;
      case 'center':
        updates.x = (canvasWidth - selectedElement.width) / 2;
        break;
      case 'right':
        updates.x = canvasWidth - selectedElement.width - 20;
        break;
      case 'top':
        updates.y = 20;
        break;
      case 'middle':
        updates.y = (canvasHeight - selectedElement.height) / 2;
        break;
      case 'bottom':
        updates.y = canvasHeight - selectedElement.height - 20;
        break;
    }
    
    updateElement(selectedElement.id, updates);
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File size must be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdateTemplate({
          ...template,
          background: {
            ...template.background,
            type: 'image',
            image: event.target.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
    
    // Reset file input
    e.target.value = '';
  };

  const handleBackgroundClick = () => {
    if (backgroundInputRef.current) {
      backgroundInputRef.current.click();
    }
  };

  const gradientPresets = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  ];

  const fontFamilies = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins',
    'Playfair Display', 'Merriweather', 'Oswald', 'Raleway'
  ];

  return (
    <div className="flex h-screen bg-netflix-black">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={backgroundInputRef}
        type="file"
        accept="image/*"
        onChange={handleBackgroundUpload}
        className="hidden"
      />

      {/* Left Toolbar */}
      <div className="w-16 bg-netflix-dark border-r border-netflix-gray flex flex-col items-center py-4 space-y-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={addTextElement}
          className="w-10 h-10 bg-netflix-gray rounded-lg flex items-center justify-center text-white hover:bg-netflix-red transition-colors"
          title="Add Text"
        >
          <SafeIcon icon={FiType} className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={addImageElement}
          className="w-10 h-10 bg-netflix-gray rounded-lg flex items-center justify-center text-white hover:bg-netflix-red transition-colors"
          title="Add Image"
        >
          <SafeIcon icon={FiImage} className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => addShapeElement('rectangle')}
          className="w-10 h-10 bg-netflix-gray rounded-lg flex items-center justify-center text-white hover:bg-netflix-red transition-colors"
          title="Add Rectangle"
        >
          <SafeIcon icon={FiSquare} className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => addShapeElement('circle')}
          className="w-10 h-10 bg-netflix-gray rounded-lg flex items-center justify-center text-white hover:bg-netflix-red transition-colors"
          title="Add Circle"
        >
          <SafeIcon icon={FiCircle} className="w-5 h-5" />
        </motion.button>
        
        <div className="w-full h-px bg-netflix-gray my-2" />
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowGrid(!showGrid)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            showGrid ? 'bg-netflix-red text-white' : 'bg-netflix-gray text-white hover:bg-netflix-red'
          }`}
          title="Toggle Grid"
        >
          <SafeIcon icon={FiGrid} className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-16 bg-netflix-dark border-b border-netflix-gray flex items-center px-4 space-x-4">
          {selectedElement && (
            <>
              {/* Alignment Tools */}
              <div className="flex items-center space-x-2 border-r border-netflix-gray pr-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => alignElements('left')}
                  className="w-8 h-8 bg-netflix-gray rounded flex items-center justify-center text-white hover:bg-netflix-red transition-colors"
                  title="Align Left"
                >
                  <SafeIcon icon={FiAlignLeft} className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => alignElements('center')}
                  className="w-8 h-8 bg-netflix-gray rounded flex items-center justify-center text-white hover:bg-netflix-red transition-colors"
                  title="Align Center"
                >
                  <SafeIcon icon={FiAlignCenter} className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => alignElements('right')}
                  className="w-8 h-8 bg-netflix-gray rounded flex items-center justify-center text-white hover:bg-netflix-red transition-colors"
                  title="Align Right"
                >
                  <SafeIcon icon={FiAlignRight} className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Layer Controls */}
              <div className="flex items-center space-x-2 border-r border-netflix-gray pr-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => bringToFront(selectedElement.id)}
                  className="w-8 h-8 bg-netflix-gray rounded flex items-center justify-center text-white hover:bg-netflix-red transition-colors"
                  title="Bring to Front"
                >
                  <SafeIcon icon={FiLayers} className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => sendToBack(selectedElement.id)}
                  className="w-8 h-8 bg-netflix-gray rounded flex items-center justify-center text-white hover:bg-netflix-red transition-colors"
                  title="Send to Back"
                >
                  <SafeIcon icon={FiLayers} className="w-4 h-4 opacity-50" />
                </motion.button>
              </div>

              {/* Element Actions */}
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => duplicateElement(selectedElement)}
                  className="w-8 h-8 bg-netflix-gray rounded flex items-center justify-center text-white hover:bg-netflix-red transition-colors"
                  title="Duplicate"
                >
                  <SafeIcon icon={FiCopy} className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => deleteElement(selectedElement.id)}
                  className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white hover:bg-red-700 transition-colors"
                  title="Delete"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                </motion.button>
              </div>
            </>
          )}

          <div className="flex-1" />

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
              className="px-2 py-1 bg-netflix-gray text-white rounded text-sm hover:bg-netflix-red transition-colors"
            >
              -
            </button>
            <span className="text-white text-sm w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(3, zoom + 0.25))}
              className="px-2 py-1 bg-netflix-gray text-white rounded text-sm hover:bg-netflix-red transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-netflix-gray p-8 overflow-auto flex items-center justify-center">
          <div
            ref={canvasRef}
            className="relative bg-white shadow-2xl"
            style={{
              width: `${800 * zoom}px`,
              height: `${600 * zoom}px`,
              transform: `scale(${zoom})`,
              transformOrigin: 'center',
              background: template.background?.type === 'gradient' 
                ? template.background.gradient 
                : template.background?.color || '#ffffff',
              backgroundImage: template.background?.image ? `url(${template.background.image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Grid */}
            {showGrid && (
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
            )}

            {/* Elements */}
            {(template.elements || []).map((element) => (
              <motion.div
                key={element.id}
                drag
                dragMomentum={false}
                onDragStart={() => {
                  setDraggedElement(element);
                  setIsDragging(true);
                }}
                onDragEnd={(event, info) => {
                  const newX = Math.max(0, element.x + info.offset.x);
                  const newY = Math.max(0, element.y + info.offset.y);
                  updateElement(element.id, { x: newX, y: newY });
                  setDraggedElement(null);
                  setIsDragging(false);
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
                  height: element.height,
                  transform: `rotate(${element.rotation || 0}deg)`,
                  zIndex: selectedElement?.id === element.id ? 10 : 1
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedElement(element);
                }}
              >
                {element.type === 'text' && (
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateElement(element.id, { content: e.target.textContent })}
                    style={{
                      ...element.style,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: element.style.textAlign === 'center' ? 'center' : 'flex-start',
                      outline: 'none',
                      background: 'transparent'
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
                      opacity: element.style.opacity,
                      filter: element.style.filter
                    }}
                    draggable={false}
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

                {/* Resize handles */}
                {selectedElement?.id === element.id && !isDragging && (
                  <>
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-netflix-red rounded-full cursor-nw-resize" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-netflix-red rounded-full cursor-ne-resize" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-netflix-red rounded-full cursor-sw-resize" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-netflix-red rounded-full cursor-se-resize" />
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-netflix-red rounded-full cursor-n-resize" />
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-netflix-red rounded-full cursor-s-resize" />
                    <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-netflix-red rounded-full cursor-w-resize" />
                    <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-netflix-red rounded-full cursor-e-resize" />
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Properties Panel */}
      <div className="w-80 bg-netflix-dark border-l border-netflix-gray overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Background Settings */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <SafeIcon icon={FiImage} className="w-4 h-4 mr-2" />
              Background
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                  Type
                </label>
                <select
                  value={template.background?.type || 'color'}
                  onChange={(e) => onUpdateTemplate({
                    ...template,
                    background: { ...template.background, type: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                >
                  <option value="color">Solid Color</option>
                  <option value="gradient">Gradient</option>
                  <option value="image">Image</option>
                </select>
              </div>

              {template.background?.type === 'color' && (
                <div>
                  <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                    Color
                  </label>
                  <input
                    type="color"
                    value={template.background?.color || '#ffffff'}
                    onChange={(e) => onUpdateTemplate({
                      ...template,
                      background: { ...template.background, color: e.target.value }
                    })}
                    className="w-full h-10 bg-netflix-gray border border-netflix-gray rounded-lg form-input"
                  />
                </div>
              )}

              {template.background?.type === 'gradient' && (
                <div>
                  <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                    Gradient Presets
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {gradientPresets.map((gradient, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onUpdateTemplate({
                          ...template,
                          background: { ...template.background, gradient }
                        })}
                        className="w-full h-8 rounded border border-netflix-gray"
                        style={{ background: gradient }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {template.background?.type === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                    Upload Image
                  </label>
                  <div 
                    onClick={handleBackgroundClick}
                    className="border-2 border-dashed border-netflix-gray rounded-lg p-4 text-center cursor-pointer hover:border-netflix-red transition-all duration-200"
                  >
                    <SafeIcon icon={FiUpload} className="w-8 h-8 text-netflix-lightgray mx-auto mb-2" />
                    <p className="text-netflix-lightgray text-sm mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-netflix-lightgray text-xs">
                      JPG, PNG, or SVG (Max 10MB)
                    </p>
                  </div>
                  {template.background?.image && (
                    <div className="mt-2">
                      <img 
                        src={template.background.image} 
                        alt="Background preview" 
                        className="w-full h-20 object-cover rounded border border-netflix-gray"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Element Properties */}
          {selectedElement && (
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <SafeIcon icon={FiZap} className="w-4 h-4 mr-2" />
                Element Properties
              </h3>

              <div className="space-y-4">
                {/* Position & Size */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-netflix-lightgray mb-1">X</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement.x)}
                      onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 bg-netflix-gray border border-netflix-gray rounded text-white text-sm form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-netflix-lightgray mb-1">Y</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement.y)}
                      onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value) || 0 })}
                      className="w-full px-2 py-1 bg-netflix-gray border border-netflix-gray rounded text-white text-sm form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-netflix-lightgray mb-1">Width</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement.width)}
                      onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) || 1 })}
                      className="w-full px-2 py-1 bg-netflix-gray border border-netflix-gray rounded text-white text-sm form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-netflix-lightgray mb-1">Height</label>
                    <input
                      type="number"
                      value={Math.round(selectedElement.height)}
                      onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) || 1 })}
                      className="w-full px-2 py-1 bg-netflix-gray border border-netflix-gray rounded text-white text-sm form-input"
                    />
                  </div>
                </div>

                {/* Text Properties */}
                {selectedElement.type === 'text' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-netflix-lightgray mb-1">Font Family</label>
                      <select
                        value={selectedElement.style.fontFamily}
                        onChange={(e) => updateElement(selectedElement.id, {
                          style: { ...selectedElement.style, fontFamily: e.target.value }
                        })}
                        className="w-full px-2 py-1 bg-netflix-gray border border-netflix-gray rounded text-white text-sm form-input"
                      >
                        {fontFamilies.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-netflix-lightgray mb-1">Size</label>
                        <input
                          type="number"
                          value={selectedElement.style.fontSize}
                          onChange={(e) => updateElement(selectedElement.id, {
                            style: { ...selectedElement.style, fontSize: parseInt(e.target.value) || 12 }
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

                    {/* Text Formatting */}
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateElement(selectedElement.id, {
                          style: { 
                            ...selectedElement.style, 
                            fontWeight: selectedElement.style.fontWeight === 'bold' ? 'normal' : 'bold'
                          }
                        })}
                        className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                          selectedElement.style.fontWeight === 'bold' 
                            ? 'bg-netflix-red text-white' 
                            : 'bg-netflix-gray text-white hover:bg-netflix-red'
                        }`}
                      >
                        <SafeIcon icon={FiBold} className="w-4 h-4" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateElement(selectedElement.id, {
                          style: { 
                            ...selectedElement.style, 
                            fontStyle: selectedElement.style.fontStyle === 'italic' ? 'normal' : 'italic'
                          }
                        })}
                        className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                          selectedElement.style.fontStyle === 'italic' 
                            ? 'bg-netflix-red text-white' 
                            : 'bg-netflix-gray text-white hover:bg-netflix-red'
                        }`}
                      >
                        <SafeIcon icon={FiItalic} className="w-4 h-4" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateElement(selectedElement.id, {
                          style: { 
                            ...selectedElement.style, 
                            textDecoration: selectedElement.style.textDecoration === 'underline' ? 'none' : 'underline'
                          }
                        })}
                        className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                          selectedElement.style.textDecoration === 'underline' 
                            ? 'bg-netflix-red text-white' 
                            : 'bg-netflix-gray text-white hover:bg-netflix-red'
                        }`}
                      >
                        <SafeIcon icon={FiUnderline} className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Shape Properties */}
                {selectedElement.type === 'shape' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-netflix-lightgray mb-1">Fill</label>
                        <input
                          type="color"
                          value={selectedElement.style.fill}
                          onChange={(e) => updateElement(selectedElement.id, {
                            style: { ...selectedElement.style, fill: e.target.value }
                          })}
                          className="w-full h-8 bg-netflix-gray border border-netflix-gray rounded form-input"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-netflix-lightgray mb-1">Stroke</label>
                        <input
                          type="color"
                          value={selectedElement.style.stroke}
                          onChange={(e) => updateElement(selectedElement.id, {
                            style: { ...selectedElement.style, stroke: e.target.value }
                          })}
                          className="w-full h-8 bg-netflix-gray border border-netflix-gray rounded form-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Image Properties */}
                {selectedElement.type === 'image' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-netflix-lightgray mb-1">Opacity</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={selectedElement.style.opacity}
                        onChange={(e) => updateElement(selectedElement.id, {
                          style: { ...selectedElement.style, opacity: parseFloat(e.target.value) }
                        })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-netflix-lightgray mb-1">Border Radius</label>
                      <input
                        type="number"
                        min="0"
                        value={selectedElement.style.borderRadius}
                        onChange={(e) => updateElement(selectedElement.id, {
                          style: { ...selectedElement.style, borderRadius: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-2 py-1 bg-netflix-gray border border-netflix-gray rounded text-white text-sm form-input"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdvancedDesigner;