import React from "react";
import { MapPin } from "lucide-react";

const Step2Location = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm mb-1">
          Location <span className="text-red-500">*</span>
        </label>
        <button 
          type="button"
          onClick={() => {
            // TODO: Implement geolocation capture
            onInputChange('location', 'Current Location');
          }}
          className="w-full bg-[#3b3bff] text-white text-sm font-semibold py-2 rounded-md flex items-center justify-center gap-2 hover:bg-[#4d4dff] transition"
        >
          CAPTURE CURRENT LOCATION <MapPin size={14} />
        </button>
      </div>

      <div className="mt-4">
        <label className="block text-sm mb-1">
          Or enter location manually
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={(e) => onInputChange('location', e.target.value)}
          placeholder="Street address or description of the location"
          className={`w-full bg-transparent border ${
            formData.errors?.location ? 'border-red-500' : 'border-gray-600'
          } rounded-md p-2 text-sm text-gray-300 focus:outline-none focus:border-[#2f57ff]`}
        />
        {formData.errors?.location && (
          <p className="mt-1 text-xs text-red-400">{formData.errors.location}</p>
        )}
      </div>
      <div className="mt-4">
        <input
          type="text"
          name="landmark"
          value={formData.landmark || ''}
          onChange={(e) => onInputChange('landmark', e.target.value)}
          placeholder="Nearby landmark (optional)"
          className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-sm text-gray-300 focus:outline-none focus:border-[#2f57ff]"
        />
      </div>
    </div>
  );
};

export default Step2Location;
