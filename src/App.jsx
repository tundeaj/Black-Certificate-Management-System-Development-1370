import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Events from './pages/Events';
import Certificates from './pages/Certificates';
import Verification from './pages/Verification';
import Settings from './pages/Settings';
import TemplateDesigner from './pages/TemplateDesigner';
import EventDetail from './pages/EventDetail';
import CertificatePreview from './pages/CertificatePreview';
import { CertificateProvider } from './context/CertificateContext';
import './App.css';

function App() {
  return (
    <CertificateProvider>
      <Router>
        <div className="min-h-screen bg-netflix-black text-netflix-white">
          <Navbar />
          <motion.main 
            className="pt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/templates/designer/:id?" element={<TemplateDesigner />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/certificates/preview/:id" element={<CertificatePreview />} />
              <Route path="/verify" element={<Verification />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </motion.main>
        </div>
      </Router>
    </CertificateProvider>
  );
}

export default App;