import Sidebar from "./components/Sidebar";
import NewReport from "./pages/NewReport";
import MapView from "./pages/MapView";
import MyReports from "./pages/MyReports";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#1a1535]">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/new-report" replace />} />
            <Route path="/new-report" element={<NewReport />} />
            <Route path="/map-view" element={<MapView />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/traffic-map" element={<div className="flex-1 bg-gray-900 text-white p-8">Traffic Map Page</div>} />
            <Route path="/scenarios" element={<div className="flex-1 bg-gray-900 text-white p-8">Scenarios Page</div>} />
            <Route path="/controls" element={<div className="flex-1 bg-gray-900 text-white p-8">Controls Page</div>} />
            <Route path="/analysis" element={<div className="flex-1 bg-gray-900 text-white p-8">Analysis Page</div>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;