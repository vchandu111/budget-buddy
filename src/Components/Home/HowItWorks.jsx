import React from "react";
import { UserPlus, BarChart2, LineChart } from "lucide-react";
import Heading from "../Common/Heading";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <UserPlus className="w-6 h-6" />,
      title: "Create Your Account",
      description:
        "Get started in minutes with our simple and secure sign-up process.",
    },
    {
      id: 2,
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Track Your Spending",
      description:
        "Automatically categorize and track your transactions in real-time.",
    },
    {
      id: 3,
      icon: <LineChart className="w-6 h-6" />,
      title: "Get Insights",
      description:
        "Receive AI-powered insights and recommendations to optimize your finances.",
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Heading
          title="How It Works"
          description="Start your financial journey with BudgetBuddy in three simple steps."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-6 mx-auto">
                <div className="text-indigo-600">{step.icon}</div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {step.id}. {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
