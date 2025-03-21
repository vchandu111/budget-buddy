import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PieChart,
  Settings,
} from "lucide-react";

// Import pages
import Overview from "../Pages/Overview";
import Income from "../Pages/Income";
import Expense from "../Pages/Expense";
import Analytics from "../Pages/Analytics";
import SettingsPage from "../Pages/Settings";

const Dashboard = () => {
  const { user } = useUser();
  const location = useLocation();

  const menuItems = [
    { id: "", icon: LayoutDashboard, label: "Overview" },
    { id: "income", icon: Wallet, label: "Income" },
    { id: "expense", icon: Receipt, label: "Expense" },
    { id: "analytics", icon: PieChart, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-72 bg-white shadow-lg border-r border-gray-100">
        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center overflow-hidden shadow-md border-2 border-indigo-100">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user?.firstName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <img
                src="/boy-with-laptop.png"
                alt="avatar"
                className="w-16 h-16 object-contain"
              />
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            {user?.firstName || "User"}
          </h2>
          <p className="text-gray-500 text-sm text-center mt-1">
            {user?.emailAddresses?.[0]?.emailAddress || ""}
          </p>
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={`/app/${item.id}`}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  location.pathname === `/app/${item.id}`
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-indigo-50"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    location.pathname === `/app/${item.id}`
                      ? "text-white"
                      : "text-indigo-500"
                  }`}
                />
                <span className="ml-3 font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-10">
        <div className="flex justify-around items-center py-3">
          {menuItems.slice(0, 4).map((item) => (
            <Link
              key={item.id}
              to={`/app/${item.id}`}
              className={`p-2 rounded-lg flex flex-col items-center ${
                location.pathname === `/app/${item.id}`
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-indigo-500"
              }`}
            >
              <item.icon
                className={`w-6 h-6 ${
                  location.pathname === `/app/${item.id}`
                    ? "text-indigo-600"
                    : ""
                }`}
              />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
