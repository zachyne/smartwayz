import React from "react";

const Step1Issue = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-6">
      {/* Issue Title */}
      <div>
        <label className="block text-sm mb-1">
          Issue Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="issueTitle"
          value={formData.issueTitle}
          onChange={(e) => onInputChange("issueTitle", e.target.value)}
          placeholder="Brief description of the issue"
          className={`w-full bg-transparent border ${
            formData.errors?.issueTitle
              ? "border-red-500"
              : "border-gray-600"
          } rounded-md p-2 text-sm text-gray-300 focus:outline-none focus:border-[#2f57ff]`}
        />
        {formData.errors?.issueTitle && (
          <p className="mt-1 text-xs text-red-400">
            {formData.errors.issueTitle}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={(e) => onInputChange("category", e.target.value)}
          className={`w-full bg-transparent border ${
            formData.errors?.category
              ? "border-red-500"
              : "border-gray-600"
          } rounded-md p-2 text-sm text-gray-300 focus:outline-none focus:border-[#2f57ff]`}
        >
          <option className="text-gray-300 bg-gray-800" value="">
            Select a category
          </option>
          <option className="text-gray-300 bg-gray-800" value="Road Damage">
            Road Damage / Potholes
          </option>
          <option className="text-gray-300 bg-gray-800" value="Streetlight Issue">
            Streetlights / Electrical Issue
          </option>
          <option className="text-gray-300 bg-gray-800" value="Sidewalks Pedestrian Paths">
            Sidewalks / Pedestrian Paths
          </option>
          <option className="text-gray-300 bg-gray-800" value="Building Structural Concerns">
            Building / Structural Concerns
          </option>
          <option className="text-gray-300 bg-gray-800" value="Bridge Overpass Issues">
            Bridge / Overpass Issues
          </option>
          <option className="text-gray-300 bg-gray-800" value="Structural Collapses Weak Infrastructure">
            Structural Collapses / Weak Infrastructure
          </option>
          <option className="text-gray-300 bg-gray-800" value="Safety Security Concerns">
            Safety and Security Concerns
          </option>
          <option className="text-gray-300 bg-gray-800" value="Other">
            Other (please specify)
          </option>
        </select>

        {formData.errors?.category && (
          <p className="mt-1 text-xs text-red-400">
            {formData.errors.category}
          </p>
        )}

        {/* "Other" Text Field */}
        {formData.category === "Other" && (
          <div className="mt-3">
            <input
              type="text"
              name="otherCategory"
              placeholder="Please specify the category"
              value={formData.otherCategory || ""}
              onChange={(e) => onInputChange("otherCategory", e.target.value)}
              className={`w-full bg-transparent border ${
                formData.errors?.otherCategory
                  ? "border-red-500"
                  : "border-gray-600"
              } rounded-md p-2 text-sm text-gray-300 focus:outline-none focus:border-[#2f57ff]`}
            />
            {formData.errors?.otherCategory && (
              <p className="mt-1 text-xs text-red-400">
                {formData.errors.otherCategory}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Detailed Description */}
      <div>
        <label className="block text-sm mb-1">Detailed Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          placeholder="Provide more details about the issue..."
          className="w-full h-32 bg-transparent border border-gray-600 rounded-md p-2 text-sm text-gray-300 focus:outline-none focus:border-[#2f57ff]"
          rows="3"
        />
      </div>
    </div>
  );
};

export default Step1Issue;
