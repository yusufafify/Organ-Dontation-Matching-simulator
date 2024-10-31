import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  defaults,
} from "chart.js";
import { getPerson } from "../endpoints/personEndpoint";

ChartJS.register(ArcElement, Tooltip, Legend);
defaults.maintainAspectRatio = false;
defaults.responsive = true;
import { benchmarkMatchFunction, matchDonorsAndRecipients } from "../helper";
import ComplexityModal from "./ComplexityModal";

const TableView = () => {
  // Sample data for the pie chart
  const [donorData, setDonorData] = useState([]);
  const [recipient, setRecipient] = useState([]);
  const [matches, setMatches] = useState([]);
  const [benchMark, setBenchMark] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getPerson("recipient")
      .then((data) => {
        setRecipient(data);
      })
      .catch((err) => console.log(err));
    getPerson("donor")
      .then((data) => setDonorData(data))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, []);

  async function analyzeComplexity() {
    const complexityEvaluation = await benchmarkMatchFunction(
      donorData,
      recipient
    );
    setBenchMark(complexityEvaluation);
    setShowModal(true); // Show modal on button click
  }
  async function handleMatches() {
    setIsCalculating(true);

    try {
      const data = await matchDonorsAndRecipients(donorData, recipient);
      setMatches(data);
    } catch (error) {
      console.error("Error calculating matches:", error); // Log any error
    } finally {
      setIsCalculating(false);
    }
  }

  const data = {
    labels: ["Donors", "Recipients", "Matches", "No match Recipients"],
    datasets: [
      {
        label: "Count",
        data: [
          donorData.length,
          recipient.length,
          matches.length,
          matches.length !== 0 && recipient.length - matches.length,
        ], // Replace with actual counts
        backgroundColor: ["#4ade80", "#46b98c", "#bbe4d4", "#10a86f"],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    elements: {
      arc: {
        borderWidth: 0, // Remove the border by setting width to 0
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (context.parsed > 0) {
              label += `: ${context.parsed}`;
            }
            return label;
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="relative w-full grid place-items-center">
        <div className="w-12 h-12 rounded-full absolute top-10 border-8 border-solid border-gray-200"></div>
        <div className="w-12 h-12 rounded-full animate-spin absolute  top-10 border-8 border-solid border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 relative gap-4 w-full p-3 2xl:h-[59rem] h-[48rem]">
      {/* Show modal conditionally */}

      <div
        className={`${
          showModal ? "opacity-100" : "opacity-0 pointer-events-none"
        } fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300`}
      >
        {showModal&&  <ComplexityModal
          benchMark={benchMark}
          onClose={() => setShowModal(false)}
        />}
      
      </div>
      {isCalculating && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70">
          <div className="relative w-full grid place-items-center">
            <div className="w-12 h-12 rounded-full border-8 border-solid border-gray-200"></div>
            <div className="w-12 h-12 rounded-full animate-spin border-8 border-solid border-green-500 border-t-transparent"></div>
          </div>
        </div>
      )}

      {/* Donors Table */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <h2 className="text-lg font-semibold text-green-400 mb-3">
          Donors Table
        </h2>
        <div className="overflow-x-auto  max-h-[20rem]">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-gray-700 text-green-300">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Age</th>
                <th className="p-2">Weight</th>
                <th className="p-2">Height</th>
                <th className="p-2">Blood Type</th>
                <th className="p-2">Organ</th>
              </tr>
            </thead>
            <tbody>
              {donorData.length >= 500 ? (
                <>
                  {donorData.slice(0, donorData.length / 4).map((donor, i) => (
                    <tr
                      key={i}
                      className="bg-gray-800 border-b border-gray-700"
                    >
                      <td className="p-2">{donor.id}</td>
                      <td className="p-2">{donor.name}</td>
                      <td className="p-2">{donor.age}</td>
                      <td className="p-2">{donor.weight}</td>
                      <td className="p-2">{donor.height}</td>
                      <td className="p-2">{donor.blood_type}</td>
                      <td className="p-2">{donor.organ}</td>
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  {donorData.map((donor, i) => (
                    <tr
                      key={i}
                      className="bg-gray-800 border-b border-gray-700"
                    >
                      <td className="p-2">{donor.id}</td>
                      <td className="p-2">{donor.name}</td>
                      <td className="p-2">{donor.age}</td>
                      <td className="p-2">{donor.weight}</td>
                      <td className="p-2">{donor.height}</td>
                      <td className="p-2">{donor.blood_type}</td>
                      <td className="p-2">{donor.organ}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recipients Table */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <h2 className="text-lg font-semibold text-green-400 mb-3">
          Recipient Table
        </h2>
        <div className="overflow-x-auto max-h-[20rem]">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-gray-700 text-green-300">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Age</th>
                <th className="p-2">Weight</th>
                <th className="p-2">Height</th>
                <th className="p-2">Blood Type</th>
                <th className="p-2">Organ</th>
              </tr>
            </thead>
            <tbody>
              {recipient.length >= 500 ? (
                <>
                  {recipient
                    .slice(0, recipient.length / 4)
                    .map((recipient, i) => (
                      <tr
                        key={i}
                        className="bg-gray-800 border-b border-gray-700"
                      >
                        <td className="p-2">{recipient.id}</td>
                        <td className="p-2">{recipient.name}</td>
                        <td className="p-2">{recipient.age}</td>
                        <td className="p-2">{recipient.weight}</td>
                        <td className="p-2">{recipient.height}</td>
                        <td className="p-2">{recipient.blood_type}</td>
                        <td className="p-2">{recipient.organ}</td>
                      </tr>
                    ))}
                </>
              ) : (
                <>
                  {recipient.map((recipient, i) => (
                    <tr
                      key={i}
                      className="bg-gray-800 border-b border-gray-700"
                    >
                      <td className="p-2">{recipient.id}</td>
                      <td className="p-2">{recipient.name}</td>
                      <td className="p-2">{recipient.age}</td>
                      <td className="p-2">{recipient.weight}</td>
                      <td className="p-2">{recipient.height}</td>
                      <td className="p-2">{recipient.blood_type}</td>
                      <td className="p-2">{recipient.organ}</td>
                    </tr>
                  ))}
                </>
              )}

              {/* Repeat for additional rows */}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matched Donors and Recipients Table */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <h2 className="text-lg font-semibold text-green-400 mb-3">
          Matched Donors and Recipients
        </h2>
        {matches.length !== 0 ? (
          <>
            <div className="overflow-x-auto  max-h-[20rem]">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs uppercase bg-gray-700 text-green-300">
                  <tr>
                    <th className="p-2">Donor ID</th>
                    <th className="p-2">Donor Name</th>
                    <th className="p-2">Recipient ID</th>
                    <th className="p-2">Recipient Name</th>
                    <th className="p-2">Organ</th>
                    <th className="p-2">Blood Type(D)</th>
                    <th className="p-2">Blood Type(R)</th>
                    <th className="p-2">Compatibility Score</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.length >= 500 ? (
                    <>
                      {matches.slice(0, matches.length / 4).map((mat, i) => (
                        <tr
                          key={i}
                          className="bg-gray-800 border-b border-gray-700"
                        >
                          <td className="p-2">{mat.donor.id}</td>
                          <td className="p-2">{mat.donor.name}</td>
                          <td className="p-2">{mat.recipient.id}</td>
                          <td className="p-2">{mat.recipient.name}</td>
                          <td className="p-2">{mat.donor.organ}</td>
                          <td className="p-2">{mat.donor.blood_type}</td>
                          <td className="p-2">{mat.recipient.blood_type}</td>
                          <td className="p-2">{mat.compatibilityScore}</td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <>
                      {matches.map((mat, i) => (
                        <tr
                          key={i}
                          className="bg-gray-800 border-b border-gray-700"
                        >
                          <td className="p-2">{mat.donor.id}</td>
                          <td className="p-2">{mat.donor.name}</td>
                          <td className="p-2">{mat.recipient.id}</td>
                          <td className="p-2">{mat.recipient.name}</td>
                          <td className="p-2">{mat.donor.organ}</td>
                          <td className="p-2">{mat.donor.blood_type}</td>
                          <td className="p-2">{mat.recipient.blood_type}</td>
                          <td className="p-2">{mat.compatibilityScore}</td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <p className="text-center text-white font-semibold text-xl">
              No match data please click on Match button
            </p>
          </>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
        <h2 className="text-lg font-semibold text-green-400 mb-3">
          Analytics Chart
        </h2>
        <div>
          {data.datasets[0].data.length !== 0 && (
            <Pie data={data} options={options} width={350} height={350} />
          )}
          {data.datasets[0].data.length === 0 && (
            <p className="text-center text-white font-semibold text-xl">
              No Data Yet
            </p>
          )}
        </div>
      </div>
      {/* Button Container */}
      <div className="flex justify-center gap-3 flex-wrap w-full p-3 md:col-span-2 row-span-1 h-fit">
        <button
          onClick={handleMatches}
          className=" bg-green-600  hover:bg-green-500 transition duration-300 ease-in-out text-white py-1.5 px-6 md:w-fit w-full rounded-xl  font-bold text-xl"
        >
          Match
        </button>
        <button
          onClick={analyzeComplexity}
          disabled={matches.length === 0}
          className=" bg-[#10a86f] hover:bg-[#46b98c] disabled:cursor-not-allowed transition duration-300 ease-in-out disabled:opacity-40 text-white py-1.5 px-6 md:w-fit w-full rounded-xl  font-bold text-xl"
        >
          Analyze Complexity
        </button>
      </div>
    </div>
  );
};

export default TableView;
