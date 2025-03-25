import React, { useState, useEffect } from "react";
import { TrendingUp, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const TopIncome = () => {
  const [topIncomes, setTopIncomes] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // Group incomes by source and calculate total amount for each source
        const sourceMap = incomesArray.reduce((acc, income) => {
          const source = income.source;
          if (!acc[source]) {
            acc[source] = {
              source,
              totalAmount: 0,
              count: 0,
              color: getRandomColor(),
            };
          }
          acc[source].totalAmount += parseFloat(income.amount);
          acc[source].count += 1;
          return acc;
        }, {});

        // Convert to array and sort by total amount
        const sortedSources = Object.values(sourceMap)
          .sort((a, b) => b.totalAmount - a.totalAmount)
          .slice(0, 3); // Get top 3

        setTopIncomes(sortedSources);
      } catch (error) {
        console.error("Error fetching incomes:", error);
        setTopIncomes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  // Function to generate random colors for sources
  const getRandomColor = () => {
    const colors = [
      "#4CAF50", // Green
      "#2196F3", // Blue
      "#9C27B0", // Purple
      "#FF9800", // Orange
      "#F44336", // Red
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Top Income Sources
          </h2>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between gap-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Top Income Sources
        </h2>
        <Link
          to="/app/income"
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-blue-300 hover:text-black bg-gray-50 rounded-lg text-[12px] transition-colors"
        >
          See All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {topIncomes.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No income records found
        </div>
      ) : (
        <div className="space-y-4">
          {topIncomes.map((income) => (
            <div key={income.source} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: income.color }}
                  />
                  <span className="font-medium text-gray-900">
                    {income.source}
                  </span>
                </div>
                <span className="text-gray-900 font-semibold">
                  ₹{income.totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (income.totalAmount / topIncomes[0].totalAmount) * 100
                    }%`,
                    backgroundColor: income.color,
                  }}
                />
              </div>

              {/* Transaction count */}
              <p className="text-sm text-gray-500 mt-1">
                {income.count} transaction{income.count !== 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopIncome;
