import {
  Utensils,
  ShoppingCart,
  Plane,
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
  Wallet,
  CreditCard,
  Smartphone,
  Landmark,
  DollarSign,
} from "lucide-react";

export const categories = [
  {
    id: "food",
    name: "Food expenses",
    icon: Utensils,
    iconName: "Utensils",
    color: "#f59e0b",
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: ShoppingCart,
    iconName: "ShoppingCart",
    color: "blue",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: Gamepad,
    iconName: "Gamepad",
    color: "green",
  },
  {
    id: "medical",
    name: "Medical",
    icon: Stethoscope,
    iconName: "Stethoscope",
    color: "red",
  },
  {
    id: "bills",
    name: "Bills and Utilities",
    icon: FileText,
    iconName: "FileText",
    color: "pink",
  },
  {
    id: "education",
    name: "Education",
    icon: GraduationCap,
    iconName: "GraduationCap",
    color: "purple",
  }
];


export const paymentModes = [
  {
    id: "cash",
    name: "Cash",
    icon: Wallet,
    iconName: "Wallet",
    color: "green",
  },
  {
    id: "credit",
    name: "Credit Card",
    icon: CreditCard,
    iconName: "CreditCard",
    color: "blue",
  },
  {
    id: "debit",
    name: "Debit Card",
    icon: CreditCard,
    iconName: "CreditCard",
    color: "purple",
  },
  {
    id: "upi",
    name: "UPI",
    icon: Smartphone,
    iconName: "Smartphone",
    color: "orange",
  },
  {
    id: "bank",
    name: "Bank Transfer",
    icon: Landmark,
    iconName: "Landmark",
    color: "indigo",
  },
  {
    id: "other",
    name: "Other",
    icon: DollarSign,
    iconName: "DollarSign",
    color: "gray",
  },
];
