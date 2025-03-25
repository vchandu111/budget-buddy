import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const OverviewChart = () => {
  const [chartData, setChartData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch income data
        const incomeResponse = await fetch(
          "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/income.json"
        );
        const incomeData = await incomeResponse.json();

        // Calculate total income
        const totalIncome = Object.values(incomeData).reduce((sum, income) => {
          return sum + parseFloat(income.amount);
        }, 0);

        // Fetch expense data
        const expenseResponse = await fetch(
          "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/expense.json"
        );
        const expenseData = await expenseResponse.json();

        // Calculate total expense
        const totalExpense = Object.values(expenseData).reduce(
          (sum, expense) => {
            const amount = expense.amount.replace("₹", "");
            return sum + (parseFloat(amount) || 0);
          },
          0
        );

        const balance = totalIncome - totalExpense;
        setTotalBalance(balance);

        // Prepare data for the chart
        const data = [
          { name: "Total Income", value: totalIncome, color: "#FF8A65" },
          { name: "Total Expenses", value: totalExpense, color: "#EF5350" },
          { name: "Total Balance", value: balance, color: "#7950F2" },
        ];

        setChartData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm w-1/2">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-full w-64 mx-auto"></div>
          <div className="mt-6 flex justify-center space-x-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex justify-center gap-8 mt-6">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Financial Overview
      </h2>

      <div className="relative" style={{ height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              startAngle={90}
              endAngle={450}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-gray-600 text-sm">Total Balance</p>
          <p className="text-2xl font-bold text-gray-900">
            ₹{totalBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Legend */}
      <CustomLegend payload={chartData} />
    </div>
  );
};

export default OverviewChart;
