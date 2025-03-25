import React, { useState, useEffect } from "react";
import { Calendar, ArrowDown, ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/expense.json"
        );
        const data = await response.json();

        // Convert object to array and add ID
        const transactionsArray = Object.entries(data).map(
          ([id, transaction]) => ({
            id,
            ...transaction,
          })
        );

        // Sort by date (newest first) and take latest 5
        const sortedTransactions = transactionsArray
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setTransactions(sortedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day}th ${month} ${year}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm flex-1">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-32 mt-2"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Recent Expenses
        </h2>
        <Link
          to="/app/expense"
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-blue-300 hover:text-black bg-gray-50 rounded-lg text-[12px] transition-colors"
        >
          See All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-6">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-start justify-between"
          >
            <div className="flex items-start gap-4">
              {/* Category Icon */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100"
                style={{ backgroundColor: `${transaction.category.color}15` }}
              >
                <div style={{ color: transaction.category.color }}>
                  {transaction.category.icon &&
                    renderIcon(transaction.category.icon)}
                </div>
              </div>

              {/* Transaction Details */}
              <div>
                <h3 className="font-medium text-gray-900">
                  {transaction.category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="flex items-center gap-1 text-rose-600 font-medium bg-rose-50 px-3 py-1 rounded-full">
              - {transaction.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
