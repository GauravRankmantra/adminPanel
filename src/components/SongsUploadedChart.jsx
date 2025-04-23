import React, { Fragment, useState, useEffect } from "react";
import Card from "@/components/Card/Card";
import ReactApexChart from "react-apexcharts";
import { CardBody } from "react-bootstrap";
import axios from "axios";

const SongsUploadedChart = () => {
  const [close, setClose] = useState(false);
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Songs Uploaded",
        data: [],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
        width: 2,
        colors: ["#107d02"],
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0,
          colorStops: [
            {
              offset: 0,
              color: "#38d52a", // Start of the gradient (lighter blue)
              opacity: 0.6,
            },
            {
              offset: 100,
              color: "#1ee17a", // End of the gradient (light blue)
              opacity: 0.1,
            },
          ],
        },
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

  // Fetch songs uploaded data from backend API
  useEffect(() => {
    const fetchSongsData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/song/songs-uploaded-this-week"
        );
        const data = response.data.data;

        // Map data for the chart
        const uploadedSongsSeries = data.map((day) => day.uploadedSongs);
        const dateCategories = data.map((day) => day.date);

        // Update chart data state
        setChartData({
          series: [
            {
              name: "Songs Uploaded",
              data: uploadedSongsSeries,
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
        console.error("Error fetching song data:", error);
      }
    };

    fetchSongsData();
  }, []);

  return (
    <Fragment>
      {!close ? (
        <Card
          title="Songs Uploaded This Week"
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

export default SongsUploadedChart;
