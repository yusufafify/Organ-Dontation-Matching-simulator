import React from "react";
import { Doughnut } from "react-chartjs-2";

const ComplexityModal = ({ benchMark, onClose }) => {
  // Doughnut chart data
  const data = {
    datasets: [
      {
        data: [1000 - benchMark.executionTime], // Display execution time out of 1000ms
        backgroundColor: ["#4ade80"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%", // Hollow center for text
    plugins: {
      tooltip: { enabled: false }, // Hide tooltip for simplicity
      legend: { display: false },
    },
    animation: {
      animateRotate: true,
      // animateScale: true,
      duration: 3000, // 1-second animation duration
    },
  };

  return (
    <div
      className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-md w-full transform transition-transform duration-300 translate-y-0"
      style={{ transform: "translateY(-100px)" }} // Slide in from top
    >
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Complexity Analysis</h2>
      </div>

      <div className="flex flex-wrap gap-4 mb-2 items-center w-full justify-center">
        <div className="flex gap-2 items-center">
          <div className="w-3 h-3 bg-green-200 rounded-full" />
          <p className="text-xs">
            {" "}
            <span>{benchMark.donorCount}</span> donors
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-3 h-3 bg-green-200 rounded-full" />
          <p className="text-xs">
            <span>{benchMark.recipientCount}</span> recipients
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-3 h-3 bg-green-200 rounded-full" />
          <p className="text-xs">
            <span>{benchMark.matches?.length}</span> matches
          </p>
        </div>
      </div>

      <div className="flex my-1 justify-center items-center relative w-full h-48">
        <Doughnut data={data} options={options} />
        {/* Centered execution time */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="md:text-3xl text-xl font-semibold text-green-400">
            {benchMark.executionTime} ms
          </p>
          <p className="text-sm  text-gray-300">Execution Time</p>
        </div>
      </div>
      <p className="text-xl w-fit">
        Complexity:{" "}
        <span className="text-base text-gray-300 font-semibold">
          {benchMark.complexity}
        </span>
      </p>

      <button
        onClick={onClose}
        className="mt-6 text-red-400 border border-white py-1 px-4 hover:bg-red-500 hover:text-white transition duration-300 ease-in-out hover:border-red-500 rounded"
      >
        Close
      </button>
    </div>
  );
};

export default ComplexityModal;
