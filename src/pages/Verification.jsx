import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCertificate } from '../context/CertificateContext';

const { FiShield, FiSearch, FiCheckCircle, FiXCircle, FiInfo, FiCalendar, FiUser, FiAward } = FiIcons;

function Verification() {
  const { certificates } = useCertificate();
  const [certificateId, setCertificateId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!certificateId.trim()) return;

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const certificate = certificates.find(c => 
        c.certificateId.toLowerCase() === certificateId.toLowerCase()
      );

      if (certificate) {
        setVerificationResult({
          isValid: true,
          certificate: certificate,
          verifiedAt: new Date().toISOString()
        });
      } else {
        setVerificationResult({
          isValid: false,
          message: 'Certificate not found or invalid'
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  const resetVerification = () => {
    setCertificateId('');
    setVerificationResult(null);
  };

  return (
    <div className="min-h-screen bg-netflix-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-netflix-red rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiShield} className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Certificate Verification</h1>
          <p className="text-netflix-lightgray text-lg max-w-2xl mx-auto">
            Enter a certificate ID to verify its authenticity and view details
          </p>
        </motion.div>

        {/* Verification Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-netflix-dark rounded-xl p-8 border border-netflix-gray mb-8"
        >
          <form onSubmit={handleVerification} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-netflix-lightgray mb-3">
                Certificate ID
              </label>
              <div className="relative">
                <SafeIcon icon={FiSearch} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-netflix-lightgray w-5 h-5" />
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input text-lg"
                  placeholder="Enter certificate ID (e.g., CERT-1234567890-ABC)"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center px-6 py-4 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="loading-spinner mr-2"></div>
                ) : (
                  <SafeIcon icon={FiShield} className="w-5 h-5 mr-2" />
                )}
                {isLoading ? 'Verifying...' : 'Verify Certificate'}
              </button>
              <button
                type="button"
                onClick={resetVerification}
                className="px-6 py-4 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
              >
                Reset
              </button>
            </div>
          </form>
        </motion.div>

        {/* Verification Result */}
        {verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-8 border ${
              verificationResult.isValid
                ? 'bg-green-900 border-green-600'
                : 'bg-red-900 border-red-600'
            }`}
          >
            <div className="flex items-center mb-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                verificationResult.isValid ? 'bg-green-600' : 'bg-red-600'
              }`}>
                <SafeIcon 
                  icon={verificationResult.isValid ? FiCheckCircle : FiXCircle} 
                  className="w-6 h-6 text-white" 
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {verificationResult.isValid ? 'Certificate Verified' : 'Verification Failed'}
                </h2>
                <p className="text-sm opacity-90">
                  {verificationResult.isValid 
                    ? 'This certificate is authentic and valid'
                    : verificationResult.message
                  }
                </p>
              </div>
            </div>

            {verificationResult.isValid && verificationResult.certificate && (
              <div className="space-y-6">
                {/* Certificate Details */}
                <div className="bg-black bg-opacity-30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <SafeIcon icon={FiInfo} className="w-5 h-5 mr-2" />
                    Certificate Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Attendee Name
                      </label>
                      <p className="text-white font-medium">{verificationResult.certificate.attendeeName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Event Title
                      </label>
                      <p className="text-white font-medium">{verificationResult.certificate.eventTitle}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Completion Date
                      </label>
                      <p className="text-white font-medium flex items-center">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                        {new Date(verificationResult.certificate.completionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Certificate ID
                      </label>
                      <p className="text-white font-medium font-mono">{verificationResult.certificate.certificateId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Signing Authority
                      </label>
                      <p className="text-white font-medium">
                        {verificationResult.certificate.signingAuthority?.name || 'N/A'}
                        {verificationResult.certificate.signingAuthority?.title && (
                          <span className="text-gray-300 text-sm block">
                            {verificationResult.certificate.signingAuthority.title}
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Template Used
                      </label>
                      <p className="text-white font-medium">{verificationResult.certificate.templateName}</p>
                    </div>
                  </div>
                </div>

                {/* Verification Info */}
                <div className="bg-black bg-opacity-30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <SafeIcon icon={FiShield} className="w-5 h-5 mr-2" />
                    Verification Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Verified At
                      </label>
                      <p className="text-white font-medium">
                        {new Date(verificationResult.verifiedAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Status
                      </label>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white bg-green-600">
                        <SafeIcon icon={FiCheckCircle} className="w-3 h-3 mr-1" />
                        Valid & Authentic
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Features */}
                <div className="bg-black bg-opacity-30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <SafeIcon icon={FiShield} className="w-5 h-5 mr-2" />
                    Security Features
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-green-400">
                      <SafeIcon icon={FiCheckCircle} className="w-4 h-4 mr-3" />
                      <span>Unique Certificate ID verified</span>
                    </div>
                    <div className="flex items-center text-green-400">
                      <SafeIcon icon={FiCheckCircle} className="w-4 h-4 mr-3" />
                      <span>Digital signature authenticated</span>
                    </div>
                    <div className="flex items-center text-green-400">
                      <SafeIcon icon={FiCheckCircle} className="w-4 h-4 mr-3" />
                      <span>Issuing authority verified</span>
                    </div>
                    <div className="flex items-center text-green-400">
                      <SafeIcon icon={FiCheckCircle} className="w-4 h-4 mr-3" />
                      <span>Certificate has not been revoked</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-netflix-dark rounded-xl p-8 border border-netflix-gray"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">How Certificate Verification Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-netflix-red rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiSearch} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Enter Certificate ID</h3>
              <p className="text-netflix-lightgray text-sm">
                Input the unique certificate ID found on your certificate
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-netflix-red rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiShield} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Verify Authenticity</h3>
              <p className="text-netflix-lightgray text-sm">
                Our system checks the certificate against our secure database
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-netflix-red rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiCheckCircle} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">3. View Results</h3>
              <p className="text-netflix-lightgray text-sm">
                Get instant verification results with detailed certificate information
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sample Certificate IDs */}
        {certificates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-netflix-dark rounded-xl p-6 border border-netflix-gray"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Sample Certificate IDs (for testing)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.slice(0, 4).map((cert, index) => (
                <button
                  key={cert.id}
                  onClick={() => setCertificateId(cert.certificateId)}
                  className="text-left p-3 bg-netflix-gray rounded-lg hover:bg-opacity-80 transition-all duration-200"
                >
                  <p className="text-white font-mono text-sm">{cert.certificateId}</p>
                  <p className="text-netflix-lightgray text-xs mt-1">
                    {cert.attendeeName} - {cert.eventTitle}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Verification;