import React from "react";
import { MapPin } from "lucide-react";

const Step2Location = () => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm mb-1">
          Location <span className="text-red-500">*</span>
        </label>
        <button className="w-full bg-[#3b3bff] text-white text-sm font-semibold py-2 rounded-md flex items-center justify-center gap-2 hover:bg-[#4d4dff] transition">
          CAPTURE CURRENT LOCATION <MapPin size={14} />
        </button>
      </div>

      <input
        type="text"
        placeholder="Street address or description of the location"
        className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-sm text-gray-300 focus:outline-none focus:border-[#2f57ff]"
      />
      <input
        type="text"
        placeholder="Nearby landmark (optional)"
        className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-sm text-gray-300 focus:outline-none focus:border-[#2f57ff]"
      />
    </div>
  );
};

export default Step2Location;
