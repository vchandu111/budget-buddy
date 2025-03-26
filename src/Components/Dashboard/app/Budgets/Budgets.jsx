import React, { useState, useEffect } from "react";
import {
  Utensils,
  ShoppingCart,
  Gamepad,
  Stethoscope,
  FileText,
  GraduationCap,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Budgets = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [chartData, setChartData] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editBudget, setEditBudget] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch(
          "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/categories.json"
        );
        const categoriesData = await categoriesResponse.json();

        // Fetch expenses
        const expensesResponse = await fetch(
          "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/expense.json"
        );
        const expensesData = await expensesResponse.json();

        // Calculate totals for each category
        const totals = {};
        Object.values(expensesData).forEach((expense) => {
          const categoryName = expense.category.name;
          // Remove ₹ symbol and commas, then convert to number
          const amount = parseFloat(
            expense.amount.replace("₹", "").replace(/,/g, "")
          );
          totals[categoryName] = (totals[categoryName] || 0) + amount;
        });

        // Prepare chart data
        const chartData = categoriesData.map((category) => ({
          name: category.name,
          Budget: category.budget,
          Spent: totals[category.name] || 0,
        }));

        setCategories(categoriesData);
        setCategoryTotals(totals);
        setChartData(chartData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getIconComponent = (iconName) => {
    const iconConfig = {
      Utensils: { component: Utensils, color: "#f97316" }, // Orange
      ShoppingCart: { component: ShoppingCart, color: "#06b6d4" }, // Cyan
      Gamepad: { component: Gamepad, color: "#8b5cf6" }, // Purple
      Stethoscope: { component: Stethoscope, color: "#ef4444" }, // Red
      FileText: { component: FileText, color: "#22c55e" }, // Green
      GraduationCap: { component: GraduationCap, color: "#ec4899" }, // Pink
    };

    const config = iconConfig[iconName];
    if (!config) return null;

    const IconComponent = config.component;
    return (
      <div
        className="p-3 rounded-lg"
        style={{ backgroundColor: `${config.color}15` }}
      >
        <IconComponent className="w-6 h-6" style={{ color: config.color }} />
      </div>
    );
  };

  const calculateProgress = (category) => {
    const spent = categoryTotals[category.name] || 0;
    const budget = category.budget;
    const percentage = (spent / budget) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-green-700";
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setEditBudget(category.budget.toString());
    setEditDialogOpen(true);
  };

  const handleUpdateBudget = async () => {
    if (!selectedCategory || isUpdating) return;

    setIsUpdating(true);
    try {
      // Find the index of the category in the array
      const categoryIndex = categories.findIndex(
        (cat) => cat.id === selectedCategory.id
      );

      if (categoryIndex === -1) throw new Error("Category not found");

      const response = await fetch(
        `https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/categories/${categoryIndex}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            budget: parseFloat(editBudget),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update budget");
      }

      // Update local state
      const updatedCategories = categories.map((cat, index) =>
        index === categoryIndex
          ? { ...cat, budget: parseFloat(editBudget) }
          : cat
      );
      setCategories(updatedCategories);

      // Update chart data
      const updatedChartData = updatedCategories.map((category) => ({
        name: category.name,
        Budget: category.budget,
        Spent: categoryTotals[category.name] || 0,
      }));
      setChartData(updatedChartData);

      // Close dialog
      setEditDialogOpen(false);
      setSelectedCategory(null);
      setEditBudget("");
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("Failed to update budget. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Budget Categories</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Add New Category
        </Button>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Budget vs Spending Overview
        </h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
              <Tooltip
                formatter={(value) => `₹${value.toLocaleString()}`}
                labelStyle={{ color: "#111827" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              <Bar dataKey="Budget" fill="#4f46e5" />
              <Bar dataKey="Spent" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const progress = calculateProgress(category);
          const progressColor = getProgressColor(progress);
          const spent = categoryTotals[category.name] || 0;

          return (
            <div
              key={category.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {getIconComponent(category.icon)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Monthly Budget</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => handleEditClick(category)}
                  >
                    <Edit className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-2xl font-bold text-indigo-600">
                      ₹{category.budget.toLocaleString()}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      Spent: ₹{spent.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      progress >= 80 ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {progress.toFixed(0)}% used
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${progressColor} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Budget Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Edit Budget
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                value={selectedCategory?.name || ""}
                disabled
                className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-700"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-700">
                Budget Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <Input
                  type="number"
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  className="pl-7"
                  placeholder="Enter budget amount"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBudget}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Budget"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Budgets;
