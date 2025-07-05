// Professional certificate template library
export const templateLibrary = {
  webinar: [
    {
      id: 'webinar-modern',
      name: 'Modern Webinar Certificate',
      category: 'webinar',
      description: 'Clean, professional design perfect for online events',
      thumbnail: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      isPremium: false,
      background: {
        type: 'gradient',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      elements: [
        {
          id: 1,
          type: 'text',
          content: 'CERTIFICATE',
          x: 400,
          y: 80,
          style: {
            fontSize: 48,
            fontFamily: 'Playfair Display',
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center'
          }
        },
        {
          id: 2,
          type: 'text',
          content: 'OF PARTICIPATION',
          x: 400,
          y: 130,
          style: {
            fontSize: 24,
            fontFamily: 'Inter',
            color: '#ffffff',
            textAlign: 'center'
          }
        }
      ]
    },
    {
      id: 'webinar-elegant',
      name: 'Elegant Webinar Certificate',
      category: 'webinar',
      description: 'Sophisticated design with golden accents',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      isPremium: true,
      background: {
        type: 'color',
        color: '#1a1a2e'
      }
    },
    {
      id: 'webinar-creative',
      name: 'Creative Webinar Certificate',
      category: 'webinar',
      description: 'Bold, colorful design for creative events',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      isPremium: false,
      background: {
        type: 'gradient',
        gradient: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)'
      }
    }
  ],
  course: [
    {
      id: 'course-academic',
      name: 'Academic Excellence Certificate',
      category: 'course',
      description: 'Traditional academic design with modern touches',
      thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
      isPremium: false,
      background: {
        type: 'color',
        color: '#ffffff'
      }
    },
    {
      id: 'course-professional',
      name: 'Professional Course Certificate',
      category: 'course',
      description: 'Corporate-friendly design for business training',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
      isPremium: false,
      background: {
        type: 'gradient',
        gradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)'
      }
    },
    {
      id: 'course-tech',
      name: 'Tech Course Certificate',
      category: 'course',
      description: 'Modern design perfect for technology courses',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      isPremium: true,
      background: {
        type: 'gradient',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    }
  ],
  workshop: [
    {
      id: 'workshop-hands-on',
      name: 'Hands-On Workshop Certificate',
      category: 'workshop',
      description: 'Practical design for skill-building workshops',
      thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      isPremium: false,
      background: {
        type: 'gradient',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      }
    },
    {
      id: 'workshop-creative',
      name: 'Creative Workshop Certificate',
      category: 'workshop',
      description: 'Artistic design for creative workshops',
      thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
      isPremium: false,
      background: {
        type: 'gradient',
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
      }
    },
    {
      id: 'workshop-business',
      name: 'Business Workshop Certificate',
      category: 'workshop',
      description: 'Professional design for business workshops',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      isPremium: true,
      background: {
        type: 'color',
        color: '#2c3e50'
      }
    }
  ],
  training: [
    {
      id: 'training-corporate',
      name: 'Corporate Training Certificate',
      category: 'training',
      description: 'Professional design for corporate training programs',
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      isPremium: false,
      background: {
        type: 'gradient',
        gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)'
      }
    },
    {
      id: 'training-safety',
      name: 'Safety Training Certificate',
      category: 'training',
      description: 'Clear, authoritative design for safety certifications',
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
      isPremium: false,
      background: {
        type: 'color',
        color: '#e74c3c'
      }
    },
    {
      id: 'training-leadership',
      name: 'Leadership Training Certificate',
      category: 'training',
      description: 'Inspiring design for leadership development',
      thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
      isPremium: true,
      background: {
        type: 'gradient',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    }
  ]
};

export const getTemplatesByCategory = (category) => {
  return templateLibrary[category] || [];
};

export const getAllTemplates = () => {
  return Object.values(templateLibrary).flat();
};

export const getFeaturedTemplates = () => {
  return getAllTemplates().slice(0, 6);
};