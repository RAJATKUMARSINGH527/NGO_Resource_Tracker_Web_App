import { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { 
  BarChart3, 
  Package, 
  AlertTriangle, 
  Bell,
  CheckCircle2,
  TrendingUp,
  Users,
  Truck,
  Settings as SettingsIcon,
  X
} from "lucide-react";

function Home() {
  // State for sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // State for notifications panel
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    inventoryCount: 0,
    lowStockItems: 0,
    pendingShipments: 0,
    activeDonors: 0,
    recentDonations: []
  });
  
  // Notifications data
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  // Fetch user data on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userInfo = localStorage.getItem('userInfo');
      
      if (token && userInfo) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(userInfo));
        fetchNotifications(token);
        fetchDashboardData(token);
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Fetch notifications from the server
  const fetchNotifications = async (token) => {
    try {
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
  
  // Fetch dashboard data
  const fetchDashboardData = async (token) => {
    try {
      // This would be replaced with actual API endpoints
      // Simulating API calls for demo purposes
      const inventoryResponse = await fetch('/api/inventory/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => ({ ok: false }));
      
      const logisticsResponse = await fetch('/api/logistics/pending', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => ({ ok: false }));
      
      const donorsResponse = await fetch('/api/donors/active', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => ({ ok: false }));
      
      // If we can't fetch real data, use dummy data
      setDashboardData({
        inventoryCount: inventoryResponse.ok ? (await inventoryResponse.json()).count : 156,
        lowStockItems: inventoryResponse.ok ? (await inventoryResponse.json()).lowStock : 12,
        pendingShipments: logisticsResponse.ok ? (await logisticsResponse.json()).pending : 8,
        activeDonors: donorsResponse.ok ? (await donorsResponse.json()).active : 42,
        recentDonations: [
          { id: 1, donor: "Acme Foundation", item: "Medical Supplies", quantity: 200, date: "2025-04-24" },
          { id: 2, donor: "Tech for Good", item: "Laptops", quantity: 15, date: "2025-04-23" },
          { id: 3, donor: "Global Help", item: "Food Packages", quantity: 500, date: "2025-04-22" },
          { id: 4, donor: "Community Trust", item: "Blankets", quantity: 150, date: "2025-04-20" }
        ]
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
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
  
  // Render tab content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case "dashboard":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <DashboardCard 
                title="Total Inventory" 
                value={dashboardData.inventoryCount} 
                icon={<Package size={24} />}
                color="blue"
              />
              <DashboardCard 
                title="Low Stock Items" 
                value={dashboardData.lowStockItems} 
                icon={<AlertTriangle size={24} />}
                color="yellow" 
              />
              <DashboardCard 
                title="Pending Shipments" 
                value={dashboardData.pendingShipments} 
                icon={<Truck size={24} />}
                color="purple"
              />
              <DashboardCard 
                title="Active Donors" 
                value={dashboardData.activeDonors} 
                icon={<Users size={24} />}
                color="green"
              />
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Donations</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.recentDonations.map((donation) => (
                      <tr key={donation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {donation.donor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {donation.item}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {donation.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {donation.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case "inventory":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Inventory content will be displayed here.</p>
            </div>
          </div>
        );
      case "donors":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Donor Management</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Donor information will be displayed here.</p>
            </div>
          </div>
        );
      case "logistics":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Logistics Management</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Logistics information will be displayed here.</p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Settings options will be displayed here.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <p className="text-gray-600">Select a section from the sidebar.</p>
          </div>
        );
    }
  };
  
  // Dashboard card component
  const DashboardCard = ({ title, value, icon, color }) => {
    const colorClasses = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      yellow: "bg-yellow-100 text-yellow-800",
      red: "bg-red-100 text-red-800",
      purple: "bg-purple-100 text-purple-800"
    };
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className={`rounded-full p-2 ${colorClasses[color] || colorClasses.blue}`}>
            {icon}
          </div>
        </div>
        <div className="flex items-end">
          <span className="text-3xl font-bold">{value}</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header component */}
      <Header 
        toggleSidebar={toggleSidebar} 
        toggleNotifications={toggleNotifications}
        showNotifications={showNotifications}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      {/* Sidebar component */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />
      
      {/* Main content */}
      <div className={`md:pl-64 pt-16 transition-all duration-300 ${sidebarOpen ? "blur-sm md:blur-none" : ""}`}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : !isLoggedIn ? (
          <div className="p-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Welcome to NGO Resource Tracker</h2>
              <p className="mb-6">Please log in to access the dashboard.</p>
              <button 
                onClick={() => window.location.href = "/login"}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>
      
      {/* Notifications panel */}
      {showNotifications && (
        <div className="fixed right-0 top-16 h-full w-80 bg-white shadow-lg z-40 overflow-y-auto">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <button onClick={toggleNotifications} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="divide-y">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`p-4 hover:bg-gray-50 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="flex items-start">
                    <div className={`rounded-full p-2 mr-3 ${getNotificationIconClass(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Overlay for notifications panel on mobile */}
      {showNotifications && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleNotifications}
        ></div>
      )}
    </div>
  );
}

// Helper function to get notification icon based on type
function getNotificationIcon(type) {
  switch(type) {
    case 'alert':
      return <AlertTriangle size={18} />;
    case 'success':
      return <CheckCircle2 size={18} />;
    case 'update':
      return <TrendingUp size={18} />;
    default:
      return <Bell size={18} />;
  }
}

// Helper function to get notification icon class based on type
function getNotificationIconClass(type) {
  switch(type) {
    case 'alert':
      return 'bg-red-100 text-red-800';
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'update':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default Home;