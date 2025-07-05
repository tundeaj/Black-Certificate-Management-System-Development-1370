import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCertificate } from '../context/CertificateContext';

const { FiSettings, FiUser, FiMail, FiUpload, FiSave, FiTrash2, FiEye, FiEyeOff, FiKey, FiShield } = FiIcons;

function Settings() {
  const { settings, dispatch } = useCertificate();
  const [activeTab, setActiveTab] = useState('organization');
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempSettings, setTempSettings] = useState(settings);

  const handleSaveSettings = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: tempSettings });
    alert('Settings saved successfully!');
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempSettings(prev => ({
          ...prev,
          organizationLogo: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempSettings(prev => ({
          ...prev,
          defaultSignature: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'organization', label: 'Organization', icon: FiUser },
    { id: 'email', label: 'Email Settings', icon: FiMail },
    { id: 'api', label: 'API & Integrations', icon: FiSettings },
    { id: 'security', label: 'Security', icon: FiShield }
  ];

  return (
    <div className="min-h-screen bg-netflix-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-netflix-lightgray">Configure your certificate management system</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-netflix-dark rounded-xl p-4 border border-netflix-gray">
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-netflix-red text-white'
                        : 'text-netflix-lightgray hover:text-white hover:bg-netflix-gray'
                    }`}
                  >
                    <SafeIcon icon={tab.icon} className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-netflix-dark rounded-xl p-8 border border-netflix-gray"
            >
              {activeTab === 'organization' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Organization Settings</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        value={tempSettings.organizationName}
                        onChange={(e) => setTempSettings(prev => ({
                          ...prev,
                          organizationName: e.target.value
                        }))}
                        className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                        placeholder="Enter organization name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={tempSettings.websiteUrl || ''}
                        onChange={(e) => setTempSettings(prev => ({
                          ...prev,
                          websiteUrl: e.target.value
                        }))}
                        className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                        placeholder="https://yourorganization.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                      Organization Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      {tempSettings.organizationLogo && (
                        <img
                          src={tempSettings.organizationLogo}
                          alt="Organization Logo"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer flex items-center px-4 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
                        >
                          <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
                          Upload Logo
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                      Default Signature
                    </label>
                    <div className="flex items-center space-x-4">
                      {tempSettings.defaultSignature && (
                        <img
                          src={tempSettings.defaultSignature}
                          alt="Default Signature"
                          className="w-32 h-16 object-cover rounded-lg bg-white p-2"
                        />
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSignatureUpload}
                          className="hidden"
                          id="signature-upload"
                        />
                        <label
                          htmlFor="signature-upload"
                          className="cursor-pointer flex items-center px-4 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
                        >
                          <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
                          Upload Signature
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                      Address
                    </label>
                    <textarea
                      value={tempSettings.address || ''}
                      onChange={(e) => setTempSettings(prev => ({
                        ...prev,
                        address: e.target.value
                      }))}
                      className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                      placeholder="Enter organization address"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Email Settings</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={tempSettings.emailSettings.fromName}
                        onChange={(e) => setTempSettings(prev => ({
                          ...prev,
                          emailSettings: { ...prev.emailSettings, fromName: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                        placeholder="Certificate System"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        value={tempSettings.emailSettings.fromEmail}
                        onChange={(e) => setTempSettings(prev => ({
                          ...prev,
                          emailSettings: { ...prev.emailSettings, fromEmail: e.target.value }
                        }))}
                        className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                        placeholder="certificates@yourorg.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                      Default Subject
                    </label>
                    <input
                      type="text"
                      value={tempSettings.emailSettings.subject}
                      onChange={(e) => setTempSettings(prev => ({
                        ...prev,
                        emailSettings: { ...prev.emailSettings, subject: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                      placeholder="Your Certificate is Ready!"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                      Default Message Body
                    </label>
                    <textarea
                      value={tempSettings.emailSettings.body}
                      onChange={(e) => setTempSettings(prev => ({
                        ...prev,
                        emailSettings: { ...prev.emailSettings, body: e.target.value }
                      }))}
                      className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                      placeholder="Congratulations! Please find your certificate attached."
                      rows={4}
                    />
                  </div>

                  <div className="bg-netflix-gray rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Email Template Variables</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="text-netflix-lightgray">
                        <code className="text-netflix-red">[[AttendeeName]]</code> - Attendee's name
                      </div>
                      <div className="text-netflix-lightgray">
                        <code className="text-netflix-red">[[EventTitle]]</code> - Event title
                      </div>
                      <div className="text-netflix-lightgray">
                        <code className="text-netflix-red">[[CompletionDate]]</code> - Completion date
                      </div>
                      <div className="text-netflix-lightgray">
                        <code className="text-netflix-red">[[CertificateID]]</code> - Certificate ID
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'api' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">API & Integrations</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        API Key
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type={showApiKey ? 'text' : 'password'}
                          value="sk_test_1234567890abcdef"
                          readOnly
                          className="flex-1 px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                        />
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="px-3 py-2 bg-netflix-gray text-white rounded-lg hover:bg-opacity-80 transition-all duration-200"
                        >
                          <SafeIcon icon={showApiKey ? FiEyeOff : FiEye} className="w-4 h-4" />
                        </button>
                        <button className="px-4 py-2 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200">
                          Regenerate
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                        Webhook URL
                      </label>
                      <input
                        type="url"
                        value={tempSettings.webhookUrl || ''}
                        onChange={(e) => setTempSettings(prev => ({
                          ...prev,
                          webhookUrl: e.target.value
                        }))}
                        className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white placeholder-netflix-lightgray focus:outline-none focus:border-netflix-red form-input"
                        placeholder="https://yourapp.com/webhooks/certificates"
                      />
                    </div>

                    <div className="bg-netflix-gray rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">API Documentation</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-white mb-2">Generate Certificate</h4>
                          <code className="block bg-netflix-black p-3 rounded text-green-400 text-sm">
                            POST /api/certificates/generate
                          </code>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white mb-2">Verify Certificate</h4>
                          <code className="block bg-netflix-black p-3 rounded text-green-400 text-sm">
                            GET /api/certificates/verify/:id
                          </code>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white mb-2">List Certificates</h4>
                          <code className="block bg-netflix-black p-3 rounded text-green-400 text-sm">
                            GET /api/certificates
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Certificate Security</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-netflix-gray rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">Enable QR Code Verification</h4>
                            <p className="text-netflix-lightgray text-sm">Add QR codes to certificates for quick verification</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-netflix-red"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-netflix-gray rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">Watermark Protection</h4>
                            <p className="text-netflix-lightgray text-sm">Add watermarks to prevent unauthorized use</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-netflix-red"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-netflix-gray rounded-lg">
                          <div>
                            <h4 className="text-white font-medium">Digital Signatures</h4>
                            <p className="text-netflix-lightgray text-sm">Cryptographically sign certificates</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-netflix-red"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Access Control</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                            Certificate Expiry (Days)
                          </label>
                          <input
                            type="number"
                            value={tempSettings.certificateExpiry || 365}
                            onChange={(e) => setTempSettings(prev => ({
                              ...prev,
                              certificateExpiry: parseInt(e.target.value)
                            }))}
                            className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                            placeholder="365"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-netflix-lightgray mb-2">
                            Maximum Download Attempts
                          </label>
                          <input
                            type="number"
                            value={tempSettings.maxDownloads || 10}
                            onChange={(e) => setTempSettings(prev => ({
                              ...prev,
                              maxDownloads: parseInt(e.target.value)
                            }))}
                            className="w-full px-3 py-2 bg-netflix-gray border border-netflix-gray rounded-lg text-white focus:outline-none focus:border-netflix-red form-input"
                            placeholder="10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-netflix-gray mt-8">
                <button
                  onClick={handleSaveSettings}
                  className="flex items-center px-6 py-3 bg-netflix-red text-white rounded-lg hover:bg-red-600 transition-all duration-200 netflix-button"
                >
                  <SafeIcon icon={FiSave} className="w-5 h-5 mr-2" />
                  Save Settings
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;