import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  DollarSign,
  Calendar,
  Loader2,
  RepeatIcon,
  AlertCircle,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Loader from "@/Components/Common/Loader";

const IncomeDisplay = () => {
  const [incomes, setIncomes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedIncomeId, setSelectedIncomeId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Format date to be more readable
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
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
      fetchIncomes(); // Refresh the list
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
      fetchIncomes(); // Refresh the list
    } catch (error) {
      console.error("Error deleting income:", error);
    } finally {
      setIsSubmitting(false);
      setSelectedIncomeId(null);
    }
  };

  // Calculate summary data whenever incomes change
  const calculateSummaryData = () => {
    const recurringTotal = incomes
      .filter((income) => income.isRecurring)
      .reduce((total, income) => total + parseFloat(income.amount), 0);

    const highestIncome =
      incomes.length > 0
        ? Math.max(...incomes.map((income) => parseFloat(income.amount)))
        : 0;

    return { recurringTotal, highestIncome };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader />
      </div>
    );
  }

  const summaryData = calculateSummaryData();

  return (
    <>
      {/* Summary Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Income Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <RepeatIcon className="w-5 h-5 opacity-80" />
                  <h3 className="text-sm font-medium opacity-80">
                    Total Recurring Income
                  </h3>
                </div>
                <p className="text-2xl font-bold flex items-center gap-1">
                  <IndianRupee className="w-6 h-6" />
                  {summaryData.recurringTotal.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-full">
                <RepeatIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 opacity-80" />
                  <h3 className="text-sm font-medium opacity-80">
                    Highest Income
                  </h3>
                </div>
                <p className="text-2xl font-bold flex items-center gap-1">
                  <IndianRupee className="w-6 h-6" />
                  {summaryData.highestIncome.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-full">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Income List Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
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
                    ${Number(income.amount).toLocaleString()}
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

              {/* Notes Section - if we add notes later */}
              {income.notes && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Notes
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {income.notes}
                  </p>
                </div>
              )}

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
    </>
  );
};

export default IncomeDisplay;
