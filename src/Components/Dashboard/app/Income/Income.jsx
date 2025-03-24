import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  PlusCircle,
  Loader2,
  RepeatIcon,
  Pencil,
  Trash2,
  DollarSign,
  Calendar,
  AlertCircle,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import Loader from "@/Components/Common/Loader";
import IncomeForm from "./IncomeForm";
import IncomeChart from "./IncomeChart";
import IncomeDisplay from "./IncomeDisplay";

const Income = () => {
  // Main state
  const [incomes, setIncomes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIncomeId, setSelectedIncomeId] = useState(null);

  // Form data states
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: "",
    isRecurring: false,
  });

  const [editFormData, setEditFormData] = useState({
    id: "",
    source: "",
    amount: "",
    date: "",
    isRecurring: false,
  });

  // Fetch incomes
  const fetchIncomes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/income.json"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch incomes");
      }

      const data = await response.json();

      // Convert the object to array and add ID
      const incomesArray = data
        ? Object.entries(data).map(([id, income]) => ({
            id,
            ...income,
          }))
        : [];

      // Sort by date (newest first)
      const sortedIncomes = incomesArray.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setIncomes(sortedIncomes);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  // Form handlers
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/income.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add income");
      }

      await response.json();
      setFormData({ source: "", amount: "", date: "", isRecurring: false });
      setShowAddDialog(false);
      fetchIncomes();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (income) => {
    setEditFormData({
      id: income.id,
      source: income.source,
      amount: income.amount,
      date: income.date,
      isRecurring: income.isRecurring || false,
    });
    setShowEditDialog(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/income/${editFormData.id}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: editFormData.source,
            amount: editFormData.amount,
            date: editFormData.date,
            isRecurring: editFormData.isRecurring,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update income");
      }

      await response.json();
      setShowEditDialog(false);
      fetchIncomes();
    } catch (error) {
      console.error("Error updating income:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (income) => {
    setSelectedIncomeId(income.id);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedIncomeId) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://budgetbuddy-bc5a0-default-rtdb.firebaseio.com/income/${selectedIncomeId}.json`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete income");
      }

      setShowDeleteDialog(false);
      fetchIncomes();
    } catch (error) {
      console.error("Error deleting income:", error);
    } finally {
      setIsSubmitting(false);
      setSelectedIncomeId(null);
    }
  };

  // Calculate summary data
  const summaryData = useMemo(() => {
    const recurringTotal = incomes
      .filter((income) => income.isRecurring)
      .reduce((total, income) => total + parseFloat(income.amount), 0);

    const highestIncome =
      incomes.length > 0
        ? Math.max(...incomes.map((income) => parseFloat(income.amount)))
        : 0;

    const totalIncome = incomes.reduce(
      (total, income) => total + parseFloat(income.amount),
      0
    );

    return { recurringTotal, highestIncome, totalIncome };
  }, [incomes]);

  // Process chart data
  const chartData = useMemo(() => {
    if (!incomes.length) return [];

    const monthlyData = {};

    // First collect all unique months from income data
    incomes.forEach((income) => {
      const date = new Date(income.date);
      const monthYear = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          name: monthYear,
          total: 0,
          recurring: 0,
          nonRecurring: 0,
        };
      }

      const amount = parseFloat(income.amount);
      monthlyData[monthYear].total += amount;
      if (income.isRecurring) {
        monthlyData[monthYear].recurring += amount;
      } else {
        monthlyData[monthYear].nonRecurring += amount;
      }
    });

    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .sort(([monthYearA], [monthYearB]) => {
        const [monthA, yearA] = monthYearA.split(" ");
        const [monthB, yearB] = monthYearB.split(" ");
        return (
          new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`)
        );
      })
      .map(([, data]) => data);
  }, [incomes]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-300">
                {entry.name}:
              </span>
              <span className="font-medium text-gray-900 dark:text-white flex items-center">
                <IndianRupee className="w-3 h-3 mr-1" />
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
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

      {/* Summary Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-500 rounded-lg p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4" />
              <p className="text-lg font-bold">Total Income</p>
            </div>
            <p className="text-2xl font-bold flex items-center mt-8">
              <IndianRupee className="w-5 h-5" />
              {summaryData.totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="bg-indigo-500 rounded-lg p-4 text-white">
            <div className="flex items-center gap-2 mb-">
              <RepeatIcon className="w-4 h-4" />
              <p className="text-lg font-bold">Recurring Income</p>
            </div>
            <p className="text-2xl font-bold flex items-center mt-8">
              <IndianRupee className="w-5 h-5" />
              {summaryData.recurringTotal.toLocaleString()}
            </p>
          </div>

          <div className="bg-emerald-500 rounded-lg p-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <p className="text-lg font-bold">Highest Income</p>
            </div>
            <p className="text-2xl font-bold flex items-center mt-8">
              <IndianRupee className="w-5 h-5" />
              {summaryData.highestIncome.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <IncomeChart chartData={chartData} />

      {/* Income List and Delete Dialog */}
      <IncomeDisplay
        incomes={incomes}
        isSubmitting={isSubmitting}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        handleEdit={handleEdit}
        handleDeleteClick={handleDeleteClick}
        handleDelete={handleDelete}
        formatDate={formatDate}
      />

      {/* Forms */}
      <IncomeForm
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        showEditDialog={showEditDialog}
        setShowEditDialog={setShowEditDialog}
        isSubmitting={isSubmitting}
        formData={formData}
        setFormData={setFormData}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        handleAddSubmit={handleAddSubmit}
        handleEditSubmit={handleEditSubmit}
      />
    </div>
  );
};

export default Income;
