import React from "react";
import "./BarChart.css";

import { Bar } from "react-chartjs-2";
export const BarChart = ({ chartData }) => {
  const options = {
    animation: {
      duration: 1500, // Animation duration in milliseconds
      easing: "easeInOutQuart", // Easing function
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};
export default BarChart;
