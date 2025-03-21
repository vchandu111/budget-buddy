import React from "react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="py-20 h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 text-left mb-10 lg:mb-0">
            <h1 className="text-6xl font-extrabold text-gray-900 mb-6 font-['Poppins']">
              <span className="block mb-4">Manage Your</span>
              <span className="block mb-4">Expenses Easily</span>
              <span className="text-indigo-600 block">With BudgetBuddy</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 font-['Inter'] leading-relaxed max-w-xl">
              Take control of your finances with our intuitive budgeting tools.
              Track expenses, set goals, and make informed decisions in just a
              few clicks.
            </p>
            <Link
              to="/demo"
              className="bg-indigo-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-all inline-block shadow-md"
            >
              Try Demo Now
            </Link>
          </div>

          <div className="lg:w-1/2 relative">
            <img
              src="https://d1muf25xaso8hp.cloudfront.net/https%3A%2F%2F7146ebd610c4e00f7c3a0ec607a7c01a.cdn.bubble.io%2Ff1703660948031x763280807179639900%2Fimage%2520%252812%2529.png?w=1024&h=&auto=compress&dpr=1.75&fit=max"
              alt="Budget Dashboard Preview"
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
