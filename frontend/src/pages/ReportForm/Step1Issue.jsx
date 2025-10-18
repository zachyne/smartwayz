import React, { useState, useEffect } from "react";
import { categoryAPI, subCategoryAPI } from "../../services/api";

const Step1Issue = ({ formData, onInputChange }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await categoryAPI.getAll();
        
        if (isMounted) {
          setCategories(data);
          setError(null);
        }
      } catch (err) {
        // Don't show error if request was aborted
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          return;
        }
        console.error('Error fetching categories:', err);
        if (isMounted) {
          setError('Failed to load categories. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  // Fetch subcategories when reportType changes
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchSubcategories = async () => {
      if (!formData.reportType) {
        if (isMounted) {
          setSubcategories([]);
        }
        return;
      }

      try {
        // Find the category ID based on report_type name
        const category = categories.find(cat => cat.report_type === formData.reportType);
        if (category) {
          const data = await subCategoryAPI.getByCategory(category.id);
          if (isMounted) {
            setSubcategories(data);
          }
        }
      } catch (err) {
        // Don't show error if request was aborted
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          return;
        }
        console.error('Error fetching subcategories:', err);
        if (isMounted) {
          setError('Failed to load subcategories. Please try again.');
        }
      }
    };

    if (categories.length > 0) {
      fetchSubcategories();
    }

    // Cleanup function
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [formData.reportType, categories]);

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

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-md p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Report Type */}
      <div>
        <label className="block text-sm mb-1">
          Report Type <span className="text-red-500">*</span>
        </label>
        <select
          name="reportType"
          value={formData.reportType || ""}
          onChange={(e) => {
            const selectedType = e.target.value;
            onInputChange("reportType", selectedType);
            // Reset category when report type changes
            onInputChange("category", "");
            onInputChange("subcategory", "");
            onInputChange("otherCategory", "");
            
            // Store the category ID as well
            const category = categories.find(cat => cat.report_type === selectedType);
            if (category) {
              onInputChange("categoryId", category.id);
            }
          }}
          disabled={loading}
          className={`w-full bg-transparent border ${
            formData.errors?.reportType
              ? "border-red-500"
              : "border-gray-600"
          } rounded-md p-2 text-sm text-gray-300 focus:outline-none focus:border-[#2f57ff] disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <option className="text-gray-300 bg-gray-800" value="">
            {loading ? "Loading..." : "Select report type"}
          </option>
          {categories.map((category) => (
            <option 
              key={category.id} 
              className="text-gray-300 bg-gray-800" 
              value={category.report_type}
            >
              {category.report_type === "Infrastructure" ? "Infrastructure Issue" : "Hazard Report"}
            </option>
          ))}
        </select>

        {formData.errors?.reportType && (
          <p className="mt-1 text-xs text-red-400">
            {formData.errors.reportType}
          </p>
        )}
      </div>

      {/* Subcategory - Only show if report type is selected */}
      {formData.reportType && (
        <div>
          <label className="block text-sm mb-1">
            {formData.reportType === "Infrastructure" ? "Infrastructure Category" : "Hazard Category"} <span className="text-red-500">*</span>
          </label>
          <select
            name="subcategory"
            value={formData.subcategory || ""}
            onChange={(e) => {
              const selectedValue = e.target.value;
              onInputChange("subcategory", selectedValue);
              
              // Store the subcategory ID and display name
              const subcategory = subcategories.find(sub => sub.id === parseInt(selectedValue));
              if (subcategory) {
                onInputChange("subcategoryId", subcategory.id);
                onInputChange("category", subcategory.sub_category_display);
              }
            }}
            disabled={subcategories.length === 0}
            className={`w-full bg-transparent border ${
              formData.errors?.category
                ? "border-red-500"
                : "border-gray-600"
            } rounded-md p-2 text-sm text-gray-300 focus:outline-none focus:border-[#2f57ff] disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <option className="text-gray-300 bg-gray-800" value="">
              {subcategories.length === 0 ? "Loading categories..." : "Select a category"}
            </option>
            
            {subcategories.map((subcategory) => (
              <option 
                key={subcategory.id} 
                className="text-gray-300 bg-gray-800" 
                value={subcategory.id}
              >
                {subcategory.sub_category_display}
              </option>
            ))}
          </select>

          {formData.errors?.category && (
            <p className="mt-1 text-xs text-red-400">
              {formData.errors.category}
            </p>
          )}

          {/* "Other" Text Field - Show when "Other" or "Other Hazard" is selected */}
          {(formData.category?.includes("Other") || formData.category?.includes("specify")) && (
            <div className="mt-3">
              <input
                type="text"
                name="otherCategory"
                placeholder={`Please specify the ${formData.reportType === "Infrastructure" ? "infrastructure" : "hazard"} category`}
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
      )}

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