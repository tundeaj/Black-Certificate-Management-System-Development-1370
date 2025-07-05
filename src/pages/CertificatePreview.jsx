import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCertificate } from '../context/CertificateContext';

const { FiArrowLeft, FiDownload, FiMail, FiPrinter, FiShare2 } = FiIcons;

function CertificatePreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { certificates, templates } = useCertificate();
  const certificateRef = useRef(null);

  const certificate = certificates.find(c => c.id === id);
  const template = templates.find(t => t.id === certificate?.templateId);

  if (!certificate) {
    return (
      <div className="min-h-screen bg-netflix-black p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Certificate not found</h1>
          <button
            onClick={() => navigate('/certificates')}
            className="px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200"
          >
            Back to Certificates
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    console.log('Downloading certificate:', certificate.certificateId);
    alert('Certificate downloaded successfully!');
  };

  const handleEmail = () => {
    console.log('Emailing certificate:', certificate.certificateId);
    alert(`Certificate emailed to ${certificate.attendeeEmail}!`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate - ${certificate.attendeeName}`,
        text: `Certificate of completion for ${certificate.eventTitle}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Certificate link copied to clipboard!');
    }
  };

  // Sample certificate data with dynamic content
  const certificateData = {
    attendeeName: certificate.attendeeName,
    eventTitle: certificate.eventTitle,
    completionDate: new Date(certificate.completionDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    certificateId: certificate.certificateId,
    signingAuthorityName: certificate.signingAuthority?.name || 'John Doe',
    signingAuthorityTitle: certificate.signingAuthority?.title || 'Director of Training'
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <div className="bg-netflix-dark border-b border-netflix-gray p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/certificates')}
              className="text-netflix-lightgray hover:text-white"
            >
              <SafeIcon icon={FiArrowLeft} className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-white">Certificate Preview</h1>
              <p className="text-netflix-lightgray text-sm">{certificate.certificateId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
            >
              <SafeIcon icon={FiShare2} className="w-4 h-4 mr-2" />
              Share
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
            >
              <SafeIcon icon={FiPrinter} className="w-4 h-4 mr-2" />
              Print
            </button>
            <button
              onClick={handleEmail}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
              Email
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
            >
              <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Preview */}
      <div className="p-8 flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="certificate-preview"
        >
          <div
            ref={certificateRef}
            className="bg-white p-16 shadow-2xl"
            style={{
              width: '800px',
              height: '600px',
              background: template?.background?.color || '#ffffff',
              backgroundImage: template?.background?.image ? `url(${template.background.image})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Certificate Border */}
            <div className="h-full border-8 border-double border-gray-800 p-8 relative">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">CERTIFICATE</h1>
                <h2 className="text-2xl text-gray-600">OF COMPLETION</h2>
              </div>

              {/* Decorative Element */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-1 bg-gradient-to-r from-netflix-red to-red-600"></div>
              </div>

              {/* Main Content */}
              <div className="text-center mb-8">
                <p className="text-lg text-gray-600 mb-4">This is to certify that</p>
                <h3 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-300 pb-2 inline-block">
                  {certificateData.attendeeName}
                </h3>
                <p className="text-lg text-gray-600 mb-2">has successfully completed</p>
                <h4 className="text-2xl font-semibold text-gray-800 mb-6">
                  {certificateData.eventTitle}
                </h4>
                <p className="text-lg text-gray-600">
                  on {certificateData.completionDate}
                </p>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-end absolute bottom-8 left-8 right-8">
                <div className="text-center">
                  <div className="w-40 h-0.5 bg-gray-400 mb-2"></div>
                  <p className="text-sm text-gray-600">{certificateData.signingAuthorityName}</p>
                  <p className="text-xs text-gray-500">{certificateData.signingAuthorityTitle}</p>
                </div>
                <div className="text-center">
                  <div className="w-40 h-0.5 bg-gray-400 mb-2"></div>
                  <p className="text-xs text-gray-500">Certificate ID</p>
                  <p className="text-sm text-gray-600 font-mono">{certificateData.certificateId}</p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 left-4 w-16 h-16 border-4 border-netflix-red opacity-20"></div>
              <div className="absolute top-4 right-4 w-16 h-16 border-4 border-netflix-red opacity-20"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 border-4 border-netflix-red opacity-20"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 border-4 border-netflix-red opacity-20"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Certificate Details */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-netflix-dark rounded-xl p-6 border border-netflix-gray">
          <h2 className="text-xl font-semibold text-white mb-6">Certificate Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                Attendee Name
              </label>
              <p className="text-white">{certificate.attendeeName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                Email Address
              </label>
              <p className="text-white">{certificate.attendeeEmail}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                Event Title
              </label>
              <p className="text-white">{certificate.eventTitle}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                Completion Date
              </label>
              <p className="text-white">{certificateData.completionDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                Certificate ID
              </label>
              <p className="text-white font-mono">{certificate.certificateId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                Template Used
              </label>
              <p className="text-white">{certificate.templateName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                Signing Authority
              </label>
              <p className="text-white">
                {certificateData.signingAuthorityName}
                <span className="text-netflix-lightgray"> - {certificateData.signingAuthorityTitle}</span>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                Status
              </label>
              <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-green-600">
                {certificate.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificatePreview;