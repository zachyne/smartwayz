import React from "react";
import { ImagePlus } from "lucide-react";

const Step3Evidence = () => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm mb-1">Photos (Up to 5 photos)</label>
        <div className="border border-gray-600 border-dashed rounded-md p-6 text-center text-gray-400 hover:border-[#2f57ff] transition cursor-pointer">
          <div className="flex flex-col items-center justify-center gap-2">
            <ImagePlus size={32} className="text-gray-400" />
            <p className="text-sm">
              Click to upload photos or drag and drop <br />
              <span className="text-xs text-gray-500">(PNG, JPG or HEIC, max 5MB each)</span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Contact Information</label>
        <input
          type="text"
          placeholder="Phone number or email for follow-up"
          className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-sm text-gray-300 focus:outline-none focus:border-[#2f57ff]"
        />
      </div>
    </div>
  );
};

export default Step3Evidence;
