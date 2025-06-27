import React, { Fragment, useState, useEffect } from "react";
import { CardBody, Button, ButtonGroup } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "@/components/Card/Card";
import axios from "axios";
import styles from "@/assets/scss/Traffic.module.scss";

const Traffic = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [range, setRange] = useState("week");
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrafficData = async (selectedRange) => {
    try {
      const res = await axios.get(`${apiUrl}/traffic?range=${selectedRange}`);
      const data = res.data.data.sort(
        (a, b) => new Date(a.dayDate) - new Date(b.dayDate)
      );
      setTrafficData(data);
    } catch (error) {
      console.error("Error fetching traffic data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrafficData(range);
  }, [range]);

  return (
    <Fragment>
      <Card
        title="Website Traffic"
        dismissible={true}
        onClose={() => setTrafficData([])}
      >
        <CardBody className="p-3">
          <div className="mb-3">
            <ButtonGroup aria-label="Traffic Filter">
              <Button
                variant={range === "week" ? "primary" : "outline-primary"}
                onClick={() => setRange("week")}
              >
                This Week
              </Button>
              <Button
                variant={range === "month" ? "primary" : "outline-primary"}
                onClick={() => setRange("month")}
              >
                This Month
              </Button>
              <Button
                variant={range === "all" ? "primary" : "outline-primary"}
                onClick={() => setRange("all")}
              >
                All Time
              </Button>
            </ButtonGroup>
          </div>
          {loading ? (
            <div>Loading traffic data...</div>
          ) : (
            <ResponsiveContainer width="100%" height={345}>
              <LineChart
                data={trafficData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="totalVisits"
                  stroke="#5C6BC0"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default Traffic;
