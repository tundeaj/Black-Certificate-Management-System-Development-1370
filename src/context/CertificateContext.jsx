import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { emailService, EMAIL_PROVIDERS } from '../services/emailService';

const CertificateContext = createContext();

const initialState = {
  templates: [],
  events: [],
  certificates: [],
  attendees: [],
  settings: {
    organizationName: 'Your Organization',
    organizationLogo: null,
    defaultSignature: null,
    emailSettings: {
      fromName: 'Certificate System',
      fromEmail: 'certificates@yourorg.com',
      subject: 'Your Certificate is Ready!',
      body: 'Congratulations! Please find your certificate attached.',
      provider: EMAIL_PROVIDERS.SMTP,
      providerConfig: {
        host: '',
        port: 587,
        secure: false,
        username: '',
        password: '',
        apiKey: ''
      }
    }
  },
  loading: false,
  error: null
};

function certificateReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_TEMPLATE':
      const newTemplate = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return { ...state, templates: [...state.templates, newTemplate] };
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map(template =>
          template.id === action.payload.id
            ? { ...template, ...action.payload, updatedAt: new Date().toISOString() }
            : template
        )
      };
    case 'DELETE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.filter(template => template.id !== action.payload)
      };
    case 'ADD_EVENT':
      const newEvent = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return { ...state, events: [...state.events, newEvent] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id
            ? { ...event, ...action.payload, updatedAt: new Date().toISOString() }
            : event
        )
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload)
      };
    case 'ADD_CERTIFICATE':
      const newCertificate = {
        id: uuidv4(),
        certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        ...action.payload,
        createdAt: new Date().toISOString()
      };
      return { ...state, certificates: [...state.certificates, newCertificate] };
    case 'BULK_ADD_CERTIFICATES':
      const newCertificates = action.payload.map(cert => ({
        id: uuidv4(),
        certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        ...cert,
        createdAt: new Date().toISOString()
      }));
      return { ...state, certificates: [...state.certificates, ...newCertificates] };
    case 'UPDATE_CERTIFICATE_STATUS':
      return {
        ...state,
        certificates: state.certificates.map(cert =>
          cert.id === action.payload.id
            ? { ...cert, status: action.payload.status, updatedAt: new Date().toISOString() }
            : cert
        )
      };
    case 'ADD_ATTENDEE':
      const newAttendee = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date().toISOString()
      };
      return { ...state, attendees: [...state.attendees, newAttendee] };
    case 'BULK_ADD_ATTENDEES':
      const newAttendees = action.payload.map(attendee => ({
        id: uuidv4(),
        ...attendee,
        createdAt: new Date().toISOString()
      }));
      return { ...state, attendees: [...state.attendees, ...newAttendees] };
    case 'UPDATE_ATTENDEE':
      return {
        ...state,
        attendees: state.attendees.map(attendee =>
          attendee.id === action.payload.id
            ? { ...attendee, ...action.payload }
            : attendee
        )
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'UPDATE_EMAIL_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          emailSettings: { ...state.settings.emailSettings, ...action.payload }
        }
      };
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function CertificateProvider({ children }) {
  const [state, dispatch] = useReducer(certificateReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('certificateSystemData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('certificateSystemData', JSON.stringify(state));
  }, [state]);

  // Initialize email service when email settings change
  useEffect(() => {
    const initializeEmailService = async () => {
      const { emailSettings } = state.settings;
      if (emailSettings.provider && emailSettings.providerConfig) {
        try {
          await emailService.initialize(emailSettings.provider, {
            ...emailSettings.providerConfig,
            fromEmail: emailSettings.fromEmail
          });
        } catch (error) {
          console.error('Email service initialization failed:', error);
        }
      }
    };

    initializeEmailService();
  }, [state.settings.emailSettings]);

  const value = {
    ...state,
    dispatch,
    // Email service methods
    initializeEmailService: async (provider, config) => {
      try {
        await emailService.initialize(provider, config);
        dispatch({
          type: 'UPDATE_EMAIL_SETTINGS',
          payload: {
            provider,
            providerConfig: config
          }
        });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    testEmailConnection: async () => {
      try {
        return await emailService.testConnection();
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
  };

  return (
    <CertificateContext.Provider value={value}>
      {children}
    </CertificateContext.Provider>
  );
}

export function useCertificate() {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error('useCertificate must be used within a CertificateProvider');
  }
  return context;
}