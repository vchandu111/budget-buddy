import React from "react";
import * as Icons from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const ExpenseSummary = ({ expenses }) => {
  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  // Process expenses to get category totals
  const getCategoryTotals = () => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      const categoryName = expense.category.name;
      const amount = parseFloat(
        expense.amount.replace("₹", "").replace(/,/g, "")
      );

      if (!acc[categoryName]) {
        acc[categoryName] = {
          total: 0,
          color: expense.category.color,
          icon: expense.category.icon,
        };
      }
      acc[categoryName].total += amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([name, data]) => ({
      name,
      ...data,
    }));
  };

  const categoryTotals = getCategoryTotals();
  const totalAmount = categoryTotals.reduce((sum, cat) => sum + cat.total, 0);

  // Prepare data for pie chart
  const pieChartData = categoryTotals.map((category) => ({
    name: category.name,
    value: category.total,
    color: category.color,
  }));

  return (
    <div className="hidden lg:block w-80 bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Expenses by Category
      </h2>

      {/* Category List */}
      <div className="space-y-4 mb-8">
        {categoryTotals.map((category) => (
          <div
            key={category.name}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${category.color}15` }}
              >
                <div style={{ color: category.color }}>
                  {renderIcon(category.icon)}
                </div>
              </div>
              <span className="font-medium text-gray-700">{category.name}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                ₹{category.total.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                {((category.total / totalAmount) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
        <div className="pt-4 mt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">Total</span>
            <span className="font-bold text-gray-900">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Pie Chart with Legend */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Spending Distribution
        </h3>
        <div style={{ height: "180px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                startAngle={90}
                endAngle={450}
                paddingAngle={3}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    strokeWidth={1}
                    stroke="#fff"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend below chart */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-6">
          {categoryTotals.map((category) => (
            <div key={category.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm text-gray-600 truncate">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;
