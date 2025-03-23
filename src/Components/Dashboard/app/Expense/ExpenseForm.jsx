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
import { PlusCircle, IndianRupee, Tag, CreditCard, Pencil } from "lucide-react";
import { categories, paymentModes } from "@/utils/data";

const ExpenseForm = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    paymentMode: "",
    note: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Find the selected category and payment mode objects
    const selectedCategory = categories.find(
      (cat) => cat.name === formData.category
    );
    const selectedPaymentMode = paymentModes.find(
      (mode) => mode.name === formData.paymentMode
    );

    // Create formatted data object
    const expenseData = {
      date: formData.date,
      amount: `₹${formData.amount}`,
      category: {
        name: selectedCategory?.name || "",
        icon: selectedCategory?.iconName || "",
        color: selectedCategory?.color || "",
      },
      paymentMode: {
        name: selectedPaymentMode?.name || "",
        icon: selectedPaymentMode?.iconName || "",
        color: selectedPaymentMode?.color || "",
      },
      note: formData.note || "No note added",
    };

    console.log("Expense Details:", expenseData);

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(expenseData),
        redirect: "follow",
      };

      const response = await fetch(
        "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/expense.json",
        requestOptions
      );
      const result = await response.json();
      console.log("Success:", result);

      // Clear form after successful submission
      setFormData({
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        paymentMode: "",
        note: "",
      });

      // Close the dialog
      setOpen(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
          <PlusCircle className="w-5 h-5 mr-2 text-white" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 mb-4">
            Add New Expense
          </DialogTitle>
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg w-full shadow-sm border border-gray-200">
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border-none bg-transparent p-1 focus:ring-0 w-full text-gray-700"
              />
            </div>
          </div>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg shadow-sm border border-gray-200">
              <IndianRupee className="w-6 h-6 text-indigo-500" />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Amount
                </label>
                <div className="flex items-center">
                  <span className="text-2xl mr-2 text-gray-700 font-semibold">
                    ₹
                  </span>
                  <input
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder=""
                    className="text-xl border-none bg-transparent p-0 focus:ring-0 focus:outline-none text-gray-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200">
              <Tag className="w-6 h-6 text-indigo-500" />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="text-left w-full text-gray-700 hover:text-indigo-600 transition-colors font-medium"
                >
                  {formData.category || "Select category"}
                </button>

                {showCategoryModal && (
                  <div className="fixed inset-0 bg-gray-300 bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 w-[90%] max-w-md max-h-[50vh] overflow-y-auto shadow-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                          Select Category
                        </h3>
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
                              <category.icon
                                className="w-5 h-5"
                                style={{ color: category.color }}
                              />
                            </div>
                            <span className="text-xs text-center">
                              {category.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200">
              <CreditCard className="w-6 h-6 text-indigo-500" />
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Payment mode
                </label>
                <Select
                  value={formData.paymentMode}
                  onValueChange={(value) =>
                    handleSelectChange("paymentMode", value)
                  }
                >
                  <SelectTrigger className="border-none bg-transparent focus:ring-0 p-0 h-8 text-gray-700 font-medium">
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentModes.map((mode) => (
                      <SelectItem key={mode.id} value={mode.name}>
                        <div className="flex items-center gap-2">
                          <mode.icon
                            className="w-5 h-5"
                            style={{ color: mode.color }}
                          />
                          <span>{mode.name}</span>
                        </div>
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
            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg shadow-sm border border-gray-200">
              <Pencil className="w-6 h-6 text-indigo-500" />
              <input
                name="note"
                value={formData.note}
                onChange={handleChange}
                placeholder="Write a note"
                className="border-none bg-transparent focus:ring-0 focus:outline-none text-gray-700"
              />
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
  );
};

export default ExpenseForm;
