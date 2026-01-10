import Sidebar from "./Sidebar";
import AuthoritySidebar from "./AuthoritySidebar";
import { useAuth } from "../pages/AuthPages";

const RoleBasedSidebar = () => {
  const { user } = useAuth();

  if (user?.type === "authority") {
    return <AuthoritySidebar />;
  }

  return <Sidebar />;
};

export default RoleBasedSidebar;
