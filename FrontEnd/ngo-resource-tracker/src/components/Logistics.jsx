import { useState, useEffect } from "react";
import { Search, ListChecks, Truck, AlertCircle } from "lucide-react";

function LogisticsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [logisticsStatusFilter, setLogisticsStatusFilter] = useState("All Status");
  const [logisticsDateFilter, setLogisticsDateFilter] = useState("All Dates");
  const [logistics, setLogistics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logistics data
  useEffect(() => {
    const fetchLogistics = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        
        if (logisticsStatusFilter !== "All Status") {
          params.append("status", logisticsStatusFilter);
        }
        
        if (logisticsDateFilter !== "All Dates") {
          params.append("date", logisticsDateFilter);
        }
        
        if (searchQuery.trim()) {
          params.append("search", searchQuery);
        }
        
        const url = `http://localhost:8000/logistics${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setLogistics(data);
      } catch (error) {
        console.error("Error fetching logistics data:", error);
        setError("Failed to load logistics data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogistics();
  }, [searchQuery, logisticsStatusFilter, logisticsDateFilter]);

  // Function to format items from the API response
  const formatItems = (items) => {
    if (!items || items.length === 0) return "No items";
    return items.map(item => 
      item.item && item.item.name ? `${item.item.name} (${item.quantity})` : "Unknown Item"
    ).join(", ");
  };

  // Function to format the date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // View logistics details
  const viewLogisticsDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/logistics/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const shipment = await response.json();
      
      // For simplicity, we'll use an alert to show details
      // In a real app, you might want to use a modal or a separate page
      alert(`
        Shipment ID: ${shipment.shipmentId}
        Destination: ${shipment.destination.name}
        Address: ${shipment.destination.address}
        Items: ${formatItems(shipment.items)}
        Status: ${shipment.status}
        Scheduled Date: ${formatDate(shipment.scheduledDate)}
        Transport Method: ${shipment.transportMethod}
        Carrier: ${shipment.carrier || 'N/A'}
        Notes: ${shipment.notes || 'N/A'}
      `);
    } catch (error) {
      console.error("Error fetching shipment details:", error);
      alert("Failed to load shipment details.");
    }
  };

  // Update logistics status
  const updateLogisticsStatus = async (id) => {
    const statusOptions = ["Pending", "Scheduled", "In Transit", "Delivered", "Cancelled"];
    const logistic = logistics.find(logistic => logistic._id === id);
    
    if (!logistic) return;
    
    const currentIndex = statusOptions.indexOf(logistic.status);
    let newStatus = prompt(
      `Update status (${statusOptions.join(", ")})`,
      statusOptions[(currentIndex + 1) % statusOptions.length]
    );
    
    if (!newStatus || !statusOptions.includes(newStatus)) {
      alert("Invalid status. Status not updated.");
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8000/logistics/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const updatedShipment = await response.json();
      
      // Update the shipment in the state
      setLogistics(logistics.map(item => 
        item._id === id ? updatedShipment : item
      ));
      
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating logistics status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  // Create new shipment
  const createShipment = async () => {
    // For simplicity using prompts, in a real app you'd use a form modal
    const destination = {
      name: prompt("Enter destination name:"),
      address: prompt("Enter destination address:")
    };
    
    const itemCount = parseInt(prompt("How many items to ship?", "1"));
    const items = [];
    
    for (let i = 0; i < itemCount; i++) {
      const itemId = prompt(`Enter item #${i+1} ID:`);
      const quantity = parseInt(prompt(`Enter quantity for item #${i+1}:`, "1"));
      
      if (itemId && !isNaN(quantity) && quantity > 0) {
        items.push({
          item: itemId,
          quantity
        });
      }
    }
    
    const scheduledDate = prompt("Enter scheduled date (YYYY-MM-DD):", 
      new Date().toISOString().split('T')[0]);
    const transportMethod = prompt("Enter transport method (Road, Air, Sea):", "Road");
    const carrier = prompt("Enter carrier (optional):");
    const notes = prompt("Enter notes (optional):");
    
    if (!destination.name || !destination.address || items.length === 0) {
      alert("Invalid input. Shipment not created.");
      return;
    }
    
    const newShipment = {
      destination,
      items,
      scheduledDate,
      transportMethod,
      carrier,
      notes
    };
    
    try {
      const response = await fetch("http://localhost:8000/logistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newShipment),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Refresh the list to show the new shipment
      setLogistics([data, ...logistics]);
      alert("Shipment created successfully!");
    } catch (error) {
      console.error("Error creating shipment:", error);
      alert("Failed to create shipment. Please try again.");
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-white p-5 rounded-lg shadow">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-white p-5 rounded-lg shadow">
        <div className="text-red-500 flex items-center">
          <AlertCircle size={24} className="mr-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Logistics Management</h2>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={createShipment}
        >
          <ListChecks size={18} className="mr-2" /> Create Shipment
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search logistics..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={logisticsStatusFilter}
            onChange={(e) => setLogisticsStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Pending</option>
            <option>Scheduled</option>
            <option>In Transit</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>

          <select 
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={logisticsDateFilter}
            onChange={(e) => setLogisticsDateFilter(e.target.value)}
          >
            <option>All Dates</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Shipment ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scheduled Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logistics.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-sm text-center text-gray-500">
                  No shipments found
                </td>
              </tr>
            ) : (
              logistics.map((logistic) => (
                <tr key={logistic._id}>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {logistic.shipmentId}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {logistic.destination && logistic.destination.name}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {formatItems(logistic.items)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        logistic.status === "In Transit"
                          ? "bg-blue-100 text-blue-800"
                          : logistic.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : logistic.status === "Scheduled"
                          ? "bg-yellow-100 text-yellow-800"
                          : logistic.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {logistic.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {formatDate(logistic.scheduledDate)}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => viewLogisticsDetails(logistic._id)}
                      >
                        Details
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        onClick={() => updateLogisticsStatus(logistic._id)}
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">{logistics.length}</span> of{" "}
          <span className="font-medium">{logistics.length}</span> results
        </div>
        <div className="flex space-x-2">
          <button
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            disabled
          >
            Previous
          </button>
          <button className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-blue-600 text-white">
            1
          </button>
          <button
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogisticsManagement;