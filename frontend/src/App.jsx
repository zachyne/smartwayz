import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./pages/AuthPages";
import Sidebar from "./components/Sidebar";
import RoleBasedSidebar from "./components/RoleBasedSidebar";
import NewReport from "./pages/NewReport";
import MapView from "./pages/MapView";
import MyReports from "./pages/MyReports";
import AuthPages from "./pages/AuthPages";
import AuthorityReports from "./pages/Authority/AuthorityReports";
import PendingReports from "./pages/Authority/PendingReports";
import { Outlet, useLocation } from "react-router-dom";
import InProgressReports from "./pages/Authority/InProgressReports";
import ApprovedReports from "./pages/Authority/ApprovedReports";
import ResolvedReports from "./pages/Authority/ResolvedReports";
import RejectedReports from "./pages/Authority/RejectedReports";
import AuthorityAnalytics from "./pages/Authority/AuthorityAnalytics";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="text-white">Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

// Auth Route Wrapper
const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <div className="text-white">Loading...</div>;

  if (isAuthenticated) {
    return <Navigate to={user?.type === "authority" ? "/authority/reports" : "/new-report"} replace />;
  }

  return children;
};

const DashboardLayout = () => (
  <div className="flex min-h-screen bg-[#1a1535]">
    <RoleBasedSidebar />
    <div className="flex-1 overflow-y-auto">
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth */}
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <AuthPages />
            </AuthRoute>
          }
        />

        {/* Protected Dashboard */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/new-report" replace />} />

          {/* Citizen Routes */}
          <Route path="new-report" element={<NewReport />} />
          <Route path="map-view" element={<MapView />} />
          <Route path="my-reports" element={<MyReports />} />
          <Route path="scenarios" element={<div className="p-8 text-white">Scenarios</div>} />
          <Route path="controls" element={<div className="p-8 text-white">Controls</div>} />
          <Route path="analysis" element={<div className="p-8 text-white">Analysis</div>} />

          {/* Authority Routes */}
          <Route path="authority/reports" element={<AuthorityReports />} />
          <Route path="authority/pending" element={<PendingReports />} />
          <Route path="authority/in-progress" element={<InProgressReports />} />
          <Route path="authority/approved" element={<ApprovedReports />} />
          <Route path="authority/rejected" element={<RejectedReports />} />
          <Route path="authority/resolved" element={<ResolvedReports />} />
          <Route path="authority/authority-analytics" element={<AuthorityAnalytics />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
