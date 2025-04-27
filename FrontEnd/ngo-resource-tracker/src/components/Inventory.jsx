import React, { useState, useEffect } from "react";
import { Search, PackagePlus, Edit, Trash2, AlertCircle } from "lucide-react";

function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch inventory data from backend
  const fetchInventory = async () => {
    try {
      setLoading(true);
      
      // Build query params for filtering
      const params = new URLSearchParams();
      if (categoryFilter !== "All Categories") params.append("category", categoryFilter);
      if (locationFilter !== "All Locations") params.append("location", locationFilter);
      if (searchQuery) params.append("search", searchQuery);
      
      const response = await fetch(`/api/inventory?${params.toString()}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setInventory(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to load inventory data");
      setLoading(false);
    }
  };

  // Call the API when filters change
  useEffect(() => {
    fetchInventory();
  }, [searchQuery, categoryFilter, locationFilter]);

  // Add new inventory item
  const addInventoryItem = () => {
    // Navigate to add item form or open modal
    window.location.href = "/inventory/add";
  };

  // Edit inventory item
  const editInventoryItem = (id) => {
    // Navigate to edit item form or open modal
    window.location.href = `/inventory/edit/${id}`;
  };

  // Delete inventory item - confirmation
  const confirmDeleteItem = (id) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  // Delete inventory item - execution
  const deleteInventoryItem = async () => {
    if (!itemToDelete) return;
    
    try {
      const response = await fetch(`/api/inventory/${itemToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
      }
      
      // Refresh inventory list after deletion
      fetchInventory();
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Error deleting item:", err);
      setError(`Failed to delete item: ${err.message}`);
    }
  };

  // Cancel deletion
  const cancelDeleteItem = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  // Handle search input changes with debounce
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading && inventory.length === 0) {
    return (
      <div className="bg-white p-5 rounded-lg shadow flex justify-center items-center h-64">
        <div className="text-gray-500">Loading inventory data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Inventory Management</h2>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={addInventoryItem}
        >
          <PackagePlus size={18} className="mr-2" /> Add Item
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
          <button 
            className="ml-auto text-red-700" 
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search inventory..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex gap-2">
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option>All Categories</option>
            <option>Food</option>
            <option>Water</option>
            <option>Medical</option>
            <option>Shelter</option>
            <option>Hygiene</option>
          </select>

          <select 
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option>All Locations</option>
            <option>Warehouse A</option>
            <option>Warehouse B</option>
            <option>Storage C</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  No inventory items found. Try adjusting your filters or add a new item.
                </td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {item.name}
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                        {item.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.category === "Food"
                          ? "bg-green-100 text-green-800"
                          : item.category === "Medical"
                          ? "bg-red-100 text-red-800"
                          : item.category === "Water"
                          ? "bg-blue-100 text-blue-800"
                          : item.category === "Shelter"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {item.quantity} {item.unit || "units"}
                    {item.expiryDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Expires: {new Date(item.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {item.location}
                    {item.batchNumber && (
                      <p className="text-xs text-gray-500 mt-1">
                        Batch: {item.batchNumber}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                        onClick={() => editInventoryItem(item._id)}
                      >
                        <Edit size={16} className="mr-1" /> Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 flex items-center"
                        onClick={() => confirmDeleteItem(item._id)}
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {inventory.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{inventory.length}</span> of{" "}
            <span className="font-medium">{inventory.length}</span> results
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
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-3">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this inventory item? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg"
                onClick={cancelDeleteItem}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={deleteInventoryItem}
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventoryManagement;