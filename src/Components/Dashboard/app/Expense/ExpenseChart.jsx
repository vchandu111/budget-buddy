import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ExpenseChart = ({ expenses }) => {
  const [timeFilter, setTimeFilter] = useState("daily"); // daily, monthly, yearly

  const getHeadingText = () => {
    switch (timeFilter) {
      case "monthly":
        return "Monthly spending overview";
      case "yearly":
        return "Yearly spending overview";
      default:
        return "Daily spending overview";
    }
  };

  const processExpensesForChart = (expenses) => {
    // Sort expenses by date
    const sortedExpenses = [...expenses].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Group expenses based on selected time filter
    const groupedData = sortedExpenses.reduce((acc, expense) => {
      let dateKey;
      const expenseDate = new Date(expense.date);

      switch (timeFilter) {
        case "monthly":
          dateKey = expenseDate.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
          break;
        case "yearly":
          dateKey = expenseDate.getFullYear().toString();
          break;
        default: // daily
          dateKey = expenseDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
      }

      const amount = parseFloat(
        expense.amount.replace("₹", "").replace(/,/g, "")
      );

      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          amount: 0,
        };
      }
      acc[dateKey].amount += amount;
      return acc;
    }, {});

    return Object.values(groupedData);
  };

  const chartData = processExpensesForChart(expenses);

  const CustomDot = (props) => {
    const { cx, cy } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        stroke="rgb(147, 51, 234)"
        strokeWidth={2}
        fill="white"
      />
    );
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Expense Trends
          </h2>
          <p className="text-sm text-gray-500">{getHeadingText()}</p>
        </div>
        <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-lg">
          <button
            onClick={() => setTimeFilter("daily")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeFilter === "daily"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeFilter("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeFilter === "monthly"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeFilter("yearly")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeFilter === "yearly"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 50,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tick={{ fill: "#666" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tick={{ fill: "#666" }}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
              formatter={(value) => [`₹${value}`, "Amount"]}
              labelStyle={{ color: "#666" }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="rgb(147, 51, 234)"
              fill="rgba(147, 51, 234, 0.1)"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{
                r: 6,
                stroke: "rgb(147, 51, 234)",
                strokeWidth: 2,
                fill: "white",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;
