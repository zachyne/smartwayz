import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./pages/AuthPages";
import Sidebar from "./components/Sidebar";
import NewReport from "./pages/NewReport";
import MapView from "./pages/MapView";
import MyReports from "./pages/MyReports";
import AuthPages from "./pages/AuthPages";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1B163C] via-[#2D2570] to-[#0A0E27] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

// Auth Route Wrapper (redirects to dashboard if already logged in)
const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1B163C] via-[#2D2570] to-[#0A0E27] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/new-report" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth route - redirects to /new-report if already logged in */}
        <Route 
          path="/auth" 
          element={
            <AuthRoute>
              <AuthPages />
            </AuthRoute>
          } 
        />
        
        {/* Protected routes with sidebar */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;