import React, { useState, useEffect } from "react";
import { Search, UserPlus, X, Mail } from "lucide-react";

function DonorManagement() {
  const [donors, setDonors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [donorTypeFilter, setDonorTypeFilter] = useState("All Donors");
  const [donorSortBy, setDonorSortBy] = useState("Sort by Name");
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [currentDonor, setCurrentDonor] = useState(null);
  const [newDonor, setNewDonor] = useState({
    name: "",
    email: "",
    type: "Individual",
    total: 0,
    lastDonation: "",
    phone: "",
    address: "",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // API endpoints
  const API_URL = "/api/donors";

  // Fetch donors when filters change
  useEffect(() => {
    fetchDonors();
  }, [donorTypeFilter, donorSortBy]);

  // Fetch donors from API
  const fetchDonors = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (donorTypeFilter !== "All Donors") {
        queryParams.append("type", donorTypeFilter);
      }
      
      if (searchQuery.trim()) {
        queryParams.append("search", searchQuery);
      }
      
      if (donorSortBy) {
        queryParams.append("sort", donorSortBy);
      }
      
      const queryString = queryParams.toString();
      const url = queryString ? `${API_URL}?${queryString}` : API_URL;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Map backend data structure to match the frontend structure
      const mappedDonors = data.map(donor => ({
        id: donor._id,
        name: donor.name,
        email: donor.email,
        type: donor.type,
        total: donor.totalDonated || 0,
        lastDonation: donor.donations && donor.donations.length > 0 
          ? donor.donations[donor.donations.length - 1].date.split('T')[0] 
          : '',
        phone: donor.phone || '',
        address: donor.address || '',
        notes: donor.notes || '',
        donations: donor.donations || []
      }));
      
      setDonors(mappedDonors);
      setError(null);
    } catch (err) {
      console.error("Error fetching donors:", err);
      setError("Failed to load donors. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Search donors when search query changes
  const handleSearch = () => {
    fetchDonors();
  };

  // Add new donor
  const addDonor = () => {
    setCurrentDonor(null);
    setNewDonor({
      name: "",
      email: "",
      type: "Individual",
      phone: "",
      address: "",
      notes: "",
      donations: []
    });
    setShowDonorModal(true);
  };

  // View donor details
  const viewDonorDetails = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const donor = await response.json();
      
      // Map backend data to frontend structure
      setCurrentDonor({
        id: donor._id,
        name: donor.name,
        email: donor.email,
        type: donor.type,
        total: donor.totalDonated || 0,
        lastDonation: donor.donations && donor.donations.length > 0 
          ? donor.donations[donor.donations.length - 1].date.split('T')[0] 
          : '',
        phone: donor.phone || '',
        address: donor.address || '',
        notes: donor.notes || '',
        donations: donor.donations || []
      });
      
      setShowDonorModal(true);
    } catch (err) {
      console.error("Error fetching donor details:", err);
      alert("Failed to load donor details. Please try again.");
    }
  };

  // Contact donor
  const contactDonor = (id) => {
    const donor = donors.find(d => d.id === id);
    setCurrentDonor(donor);
    setShowContactModal(true);
  };

  // Save donor (create or update)
  const handleSaveDonor = async () => {
    try {
      let response;
      let donorData = {
        name: currentDonor ? currentDonor.name : newDonor.name,
        email: currentDonor ? currentDonor.email : newDonor.email,
        type: currentDonor ? currentDonor.type : newDonor.type,
        phone: currentDonor ? currentDonor.phone : newDonor.phone,
        address: currentDonor ? currentDonor.address : newDonor.address,
        notes: currentDonor ? currentDonor.notes : newDonor.notes
      };
      
      if (currentDonor) {
        // Update existing donor
        response = await fetch(`${API_URL}/${currentDonor.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(donorData)
        });
      } else {
        // Create new donor
        response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(donorData)
        });
      }
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Refresh donors list
      fetchDonors();
      setShowDonorModal(false);
    } catch (err) {
      console.error("Error saving donor:", err);
      alert("Failed to save donor. Please try again.");
    }
  };

  // Add donation to donor
  const handleAddDonation = async (donorId, donationData) => {
    try {
      const response = await fetch(`${API_URL}/${donorId}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(donationData)
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Refresh donors list
      fetchDonors();
    } catch (err) {
      console.error("Error adding donation:", err);
      alert("Failed to add donation. Please try again.");
    }
  };

  // Delete donor
  const handleDeleteDonor = async (id) => {
    if (window.confirm("Are you sure you want to delete this donor?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        // Refresh donors list
        fetchDonors();
        setShowDonorModal(false);
      } catch (err) {
        console.error("Error deleting donor:", err);
        alert("Failed to delete donor. Please try again.");
      }
    }
  };

  // Handle input changes in forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (currentDonor) {
      setCurrentDonor({
        ...currentDonor,
        [name]: name === "total" ? parseFloat(value) || 0 : value
      });
    } else {
      setNewDonor({
        ...newDonor,
        [name]: name === "total" ? parseFloat(value) || 0 : value
      });
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Donor Management</h2>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={addDonor}
        >
          <UserPlus size={18} className="mr-2" /> Add Donor
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search donors..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="flex gap-2">
          <select 
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={donorTypeFilter}
            onChange={(e) => setDonorTypeFilter(e.target.value)}
          >
            <option>All Donors</option>
            <option>Individual</option>
            <option>Organization</option>
            <option>Corporate</option>
          </select>

          <select 
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={donorSortBy}
            onChange={(e) => setDonorSortBy(e.target.value)}
          >
            <option>Sort by Name</option>
            <option>Sort by Date</option>
            <option>Sort by Amount</option>
          </select>
          
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading donors...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Donations
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Donation
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donors.length > 0 ? (
                donors.map((donor) => (
                  <tr key={donor.id}>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {donor.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {donor.email}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {donor.type}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      ${donor.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {donor.lastDonation || 'N/A'}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => viewDonorDetails(donor.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900"
                          onClick={() => contactDonor(donor.id)}
                        >
                          Contact
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-sm text-center text-gray-500">
                    No donors found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">{donors.length}</span> of{" "}
          <span className="font-medium">{donors.length}</span> results
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

      {/* Donor Modal */}
      {showDonorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                  {currentDonor ? "Edit Donor" : "Add New Donor"}
                </h3>
                <button 
                  onClick={() => setShowDonorModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={currentDonor ? currentDonor.name : newDonor.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={currentDonor ? currentDonor.email : newDonor.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={currentDonor ? currentDonor.phone : newDonor.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donor Type
                  </label>
                  <select
                    name="type"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={currentDonor ? currentDonor.type : newDonor.type}
                    onChange={handleInputChange}
                  >
                    <option>Individual</option>
                    <option>Organization</option>
                    <option>Corporate</option>
                  </select>
                </div>
                {currentDonor && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Donations
                    </label>
                    <input
                      type="text"
                      name="total"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                      value={`$${currentDonor.total.toLocaleString()}`}
                      disabled
                    />
                  </div>
                )}
                {currentDonor && currentDonor.lastDonation && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Donation Date
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                      value={currentDonor.lastDonation}
                      disabled
                    />
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={currentDonor ? currentDonor.address : newDonor.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={currentDonor ? currentDonor.notes : newDonor.notes}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Donation History Section (only for existing donors) */}
                {currentDonor && currentDonor.donations && currentDonor.donations.length > 0 && (
                  <div className="md:col-span-2 mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Donation History</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Amount</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Description</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentDonor.donations.map((donation, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {new Date(donation.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                ${donation.amount.toLocaleString()} {donation.currency}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {donation.type}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {donation.description || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Donation Button (only for existing donors) */}
              {currentDonor && (
                <div className="mb-4">
                  <button
                    onClick={() => {
                      const amount = prompt("Enter donation amount:");
                      const description = prompt("Enter donation description (optional):");
                      
                      if (amount && !isNaN(parseFloat(amount))) {
                        handleAddDonation(currentDonor.id, {
                          amount: parseFloat(amount),
                          date: new Date().toISOString(),
                          type: "Cash",
                          description: description || ""
                        });
                      }
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Add Donation
                  </button>
                </div>
              )}

              <div className="flex justify-between">
                <div>
                  {currentDonor && (
                    <button
                      onClick={() => handleDeleteDonor(currentDonor.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDonorModal(false)}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDonor}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    {currentDonor ? "Update" : "Add"} Donor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && currentDonor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Contact {currentDonor.name}</h3>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={16} />
                  <span>{currentDonor.email}</span>
                </div>
                {currentDonor.phone && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">Phone:</span>
                    <span>{currentDonor.phone}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter email subject"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter your message"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowContactModal(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`Email would be sent to ${currentDonor.name} at ${currentDonor.email}`);
                    setShowContactModal(false);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Mail size={16} className="mr-2" />
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonorManagement;