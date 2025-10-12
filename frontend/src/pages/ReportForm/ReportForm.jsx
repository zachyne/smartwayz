import React, { useState } from "react";
import Step1Issue from "./Step1Issue";
import Step2Location from "./Step2Location";
import Step3Evidence from "./Step3Evidence";

const steps = ["Issue Details", "Location", "Evidence"];

const ReportForm = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

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
      {step === 1 && <Step1Issue />}
      {step === 2 && <Step2Location />}
      {step === 3 && <Step3Evidence />}

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
            className="text-sm text-gray-300 hover:text-white flex items-center gap-1"
          >
            Next →
          </button>
        ) : (
          <button className="bg-green-500 hover:bg-green-600 text-sm font-semibold px-4 py-2 rounded-md">
            SUBMIT REPORT
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportForm;
