import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Chart: React.FC = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "API Consumption",
        data: [4000, 8000, 12000, 10000, 15000],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
      },
      {
        label: "Revenue",
        data: [2000, 4000, 6000, 8000, 10000],
        borderColor: "rgb(54, 162, 235)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Consumption and Revenue Trends" },
    },
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg" >
      <Line data={data} options={options}  />
    </div>
  );
};

export default Chart;
