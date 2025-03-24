import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import {
  PlusCircle,
  Loader2,
  RepeatIcon,
  Pencil,
  Trash2,
  DollarSign,
  Calendar,
  AlertCircle,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import Loader from "@/Components/Common/Loader";
const Income = () => {
  // Main state
  const [incomes, setIncomes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIncomeId, setSelectedIncomeId] = useState(null);

  // Form data states
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: "",
    isRecurring: false,
  });

  const [editFormData, setEditFormData] = useState({
    id: "",
    source: "",
    amount: "",
    date: "",
    isRecurring: false,
  });

  // Fetch incomes
  const fetchIncomes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/income.json"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch incomes");
      }

      const data = await response.json();

      // Convert the object to array and add ID
      const incomesArray = data
        ? Object.entries(data).map(([id, income]) => ({
            id,
            ...income,
          }))
        : [];

      // Sort by date (newest first)
      const sortedIncomes = incomesArray.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setIncomes(sortedIncomes);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  // Form handlers
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/income.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add income");
      }

      await response.json();
      setFormData({ source: "", amount: "", date: "", isRecurring: false });
      setShowAddDialog(false);
      fetchIncomes();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (income) => {
    setEditFormData({
      id: income.id,
      source: income.source,
      amount: income.amount,
      date: income.date,
      isRecurring: income.isRecurring || false,
    });
    setShowEditDialog(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/income/${editFormData.id}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: editFormData.source,
            amount: editFormData.amount,
            date: editFormData.date,
            isRecurring: editFormData.isRecurring,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update income");
      }

      await response.json();
      setShowEditDialog(false);
      fetchIncomes();
    } catch (error) {
      console.error("Error updating income:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (income) => {
    setSelectedIncomeId(income.id);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedIncomeId) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/income/${selectedIncomeId}.json`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete income");
      }

      setShowDeleteDialog(false);
      fetchIncomes();
    } catch (error) {
      console.error("Error deleting income:", error);
    } finally {
      setIsSubmitting(false);
      setSelectedIncomeId(null);
    }
  };

  // Calculate summary data
  const summaryData = useMemo(() => {
    const recurringTotal = incomes
      .filter((income) => income.isRecurring)
      .reduce((total, income) => total + parseFloat(income.amount), 0);

    const highestIncome =
      incomes.length > 0
        ? Math.max(...incomes.map((income) => parseFloat(income.amount)))
        : 0;

    const totalIncome = incomes.reduce(
      (total, income) => total + parseFloat(income.amount),
      0
    );

    return { recurringTotal, highestIncome, totalIncome };
  }, [incomes]);

  // Process chart data
  const chartData = useMemo(() => {
    if (!incomes.length) return [];

    const monthlyData = {};

    // First collect all unique months from income data
    incomes.forEach((income) => {
      const date = new Date(income.date);
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          name: monthYear,
          total: 0,
          recurring: 0,
          nonRecurring: 0,
        };
      }

      const amount = parseFloat(income.amount);
      monthlyData[monthYear].total += amount;
      if (income.isRecurring) {
        monthlyData[monthYear].recurring += amount;
      } else {
        monthlyData[monthYear].nonRecurring += amount;
      }
    });

    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .sort(([monthYearA], [monthYearB]) => {
        const [monthA, yearA] = monthYearA.split(" ");
        const [monthB, yearB] = monthYearB.split(" ");
        return (
          new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`)
        );
      })
      .map(([, data]) => data);
  }, [incomes]);

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
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Income
        </h1>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Income
        </Button>
      </div>

      {/* Summary Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-500 rounded-lg p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4" />
              <p className="text-sm">Total Income</p>
            </div>
            <p className="text-2xl font-bold flex items-center">
              <IndianRupee className="w-5 h-5" />
              {summaryData.totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-indigo-500 rounded-lg p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <RepeatIcon className="w-4 h-4" />
              <p className="text-sm">Recurring Income</p>
            </div>
            <p className="text-2xl font-bold flex items-center">
              <IndianRupee className="w-5 h-5" />
              {summaryData.recurringTotal.toLocaleString()}
            </p>
          </div>

          <div className="bg-emerald-500 rounded-lg p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <p className="text-sm">Highest Income</p>
            </div>
            <p className="text-2xl font-bold flex items-center">
              <IndianRupee className="w-5 h-5" />
              {summaryData.highestIncome.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
          Income Trends
        </h3>
        <div className="h-[400px]">
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

      {/* Income List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Income Entries
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {incomes.length} {incomes.length === 1 ? "entry" : "entries"} total
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomes.map((income) => (
            <div
              key={income.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-200 flex flex-col"
            >
              {/* Header - Income Source */}
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Income Source
                  </h3>
                  {income.isRecurring && (
                    <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 px-2 py-1 rounded-full">
                      <RepeatIcon className="w-3 h-3" />
                      <span className="text-xs font-medium">Recurring</span>
                    </div>
                  )}
                </div>
                <p className="text-lg font-semibold text-gray-800 dark:text-white mt-1">
                  {income.source}
                </p>
              </div>

              {/* Amount and Date Section */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    Amount
                  </h4>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    ₹{Number(income.amount).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Date
                  </h4>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {formatDate(income.date)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 mt-auto border-t border-gray-100 dark:border-gray-700">
                <Button
                  onClick={() => handleEdit(income)}
                  variant="outline"
                  size="sm"
                  className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteClick(income)}
                  variant="outline"
                  size="sm"
                  className="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {incomes.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No income entries found.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Income Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="mb-2">Add New Income</DialogTitle>
            <DialogDescription>
              Enter the details of your income. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="source">Income Source</Label>
                <input
                  id="source"
                  name="source"
                  type="text"
                  required
                  placeholder="Freelance Development"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="5000"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isRecurring: e.target.checked,
                      })
                    }
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <Label
                    htmlFor="isRecurring"
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    This is a recurring income{" "}
                    <RepeatIcon className="h-4 w-4 text-indigo-500" />
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Income"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="mb-2">Edit Income</DialogTitle>
            <DialogDescription>
              Update the income details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="source">Income Source</Label>
                <input
                  id="source"
                  name="source"
                  type="text"
                  required
                  placeholder="Freelance Development"
                  value={editFormData.source}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, source: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="5000"
                  value={editFormData.amount}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, amount: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  value={editFormData.date}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, date: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={editFormData.isRecurring}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        isRecurring: e.target.checked,
                      })
                    }
                    disabled={isSubmitting}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <Label
                    htmlFor="isRecurring"
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
                  >
                    This is a recurring income{" "}
                    <RepeatIcon className="h-4 w-4 text-indigo-500" />
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Income"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="pt-3">
              Are you sure you want to delete this income? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Income"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Income;
