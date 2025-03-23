import React, { useState } from "react";
import { IndianRupee, Calendar, Pencil, Trash2 } from "lucide-react";
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

const ExpenseDisplay = ({ expenses, onDelete, onEdit }) => {
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

  return (
    <>
      <div className="flex gap-8">
        {/* Left side: Expense cards */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-all duration-200"
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
                <div className="font-medium text-emerald-600 flex items-center">
                  <IndianRupee className="w-4 h-4 mr-1" />
                  {expense.amount.replace("₹", "")}
                </div>
              </div>

              {expense.note && (
                <div className="pt-4 border-t border-gray-200 text-sm text-slate-600 line-clamp-2">
                  {expense.note}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side: Category summary */}
        <div className="hidden lg:block w-80 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Expenses by Category
          </h2>
          <div className="space-y-4">
            {categoryTotals.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <div style={{ color: category.color }}>
                      {renderIcon(category.icon)}
                    </div>
                  </div>
                  <span className="font-medium text-gray-700">
                    {category.name}
                  </span>
                </div>
                <div className="font-semibold text-gray-900">
                  ₹{category.total.toLocaleString()}
                </div>
              </div>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">Total</span>
                <span className="font-bold text-gray-900">
                  ₹
                  {categoryTotals
                    .reduce((sum, cat) => sum + cat.total, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
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
