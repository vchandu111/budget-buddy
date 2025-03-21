import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Wallet, Receipt } from "lucide-react";

const Dashboard = () => {
  const { user } = useUser();
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "income", icon: Wallet, label: "Income" },
    { id: "expense", icon: Receipt, label: "Expense" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white">
        {/* User Profile Section */}
        <div className="p-6 text-center">
          <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
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
          <h2 className="text-xl font-medium text-gray-900 uppercase">
            {user?.firstName}
          </h2>
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-3 py-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeItem === item.id
                    ? "bg-[#7950F2] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="ml-3 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around items-center py-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`p-2 rounded-lg flex flex-col items-center ${
                activeItem === item.id
                  ? "text-[#7950F2]"
                  : "text-gray-600 hover:text-[#7950F2]"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="p-6">
          
          {/* Add your dashboard content here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
