import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import PageHeader from "../components/PageHeader";

const MyReports = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [sortBy, setSortBy] = useState("Last Report first");

  // Sample reports data
  const reports = [
    {
      id: 1,
      title: "Large pothole on Main Street causing traffic hazard",
      category: "Road Damage / Potholes ",
      description: "Deep pothole approximately 2 feet wide near the intersection with Ayala Avenue. Causing dangerous conditions for vehicles and bicycles, traffic is slow from bottleneck.",
      status: "PENDING",
      statusColor: "bg-orange-500",
      location: "Kanto Nwebe",
      date: "2 days ago",
      isResolved: true,
      resolvedDate: "3 days ago"
    },
    {
      id: 2,
      title: "Street light not working on PI Garcia",
      category: "Streetlights / Electrical Issues",
      description: "Major high traffic at PI Garcia has been out for a week, creating safety concerns for pedestrians walking at night.",
      status: "IN PROGRESS",
      statusColor: "bg-blue-500",
      location: "PI Garcia St.",
      isResolved: false,
      date: "3 days ago"
    },
    {
      id: 3,
      title: "Damaged storm drain on Caraycaray",
      category: "Drainage / Flooding",
      description: "Storm drain cover is broken and partially blocking road flow. Risk of flooding during heavy rain.",
      status: "APPROVED",
      statusColor: "bg-green-500",
      location: "Caraycaray",
      isResolved: false,
      date: "5 days ago"
    }
  ];

  const stats = [
    { label: "Pending", count: 3, color: "bg-yellow-500" },
    { label: "In Progress", count: 2, color: "bg-gray-500" },
    { label: "Approved", count: 2, color: "bg-green-500" },
    { label: "Rejected", count: 1, color: "bg-red-500" }
  ];

  return (
    <div className="flex-1 text-white font-[Kanit] bg-gradient-to-b from-[#37366B] to-[#0A0E27]">
      {/* Header */}
      <PageHeader
        title="MY REPORTS"
        description="Track and manage all your submitted infrastructure reports"
        action={
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all">
            <Plus size={20} />
            New Report
            </button>
        }
      />

      {/* Stats Cards */}
      <div className="p-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1E1C3A]/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
              <div className="text-4xl font-bold">{stat.count}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#1E1C3A]/40 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-700/50">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search reports, name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0F0C1F] text-white pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none text-sm"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0F0C1F] text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none text-sm min-w-[140px]"
            >
              <option>All Statuses</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#0F0C1F] text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none text-sm min-w-[140px]"
            >
              <option>All categories</option>
              <option>Road Damage</option>
              <option>Street Light</option>
              <option>Storm Drain</option>
              <option>Traffic Signal</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0F0C1F] text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none text-sm min-w-[160px]"
            >
              <option>Last Report first</option>
              <option>Oldest first</option>
              <option>Most liked</option>
              <option>Most commented</option>
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-[#1E1C3A]/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all"
            >
              <div className="mb-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-white flex-1 pr-4">
                    {report.title}
                  </h3>
                  <span className={`${report.statusColor} text-white text-xs font-bold px-3 py-1 rounded-full uppercase`}>
                    {report.status}
                  </span>
                </div>        
                <div className="bg-[#062B67] inline-flex items-center p-2 rounded-md mt-1">
                  <p className="text-xs font-bold rounded-full uppercase text-[#3168FA]">{report.category}</p>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                {report.description}
              </p>

              <hr className="border-gray-700 my-4" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    📍 {report.location}
                  </span>
                  <span className="flex items-center gap-1">
                    📅 Submitted {report.date}
                  </span>
                  <span className="flex items-center gap-1">
                    {report.isResolved ? `✅ Resolved ${report.resolvedDate}` : report.resolvedDate ? "Not Resolved" : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyReports;