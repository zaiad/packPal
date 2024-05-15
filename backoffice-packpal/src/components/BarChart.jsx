import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";

const productsSales = [
  {
    name: "Jan",
    product1: 3456,
    product2: 6565,
  },
  {
    name: "Feb",
    product1: 2345,
    product2: 5432,
  },
  {
    name: "Mar",
    product1: 4567,
    product2: 9876,
  },
  {
    name: "Apr",
    product1: 5678,
    product2: 8765,
  },
  {
    name: "May",
    product1: 6789,
    product2: 7654,
  },
  {
    name: "Jun",
    product1: 7890,
    product2: 6543,
  },
  {
    name: "Jul",
    product1: 8901,
    product2: 5432,
  },
  {
    name: "Aug",
    product1: 9012,
    product2: 4321,
  },
  {
    name: "Sep",
    product1: 1234,
    product2: 3210,
  },
  {
    name: "Oct",
    product1: 2345,
    product2: 2109,
  },
  {
    name: "Nov",
    product1: 3456,
    product2: 1098,
  },
  {
    name: "Dec",
    product1: 4567,
    product2: 987,
  },
];

function BarChartComponent() {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    getStatistic();
  }, []);

  const getStatistic = async () => {
    try {
      const response = await axios.get("http://localhost:2001/statistic");
      const { categoryCount, productCount } = response.data;
      // Format the data to fit the chart
      const formattedData = [
        { name: "Categories", count: categoryCount },
        { name: "Products", count: productCount },
      ];
      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  return (
    <ResponsiveContainer width="50%" height={200}>
      <BarChart width={500} height={400} data={productsSales}>
        <YAxis />
        <XAxis dataKey="name" />
        <CartesianGrid strokeDasharray={"3 3"} />

        <Tooltip content={customTooltip} />
        <Legend />
        <Bar
          type="monotone"
          dataKey={"product1"}
          stroke="#2563eb"
          fill="#3B82f6"
          stackId="1"
        />
        <Bar
          type="monotone"
          dataKey={"product2"}
          stroke="#7928CA"
          fill="#8B46CF"
          stackId="1"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
          <p className="text-medium text-lg text-white">{`${label}`}</p>
          <p className="text-sm text-blue-400">Products :
            <span className="ml-2">{payload[0].value}</span>
          </p>
          <p className="text-sm text-indigo-400">Categories :
            <span className="ml-2">{payload[1].value}</span>
          </p>
        </div>
      );
    }
  };
export default BarChartComponent;
