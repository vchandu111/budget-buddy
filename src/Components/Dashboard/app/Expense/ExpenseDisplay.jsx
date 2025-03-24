import React, { useState } from "react";
import {
  IndianRupee,
  Calendar,
  Pencil,
  Trash2,
  Download,
  TrendingDown,
  Search,
  X,
  AlertTriangle,
} from "lucide-react";
import * as Icons from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, paymentModes } from "@/utils/data";
import ExpenseSummary from "./ExpenseSummary";

const ExpenseDisplay = ({ expenses, onDelete, onEdit, onSearchChange }) => {
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    amount: "",
    category: "",
    paymentMode: "",
    date: "",
    note: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Notify parent component when search state changes
  React.useEffect(() => {
    onSearchChange?.(Boolean(searchQuery));
  }, [searchQuery, onSearchChange]);

  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowConfirmDelete(true);
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setEditFormData({
      amount: expense.amount.replace("₹", ""),
      category: expense.category.name,
      paymentMode: expense.paymentMode.name,
      date: expense.date,
      note: expense.note || "",
    });
    setShowEditDialog(true);
  };

  const handleEditSubmit = async () => {
    if (!editingExpense) return;

    const selectedCategory = categories.find(
      (cat) => cat.name === editFormData.category
    );
    const selectedPaymentMode = paymentModes.find(
      (mode) => mode.name === editFormData.paymentMode
    );

    const updatedData = {
      amount: `₹${editFormData.amount}`,
      category: {
        name: selectedCategory.name,
        icon: selectedCategory.icon,
        color: selectedCategory.color,
      },
      paymentMode: {
        name: selectedPaymentMode.name,
        icon: selectedPaymentMode.icon,
        color: selectedPaymentMode.color,
      },
      date: editFormData.date,
      note: editFormData.note,
    };

    await onEdit(editingExpense.id, updatedData);
    setShowEditDialog(false);
    setEditingExpense(null);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      await onDelete(deletingId);
      setShowConfirmDelete(false);
      setDeletingId(null);
    }
  };

  const downloadAsCsv = () => {
    // Prepare CSV headers
    const headers = ["Date", "Category", "Amount", "Payment Mode", "Note"].join(
      ","
    );

    // Convert expenses to CSV rows
    const csvRows = expenses.map((expense) => {
      const date = new Date(expense.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const amount = expense.amount.replace("₹", "").trim();
      const category = expense.category.name;
      const paymentMode = expense.paymentMode.name;
      const note = expense.note ? `"${expense.note.replace(/"/g, '""')}"` : ""; // Handle quotes in notes

      return [date, category, amount, paymentMode, note].join(",");
    });

    // Combine headers and rows
    const csvContent = [headers, ...csvRows].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `expenses_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Group expenses by month
  const groupExpensesByMonth = (expenses) => {
    return expenses.reduce((acc, expense) => {
      const date = new Date(expense.date);
      const monthYear = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(expense);
      return acc;
    }, {});
  };

  // Get sorted month keys (newest first)
  const getSortedMonths = (groupedExpenses) => {
    return Object.keys(groupedExpenses).sort((a, b) => {
      const [monthA, yearA] = a.split(" ");
      const [monthB, yearB] = b.split(" ");
      return (
        yearB - yearA ||
        new Date(Date.parse(monthB + " 1")).getMonth() -
          new Date(Date.parse(monthA + " 1")).getMonth()
      );
    });
  };

  // Filter and group expenses
  const filteredExpenses = expenses.filter((expense) => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    return expense.note?.toLowerCase().includes(query);
  });

  const groupedExpenses = groupExpensesByMonth(filteredExpenses);
  const sortedMonths = getSortedMonths(groupedExpenses);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          All Expenses
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for expense"
              className="w-full pl-9 pr-9 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={downloadAsCsv}
            className="flex items-center gap-2"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/8242/8242984.png"
              alt="download icon"
              className="w-4 h-4"
            />
            Download CSV
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          {sortedMonths.map((month) => (
            <div key={month} className="mb-8">
              <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {month}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 rounded-full">
                      {groupedExpenses[month].length} expenses
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {groupedExpenses[month].map((expense) => (
                  <div
                    key={expense.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                          {expense.category.icon && (
                            <div style={{ color: expense.category.color }}>
                              {renderIcon(expense.category.icon)}
                            </div>
                          )}
                        </span>
                        <div>
                          <h3 className="font-medium text-teal-600">
                            {expense.category.name}
                          </h3>
                          <p className="text-sm">{expense.paymentMode.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditClick(expense)}
                          className="p-2 rounded-md hover:bg-gray-100 text-gray-400 hover:text-indigo-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(expense.id)}
                          className="p-2 rounded-md hover:bg-gray-100 text-gray-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(expense.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between border-gray-200">
                      {expense.note && (
                        <div className="text-sm text-slate-600 line-clamp-2">
                          {expense.note}
                        </div>
                      )}
                      <div className="font-medium text-rose-600 flex items-center gap-1 bg-rose-50/50 px-2 py-1 rounded w-fit">
                        <span>- ₹{expense.amount.replace("₹", "").trim()}</span>
                        <TrendingDown className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredExpenses.length === 0 && (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                No expenses found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Right side: Category summary - Only show when not searching */}
        {!searchQuery && <ExpenseSummary expenses={expenses} />}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent className="sm:max-w-[425px] p-0">
          <div className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-500 mt-0.5" />
              <div>
                <DialogTitle className="text-xl font-semibold text-rose-500">
                  Confirm Deletion
                </DialogTitle>
                <DialogDescription className="mt-3 text-gray-600 dark:text-gray-300">
                  Are you sure you want to delete this expense? This action
                  cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 p-4 bg-gray-50 dark:bg-gray-800/50">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDelete(false)}
              className="bg-white dark:bg-transparent"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-rose-500 hover:bg-rose-600"
            >
              Delete Expense
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Make changes to your expense here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={editFormData.amount}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, amount: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={editFormData.category}
                onValueChange={(value) =>
                  setEditFormData({ ...editFormData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentMode">Payment Mode</Label>
              <Select
                value={editFormData.paymentMode}
                onValueChange={(value) =>
                  setEditFormData({ ...editFormData, paymentMode: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  {paymentModes.map((mode) => (
                    <SelectItem key={mode.name} value={mode.name}>
                      {mode.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={editFormData.date}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, date: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Note</Label>
              <Input
                id="note"
                value={editFormData.note}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, note: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpenseDisplay;
