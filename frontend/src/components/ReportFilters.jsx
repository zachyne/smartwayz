import { Search, Filter, X } from "lucide-react";

const ReportFilters = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  accentColor = "purple", // "purple", "blue", "orange", etc.
}) => {
  const accentColorMap = {
    purple: "focus:border-purple-500",
    blue: "focus:border-blue-500",
    orange: "focus:border-orange-500",
    green: "focus:border-green-500",
  };

  const accentButtonColor = {
    purple: "bg-purple-600 hover:bg-purple-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    orange: "bg-orange-600 hover:bg-orange-700",
    green: "bg-green-600 hover:bg-green-700",
  };

  const focusColor = accentColorMap[accentColor] || accentColorMap.purple;
  const buttonColor = accentButtonColor[accentColor] || accentButtonColor.purple;

  const categoryOptions = [
    "All categories",
    "Road Damage",
    "Street Light",
    "Storm Drain",
    "Traffic Signal",
    "Flooding",
    "Potholes",
    "Debris",
    "Other",
  ];

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`sm:hidden ${buttonColor} text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all`}
      >
        <Filter size={18} />
        {showFilters ? "Hide" : "Show"} Filters
      </button>

      {/* Filters Container */}
      <div
        className={`bg-[#1E1C3A]/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 ${
          showFilters ? "block" : "hidden sm:block"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-[#0F0C1F] text-white pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 ${focusColor} focus:outline-none text-sm`}
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`bg-[#0F0C1F] text-white px-4 py-2.5 rounded-lg border border-gray-700 ${focusColor} focus:outline-none text-sm w-full`}
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`bg-[#0F0C1F] text-white px-4 py-2.5 rounded-lg border border-gray-700 ${focusColor} focus:outline-none text-sm w-full`}
            >
              <option>Most Recent</option>
              <option>Oldest First</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportFilters;