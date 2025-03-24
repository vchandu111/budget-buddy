import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pencil,
  Trash2,
  DollarSign,
  Calendar,
  AlertCircle,
  IndianRupee,
  RepeatIcon,
  Loader2,
} from "lucide-react";

const IncomeDisplay = ({
  incomes,
  isSubmitting,
  showDeleteDialog,
  setShowDeleteDialog,
  handleEdit,
  handleDeleteClick,
  handleDelete,
  formatDate,
}) => {
  // Group incomes by month
  const groupIncomesByMonth = (incomes) => {
    return incomes.reduce((acc, income) => {
      const date = new Date(income.date);
      const monthYear = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(income);
      return acc;
    }, {});
  };

  // Get sorted month keys (newest first)
  const getSortedMonths = (groupedIncomes) => {
    return Object.keys(groupedIncomes).sort((a, b) => {
      const [monthA, yearA] = a.split(" ");
      const [monthB, yearB] = b.split(" ");
      return (
        yearB - yearA ||
        new Date(Date.parse(monthB + " 1")).getMonth() -
          new Date(Date.parse(monthA + " 1")).getMonth()
      );
    });
  };

  const groupedIncomes = groupIncomesByMonth(incomes);
  const sortedMonths = getSortedMonths(groupedIncomes);

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Income Entries
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {incomes.length} {incomes.length === 1 ? "entry" : "entries"} total
          </p>
        </div>

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
                    {groupedIncomes[month].length} entries
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {groupedIncomes[month].map((income) => (
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
