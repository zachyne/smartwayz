import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Step1Issue from "./Step1Issue";
import Step2Location from "./Step2Location";
import Step3Evidence from "./Step3Evidence";
import { reportAPI } from "../../services/api";

const steps = ["Issue Details", "Location", "Evidence"];

const initialFormData = {
  // Step 1: Issue Details
  issueTitle: "",
  reportType: "",
  categoryId: null,
  subcategory: "",
  subcategoryId: null,
  category: "", // Display name for backward compatibility
  otherCategory: "",
  description: "",
  
  // Step 2: Location
  location: "",
  latitude: null,
  longitude: null,
  landmark: "",
  
  // Step 3: Evidence
  images: [],
  contactInfo: "",
  
  // Validation
  errors: {}
};

const ReportForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Validate current step before proceeding
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
      // If "Other" is selected, require specification
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
        [field]: undefined // Clear error when user types
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
      // TODO: Get actual citizen ID from auth context/localStorage
      const citizenId = localStorage.getItem('citizen_id') || 1; // Default to 1 for testing

      // Prepare the report data according to the API schema
      const reportData = {
        citizen: citizenId,
        title: formData.issueTitle,
        report_type: formData.categoryId,
        sub_category: formData.subcategoryId || null,
        description: formData.description || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      // Submit the report
      const response = await reportAPI.create(reportData);

      // TODO: Handle image upload separately if needed
      // The backend might need a separate endpoint for file uploads

      console.log('Report submitted successfully:', response);
      
      // Reset form and navigate to success page or reports list
      setFormData(initialFormData);
      setStep(1);
      
      // Show success message or navigate
      alert('Report submitted successfully!');
      // navigate('/my-reports'); // Uncomment when route exists
      
    } catch (error) {
      console.error('Error submitting report:', error);
      
      let errorMessage = 'Failed to submit report. Please try again.';
      
      if (error.response?.data) {
        // Handle validation errors from the backend
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
  
  // Update next/submit button disabled state based on form validation
  useEffect(() => {
    let isValid = false;
    
    if (step === 1) {
      isValid = formData.issueTitle.trim() !== '' && 
                formData.reportType !== '' && 
                formData.subcategory !== '';
      
      // If "Other" is selected, also require specification
      if ((formData.category?.includes("Other") || formData.category?.includes("specify"))) {
        isValid = isValid && formData.otherCategory?.trim() !== '';
      }
    } else if (step === 2) {
      isValid = formData.latitude !== null && formData.longitude !== null;
    } else if (step === 3) {
      // For the final step (submit), require at least one photo
      isValid = formData.images && formData.images.length > 0;
    }
    
    setIsNextDisabled(!isValid);
  }, [formData, step]);

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#0e1030] text-white rounded-3xl p-10 shadow-lg">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-10">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const active = step === stepNumber;
          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  active
                    ? "border-[#2f57ff] bg-[#2f57ff] text-white shadow-[0_0_10px_#2f57ff]"
                    : "border-gray-500 text-gray-400"
                }`}
              >
                {stepNumber}
              </div>
              <span
                className={`text-xs mt-2 ${
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
        <div className="mt-6 bg-red-500/10 border border-red-500 rounded-md p-3 text-sm text-red-400">
          {submitError}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        {step > 1 ? (
          <button
            onClick={prevStep}
            disabled={isSubmitting}
            className="text-sm text-gray-300 hover:text-white flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className={`text-sm flex items-center gap-1 ${
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
            className={`text-sm font-semibold px-4 py-2 rounded-md ${
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
