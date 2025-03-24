import React from "react";
import IncomeForm from "./IncomeForm";
import IncomeDisplay from "./IncomeDisplay";
import IncomeChart from "./IncomeChart";

const Income = () => {
  return (
    <div className="p-8 space-y-8">
      <IncomeForm />
      <div className="w-full">
        <IncomeChart />
      </div>
      <div>
        <IncomeDisplay />
      </div>
    </div>
  );
};

export default Income;
