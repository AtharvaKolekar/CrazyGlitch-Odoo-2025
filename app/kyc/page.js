"use client";
import React, { useState } from 'react';
import { CheckCircle, Upload, User, FileText, Camera, Shield } from 'lucide-react';
import { updateUserKYC, useUser } from "@/lib/auth";

export default function KYCVerification() {
  const user = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      nationality: '',
      phoneNumber: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    documents: {
      idType: '',
      idNumber: '',
      idFront: null,
      idBack: null
    },
    verification: {
      selfie: null,
      agreed: false
    }
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    idFront: null,
    idBack: null,
    selfie: null
  });

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Documents', icon: FileText },
    { id: 3, title: 'Verification', icon: Camera },
    { id: 4, title: 'Review', icon: Shield }
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (fileType, event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: file
      }));
      handleInputChange('documents', fileType, file);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        const { firstName, lastName, dateOfBirth, nationality, phoneNumber, street, city, state, zipCode, country } = formData.personalInfo;
        return firstName && lastName && dateOfBirth && nationality && phoneNumber && street && city && state && zipCode && country;
      case 2:
        const { idType, idNumber } = formData.documents;
        return idType && idNumber && uploadedFiles.idFront && uploadedFiles.idBack;
      case 3:
        return uploadedFiles.selfie && formData.verification.agreed;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      updateUserKYC(user.user, formData);
      alert('KYC verification submitted!');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const FileUploadBox = ({ fileType, title, accept, uploaded }) => (
    <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center hover:border-black transition-colors">
      <input
        type="file"
        accept={accept}
        onChange={(e) => handleFileUpload(fileType, e)}
        className="hidden"
        id={fileType}
      />
      <label htmlFor={fileType} className="cursor-pointer">
        <div className="flex flex-col items-center space-y-2">
          {uploaded ? (
            <CheckCircle className="w-12 h-12 text-black" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          <p className="text-sm font-medium text-gray-700">{title}</p>
          {uploaded && <p className="text-xs text-gray-500">Uploaded: {uploaded.name}</p>}
        </div>
      </label>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter last name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <select
                  value={formData.personalInfo.nationality}
                  onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select nationality</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="IN">India</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.personalInfo.phoneNumber}
                onChange={(e) => handleInputChange('personalInfo', 'phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={formData.personalInfo.street}
                    onChange={(e) => handleInputChange('personalInfo', 'street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.personalInfo.city}
                      onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                    <input
                      type="text"
                      value={formData.personalInfo.state}
                      onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                    <input
                      type="text"
                      value={formData.personalInfo.zipCode}
                      onChange={(e) => handleInputChange('personalInfo', 'zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="10001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      value={formData.personalInfo.country}
                      onChange={(e) => handleInputChange('personalInfo', 'country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="IN">India</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID Document Type</label>
              <select
                value={formData.documents.idType}
                onChange={(e) => handleInputChange('documents', 'idType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select document type</option>
                <option value="passport">Passport</option>
                <option value="drivers_license">Driver's License</option>
                <option value="national_id">National ID Card</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
              <input
                type="text"
                value={formData.documents.idNumber}
                onChange={(e) => handleInputChange('documents', 'idNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter ID number"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadBox
                fileType="idFront"
                title="Front of ID"
                accept="image/*"
                uploaded={uploadedFiles.idFront}
              />
              <FileUploadBox
                fileType="idBack"
                title="Back of ID"
                accept="image/*"
                uploaded={uploadedFiles.idBack}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Take a Selfie</h3>
              <p className="text-sm text-gray-600 mb-6">
                Take a clear photo of yourself to verify your identity
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <FileUploadBox
                fileType="selfie"
                title="Upload Selfie"
                accept="image/*"
                uploaded={uploadedFiles.selfie}
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="biometric-consent"
                checked={formData.verification.agreed}
                onChange={(e) => handleInputChange('verification', 'agreed', e.target.checked)}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="biometric-consent" className="text-sm text-gray-700">
                I agree to biometric verification
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Review Information</h3>
              <p className="text-sm text-gray-600 mb-6">
                Please review your information before submitting
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 text-gray-900">{formData.personalInfo.firstName} {formData.personalInfo.lastName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="ml-2 text-gray-900">{formData.personalInfo.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-gray-600">Nationality:</span>
                  <span className="ml-2 text-gray-900">{formData.personalInfo.nationality}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 text-gray-900">{formData.personalInfo.phoneNumber}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Address</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Street:</span>
                  <span className="ml-2 text-gray-900">{formData.personalInfo.street}</span>
                </div>
                <div>
                  <span className="text-gray-600">City:</span>
                  <span className="ml-2 text-gray-900">{formData.personalInfo.city}</span>
                </div>
                <div>
                  <span className="text-gray-600">State/Province:</span>
                  <span className="ml-2 text-gray-900">{formData.personalInfo.state}</span>
                </div>
                <div>
                  <span className="text-gray-600">ZIP/Postal Code:</span>
                  <span className="ml-2 text-gray-900">{formData.personalInfo.zipCode}</span>
                </div>
                <div>
                  <span className="text-gray-600">Country:</span>
                  <span className="ml-2 text-gray-900">{formData.personalInfo.country}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Document Type:</span>
                  <span className="ml-2 text-gray-900">{formData.documents.idType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Document Number:</span>
                  <span className="ml-2 text-gray-900">{formData.documents.idNumber}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Uploaded Files</h4>
              <div className="space-y-2 text-sm">
                {Object.entries(uploadedFiles).map(([key, file]) => (
                  <div key={key} className="flex items-center space-x-2">
                    {file ? (
                      <CheckCircle className="w-4 h-4 text-black" />
                    ) : (
                      <div className="w-4 h-4 border border-gray-300 rounded" />
                    )}
                    <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="final-consent"
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="final-consent" className="text-sm text-gray-700">
                I confirm all information is accurate
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isCurrentStepValid = validateCurrentStep();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-black px-6 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">KYC Verification</h1>
              <p className="text-gray-300">Complete your identity verification</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted 
                        ? 'bg-black border-black text-white' 
                        : isActive 
                        ? 'bg-gray-800 border-gray-800 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <p className={`text-sm font-medium ${
                        isActive ? 'text-gray-800' : isCompleted ? 'text-black' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`hidden sm:block w-16 h-0.5 mx-4 ${
                        isCompleted ? 'bg-black' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 py-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-4 py-2 rounded-md font-medium ${
                currentStep === 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            <button
              onClick={nextStep}
              disabled={!isCurrentStepValid}
              className={`px-6 py-2 rounded-md font-medium ${
                isCurrentStepValid
                  ? 'bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              {currentStep === 4 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}