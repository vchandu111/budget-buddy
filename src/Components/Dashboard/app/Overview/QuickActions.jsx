import React from "react";
import { Receipt, DollarSign, FolderPlus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log("File uploaded:", file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Receipt Upload */}
      <div className="relative group">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-indigo-200 rounded-xl bg-white hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 shadow-sm hover:shadow-md">
          <div className="p-3 rounded-full bg-indigo-100 mb-4 group-hover:bg-indigo-200 transition-colors">
            <Receipt className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">
            Upload Receipt
          </h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            Drag and drop or click to attach
          </p>
          <div className="flex items-center text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Upload Now</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>

      {/* New Expense */}
      <div
        onClick={() => navigate("/app/expense")}
        className="flex flex-col items-center justify-center p-8 border-2 border-indigo-200 rounded-xl bg-white hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group"
      >
        <div className="p-3 rounded-full bg-indigo-100 mb-4 group-hover:bg-indigo-200 transition-colors">
          <DollarSign className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          New Expense
        </h3>
        <p className="text-sm text-gray-500 text-center mb-4">
          Add a new transaction
        </p>
        <div className="flex items-center text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Add Now</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>

      {/* New Income */}
      <div
        onClick={() => navigate("/app/income")}
        className="flex flex-col items-center justify-center p-8 border-2 border-indigo-200 rounded-xl bg-white hover:border-indigo-400 hover:bg-indigo-50/50 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group"
      >
        <div className="p-3 rounded-full bg-indigo-100 mb-4 group-hover:bg-indigo-200 transition-colors">
          <FolderPlus className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          New Income
        </h3>
        <p className="text-sm text-gray-500 text-center mb-4">
          Add a new income source
        </p>
        <div className="flex items-center text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Add Now</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
