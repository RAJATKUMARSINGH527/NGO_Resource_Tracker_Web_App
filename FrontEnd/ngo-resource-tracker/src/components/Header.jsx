import { Bell, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

function Header({ 
  toggleSidebar, 
  toggleNotifications, 
  showNotifications, 
  activeTab,
  setActiveTab
}) {
  // User authentication state
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  
  // Calculate unread notifications count
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  
  // Function to fetch notifications from the server
  const fetchNotifications = async (token) => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Compare with current notifications to detect new ones
        const currentIds = new Set(notifications.map(n => n._id));
        const hasNewNotifications = data.some(notification => !currentIds.has(notification._id));
        
        // If we have new notifications, play a sound or show an alert if needed
        if (hasNewNotifications && notifications.length > 0) {
          // You could play a notification sound here if you want
          // const audio = new Audio('/notification-sound.mp3');
          // audio.play().catch(e => console.log('Audio play failed:', e));
        }
        
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
  
  // Check for new notifications periodically
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Initial fetch
    fetchNotifications(token);
    
    // Check for new notifications every 30 seconds
    const intervalId = setInterval(() => fetchNotifications(token), 30000);
    
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);  // Empty dependency array since we only want to set up the interval once
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userData || !userData.name) return "UN";
    
    const nameParts = userData.name.split(" ");
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        const response = await fetch('http://localhost:8000/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          // Update localStorage with latest user data
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          console.error('Error fetching user profile');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    // Check if we have a user in localStorage first
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      setUserData(JSON.parse(userInfo));
    }
    
    fetchUserData();
  }, []);
  
  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(`http://localhost:8000/notifications/${notificationId}`, {
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
  
  // Toggle notification dropdown
  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format notification time
  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <header className="bg-white shadow px-4 py-3 flex items-center justify-between relative">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 md:hidden">
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold">
          {activeTab?.charAt(0).toUpperCase() + activeTab?.slice(1) || "Dashboard"}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={notificationRef}>
          <button 
            className="relative p-1" 
            onClick={toggleNotificationDropdown}
            aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>
          
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 border border-gray-200 max-h-96 overflow-auto">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-medium">Notifications</h3>
                <button onClick={() => setIsNotificationOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <X size={16} />
                </button>
              </div>
              
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No notifications</div>
              ) : (
                <div>
                  {notifications.map((notification) => (
                    <div 
                      key={notification._id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => markAsRead(notification._id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatNotificationTime(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.read && (
                          <span className="h-2 w-2 bg-blue-500 rounded-full mt-1"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {notifications.length > 0 && (
                <div className="p-2 text-center border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {getUserInitials()}
          </div>
          <span className="ml-2 text-sm font-medium hidden md:block">
            {userData?.name || "User Name"}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;