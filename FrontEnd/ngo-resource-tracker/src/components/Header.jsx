import { Bell, Menu, Settings, LogOut, User, LogIn } from "lucide-react";
import { useState, useEffect } from "react";

function Header({ 
  toggleSidebar, 
  toggleNotifications, 
  showNotifications, 
  activeTab,
  setActiveTab
}) {
  // User authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Calculate unread notifications count
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  
  // Fetch user data and notifications on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userInfo = localStorage.getItem('userInfo');
      
      if (token && userInfo) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(userInfo));
        fetchNotifications(token);
      }
    };
    
    checkAuth();
  }, []);
  
  // Function to fetch notifications from the server
  const fetchNotifications = async (token) => {
    try {
      setLoading(true);
      const response = await fetch('/api/notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        console.error('Error fetching notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData || !userData.name) return "?";
    
    const nameParts = userData.name.split(" ");
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };
  
  // Handle login click
  const handleLogin = () => {
    window.location.href = "/login";
  };
  
  // Handle logout click
  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      
      // Update state
      setIsLoggedIn(false);
      setUserData(null);
      setNotifications([]);
      
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  // Handle settings click
  const handleSettings = () => {
    setActiveTab("settings");
  };
  
  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ read: true })
      });
      
      if (response.ok) {
        // Update local state
        setNotifications(notifications.map(n => 
          n._id === notificationId ? { ...n, read: true } : n
        ));
      } else {
        console.error('Error marking notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  return (
    <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 md:hidden">
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold">
          {activeTab?.charAt(0).toUpperCase() + activeTab?.slice(1) || "Dashboard"}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        {isLoggedIn && (
          <button className="relative p-1" onClick={toggleNotifications}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>
        )}

        {isLoggedIn ? (
          <>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer">
                {getUserInitials()}
              </div>
              <span className="ml-2 text-sm font-medium hidden md:block">
                {userData?.name || "User"}
              </span>
            </div>
            
            <button onClick={handleSettings} className="p-1 hidden md:block">
              <Settings size={20} />
            </button>
            
            <button onClick={handleLogout} className="p-1">
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md">
            <LogIn size={16} />
            <span className="hidden md:inline">Login</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;