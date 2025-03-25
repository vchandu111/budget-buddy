import React, { useState, useEffect } from "react";
import { CreditCard, Wallet, Receipt } from "lucide-react";
import Loader from "@/Components/Common/Loader";

const TotalSummary = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        // Fetch income data
        const incomeResponse = await fetch(
          "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/income.json"
        );
        const incomeData = await incomeResponse.json();

        // Calculate total income
        const incomeTotal = Object.values(incomeData).reduce((sum, income) => {
          return sum + parseFloat(income.amount);
        }, 0);

        // Fetch expense data
        const expenseResponse = await fetch(
          "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/expense.json"
        );
        const expenseData = await expenseResponse.json();

        // Calculate total expense
        const expenseTotal = Object.values(expenseData).reduce(
          (sum, expense) => {
            const amount = expense.amount.replace("₹", "");
            return sum + (parseFloat(amount) || 0);
          },
          0
        );

        setTotalIncome(incomeTotal);
        setTotalExpense(expenseTotal);
      } catch (error) {
        console.error("Error fetching totals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  if (loading) {
    return <Loader/>
  }

  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Balance */}
      

      {/* Total Income */}
      <div className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
        <div className="bg-[#2a5897] w-12 h-12 rounded-full flex items-center justify-center text-white">
          <Wallet className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-gray-500 font-medium mb-1">Total Income</h3>
          <p className="text-2xl font-bold text-gray-900">
            ₹{totalIncome.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
        <div className="bg-[#1c4825] w-12 h-12 rounded-full flex items-center justify-center text-white">
          <Receipt className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-gray-500 font-medium mb-1">Total Expenses</h3>
          <p className="text-2xl font-bold text-gray-900">
            ₹{totalExpense.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm flex items-start gap-4">
        <div
          className={`${
            balance < 0 ? "bg-[#EF5350]" : "bg-[#7950F2]"
          } w-12 h-12 rounded-full flex items-center justify-center text-white`}
        >
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-gray-500 font-medium mb-1">Total Balance</h3>
          <p
            className={`text-2xl font-bold ${
              balance < 0 ? "text-[#EF5350]" : "text-gray-900"
            }`}
          >
            ₹{balance.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalSummary;
