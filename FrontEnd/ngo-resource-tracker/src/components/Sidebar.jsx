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

function Sidebar({ activeTab, setActiveTab, sidebarOpen, toggleSidebar }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userInfo = localStorage.getItem('userInfo');
      
      if (token && userInfo) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(userInfo));
      }
    };
    
    checkAuth();
  }, []);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      
      // Update state
      setIsLoggedIn(false);
      setUserData(null);
      
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

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
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center px-4 py-2 w-full rounded-lg ${
                activeTab === "dashboard" ? "bg-blue-700" : "hover:bg-blue-700"
              }`}
            >
              <BarChart3 size={20} className="mr-3" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center px-4 py-2 w-full rounded-lg ${
                activeTab === "inventory" ? "bg-blue-700" : "hover:bg-blue-700"
              }`}
            >
              <Package size={20} className="mr-3" />
              Inventory
            </button>

            <button
              onClick={() => setActiveTab("donors")}
              className={`flex items-center px-4 py-2 w-full rounded-lg ${
                activeTab === "donors" ? "bg-blue-700" : "hover:bg-blue-700"
              }`}
            >
              <Users size={20} className="mr-3" />
              Donors
            </button>

            <button
              onClick={() => setActiveTab("logistics")}
              className={`flex items-center px-4 py-2 w-full rounded-lg ${
                activeTab === "logistics" ? "bg-blue-700" : "hover:bg-blue-700"
              }`}
            >
              <Truck size={20} className="mr-3" />
              Logistics
            </button>
            
            {isLoggedIn && userData?.role === "admin" && (
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center px-4 py-2 w-full rounded-lg ${
                  activeTab === "settings" ? "bg-blue-700" : "hover:bg-blue-700"
                }`}
              >
                <Settings size={20} className="mr-3" />
                Settings
              </button>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          {!isLoggedIn ? (
            <button 
              onClick={() => window.location.href = "/login"}
              className="flex items-center px-4 py-2 w-full rounded-lg hover:bg-blue-700"
            >
              <LogOut size={20} className="mr-3" />
              Login
            </button>
          ) : (
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-2 w-full rounded-lg hover:bg-blue-700 mt-2"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
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