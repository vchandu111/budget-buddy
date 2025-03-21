import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  PlusCircle,
  Calculator,
  PaperclipIcon,
  Menu,
  ShoppingCart,
  Utensils,
  Gamepad,
  Stethoscope,
  Scissors,
  GraduationCap,
  FileText,
  TrendingUp,
  Home,
  Receipt,
  Shield,
  Gift,
  MoreHorizontal,
  Plane,
} from "lucide-react";

const Expense = () => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split('T')[0],
    paymentMode: "",
    note: "",
    attachment: null,
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category: category,
    }));
    setShowCategoryModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const categories = [
    { id: "food", name: "Food and Dining", icon: <Utensils className="w-5 h-5 text-amber-500" /> },
    { id: "shopping", name: "Shopping", icon: <ShoppingCart className="w-5 h-5 text-blue-400" /> },
    { id: "travel", name: "Travelling", icon: <Plane className="w-5 h-5 text-purple-500" /> },
    { id: "entertainment", name: "Entertainment", icon: <Gamepad className="w-5 h-5 text-green-400" /> },
    { id: "medical", name: "Medical", icon: <Stethoscope className="w-5 h-5 text-red-400" /> },
    { id: "personal", name: "Personal Care", icon: <Scissors className="w-5 h-5 text-cyan-500" /> },
    { id: "education", name: "Education", icon: <GraduationCap className="w-5 h-5 text-purple-600" /> },
    { id: "bills", name: "Bills and Utilities", icon: <FileText className="w-5 h-5 text-pink-500" /> },
    { id: "investments", name: "Investments", icon: <TrendingUp className="w-5 h-5 text-green-500" /> },
    { id: "rent", name: "Rent", icon: <Home className="w-5 h-5 text-cyan-600" /> },
    { id: "taxes", name: "Taxes", icon: <Receipt className="w-5 h-5 text-gray-600" /> },
    { id: "insurance", name: "Insurance", icon: <Shield className="w-5 h-5 text-indigo-500" /> },
    { id: "gifts", name: "Gifts and Donation", icon: <Gift className="w-5 h-5 text-teal-400" /> },
    { id: "others", name: "Others", icon: <MoreHorizontal className="w-5 h-5 text-gray-400" /> },
  ];

  const paymentModes = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "UPI",
    "Bank Transfer",
    "Other",
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Expenses</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white p-6 rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800 mb-4">Add New Expense</DialogTitle>
              <div className="flex items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg w-full">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="border-none bg-transparent p-1 focus:ring-0 w-full"
                  />
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <Calculator className="w-6 h-6 text-indigo-500" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600 block mb-1">Amount</label>
                    <div className="flex items-center">
                      <span className="text-2xl mr-2 text-gray-700 font-semibold">₹</span>
                      <Input
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0"
                        className="text-2xl border-none bg-transparent p-0 focus:ring-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <Menu className="w-6 h-6 text-indigo-500" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600 block mb-1">Category</label>
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(true)}
                      className="text-left w-full text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      {formData.category || "Select category"}
                    </button>
                    
                    {showCategoryModal && (
                      <div className="fixed inset-0 bg-gray-300 bg-opacity-50 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-xl p-6 w-[90%] max-w-md max-h-[50vh] overflow-y-auto">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Select Category</h3>
                            <button 
                              type="button" 
                              onClick={() => setShowCategoryModal(false)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            {categories.map((category) => (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() => handleCategorySelect(category.name)}
                                className="flex flex-col items-center justify-center p-3 bg-white-100 rounded-lg hover:bg-indigo-100 transition-colors"
                              >
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm">
                                  {category.icon}
                                </div>
                                <span className="text-xs text-center">{category.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <PlusCircle className="w-6 h-6 text-indigo-500" />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-600 block mb-1">Payment mode</label>
                    <Select
                      value={formData.paymentMode}
                      onValueChange={(value) =>
                        handleSelectChange("paymentMode", value)
                      }
                    >
                      <SelectTrigger className="border-none bg-transparent focus:ring-0 p-0 h-8">
                        <SelectValue placeholder="Select payment mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentModes.map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Other details
                </h3>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <Menu className="w-6 h-6 text-indigo-500" />
                  <Input
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Write a note"
                    className="border-none bg-transparent focus:ring-0"
                  />
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <PaperclipIcon className="w-6 h-6 text-indigo-500" />
                  <button
                    type="button"
                    className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                  >
                    Add attachment
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Add Expense
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <p className="text-gray-500 text-center py-8">No expenses added yet. Click "Add Expense" to get started.</p>
      </div>
    </div>
  );
};

export default Expense;
