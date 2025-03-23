import React from "react";
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
  const processExpensesForChart = (expenses) => {
    // Sort expenses by date
    const sortedExpenses = [...expenses].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    // Group expenses by date and calculate total amount
    const groupedData = sortedExpenses.reduce((acc, expense) => {
      const date = new Date(expense.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const amount = parseFloat(
        expense.amount.replace("₹", "").replace(/,/g, "")
      );

      if (!acc[date]) {
        acc[date] = {
          date,
          amount: 0,
        };
      }
      acc[date].amount += amount;
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
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Expense Trends</h2>
        <p className="text-sm text-gray-500">Daily spending overview</p>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
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
