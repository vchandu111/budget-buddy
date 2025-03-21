import React from "react";

const Heading = ({ title, description }) => {
  return (
    <div className="text-center mb-16">
      <h2 className="text-5xl font-bold text-gray-900 mb-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          {title}
        </span>
      </h2>
      {description && (
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default Heading;
