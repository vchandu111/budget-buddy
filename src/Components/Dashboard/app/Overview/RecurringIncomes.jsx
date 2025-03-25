import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Wallet,
  Briefcase,
  Gift,
  CreditCard,
  Award,
} from "lucide-react";
import { Link } from "react-router-dom";

const RecurringIncomes = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map source types to icons and colors
  const sourceConfig = {
    Salary: { icon: Briefcase, color: "#4CAF50" },
    Stocks: { icon: CreditCard, color: "#2196F3" },
    Gift: { icon: Gift, color: "#9C27B0" },
    Refund: { icon: Award, color: "#FF9800" },
    default: { icon: Wallet, color: "#607D8B" },
  };

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await fetch(
          "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/income.json"
        );
        const data = await response.json();

        // Convert object to array and add ID
        const incomesArray = Object.entries(data || {}).map(([id, income]) => ({
          id,
          ...income,
        }));

        // Filter recurring incomes, sort by date (newest first)
        const recurringIncomes = incomesArray
          .filter((income) => income.isRecurring)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setIncomes(recurringIncomes);
      } catch (error) {
        console.error("Error fetching incomes:", error);
        setIncomes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  const getSourceConfig = (source) => {
    return sourceConfig[source] || sourceConfig.default;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      return `${day}th ${month} ${year}`;
    } catch {
      return "Date not available";
    }
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
          Recurring Incomes
        </h2>
      </div>

      <div className="space-y-6">
        {incomes.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No recurring income records found
          </div>
        ) : (
          incomes.map((income) => {
            const { icon: IconComponent, color } = getSourceConfig(
              income.source
            );
            return (
              <div key={income.id} className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Source Icon */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <div style={{ color }}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Income Details */}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {income.source}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(income.date)}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-1 text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                  + ₹{income.amount || 0}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecurringIncomes;
