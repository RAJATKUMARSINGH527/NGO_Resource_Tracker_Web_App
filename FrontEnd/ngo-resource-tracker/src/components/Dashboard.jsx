import { Package, Users, Truck } from "lucide-react";

function Dashboard({ 
  totalInventoryItems, 
  activeDonorsCount, 
  pendingLogistics,
  inventoryItems, 
  logistics, 
  donors, 
  setActiveTab 
}) {
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
                {inventoryItems.slice(0, 4).map((item) => (
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
            {logistics
              .filter((l) => l.status !== "Delivered")
              .map((logistic) => (
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