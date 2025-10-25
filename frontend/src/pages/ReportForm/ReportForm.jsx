import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Step1Issue from "./Step1Issue";
import Step2Location from "./Step2Location";
import Step3Evidence from "./Step3Evidence";
import { reportAPI } from "../../services/api";

const steps = ["Issue Details", "Location", "Evidence"];

const initialFormData = {
  issueTitle: "",
  reportType: "",
  categoryId: null,
  subcategory: "",
  subcategoryId: null,
  category: "",
  otherCategory: "",
  description: "",
  location: "",
  latitude: null,
  longitude: null,
  landmark: "",
  images: [],
  contactInfo: "",
  errors: {}
};

const ReportForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateStep = useCallback((currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.issueTitle.trim()) {
        newErrors.issueTitle = 'Issue title is required';
      }
      if (!formData.reportType) {
        newErrors.reportType = 'Please select a report type';
      }
      if (!formData.subcategory) {
        newErrors.category = 'Please select a category';
      }
      if ((formData.category?.includes("Other") || formData.category?.includes("specify")) && !formData.otherCategory?.trim()) {
        newErrors.otherCategory = 'Please specify the category';
      }
    } else if (currentStep === 2) {
      if (!formData.latitude || !formData.longitude) {
        newErrors.location = 'Please capture your location';
      }
    } else if (currentStep === 3) {
      if (!formData.images || formData.images.length === 0) {
        newErrors.images = 'Please upload at least one photo';
      }
    }
    
    setFormData(prev => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, steps.length));
    }
  };
  
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: undefined
      }
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(3)) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const citizenId = localStorage.getItem('citizen_id') || 1;

      const reportData = {
        citizen: citizenId,
        title: formData.issueTitle,
        report_type: formData.categoryId,
        sub_category: formData.subcategoryId || null,
        description: formData.description || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      const response = await reportAPI.create(reportData);

      console.log('Report submitted successfully:', response);
      
      setFormData(initialFormData);
      setStep(1);
      
      alert('Report submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting report:', error);
      
      let errorMessage = 'Failed to submit report. Please try again.';
      
      if (error.response?.data) {
        const backendErrors = error.response.data;
        if (typeof backendErrors === 'object') {
          errorMessage = Object.entries(backendErrors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
        } else if (typeof backendErrors === 'string') {
          errorMessage = backendErrors;
        }
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateStep]);
  
  useEffect(() => {
    let isValid = false;
    
    if (step === 1) {
      isValid = formData.issueTitle.trim() !== '' && 
                formData.reportType !== '' && 
                formData.subcategory !== '';
      
      if ((formData.category?.includes("Other") || formData.category?.includes("specify"))) {
        isValid = isValid && formData.otherCategory?.trim() !== '';
      }
    } else if (step === 2) {
      isValid = formData.latitude !== null && formData.longitude !== null;
    } else if (step === 3) {
      isValid = formData.images && formData.images.length > 0;
    }
    
    setIsNextDisabled(!isValid);
  }, [formData, step]);

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#0e1030] text-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-10 shadow-lg">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-10">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const active = step === stepNumber;
          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 text-xs sm:text-base ${
                  active
                    ? "border-[#2f57ff] bg-[#2f57ff] text-white shadow-[0_0_10px_#2f57ff]"
                    : "border-gray-500 text-gray-400"
                }`}
              >
                {stepNumber}
              </div>
              <span
                className={`text-[10px] sm:text-xs mt-1 sm:mt-2 text-center ${
                  active ? "text-white" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <Step1Issue 
          formData={formData} 
          onInputChange={handleInputChange} 
        />
      )}
      {step === 2 && (
        <Step2Location 
          formData={formData} 
          onInputChange={handleInputChange} 
        />
      )}
      {step === 3 && (
        <Step3Evidence 
          formData={formData} 
          onInputChange={handleInputChange} 
        />
      )}

      {/* Submit Error Message */}
      {submitError && (
        <div className="mt-4 sm:mt-6 bg-red-500/10 border border-red-500 rounded-md p-2 sm:p-3 text-xs sm:text-sm text-red-400">
          {submitError}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6 sm:mt-8 lg:mt-10">
        {step > 1 ? (
          <button
            onClick={prevStep}
            disabled={isSubmitting}
            className="text-xs sm:text-sm text-gray-300 hover:text-white flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
        ) : (
          <div />
        )}
        {step < 3 ? (
          <button
            onClick={nextStep}
            disabled={isNextDisabled}
            className={`text-xs sm:text-sm flex items-center gap-1 ${
              isNextDisabled 
                ? 'text-gray-500 cursor-not-allowed' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Next →
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            className={`text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-md ${
              isNextDisabled || isSubmitting
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
            disabled={isNextDisabled || isSubmitting}
          >
            {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REPORT'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportForm;