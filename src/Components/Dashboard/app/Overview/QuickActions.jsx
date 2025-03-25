import React from "react";
import { Receipt, DollarSign, FolderPlus } from "lucide-react";

const QuickActions = () => {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log("File uploaded:", file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Receipt Upload */}
      <div className="relative group">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-red-200 rounded-lg bg-white hover:border-red-400 transition-colors">
          <Receipt className="w-8 h-8 text-red-400 mb-2" />
          <h3 className="text-sm font-medium text-gray-900">Drag Receipt(s)</h3>
          <p className="text-xs text-gray-500">or click here to attach</p>
        </div>
      </div>

      {/* New Expense */}
      <div
        className="flex flex-col items-center justify-center p-6 border-2 border-red-200 rounded-lg bg-white hover:border-red-400 transition-colors cursor-pointer"
        onClick={() => console.log("New expense clicked")}
      >
        <DollarSign className="w-8 h-8 text-red-400 mb-2" />
        <h3 className="text-sm font-medium text-gray-900">New Expense</h3>
        <p className="text-xs text-gray-500">add transaction</p>
      </div>

      {/* New Report */}
      <div
        className="flex flex-col items-center justify-center p-6 border-2 border-red-200 rounded-lg bg-white hover:border-red-400 transition-colors cursor-pointer"
        onClick={() => console.log("New report clicked")}
      >
        <FolderPlus className="w-8 h-8 text-red-400 mb-2" />
        <h3 className="text-sm font-medium text-gray-900">New Income</h3>
        <p className="text-xs text-gray-500">generate report</p>
      </div>
    </div>
  );
};

export default QuickActions;
