import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import TotalSummary from "./TotalSummary";
import RecentTransactions from "./RecentTransactions";
import OverviewChart from "./OverviewChart";
import RecurringIncomes from "./RecurringIncomes";
import TopIncome from "../Income/TopIncome";
import QuickActions from "./QuickActions";

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
    <div className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {greeting}, {user?.firstName || "User"}!
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome to your financial dashboard
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Total Summary */}
      <TotalSummary />

      {/* Charts and Transactions */}
      <div className="flex gap-8">
        <div className="w-1/2">
          <RecentTransactions />
        </div>
        <div className="w-1/2">
          <OverviewChart />
        </div>
      </div>

      {/* Income Analysis */}
      <div className="flex gap-8">
        <div className="w-1/2">
          <TopIncome />
        </div>
        <div className="w-1/2">
          <RecurringIncomes />
        </div>
      </div>
    </div>
  );
};

export default Overview;
