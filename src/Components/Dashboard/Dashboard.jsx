import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PieChart,
  Settings,
  LogOut,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useUser();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 18) return "Good Afternoon";
      return "Good Evening";
    };
    setGreeting(getGreeting());
  }, []);

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
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
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeItem === item.id
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-indigo-50"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    activeItem === item.id ? "text-white" : "text-indigo-500"
                  }`}
                />
                <span className="ml-3 font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <div className=" pt-6 border-t border-gray-100 mt-8">
            <button className="w-full flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 transition-all duration-200">
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-10">
        <div className="flex justify-around items-center py-3">
          {menuItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`p-2 rounded-lg flex flex-col items-center ${
                activeItem === item.id
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-indigo-500"
              }`}
            >
              <item.icon
                className={`w-6 h-6 ${
                  activeItem === item.id ? "text-indigo-600" : ""
                }`}
              />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              {greeting}, {user?.firstName || "User"}!
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome to your financial dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Summary Cards */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Total Balance
                </h3>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wallet className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">$4,550.00</p>
              <p className="text-green-600 text-sm mt-2 flex items-center">
                <span>↑ 12% from last month</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Income</h3>
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Wallet className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">$6,210.00</p>
              <p className="text-indigo-600 text-sm mt-2 flex items-center">
                <span>↑ 8% from last month</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Expenses
                </h3>
                <div className="p-2 bg-red-100 rounded-lg">
                  <Receipt className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">$1,660.00</p>
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <span>↓ 5% from last month</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
