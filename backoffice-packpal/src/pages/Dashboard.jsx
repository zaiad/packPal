import React from "react";
import Card from "../components/card";
import Chart from "../components/chart";
import BarChartComponent from "../components/BarChart";
import Doughnut from "../components/Doughnut";

const App = () => (
  <div className="">
    <Card />
    {/* <div className="flex flex-wrap px-5 mt-9">
      <Chart />
    </div> */}
    <div className="flex min-h-screen flex-col items-center justify-center px-4 md:px-8 xl:px-10 py-44"> 
    <div className="grid xl:grid-cols-3 lg:grid-cols-2 w-full gap-10 max-w-[1400px]"></div>
      <Chart />
      <BarChartComponent />
      <Doughnut />
    </div>
  </div>
);
export default App;
