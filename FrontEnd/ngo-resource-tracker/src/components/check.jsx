// import { useState, useEffect } from "react";
// import {
//   BarChart3,
//   Package,
//   Users,
//   Truck,
//   PieChart,
//   Calendar,
//   Bell,
//   Search,
//   UserPlus,
//   PackagePlus,
//   ListChecks,
//   Settings,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";

// function Home() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [inventoryItems, setInventoryItems] = useState([]);
//   const [donors, setDonors] = useState([]);
//   const [logistics, setLogistics] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("All Categories");
//   const [locationFilter, setLocationFilter] = useState("All Locations");
//   const [donorTypeFilter, setDonorTypeFilter] = useState("All Donors");
//   const [donorSortBy, setDonorSortBy] = useState("Sort by Name");
//   const [logisticsStatusFilter, setLogisticsStatusFilter] = useState("All Status");
//   const [logisticsDateFilter, setLogisticsDateFilter] = useState("All Dates");
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);

//   // Fetch data from backend
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         // Fetch inventory data
//         const inventoryResponse = await fetch("http://localhost:8000/inventory/");
//         const inventoryData = await inventoryResponse.json();
        
//         // Fetch donors data
//         const donorsResponse = await fetch("http://localhost:8000/donors");
//         const donorsData = await donorsResponse.json();
        
//         // Fetch logistics data
//         const logisticsResponse = await fetch("http://localhost:8000/logistics");
//         const logisticsData = await logisticsResponse.json();
        
//         // Fetch notifications
//         const notificationsResponse = await fetch("http://localhost:8000/notifications");
//         const notificationsData = await notificationsResponse.json();

//         setInventoryItems(inventoryData);
//         setDonors(donorsData);
//         setLogistics(logisticsData);
//         setNotifications(notificationsData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         // Use mock data as fallback
//         setInventoryItems([
//           {
//             id: 1,
//             name: "Food packages",
//             quantity: 234,
//             category: "Food",
//             location: "Warehouse A",
//           },
//           {
//             id: 2,
//             name: "Blankets",
//             quantity: 120,
//             category: "Shelter",
//             location: "Warehouse B",
//           },
//           {
//             id: 3,
//             name: "Medical kits",
//             quantity: 45,
//             category: "Medical",
//             location: "Storage C",
//           },
//           {
//             id: 4,
//             name: "Water bottles",
//             quantity: 500,
//             category: "Water",
//             location: "Warehouse A",
//           },
//           {
//             id: 5,
//             name: "Hygiene kits",
//             quantity: 175,
//             category: "Hygiene",
//             location: "Warehouse B",
//           },
//         ]);
        
//         setDonors([
//           {
//             id: 1,
//             name: "Jane Smith",
//             email: "jane@example.com",
//             type: "Individual",
//             total: 5000,
//             lastDonation: "2025-03-15",
//           },
//           {
//             id: 2,
//             name: "ABC Foundation",
//             email: "contact@abcfoundation.org",
//             type: "Organization",
//             total: 25000,
//             lastDonation: "2025-04-01",
//           },
//           {
//             id: 3,
//             name: "Global Helpers",
//             email: "info@globalhelpers.org",
//             type: "Organization",
//             total: 12500,
//             lastDonation: "2025-03-20",
//           },
//           {
//             id: 4,
//             name: "John Davis",
//             email: "john@example.com",
//             type: "Individual",
//             total: 1000,
//             lastDonation: "2025-04-10",
//           },
//         ]);
        
//         setLogistics([
//           {
//             id: 1,
//             destination: "Community Center",
//             items: "Food, Water",
//             status: "In Transit",
//             date: "2025-04-23",
//           },
//           {
//             id: 2,
//             destination: "Rural Village",
//             items: "Medical Supplies",
//             status: "Delivered",
//             date: "2025-04-20",
//           },
//           {
//             id: 3,
//             destination: "Shelter Home",
//             items: "Blankets, Hygiene Kits",
//             status: "Scheduled",
//             date: "2025-04-25",
//           },
//           {
//             id: 4,
//             destination: "School District",
//             items: "Educational Materials",
//             status: "Pending",
//             date: "2025-04-26",
//           },
//         ]);
        
//         setNotifications([
//           { id: 1, message: "New donation received from ABC Foundation", read: false, date: "2025-04-26" },
//           { id: 2, message: "Inventory low alert: Medical kits", read: false, date: "2025-04-25" },
//           { id: 3, message: "Shipment to Rural Village delivered", read: true, date: "2025-04-20" },
//         ]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Calculate totals for dashboard
//   const totalInventoryItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
//   const activeDonorsCount = donors.length;
//   const pendingLogistics = logistics.filter(item => item.status !== "Delivered").length;
//   const unreadNotifications = notifications.filter(notif => !notif.read).length;

//   // Toggle sidebar on smaller screens
//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   // Toggle mobile menu
//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//   };

//   // Toggle notifications panel
//   const toggleNotifications = () => {
//     setShowNotifications(!showNotifications);
//   };

//   // Mark notification as read
//   const markAsRead = async (id) => {
//     try {
//       await fetch(`/api/notifications/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ read: true }),
//       });
      
//       // Update local state
//       setNotifications(notifications.map(notif => 
//         notif.id === id ? { ...notif, read: true } : notif
//       ));
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//       // Optimistic update even if API fails
//       setNotifications(notifications.map(notif => 
//         notif.id === id ? { ...notif, read: true } : notif
//       ));
//     }
//   };

//   // Filter inventory items based on search and filters
//   const filteredInventory = inventoryItems.filter(item => {
//     const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = categoryFilter === "All Categories" || item.category === categoryFilter;
//     const matchesLocation = locationFilter === "All Locations" || item.location === locationFilter;
//     return matchesSearch && matchesCategory && matchesLocation;
//   });

//   // Filter donors based on search and filters
//   const filteredDonors = donors.filter(donor => {
//     const matchesSearch = donor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                           donor.email.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesType = donorTypeFilter === "All Donors" || donor.type === donorTypeFilter;
//     return matchesSearch && matchesType;
//   }).sort((a, b) => {
//     if (donorSortBy === "Sort by Name") {
//       return a.name.localeCompare(b.name);
//     } else if (donorSortBy === "Sort by Date") {
//       return new Date(b.lastDonation) - new Date(a.lastDonation);
//     } else if (donorSortBy === "Sort by Amount") {
//       return b.total - a.total;
//     }
//     return 0;
//   });

//   // Filter logistics based on search and filters
//   const filteredLogistics = logistics.filter(logistic => {
//     const matchesSearch = logistic.destination.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                           logistic.items.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesStatus = logisticsStatusFilter === "All Status" || logistic.status === logisticsStatusFilter;
    
//     const matchesDate = logisticsDateFilter === "All Dates";
//     const today = new Date().toISOString().split('T')[0];
    
//     if (logisticsDateFilter === "Today") {
//       return matchesSearch && matchesStatus && logistic.date === today;
//     } else if (logisticsDateFilter === "This Week") {
//       const lastWeek = new Date();
//       lastWeek.setDate(lastWeek.getDate() - 7);
//       return matchesSearch && matchesStatus && new Date(logistic.date) >= lastWeek;
//     } else if (logisticsDateFilter === "This Month") {
//       const lastMonth = new Date();
//       lastMonth.setMonth(lastMonth.getMonth() - 1);
//       return matchesSearch && matchesStatus && new Date(logistic.date) >= lastMonth;
//     }
    
//     return matchesSearch && matchesStatus && matchesDate;
//   });

//   // Add new inventory item
//   const addInventoryItem = async () => {
//     const newItem = {
//       name: prompt("Enter item name:"),
//       quantity: parseInt(prompt("Enter quantity:"), 10),
//       category: prompt("Enter category: (Food, Water, Medical, Shelter, Hygiene)"),
//       location: prompt("Enter location: (Warehouse A, Warehouse B, Storage C)"),
//     };
    
//     if (!newItem.name || isNaN(newItem.quantity)) {
//       alert("Invalid input. Item not added.");
//       return;
//     }
    
//     try {
//       const response = await fetch("/api/inventory", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newItem),
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setInventoryItems([...inventoryItems, data]);
//       } else {
//         throw new Error("Failed to add item");
//       }
//     } catch (error) {
//       console.error("Error adding inventory item:", error);
//       // Optimistic update even if API fails
//       const newId = Math.max(...inventoryItems.map(item => item.id), 0) + 1;
//       setInventoryItems([...inventoryItems, { id: newId, ...newItem }]);
//     }
//   };

//   // Edit inventory item
//   const editInventoryItem = async (id) => {
//     const item = inventoryItems.find(item => item.id === id);
    
//     if (!item) return;
    
//     const updatedItem = {
//       ...item,
//       name: prompt("Enter item name:", item.name),
//       quantity: parseInt(prompt("Enter quantity:", item.quantity), 10),
//       category: prompt("Enter category: (Food, Water, Medical, Shelter, Hygiene)", item.category),
//       location: prompt("Enter location: (Warehouse A, Warehouse B, Storage C)", item.location),
//     };
    
//     if (!updatedItem.name || isNaN(updatedItem.quantity)) {
//       alert("Invalid input. Item not updated.");
//       return;
//     }
    
//     try {
//       const response = await fetch(`/api/inventory/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedItem),
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setInventoryItems(inventoryItems.map(item => item.id === id ? data : item));
//       } else {
//         throw new Error("Failed to update item");
//       }
//     } catch (error) {
//       console.error("Error updating inventory item:", error);
//       // Optimistic update even if API fails
//       setInventoryItems(inventoryItems.map(item => item.id === id ? updatedItem : item));
//     }
//   };

//   // Delete inventory item
//   const deleteInventoryItem = async (id) => {
//     if (!confirm("Are you sure you want to delete this item?")) return;
    
//     try {
//       const response = await fetch(`/api/inventory/${id}`, {
//         method: "DELETE",
//       });
      
//       if (response.ok) {
//         setInventoryItems(inventoryItems.filter(item => item.id !== id));
//       } else {
//         throw new Error("Failed to delete item");
//       }
//     } catch (error) {
//       console.error("Error deleting inventory item:", error);
//       // Optimistic update even if API fails
//       setInventoryItems(inventoryItems.filter(item => item.id !== id));
//     }
//   };

//   // Add new donor
//   const addDonor = async () => {
//     const newDonor = {
//       name: prompt("Enter donor name:"),
//       email: prompt("Enter donor email:"),
//       type: prompt("Enter donor type: (Individual, Organization, Corporate)"),
//       total: parseFloat(prompt("Enter total donations:"), 10),
//       lastDonation: prompt("Enter last donation date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]),
//     };
    
//     if (!newDonor.name || !newDonor.email || isNaN(newDonor.total)) {
//       alert("Invalid input. Donor not added.");
//       return;
//     }
    
//     try {
//       const response = await fetch("/api/donors", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newDonor),
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setDonors([...donors, data]);
//       } else {
//         throw new Error("Failed to add donor");
//       }
//     } catch (error) {
//       console.error("Error adding donor:", error);
//       // Optimistic update even if API fails
//       const newId = Math.max(...donors.map(donor => donor.id), 0) + 1;
//       setDonors([...donors, { id: newId, ...newDonor }]);
//     }
//   };

//   // View donor details
//   const viewDonorDetails = (id) => {
//     const donor = donors.find(donor => donor.id === id);
//     if (donor) {
//       alert(`
//         Donor: ${donor.name}
//         Email: ${donor.email}
//         Type: ${donor.type || "N/A"}
//         Total Donations: $${donor.total.toLocaleString()}
//         Last Donation: ${donor.lastDonation}
//       `);
//     }
//   };

//   // Contact donor
//   const contactDonor = (id) => {
//     const donor = donors.find(donor => donor.id === id);
//     if (donor) {
//       window.location.href = `mailto:${donor.email}?subject=NGO Resource Tracker - Important Update`;
//     }
//   };

//   // Create new shipment
//   const createShipment = async () => {
//     const newShipment = {
//       destination: prompt("Enter destination:"),
//       items: prompt("Enter items:"),
//       status: "Pending",
//       date: prompt("Enter date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]),
//     };
    
//     if (!newShipment.destination || !newShipment.items) {
//       alert("Invalid input. Shipment not created.");
//       return;
//     }
    
//     try {
//       const response = await fetch("/api/logistics", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newShipment),
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setLogistics([...logistics, data]);
//       } else {
//         throw new Error("Failed to create shipment");
//       }
//     } catch (error) {
//       console.error("Error creating shipment:", error);
//       // Optimistic update even if API fails
//       const newId = Math.max(...logistics.map(logistic => logistic.id), 0) + 1;
//       setLogistics([...logistics, { id: newId, ...newShipment }]);
//     }
//   };

//   // View logistics details
//   const viewLogisticsDetails = (id) => {
//     const logistic = logistics.find(logistic => logistic.id === id);
//     if (logistic) {
//       alert(`
//         Destination: ${logistic.destination}
//         Items: ${logistic.items}
//         Status: ${logistic.status}
//         Date: ${logistic.date}
//       `);
//     }
//   };

//   // Update logistics status
//   const updateLogisticsStatus = async (id) => {
//     const logistic = logistics.find(logistic => logistic.id === id);
//     if (!logistic) return;
    
//     const statusOptions = ["Pending", "Scheduled", "In Transit", "Delivered"];
//     const currentIndex = statusOptions.indexOf(logistic.status);
//     let newStatus = prompt(
//       `Update status (${statusOptions.join(", ")})`,
//       statusOptions[(currentIndex + 1) % statusOptions.length]
//     );
    
//     if (!newStatus || !statusOptions.includes(newStatus)) {
//       alert("Invalid status. Status not updated.");
//       return;
//     }
    
//     try {
//       const response = await fetch(`/api/logistics/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ ...logistic, status: newStatus }),
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setLogistics(logistics.map(item => item.id === id ? data : item));
//       } else {
//         throw new Error("Failed to update status");
//       }
//     } catch (error) {
//       console.error("Error updating logistics status:", error);
//       // Optimistic update even if API fails
//       setLogistics(logistics.map(item => item.id === id ? { ...item, status: newStatus } : item));
//     }
//   };

//   // Handle logout
//   const handleLogout = () => {
//     if (confirm("Are you sure you want to logout?")) {
//       alert("You have been logged out successfully!");
//       // In a real app, this would redirect to login page or clear sessions
//       window.location.href = "/login";
//     }
//   };

//   // Handle settings
//   const handleSettings = () => {
//     alert("Settings page is under development.");
//   };

//   const renderContent = () => {
//     if (isLoading) {
//       return (
//         <div className="flex items-center justify-center h-full">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
//         </div>
//       );
//     }

//     switch (activeTab) {
//       case "dashboard":
//         return (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="bg-white p-4 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 rounded-full bg-blue-100 text-blue-600">
//                     <Package size={24} />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-500">
//                       Total Inventory
//                     </p>
//                     <p className="text-2xl font-semibold">{totalInventoryItems.toLocaleString()} items</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 rounded-full bg-green-100 text-green-600">
//                     <Users size={24} />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-500">
//                       Active Donors
//                     </p>
//                     <p className="text-2xl font-semibold">{activeDonorsCount}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow">
//                 <div className="flex items-center">
//                   <div className="p-3 rounded-full bg-purple-100 text-purple-600">
//                     <Truck size={24} />
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium text-gray-500">
//                       Logistics
//                     </p>
//                     <p className="text-2xl font-semibold">{pendingLogistics} pending</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="bg-white p-5 rounded-lg shadow">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="font-semibold text-lg">Recent Inventory</h3>
//                   <button 
//                     className="text-blue-600 text-sm"
//                     onClick={() => setActiveTab("inventory")}
//                   >
//                     View All
//                   </button>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead>
//                       <tr>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Item
//                         </th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Quantity
//                         </th>
//                         <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Location
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {inventoryItems.slice(0, 4).map((item) => (
//                         <tr key={item.id}>
//                           <td className="px-4 py-3 text-sm text-gray-900">
//                             {item.name}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-900">
//                             {item.quantity}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-900">
//                             {item.location}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//               <div className="bg-white p-5 rounded-lg shadow">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="font-semibold text-lg">Upcoming Logistics</h3>
//                   <button 
//                     className="text-blue-600 text-sm"
//                     onClick={() => setActiveTab("logistics")}
//                   >
//                     View All
//                   </button>
//                 </div>
//                 <div className="space-y-3">
//                   {logistics
//                     .filter((l) => l.status !== "Delivered")
//                     .map((logistic) => (
//                       <div
//                         key={logistic.id}
//                         className="flex items-center p-3 border border-gray-200 rounded-lg"
//                       >
//                         <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
//                           <Truck size={18} />
//                         </div>
//                         <div className="ml-3">
//                           <p className="text-sm font-medium">
//                             {logistic.destination}
//                           </p>
//                           <p className="text-xs text-gray-500">
//                             {logistic.items} - {logistic.date}
//                           </p>
//                         </div>
//                         <span
//                           className={`ml-auto px-2 py-1 text-xs rounded-full ${
//                             logistic.status === "In Transit"
//                               ? "bg-blue-100 text-blue-800"
//                               : logistic.status === "Scheduled"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           {logistic.status}
//                         </span>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-5 rounded-lg shadow">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="font-semibold text-lg">Recent Donors</h3>
//                 <button 
//                   className="text-blue-600 text-sm"
//                   onClick={() => setActiveTab("donors")}
//                 >
//                   View All
//                 </button>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead>
//                     <tr>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Email
//                       </th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Total Donated
//                       </th>
//                       <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Last Donation
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {donors.map((donor) => (
//                       <tr key={donor.id}>
//                         <td className="px-4 py-3 text-sm text-gray-900">
//                           {donor.name}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900">
//                           {donor.email}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900">
//                           ${donor.total.toLocaleString()}
//                         </td>
//                         <td className="px-4 py-3 text-sm text-gray-900">
//                           {donor.lastDonation}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         );
//       case "inventory":
//         return (
//           <div className="bg-white p-5 rounded-lg shadow">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold">Inventory Management</h2>
//               <button 
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
//                 onClick={addInventoryItem}
//               >
//                 <PackagePlus size={18} className="mr-2" /> Add Item
//               </button>
//             </div>

//             <div className="mb-6 flex flex-col md:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search size={18} className="text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search inventory..."
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>

//               <div className="flex gap-2">
//                 <select 
//                   className="border border-gray-300 rounded-lg px-3 py-2"
//                   value={categoryFilter}
//                   onChange={(e) => setCategoryFilter(e.target.value)}
//                 >
//                   <option>All Categories</option>
//                   <option>Food</option>
//                   <option>Water</option>
//                   <option>Medical</option>
//                   <option>Shelter</option>
//                   <option>Hygiene</option>
//                 </select>

//                 <select 
//                   className="border border-gray-300 rounded-lg px-3 py-2"
//                   value={locationFilter}
//                   onChange={(e) => setLocationFilter(e.target.value)}
//                 >
//                   <option>All Locations</option>
//                   <option>Warehouse A</option>
//                   <option>Warehouse B</option>
//                   <option>Storage C</option>
//                 </select>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Item Name
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Category
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Quantity
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Location
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredInventory.map((item) => (
//                     <tr key={item.id}>
//                       <td className="px-4 py-4 text-sm text-gray-900">
//                         {item.name}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-900">
//                         <span
//                           className={`px-2 py-1 text-xs rounded-full ${
//                             item.category === "Food"
//                               ? "bg-green-100 text-green-800"
//                               : item.category === "Medical"
//                               ? "bg-red-100 text-red-800"
//                               : item.category === "Water"
//                               ? "bg-blue-100 text-blue-800"
//                               : item.category === "Shelter"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-purple-100 text-purple-800"
//                           }`}
//                         >
//                           {item.category}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-900">
//                         {item.quantity}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-900">
//                         {item.location}
//                       </td>
//                       <td className="px-4 py-4 text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <button className="text-blue-600 hover:text-blue-900">
//                             Edit
//                           </button>
//                           <button className="text-red-600 hover:text-red-900">
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-4 flex items-center justify-between">
//               <div className="text-sm text-gray-500">
//                 Showing <span className="font-medium">1</span> to{" "}
//                 <span className="font-medium">5</span> of{" "}
//                 <span className="font-medium">5</span> results
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   className="border border-gray-300 rounded-md px-3 py-1 text-sm"
//                   disabled
//                 >
//                   Previous
//                 </button>
//                 <button className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-blue-600 text-white">
//                   1
//                 </button>
//                 <button
//                   className="border border-gray-300 rounded-md px-3 py-1 text-sm"
//                   disabled
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       case "donors":
//         return (
//           <div className="bg-white p-5 rounded-lg shadow">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold">Donor Management</h2>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
//                 <UserPlus size={18} className="mr-2" /> Add Donor
//               </button>
//             </div>

//             <div className="mb-6 flex flex-col md:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search size={18} className="text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search donors..."
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
//                 />
//               </div>

//               <div className="flex gap-2">
//                 <select className="border border-gray-300 rounded-lg px-3 py-2">
//                   <option>All Donors</option>
//                   <option>Individual</option>
//                   <option>Organization</option>
//                   <option>Corporate</option>
//                 </select>

//                 <select className="border border-gray-300 rounded-lg px-3 py-2">
//                   <option>Sort by Name</option>
//                   <option>Sort by Date</option>
//                   <option>Sort by Amount</option>
//                 </select>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Donor Name
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Email
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Total Donations
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Last Donation
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {donors.map((donor) => (
//                     <tr key={donor.id}>
//                       <td className="px-4 py-4 text-sm font-medium text-gray-900">
//                         {donor.name}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-900">
//                         {donor.email}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-900">
//                         ${donor.total.toLocaleString()}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-900">
//                         {donor.lastDonation}
//                       </td>
//                       <td className="px-4 py-4 text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <button className="text-blue-600 hover:text-blue-900">
//                             View
//                           </button>
//                           <button className="text-green-600 hover:text-green-900">
//                             Contact
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-4 flex items-center justify-between">
//               <div className="text-sm text-gray-500">
//                 Showing <span className="font-medium">1</span> to{" "}
//                 <span className="font-medium">4</span> of{" "}
//                 <span className="font-medium">4</span> results
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   className="border border-gray-300 rounded-md px-3 py-1 text-sm"
//                   disabled
//                 >
//                   Previous
//                 </button>
//                 <button className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-blue-600 text-white">
//                   1
//                 </button>
//                 <button
//                   className="border border-gray-300 rounded-md px-3 py-1 text-sm"
//                   disabled
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       case "logistics":
//         return (
//           <div className="bg-white p-5 rounded-lg shadow">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold">Logistics Management</h2>
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
//                 <ListChecks size={18} className="mr-2" /> Create Shipment
//               </button>
//             </div>

//             <div className="mb-6 flex flex-col md:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search size={18} className="text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search logistics..."
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
//                 />
//               </div>

//               <div className="flex gap-2">
//                 <select className="border border-gray-300 rounded-lg px-3 py-2">
//                   <option>All Status</option>
//                   <option>In Transit</option>
//                   <option>Delivered</option>
//                   <option>Scheduled</option>
//                   <option>Pending</option>
//                 </select>

//                 <select className="border border-gray-300 rounded-lg px-3 py-2">
//                   <option>All Dates</option>
//                   <option>Today</option>
//                   <option>This Week</option>
//                   <option>This Month</option>
//                 </select>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Destination
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Items
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {logistics.map((logistic) => (
//                     <tr key={logistic.id}>
//                       <td className="px-4 py-4 text-sm font-medium text-gray-900">
//                         {logistic.destination}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-900">
//                         {logistic.items}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-900">
//                         <span
//                           className={`px-2 py-1 text-xs rounded-full ${
//                             logistic.status === "In Transit"
//                               ? "bg-blue-100 text-blue-800"
//                               : logistic.status === "Delivered"
//                               ? "bg-green-100 text-green-800"
//                               : logistic.status === "Scheduled"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           {logistic.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-900">
//                         {logistic.date}
//                       </td>
//                       <td className="px-4 py-4 text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <button className="text-blue-600 hover:text-blue-900">
//                             Details
//                           </button>
//                           <button className="text-green-600 hover:text-green-900">
//                             Update
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-4 flex items-center justify-between">
//               <div className="text-sm text-gray-500">
//                 Showing <span className="font-medium">1</span> to{" "}
//                 <span className="font-medium">4</span> of{" "}
//                 <span className="font-medium">4</span> results
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   className="border border-gray-300 rounded-md px-3 py-1 text-sm"
//                   disabled
//                 >
//                   Previous
//                 </button>
//                 <button className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-blue-600 text-white">
//                   1
//                 </button>
//                 <button
//                   className="border border-gray-300 rounded-md px-3 py-1 text-sm"
//                   disabled
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       default:
//         return <div>Select a tab to view content</div>;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar - desktop */}
//       <div
//         className={`bg-blue-800 text-white w-64 fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 z-30 ${
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         }`}
//       >
//         <div className="p-5">
//           <div className="flex items-center justify-between">
//             <h1 className="text-xl font-bold">NGO Resource Tracker</h1>
//             <button onClick={toggleSidebar} className="md:hidden">
//               <X size={20} />
//             </button>
//           </div>

//           <div className="mt-8 space-y-2">
//             <button
//               onClick={() => setActiveTab("dashboard")}
//               className={`flex items-center px-4 py-2 w-full rounded-lg ${
//                 activeTab === "dashboard" ? "bg-blue-700" : "hover:bg-blue-700"
//               }`}
//             >
//               <BarChart3 size={20} className="mr-3" />
//               Dashboard
//             </button>

//             <button
//               onClick={() => setActiveTab("inventory")}
//               className={`flex items-center px-4 py-2 w-full rounded-lg ${
//                 activeTab === "inventory" ? "bg-blue-700" : "hover:bg-blue-700"
//               }`}
//             >
//               <Package size={20} className="mr-3" />
//               Inventory
//             </button>

//             <button
//               onClick={() => setActiveTab("donors")}
//               className={`flex items-center px-4 py-2 w-full rounded-lg ${
//                 activeTab === "donors" ? "bg-blue-700" : "hover:bg-blue-700"
//               }`}
//             >
//               <Users size={20} className="mr-3" />
//               Donors
//             </button>

//             <button
//               onClick={() => setActiveTab("logistics")}
//               className={`flex items-center px-4 py-2 w-full rounded-lg ${
//                 activeTab === "logistics" ? "bg-blue-700" : "hover:bg-blue-700"
//               }`}
//             >
//               <Truck size={20} className="mr-3" />
//               Logistics
//             </button>
//           </div>
//         </div>

//         <div className="absolute bottom-0 left-0 right-0 p-5">
//           <button className="flex items-center px-4 py-2 w-full rounded-lg hover:bg-blue-700">
//             <Settings size={20} className="mr-3" />
//             Settings
//           </button>

//           <button className="flex items-center px-4 py-2 w-full rounded-lg hover:bg-blue-700 mt-2">
//             <LogOut size={20} className="mr-3" />
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Mobile menu overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
//           onClick={toggleSidebar}
//         ></div>
//       )}

//       {/* Main content */}
//       <div className={`flex-1 flex flex-col ${sidebarOpen ? "md:ml-64" : ""}`}>
//         {/* Header */}
//         <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
//           <div className="flex items-center">
//             <button onClick={toggleSidebar} className="mr-4 md:hidden">
//               <Menu size={24} />
//             </button>
//             <h2 className="text-lg font-semibold">
//               {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
//             </h2>
//           </div>

//           <div className="flex items-center space-x-4">
//             <button className="relative p-1">
//               <Bell size={20} />
//               <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
//             </button>

//             <div className="flex items-center">
//               <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
//                 UN
//               </div>
//               <span className="ml-2 text-sm font-medium hidden md:block">
//                 User Name
//               </span>
//             </div>
//           </div>
//         </header>

//         {/* Main content area */}
//         <main className="flex-1 overflow-y-auto p-5">{renderContent()}</main>
//       </div>
//     </div>
//   );
// }

// export default Home;