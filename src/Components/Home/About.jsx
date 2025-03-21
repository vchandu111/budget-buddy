import React from "react";

const About = () => {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          {/* Left side - Image */}
          <div className="lg:w-1/2">
            <div className=" rounded-3xl">
              <img
                src="https://cdn.prod.website-files.com/66e3cafc52638c58d5c746f1/66efb95a43461a2e100f737d_Frame%201000002107.webp"
                alt="Budget Dashboard"
                className="rounded-2xl w-3/4"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="lg:w-1/2">
            <h2 className="text-5xl font-bold mb-10">
              <span className="block mb-3">Simplify Your</span>
              <span className="block mb-3">Financial</span>
              <span className="block">
                <span className="text-indigo-600">Journey</span> With Us
              </span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
              BudgetBuddy was born out of a simple realization: traditional
              financial management tools weren't keeping up with the pace of
              modern life. As our financial needs evolved, many found themselves
              struggling with manual processes, outdated tools, and fragmented
              systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
