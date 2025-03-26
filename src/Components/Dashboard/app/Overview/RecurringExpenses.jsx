import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Utensils,
  ShoppingCart,
  Gamepad,
  Stethoscope,
  FileText,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

const RecurringExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map category types to icons and colors
  const categoryConfig = {
    "Food expenses": { icon: Utensils, color: "#f97316" },
    Shopping: { icon: ShoppingCart, color: "#06b6d4" },
    Entertainment: { icon: Gamepad, color: "#8b5cf6" },
    Medical: { icon: Stethoscope, color: "#ef4444" },
    "Bills and Utilities": { icon: FileText, color: "#22c55e" },
    Education: { icon: GraduationCap, color: "#ec4899" },
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/expense.json"
        );
        const data = await response.json();

        // Convert object to array and add ID
        const expensesArray = Object.entries(data || {}).map(
          ([id, expense]) => ({
            id,
            ...expense,
          })
        );

        // Filter recurring expenses, sort by date (newest first)
        const recurringExpenses = expensesArray
          .filter((expense) => expense.recurring)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setExpenses(recurringExpenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const getCategoryConfig = (categoryName) => {
    return (
      categoryConfig[categoryName] || {
        icon: FileText,
        color: "#64748b",
      }
    );
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
          Recurring Expenses
        </h2>
      </div>

      <div className="space-y-6">
        {expenses.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No recurring expense records found
          </div>
        ) : (
          expenses.map((expense) => {
            const { icon: IconComponent, color } = getCategoryConfig(
              expense.category.name
            );
            return (
              <div
                key={expense.id}
                className="flex items-start justify-between"
              >
                <div className="flex items-start gap-4">
                  {/* Category Icon */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <div style={{ color }}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Expense Details */}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {expense.category.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(expense.date)}
                    </p>
                    {expense.note && (
                      <p className="text-sm text-gray-500 mt-1">
                        {expense.note}
                      </p>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div className="flex items-center gap-1 text-red-600 font-medium bg-red-50 px-3 py-1 rounded-full">
                  - {expense.amount}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecurringExpenses;
