import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import axios from "axios";

const COLORS = ["#FF0000", "#FFA500", "#FFFF00", "#008000"]; // Red, Orange, Yellow, Green

function DoughnutChartComponent() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    getStatistic();
  }, []);

  const getStatistic = async () => {
    try {
      const response = await axios.get("http://localhost:2001/statistic");
      const { userCount, productCount, orderCount, categoryCount } = response.data;
      // Format the data to fit the chart
      const formattedData = [
        { name: "Users", value: userCount },
        { name: "Products", value: productCount },
        { name: "Orders", value: orderCount },
        { name: "Categories", value: categoryCount },
      ];
      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  return (
    <ResponsiveContainer width="50%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={customTooltip} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

const customTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg text-white">{payload[0].name}</p>
        <p className="text-sm text-blue-400">
          Value: <span className="ml-2">{payload[0].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

export default DoughnutChartComponent;
