import { useState, useEffect } from "react";
import {
  Save,
  User,
  Building,
  Bell,
  Shield,
  Lock,
  Users,
  Globe,
  Mail,
  Key,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

function Settings() {
  // User profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    organization: "",
    phone: "",
    avatar: null,
  });

  // Organization settings state
  const [orgSettings, setOrgSettings] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    logo: null,
  });

  // Notification preferences state
  const [notifPrefs, setNotifPrefs] = useState({
    emailNotifications: true,
    inventoryAlerts: true,
    donationAlerts: true,
    shippingUpdates: true,
    systemAlerts: true,
    dailyDigest: false,
  });

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    lowStockThreshold: 10,
    allowUserInvites: true,
    dataRetentionDays: 90,
    twoFactorAuth: false,
    requirePasswordReset: 90,
  });

  // Users management state (for admin view)
  const [users, setUsers] = useState([]);

  // Access control state
  const [userRoles, setUserRoles] = useState([
    { id: 1, name: "Admin", permissions: ["all"] },
    { id: 2, name: "Manager", permissions: ["read", "write"] },
    { id: 3, name: "Staff", permissions: ["read"] },
  ]);

  // UI state
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user data and settings on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

        if (!token) {
          setLoading(false);
          return;
        }

        // Set user profile from local storage initially
        setProfile({
          name: userInfo.name || "",
          email: userInfo.email || "",
          role: userInfo.role || "",
          organization: userInfo.organization || "",
          phone: userInfo.phone || "",
          avatar: null,
        });

        // Check if user is admin
        setIsAdmin(userInfo.role === "admin");

        // Fetch actual user profile data
        const profileResponse = await fetch("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ ok: false }));

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile((prev) => ({
            ...prev,
            ...profileData,
          }));
        }

        // If admin, fetch organization settings
        if (userInfo.role === "admin") {
          const orgResponse = await fetch("/api/organizations", {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ ok: false }));

          if (orgResponse.ok) {
            const orgData = await orgResponse.json();
            setOrgSettings(orgData);
          }

          // Fetch users list for admin
          const usersResponse = await fetch("/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ ok: false }));

          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            setUsers(usersData);
          } else {
            // Use dummy data if API fails
            setUsers([
              {
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                role: "Admin",
                status: "Active",
              },
              {
                id: 2,
                name: "Jane Smith",
                email: "jane@example.com",
                role: "Manager",
                status: "Active",
              },
              {
                id: 3,
                name: "Bob Johnson",
                email: "bob@example.com",
                role: "Staff",
                status: "Inactive",
              },
            ]);
          }
        }

        // Fetch notification preferences
        const notifResponse = await fetch("/api/notifications/preferences", {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ ok: false }));

        if (notifResponse.ok) {
          const notifData = await notifResponse.json();
          setNotifPrefs(notifData);
        }

        // Fetch system settings (admin only)
        if (userInfo.role === "admin") {
          const systemResponse = await fetch("/api/system/settings", {
            headers: { Authorization: `Bearer ${token}` },
          }).catch(() => ({ ok: false }));

          if (systemResponse.ok) {
            const systemData = await systemResponse.json();
            setSystemSettings(systemData);
          }
        }
      } catch (error) {
        console.error("Error fetching settings data:", error);
        setMessage({
          type: "error",
          text: "Failed to load settings. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile image upload
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        avatar: file,
      }));
    }
  };

  // Handle organization settings changes
  const handleOrgChange = (e) => {
    const { name, value } = e.target;
    setOrgSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle organization logo upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOrgSettings((prev) => ({
        ...prev,
        logo: file,
      }));
    }
  };

  // Handle notification preferences changes
  const handleNotifChange = (e) => {
    const { name, checked } = e.target;
    setNotifPrefs((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle system settings changes
  const handleSystemChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSystemSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle saving settings
  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage({ type: "error", text: "Authentication required" });
        setSaving(false);
        return;
      }

      // Save profile settings
      if (activeTab === "profile") {
        const formData = new FormData();
        Object.entries(profile).forEach(([key, value]) => {
          if (value !== null) formData.append(key, value);
        });

        const response = await fetch("/api/users/profile", {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }).catch(() => ({ ok: false }));

        if (response.ok) {
          // Update local storage with new user data
          const updatedUser = {
            ...JSON.parse(localStorage.getItem("userInfo") || "{}"),
            name: profile.name,
            email: profile.email,
          };
          localStorage.setItem("userInfo", JSON.stringify(updatedUser));

          setMessage({ type: "success", text: "Profile updated successfully" });
        } else {
          setMessage({ type: "error", text: "Failed to update profile" });
        }
      }

      // Save organization settings
      else if (activeTab === "organization") {
        const formData = new FormData();
        Object.entries(orgSettings).forEach(([key, value]) => {
          if (value !== null) formData.append(key, value);
        });

        const response = await fetch("/api/organizations", {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }).catch(() => ({ ok: false }));

        if (response.ok) {
          setMessage({
            type: "success",
            text: "Organization settings updated successfully",
          });
        } else {
          setMessage({
            type: "error",
            text: "Failed to update organization settings",
          });
        }
      }

      // Save notification preferences
      else if (activeTab === "notifications") {
        const response = await fetch("/api/notifications/preferences", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notifPrefs),
        }).catch(() => ({ ok: false }));

        if (response.ok) {
          setMessage({
            type: "success",
            text: "Notification preferences updated successfully",
          });
        } else {
          setMessage({
            type: "error",
            text: "Failed to update notification preferences",
          });
        }
      }

      // Save system settings
      else if (activeTab === "system") {
        const response = await fetch("/api/system/settings", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(systemSettings),
        }).catch(() => ({ ok: false }));

        if (response.ok) {
          setMessage({
            type: "success",
            text: "System settings updated successfully",
          });
        } else {
          setMessage({
            type: "error",
            text: "Failed to update system settings",
          });
        }
      }

      // After 3 seconds, clear the message
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage({
        type: "error",
        text: "An error occurred while saving settings",
      });
    } finally {
      setSaving(false);
    }
  };

  // Render tab navigation
  const renderTabNav = () => {
    const tabs = [
      { id: "profile", label: "Profile", icon: <User size={18} /> },
      { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    ];

    // Add admin-only tabs
    if (isAdmin) {
      tabs.push(
        {
          id: "organization",
          label: "Organization",
          icon: <Building size={18} />,
        },
        { id: "users", label: "Users", icon: <Users size={18} /> },
        {
          id: "roles",
          label: "Roles & Permissions",
          icon: <Shield size={18} />,
        },
        { id: "system", label: "System", icon: <Globe size={18} /> }
      );
    }

    return (
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="flex flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 flex items-center justify-center overflow-hidden">
                    {profile.avatar ? (
                      <img
                        src={URL.createObjectURL(profile.avatar)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-gray-400">
                        {profile.name?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                  <label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700">
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageChange}
                    />
                  </label>
                </div>
              </div>

              <div className="md:w-2/3 md:pl-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={profile.role}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "organization":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">
              Organization Settings
            </h2>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {orgSettings.logo ? (
                      <img
                        src={URL.createObjectURL(orgSettings.logo)}
                        alt="Organization Logo"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building size={64} className="text-gray-400" />
                    )}
                  </div>
                  <label className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700">
                    Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
              </div>

              <div className="md:w-2/3 md:pl-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={orgSettings.name}
                      onChange={handleOrgChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={orgSettings.email}
                      onChange={handleOrgChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={orgSettings.phone}
                      onChange={handleOrgChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={orgSettings.website}
                      onChange={handleOrgChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={orgSettings.address}
                      onChange={handleOrgChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={orgSettings.description}
                      onChange={handleOrgChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">
              Notification Preferences
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500">
                    Receive notifications via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={notifPrefs.emailNotifications}
                    onChange={handleNotifChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer texture-center peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Inventory Alerts</h3>
                  <p className="text-sm text-gray-500">
                    Receive notifications about low stock items
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="inventoryAlerts"
                    checked={notifPrefs.inventoryAlerts}
                    onChange={handleNotifChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer texture-center peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Donation Alerts</h3>
                  <p className="text-sm text-gray-500">
                    Receive notifications about new donations
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="donationAlerts"
                    checked={notifPrefs.donationAlerts}
                    onChange={handleNotifChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer texture-center peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Shipping Updates</h3>
                  <p className="text-sm text-gray-500">
                    Receive notifications about shipment status changes
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="shippingUpdates"
                    checked={notifPrefs.shippingUpdates}
                    onChange={handleNotifChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer texture-center peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">System Alerts</h3>
                  <p className="text-sm text-gray-500">
                    Receive notifications about system updates and maintenance
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="systemAlerts"
                    checked={notifPrefs.systemAlerts}
                    onChange={handleNotifChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer texture-center peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">Daily Digest</h3>
                  <p className="text-sm text-gray-500">
                    Receive a daily summary of all notifications
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="dailyDigest"
                    checked={notifPrefs.dailyDigest}
                    onChange={handleNotifChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer texture-center peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">User Management</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Invite User
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    ></th>
                    Role
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-500">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          {user.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "roles":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Roles & Permissions</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Add New Role
              </button>
            </div>

            <div className="space-y-6">
              {userRoles.map((role) => (
                <div
                  key={role.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium">{role.name}</h3>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        Edit
                      </button>
                      {role.name !== "Admin" && (
                        <button className="text-red-600 hover:text-red-800">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="font-medium mb-4">Permissions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`create-${role.id}`}
                          checked={
                            role.permissions.includes("all") ||
                            role.permissions.includes("create")
                          }
                          disabled={role.name === "Admin"}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`create-${role.id}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          Create Records
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`read-${role.id}`}
                          checked={
                            role.permissions.includes("all") ||
                            role.permissions.includes("read")
                          }
                          disabled={role.name === "Admin"}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`read-${role.id}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          View Records
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`update-${role.id}`}
                          checked={
                            role.permissions.includes("all") ||
                            role.permissions.includes("write")
                          }
                          disabled={role.name === "Admin"}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`update-${role.id}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          Update Records
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`delete-${role.id}`}
                          checked={
                            role.permissions.includes("all") ||
                            role.permissions.includes("delete")
                          }
                          disabled={role.name === "Admin"}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`delete-${role.id}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          Delete Records
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`export-${role.id}`}
                          checked={
                            role.permissions.includes("all") ||
                            role.permissions.includes("export")
                          }
                          disabled={role.name === "Admin"}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`export-${role.id}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          Export Data
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`admin-${role.id}`}
                          checked={
                            role.permissions.includes("all") ||
                            role.permissions.includes("admin")
                          }
                          disabled={role.name === "Admin"}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`admin-${role.id}`}
                          className="ml-2 text-sm text-gray-700"
                        >
                          Admin Access
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "system":
        return (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">System Settings</h2>

            <div className="space-y-6">
              <div className="border-b pb-6">
                <h3 className="text-lg font-medium mb-4">
                  Inventory Management
                </h3>
                <div className="flex items-center">
                  <div className="w-64">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      name="lowStockThreshold"
                      value={systemSettings.lowStockThreshold}
                      onChange={handleSystemChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="ml-4 text-sm text-gray-500">
                    Items with stock below this threshold will trigger low stock
                    alerts
                  </p>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-medium mb-4">Security</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">
                        Require two-factor authentication for all users
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="twoFactorAuth"
                        checked={systemSettings.twoFactorAuth}
                        onChange={handleSystemChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <div className="w-64">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password Reset Period (days)
                      </label>
                      <input
                        type="number"
                        name="requirePasswordReset"
                        value={systemSettings.requirePasswordReset}
                        onChange={handleSystemChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="ml-4 text-sm text-gray-500">
                      Number of days after which users will be required to reset
                      their password (0 to disable)
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b pb-6">
                <h3 className="text-lg font-medium mb-4">Data Management</h3>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-64">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Retention Period (days)
                      </label>
                      <input
                        type="number"
                        name="dataRetentionDays"
                        value={systemSettings.dataRetentionDays}
                        onChange={handleSystemChange}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="ml-4 text-sm text-gray-500">
                      Archived data older than this will be automatically purged
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">User Registration</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Allow User Invitations</h4>
                    <p className="text-sm text-gray-500">
                      Allow users with appropriate permissions to invite new
                      users
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="allowUserInvites"
                      checked={systemSettings.allowUserInvites}
                      onChange={handleSystemChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render status message
  const renderMessage = () => {
    if (!message.text) return null;

    return (
      <div
        className={`fixed bottom-4 right-4 px-4 py-3 rounded-md flex items-center ${
          message.type === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {message.type === "success" ? (
          <CheckCircle2 size={20} className="mr-2" />
        ) : (
          <AlertTriangle size={20} className="mr-2" />
        )}
        {message.text}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">
          Manage your account and application settings
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {renderTabNav()}

          {renderContent()}

          {activeTab !== "users" && activeTab !== "roles" && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center px-6 py-3 ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white rounded-md`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {renderMessage()}
    </div>
  );
}

export default Settings;
