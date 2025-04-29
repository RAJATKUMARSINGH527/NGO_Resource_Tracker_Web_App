import { 
  BarChart3, 
  Package, 
  Users, 
  Truck, 
  Settings, 
  LogOut, 
  X 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({ activeTab, setActiveTab, sidebarOpen, toggleSidebar }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  
  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userInfo = localStorage.getItem('user');
      
      if (token && userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          setIsLoggedIn(true);
          setUserData(parsedUserInfo);
          console.log("User authenticated:", parsedUserInfo);
        } catch (error) {
          console.error("Error parsing user info:", error);
          // Handle invalid JSON in localStorage
          localStorage.removeItem('user');
        }
      } else {
        console.log("User not authenticated");
      }
    };
    
    checkAuth();
  }, []);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update state
      setIsLoggedIn(false);
      setUserData(null);
      
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Handle navigation
  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
    if (window.innerWidth < 768) {
      toggleSidebar(); // Close sidebar on mobile after navigation
    }
  };

  // Check if user should see settings
  const showSettings = isLoggedIn && userData && (userData.role === "admin" || userData.isAdmin === true);
  
  // For debugging
  useEffect(() => {
    console.log("Login status:", isLoggedIn);
    console.log("User data:", userData);
    console.log("Should show settings:", showSettings);
  }, [isLoggedIn, userData]);

  return (
    <>
      <div
        className={`bg-blue-800 text-white w-64 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 z-30 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">NGO Resource Tracker</h1>
            <button onClick={toggleSidebar} className="md:hidden">
              <X size={20} />
            </button>
          </div>

          <div className="mt-8 space-y-2">
            <button
              onClick={() => handleNavigation("dashboard", "/dashboard")}
              className={`flex items-center px-4 py-2 w-full rounded-lg ${
                activeTab === "dashboard" ? "bg-blue-700" : "hover:bg-blue-700"
              }`}
            >
              <BarChart3 size={20} className="mr-3" />
              Dashboard
            </button>

            <button
              onClick={() => handleNavigation("inventory", "/inventory")}
              className={`flex items-center px-4 py-2 w-full rounded-lg ${
                activeTab === "inventory" ? "bg-blue-700" : "hover:bg-blue-700"
              }`}
            >
              <Package size={20} className="mr-3" />
              Inventory
            </button>

            <button
              onClick={() => handleNavigation("donors", "/donors")}
              className={`flex items-center px-4 py-2 w-full rounded-lg ${
                activeTab === "donors" ? "bg-blue-700" : "hover:bg-blue-700"
              }`}
            >
              <Users size={20} className="mr-3" />
              Donors
            </button>

            <button
              onClick={() => handleNavigation("logistics", "/logistics")}
              className={`flex items-center px-4 py-2 w-full rounded-lg ${
                activeTab === "logistics" ? "bg-blue-700" : "hover:bg-blue-700"
              }`}
            >
              <Truck size={20} className="mr-3" />
              Logistics
            </button>
            
            {/* Settings button - now more flexible with role checking */}
            {showSettings && (
              <button
                onClick={() => handleNavigation("settings", "/settings")}
                className={`flex items-center px-4 py-2 w-full rounded-lg ${
                  activeTab === "settings" ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                <Settings size={20} className="mr-3" />
                Settings
              </button>
            )}
            
            {/* Alternative: Always show settings button for debugging */}
            {!showSettings && isLoggedIn && (
              <div className="text-xs text-blue-300 p-2">
                {/* Settings not available (User role: {userData?.role || "unknown"}) */}
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          {!isLoggedIn ? (
            <button 
              onClick={() => navigate("/login")}
              className="flex items-center px-4 py-2 w-full rounded-lg hover:bg-blue-700"
            >
              <LogOut size={20} className="mr-3" />
              Login
            </button>
          ) : (
            <>
              <div className="text-xs text-blue-300 mb-2 px-2">
                {/* Logged in as: {userData?.name || userData?.username || "User"} */}
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center px-4 py-2 w-full rounded-lg hover:bg-blue-700"
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}

export default Sidebar;