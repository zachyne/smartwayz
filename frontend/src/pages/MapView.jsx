import { useEffect, useRef } from "react";
import PageHeader from "../components/PageHeader";

const MapLegend = () => {
  const legendItems = [
    { color: "bg-black", label: "PENDING REVIEW" },
    { color: "bg-green-500", label: "APPROVED" },
    { color: "bg-yellow-500", label: "IN PROGRESS" },
    { color: "bg-red-500", label: "REJECTED" },
  ];

  return (
    <div className="absolute bottom-6 left-6 bg-gray-700/90 backdrop-blur-sm rounded-lg p-3 text-white text-xs font-medium shadow-lg z-[1000]">
      {legendItems.map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2 mb-1.5 last:mb-0">
          <div className={`w-4 h-4 rounded-full ${color} border border-white/30`}></div>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

const MapView = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const markers = [
    { lng: 124.4025, lat: 11.5601, color: "#000000", status: "Pending Review" },
    { lng: 124.3908, lat: 11.5502, color: "#22c55e", status: "Approved" },
    { lng: 124.3775, lat: 11.5438, color: "#eab308", status: "In Progress" },
    { lng: 124.4145, lat: 11.5745, color: "#ef4444", status: "Rejected" },
    { lng: 124.3998, lat: 11.5522, color: "#000000", status: "Pending Review" },
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
        <div className="text-white text-xs font-medium p-2">
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
    <div className="flex-1 flex flex-col h-screen font-[Kanit]">
      {/* Header */}
      <PageHeader
        title="Map View"
        description="View infrastructure reports around Naval, Biliran"
      />

      {/* Map Container */}
      <div className="flex-1 bg-gray-900 relative min-h-0">
        <div ref={mapContainer} className="w-full h-full" />
        <MapLegend />
        
        {/* Filters */}
        <div className="absolute top-4 right-4 flex gap-2 z-[1000]">
          <select className="bg-gray-700/90 backdrop-blur-sm text-white text-sm rounded-lg px-4 py-2 border border-gray-600">
            <option>All Reports</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>In Progress</option>
            <option>Rejected</option>
          </select>
          <select className="bg-gray-700/90 backdrop-blur-sm text-white text-sm rounded-lg px-4 py-2 border border-gray-600">
            <option>All Categories</option>
            <option>Road Damage</option>
            <option>Traffic Light</option>
            <option>Signage</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MapView;