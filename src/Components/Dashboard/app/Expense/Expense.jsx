"use client";

import React, { useEffect, useState } from "react";
import ExpenseDisplay from "./ExpenseDisplay";
import ExpenseChart from "./ExpenseChart";
import ExpenseForm from "./ExpenseForm";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/income.json"
        );
        const data = await response.json();
        const expensesArray = data
          ? Object.entries(data).map(([id, expense]) => ({
              id,
              ...expense,
            }))
          : [];
        setExpenses(expensesArray);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
    const intervalId = setInterval(fetchExpenses, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-500 text-center py-8">
          No expenses added yet. Click "Add Expense" to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Expenses</h2>
        <ExpenseForm />
      </div>

      <div className="space-y-8">
        <ExpenseChart expenses={expenses} />
        <ExpenseDisplay expenses={expenses} />
      </div>
    </div>
  );
};

export default Expense;
