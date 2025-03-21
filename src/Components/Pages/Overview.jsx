import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Wallet, Receipt } from "lucide-react";

const Overview = () => {
  const { user } = useUser();
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

  return (
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
            <h3 className="text-lg font-semibold text-gray-800">Expenses</h3>
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
  );
};

export default Overview;
