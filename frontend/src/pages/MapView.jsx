import { useEffect, useRef, useState } from "react";
import { Filter, X } from "lucide-react";
import PageHeader from "../components/PageHeader";

const MapLegend = () => {
  const legendItems = [
    { color: "bg-black", label: "PENDING REVIEW" },
    { color: "bg-green-500", label: "APPROVED" },
    { color: "bg-yellow-500", label: "IN PROGRESS" },
    { color: "bg-red-500", label: "REJECTED" },
  ];

  return (
    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-gray-700/90 backdrop-blur-sm rounded-lg p-2 sm:p-3 text-white text-[10px] sm:text-xs font-medium shadow-lg z-[1000]">
      {legendItems.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5 last:mb-0">
          <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${color} border border-white/30`}></div>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

const MapView = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All Reports");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const markers = [
    { lng: 124.4025, lat: 11.5601, color: "#000000", status: "Pending Review", issueTitle: "Pothole on Main St" },
    { lng: 124.3908, lat: 11.5502, color: "#22c55e", status: "Approved", issueTitle: "Broken Traffic Light" },
    { lng: 124.3775, lat: 11.5438, color: "#eab308", status: "In Progress", issueTitle: "Damaged Signage" },
    { lng: 124.4145, lat: 11.5745, color: "#ef4444", status: "Rejected", issueTitle: "Road Debris" },
    { lng: 124.3998, lat: 11.5522, color: "#000000", status: "Pending Review", issueTitle: "Missing Manhole Cover" },
  ];

  useEffect(() => {
    if (map.current) return;

    // Check if Leaflet is loaded
    if (!window.L) {
      console.error("Leaflet is not loaded");
      return;
    }

    const L = window.L;
    
    // Initialize map
    map.current = L.map(mapContainer.current).setView([11.5550, 124.3950], 14);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map.current);

    // Add markers
    markers.forEach(marker => {
      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 20px;
          height: 20px;
          background-color: ${marker.color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20]
      });

      L.marker([marker.lat, marker.lng], { icon: markerIcon })
        .bindPopup(`
        <div style="font-family: Kanit; font-size: 12px; padding: 4px;">
          <b>Issue Title:</b> ${marker.issueTitle} <br />
          <b>Status:</b> ${marker.status}
        </div>`)
        .addTo(map.current);
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-screen font-[Kanit] pt-16 lg:pt-0">
      {/* Header */}
      <PageHeader
        title="Map View"
        description="View infrastructure reports around Naval, Biliran"
      />

      {/* Map Container */}
      <div className="flex-1 bg-gray-900 relative min-h-0 z-0">
        <div ref={mapContainer} className="w-full h-full" />
        <MapLegend />
        
        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden absolute top-4 right-4 bg-gray-700/90 backdrop-blur-sm text-white rounded-lg p-2.5 border border-gray-600 z-[1000] shadow-lg"
        >
          {showFilters ? <X size={20} /> : <Filter size={20} />}
        </button>

        {/* Desktop Filters */}
        <div className="hidden lg:flex absolute top-4 right-4 gap-2 z-[1000]">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-700/90 backdrop-blur-sm text-white text-sm rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option>All Reports</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>In Progress</option>
            <option>Rejected</option>
          </select>
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-700/90 backdrop-blur-sm text-white text-sm rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:border-blue-500"
          >
            <option>All Categories</option>
            <option>Road Damage</option>
            <option>Traffic Light</option>
            <option>Signage</option>
          </select>
        </div>

        {/* Mobile Filter Panel */}
        {showFilters && (
          <div className="lg:hidden absolute top-16 right-4 left-4 bg-gray-800/95 backdrop-blur-sm rounded-lg p-4 z-[1000] shadow-xl border border-gray-700">
            <div className="space-y-3">
              <div>
                <label className="block text-white text-xs font-medium mb-1.5">Status</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-gray-700 text-white text-sm rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:border-blue-500"
                >
                  <option>All Reports</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>In Progress</option>
                  <option>Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white text-xs font-medium mb-1.5">Category</label>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-gray-700 text-white text-sm rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:border-blue-500"
                >
                  <option>All Categories</option>
                  <option>Road Damage</option>
                  <option>Traffic Light</option>
                  <option>Signage</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Mobile Filter Overlay */}
        {showFilters && (
          <div
            onClick={() => setShowFilters(false)}
            className="lg:hidden absolute inset-0 bg-black/30 z-[999]"
          />
        )}
      </div>
    </div>
  );
};

export default MapView;