import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, RepeatIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const IncomeForm = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: "",
    isRecurring: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const response = await fetch(
        "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/income.json",
        {
          method: "POST",
          headers: myHeaders,
          body: JSON.stringify({
            source: formData.source,
            amount: formData.amount,
            date: formData.date,
            isRecurring: formData.isRecurring,
          }),
          redirect: "follow",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add income");
      }

      const result = await response.json();
      console.log("Success:", result);

      setFormData({ source: "", amount: "", date: "", isRecurring: false });
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center ">
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

      {/* Add Income Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="mb-2">Add New Income</DialogTitle>
            <DialogDescription>
              Enter the details of your income. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
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
                  placeholder="dd/mm/yyyy"
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
    </div>
  );
};

export default IncomeForm;
