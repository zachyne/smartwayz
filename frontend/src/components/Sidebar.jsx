import { FileText, Map, Folder, MapPin, Sliders, BarChart, Power } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "New Report", icon: <FileText size={16} />, path: "/new-report" },
    { label: "Map View", icon: <Map size={16} />, path: "/map-view" },
    { label: "My Reports", icon: <Folder size={16} />, path: "/my-reports" },
  ];

  const simItems = [
    { label: "Traffic Map", icon: <MapPin size={16} />, path: "/traffic-map" },
    { label: "Scenarios", icon: <Sliders size={16} />, path: "/scenarios" },
    { label: "Controls", icon: <Sliders size={16} />, path: "/controls" },
    { label: "Analysis", icon: <BarChart size={16} />, path: "/analysis" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-gradient-to-b from-[#1B163C] to-[#100C27] w-64 h-screen flex flex-col justify-between font-[Kanit] text-white sticky top-0">
      <div className="flex-1 overflow-y-auto">
        {/* Logo */}
        <div className="p-6 font-extrabold text-2xl tracking-tight">SMARTWAYZ</div>

        {/* REPORT INFRASTRUCTURE ISSUE */}
        <div className="px-4 text-[0.65rem] text-gray-400 uppercase tracking-wider mt-3 mb-1">
          Report Infrastructure Issue
        </div>

        <nav className="space-y-1 px-2">
          {navItems.map(({ label, icon, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`relative flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(path)
                  ? "bg-[#2E2470] text-white shadow-[0_0_12px_rgba(79,70,229,0.35)]"
                  : "text-gray-300 hover:text-white hover:bg-[#241D4D]"
              }`}
            >
              <span className="flex items-center gap-2">
                {icon}
                {label}
              </span>
              {isActive(path) && (
                <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_6px_rgba(96,165,250,0.9)]"></span>
              )}
            </button>
          ))}
        </nav>

        {/* TRAFFIC MANAGEMENT SIMULATION */}
        <div className="px-4 text-[0.65rem] text-gray-400 uppercase tracking-wider mt-6 mb-1">
          Traffic Management Simulation
        </div>

        <nav className="space-y-1 px-2">
          {simItems.map(({ label, icon, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`relative flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(path)
                  ? "bg-[#2E2470] text-white shadow-[0_0_12px_rgba(79,70,229,0.35)]"
                  : "text-gray-300 hover:text-white hover:bg-[#241D4D]"
              }`}
            >
              <span className="flex items-center gap-2">
                {icon}
                {label}
              </span>
              {isActive(path) && (
                <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_6px_rgba(96,165,250,0.9)]"></span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* USER INFO - Fixed at bottom */}
      <div className="p-4 border-t border-[#2D2570]/40">
        <div className="bg-[#1C153A] flex items-center gap-2 p-2 rounded-md mb-2 border border-[#2D2570]/40">
          <div className="w-8 h-8 rounded-full bg-gray-400" />
          <div>
            <div className="text-sm font-semibold">Cyrine</div>
            <div className="text-xs text-gray-400">Cutie Pie</div>
          </div>
        </div>
        <button className="w-full bg-gradient-to-r from-[#B02147] to-[#E13B63] hover:opacity-90 text-sm rounded-md py-1.5 flex items-center justify-center gap-2 font-medium transition-all">
          <Power size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;