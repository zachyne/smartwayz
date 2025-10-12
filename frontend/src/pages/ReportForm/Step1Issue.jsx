import React from "react";

const Step1Issue = () => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm mb-1">
          Issue Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Brief description of the issue"
          className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-sm text-gray-300 focus:outline-none focus:border-[#2f57ff]"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-sm text-gray-300 focus:outline-none focus:border-[#2f57ff]">
          <option className="text-gray-300 bg-gray-800" value="">Select a category</option>
          <option className="text-gray-300 bg-gray-800">Road Damage</option>
          <option className="text-gray-300 bg-gray-800">Streetlight Issue</option>
          <option className="text-gray-300 bg-gray-800">Water Leak</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Detailed Description</label>
        <textarea
          placeholder="Provide detailed information about the issue, including severity and any safety concerns..."
          className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-sm text-gray-300 focus:outline-none focus:border-[#2f57ff]"
          rows="3"
        ></textarea>
      </div>
    </div>
  );
};

export default Step1Issue;
