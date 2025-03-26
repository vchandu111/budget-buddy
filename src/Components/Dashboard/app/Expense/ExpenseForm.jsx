import React, { useState, useEffect } from "react";
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
  PlusCircle,
  IndianRupee,
  Tag,
  CreditCard,
  Pencil,
  RepeatIcon,
  Loader2,
} from "lucide-react";
import { paymentModes } from "@/utils/data";

const ExpenseForm = () => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    paymentMode: "",
    note: "",
    isRecurring: false,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/categories.json"
        );
        const data = await response.json();

        // Convert the Firebase object to an array
        const categoriesArray = Object.entries(data).map(([id, category]) => ({
          id,
          ...category,
        }));

        setCategories(categoriesArray);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      recurring: formData.isRecurring,
    };

    try {
      const response = await fetch(
        "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/expense.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expenseData),
        }
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
        isRecurring: false,
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
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger className="border-none bg-transparent focus:ring-0 p-0 h-8 text-gray-700 font-medium">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingCategories ? (
                      <div className="flex justify-center items-center py-2">
                        <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                      </div>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          <div className="flex items-center gap-2">
                            {category.name === "Food expenses" && (
                              <IndianRupee className="w-5 h-5 text-indigo-500" />
                            )}
                            {category.name === "Shopping" && (
                              <Tag className="w-5 h-5 text-indigo-500" />
                            )}
                            {category.name === "Entertainment" && (
                              <CreditCard className="w-5 h-5 text-indigo-500" />
                            )}
                            {category.name === "Medical" && (
                              <PlusCircle className="w-5 h-5 text-indigo-500" />
                            )}
                            {category.name === "Bills and Utilities" && (
                              <CreditCard className="w-5 h-5 text-indigo-500" />
                            )}
                            {category.name === "Education" && (
                              <Pencil className="w-5 h-5 text-indigo-500" />
                            )}
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
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

            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isRecurring"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="isRecurring"
                  className="text-sm font-medium text-gray-700"
                >
                  This is a recurring expense
                </label>
                <RepeatIcon className="w-6 h-6 text-indigo-500" />
              </div>
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
