import React, { Fragment, useState, useEffect } from "react";
import Card from "@/components/Card/Card";
import ReactApexChart from "react-apexcharts";
import { CardBody } from "react-bootstrap";
import axios from "axios";

const RealTime = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [close, setClose] = useState(false);
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "New Users",
        data: [],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "datetime",
        categories: [],
      },
      tooltip: {
        x: {
          format: "yyyy-MM-dd",
        },
      },
    },
  });

  // Fetch new user data from backend API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/new-users`);
        const data = response.data.data;

        // Map data for the chart
        const newUserSeries = data.map((day) => day.newUsers);
        const dateCategories = data.map((day) => day.day);

        // Update chart data state
        setChartData({
          series: [
            {
              name: "New Users",
              data: newUserSeries,
            },
          ],
          options: {
            ...chartData.options,
            xaxis: {
              ...chartData.options.xaxis,
              categories: dateCategories,
            },
          },
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Fragment>
      {!close ? (
        <Card
          title="Daily New Users"
          dismissible={true}
          onClose={() => setClose(!close)}
        >
          <CardBody className="p-3">
            <div className="d-flex justify-content-center align-items-center overflow-hidden">
              <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="area"
                height={446}
                style={{ width: "100%" }}
              />
            </div>
          </CardBody>
        </Card>
      ) : null}
    </Fragment>
  );
};

export default RealTime;
