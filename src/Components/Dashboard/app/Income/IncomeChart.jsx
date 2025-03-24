import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { IndianRupee, Loader } from "lucide-react";

const IncomeChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const fetchIncomeData = async () => {
    try {
      const response = await fetch(
        "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/income.json"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch income data");
      }

      const rawData = await response.json();

      // Transform the data for the chart
      const transformedData = processDataForChart(rawData);
      setData(transformedData);
    } catch (error) {
      console.error("Error fetching income data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const processDataForChart = (rawData) => {
    if (!rawData) return [];

    // Convert object to array and add IDs
    const incomesArray = Object.entries(rawData).map(([id, income]) => ({
      id,
      ...income,
      amount: parseFloat(income.amount),
    }));

    // Group by month and calculate total
    const monthlyData = incomesArray.reduce((acc, income) => {
      const date = new Date(income.date);
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!acc[monthYear]) {
        acc[monthYear] = {
          name: monthYear,
          total: 0,
          recurring: 0,
          nonRecurring: 0,
        };
      }

      acc[monthYear].total += income.amount;
      if (income.isRecurring) {
        acc[monthYear].recurring += income.amount;
      } else {
        acc[monthYear].nonRecurring += income.amount;
      }

      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(monthlyData)
      .sort((a, b) => {
        const [monthA, yearA] = a.name.split(" ");
        const [monthB, yearB] = b.name.split(" ");
        return (
          new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`)
        );
      })
      .slice(-6); // Show last 6 months
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-300">
                {entry.name}:
              </span>
              <span className="font-medium text-gray-900 dark:text-white flex items-center">
                <IndianRupee className="w-3 h-3 mr-1" />
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  console.log(data);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
        Income Trends
      </h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.1}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6B7280" }}
              tickLine={{ stroke: "#6B7280" }}
            />
            <YAxis
              tick={{ fill: "#6B7280" }}
              tickLine={{ stroke: "#6B7280" }}
              tickFormatter={(value) => `₹${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="recurring"
              name="Recurring Income"
              fill="#4F46E5"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="nonRecurring"
              name="Non-recurring Income"
              fill="#818CF8"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeChart;
