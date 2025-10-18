import React, { useState, useEffect } from "react";
import Step1Issue from "./Step1Issue";
import Step2Location from "./Step2Location";
import Step3Evidence from "./Step3Evidence";

const steps = ["Issue Details", "Location", "Evidence"];

const initialFormData = {
  // Step 1: Issue Details
  issueTitle: "",
  category: "",
  description: "",
  
  // Step 2: Location
  location: "",
  
  // Step 3: Evidence
  images: [],
  
  // Validation
  errors: {}
};

const ReportForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  // Validate current step before proceeding
  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.issueTitle.trim()) {
        newErrors.issueTitle = 'Issue title is required';
      }
      if (!formData.category) {
        newErrors.category = 'Please select a category';
      }
    } else if (currentStep === 2) {
      if (!formData.location) {
        newErrors.location = 'Please select a location';
      }
    } else if (currentStep === 3) {
      if (!formData.images || formData.images.length === 0) {
        newErrors.images = 'Please upload at least one photo';
      }
    }
    
    setFormData(prev => ({ ...prev, errors: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, steps.length));
    }
  };
  
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: undefined // Clear error when user types
      }
    }));
  };
  
  // Update next/submit button disabled state based on form validation
  useEffect(() => {
    let isValid = false;
    
    if (step === 1) {
      isValid = formData.issueTitle.trim() !== '' && formData.category !== '';
    } else if (step === 2) {
      isValid = formData.location !== '';
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

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        {step > 1 ? (
          <button
            onClick={prevStep}
            className="text-sm text-gray-300 hover:text-white flex items-center gap-1"
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
            className={`text-sm font-semibold px-4 py-2 rounded-md ${
              isNextDisabled 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
            disabled={isNextDisabled}
          >
            SUBMIT REPORT
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportForm;
