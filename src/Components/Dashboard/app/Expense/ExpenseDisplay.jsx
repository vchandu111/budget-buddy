import React from "react";
import { IndianRupee, Calendar, Pencil, Trash2 } from "lucide-react";
import * as Icons from "lucide-react";

const ExpenseDisplay = ({ expenses }) => {
  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center justify-center  ">
                {expense.category.icon && (
                  <div style={{ color: expense.category.color }}>
                    {renderIcon(expense.category.icon)}
                  </div>
                )}
              </span>
              <div>
                <h3 className="font-medium text-pink-500">
                  {expense.category.name}
                </h3>
                <p className="text-sm">{expense.paymentMode.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-md hover:bg-gray-100 text-gray-400 hover:text-indigo-600">
                <Pencil className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100 text-gray-400 hover:text-rose-600">
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
  );
};

export default ExpenseDisplay;
