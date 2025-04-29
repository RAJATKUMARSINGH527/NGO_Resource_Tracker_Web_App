import { Package, Users, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

// This component uses hardcoded data to ensure it works regardless of API availability
function Dashboard({ setActiveTab }) {
  const navigate = useNavigate();
  
  // Hardcoded data for demonstration
  const totalInventoryItems = 1248;
  const activeDonorsCount = 86;
  const pendingLogistics = 12;
  
  const inventoryItems = [
    { id: 1, name: "First Aid Kits", quantity: 245, location: "Warehouse A" },
    { id: 2, name: "Blankets", quantity: 500, location: "Warehouse B" },
    { id: 3, name: "Water (1L bottles)", quantity: 2000, location: "Warehouse A" },
    { id: 4, name: "Non-perishable Food", quantity: 1500, location: "Warehouse C" }
  ];
  
  const logistics = [
    { id: 1, destination: "Shelter #12", items: "200 Blankets", date: "2025-05-01", status: "Scheduled" },
    { id: 2, destination: "Medical Center", items: "100 First Aid Kits", date: "2025-04-30", status: "In Transit" },
    { id: 3, destination: "Community Center", items: "500 Water Bottles", date: "2025-05-02", status: "Scheduled" },
    { id: 4, destination: "School", items: "300 Food Packages", date: "2025-04-28", status: "Pending" }
  ];
  
  const donors = [
    { id: 1, name: "John Smith", email: "john@example.com", total: 5000, lastDonation: "2025-04-15" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", total: 12000, lastDonation: "2025-04-20" },
    { id: 3, name: "Community Foundation", email: "info@commfoundation.org", total: 25000, lastDonation: "2025-04-10" },
    { id: 4, name: "Local Business Group", email: "contact@lbg.org", total: 8500, lastDonation: "2025-04-25" }
  ];

  // Handle navigation (two methods provided for compatibility)
  const handleNavigation = (tab, path) => {
    // Method 1: React Router navigation (if set up)
    if (navigate) {
      setActiveTab(tab);
      navigate(path);
    } 
    // Method 2: Fallback for direct tab switching without router
    else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Package size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Inventory
              </p>
              <p className="text-2xl font-semibold">{totalInventoryItems.toLocaleString()} items</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Donors
              </p>
              <p className="text-2xl font-semibold">{activeDonorsCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Truck size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Logistics
              </p>
              <p className="text-2xl font-semibold">{pendingLogistics} pending</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Recent Inventory</h3>
            <button 
              className="text-blue-600 text-sm"
              onClick={() => setActiveTab("inventory")}
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inventoryItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Upcoming Logistics</h3>
            <button 
              className="text-blue-600 text-sm"
              onClick={() => setActiveTab("logistics")}
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {logistics.map((logistic) => (
              <div
                key={logistic.id}
                className="flex items-center p-3 border border-gray-200 rounded-lg"
              >
                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                  <Truck size={18} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {logistic.destination}
                  </p>
                  <p className="text-xs text-gray-500">
                    {logistic.items} - {logistic.date}
                  </p>
                </div>
                <span
                  className={`ml-auto px-2 py-1 text-xs rounded-full ${
                    logistic.status === "In Transit"
                      ? "bg-blue-100 text-blue-800"
                      : logistic.status === "Scheduled"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {logistic.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Recent Donors</h3>
          <button 
            className="text-blue-600 text-sm"
            onClick={() => setActiveTab("donors")}
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Donated
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Donation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {donors.map((donor) => (
                <tr key={donor.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {donor.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {donor.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    ${donor.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {donor.lastDonation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;