import React from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  BarChart2,
  FileText,
  Scale,
  Layout,
  Camera,
} from "lucide-react";
import Heading from "../Common/Heading";

const Features = () => {
  const featuresList = [
    {
      id: 1,
      icon: <DollarSign className="w-6 h-6" />,
      title: "Expense Tracking",
      description:
        "Track your daily expenses with ease. Categorize and monitor where your money goes in real-time.",
    },
    {
      id: 2,
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Income Tracking",
      description:
        "Monitor all your income sources in one place. Get a clear view of your cash flow and financial health.",
    },
    {
      id: 3,
      icon: <FileText className="w-6 h-6" />,
      title: "Report Generation",
      description:
        "Generate detailed financial reports with just a few clicks. Gain insights into your spending patterns.",
    },
    {
      id: 4,
      icon: <Scale className="w-6 h-6" />,
      title: "Budget Management",
      description:
        "Set monthly budgets for different categories and receive alerts when you're close to your limits.",
    },
    {
      id: 5,
      icon: <Layout className="w-6 h-6" />,
      title: "User-Friendly Interface",
      description:
        "Intuitive design that makes financial management accessible to everyone, regardless of experience.",
    },
    {
      id: 6,
      icon: <Camera className="w-6 h-6" />,
      title: "Smart Receipt Scanner",
      description:
        "Instantly capture and digitize receipts with our AI-powered scanner. Automatically extract and categorize expense data.",
    },
  ];

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Heading
          title="Key Features"
          description="Discover how BudgetBuddy can transform your financial management experience with these powerful features."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <div
              key={feature.id}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-indigo-100 hover:translate-y-[-4px]"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  index % 2 === 0
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
                }`}
              >
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            to="/demo"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all inline-block shadow-lg mx-3 transform hover:scale-105"
          >
            Try Demo
          </Link>
          <Link
            to="/about"
            className="border-2 border-indigo-600 text-indigo-600 px-10 py-[0.9rem] rounded-xl font-semibold hover:bg-indigo-50 transition-all inline-block mx-3 transform hover:scale-105"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Features;
