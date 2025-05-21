import React, { useEffect, useState } from "react";
import { Card, Row, Col, Container } from "react-bootstrap"; // Added Container
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import moment from "moment";
import {
  FaDollarSign,
  FaChartLine,
  FaClipboardList,
  FaExclamationTriangle,
} from "react-icons/fa"; // Added icons
import { IoMdMusicalNote } from "react-icons/io";

// Custom Tooltip for better styling and readability
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-dark text-white p-3 rounded shadow-lg border border-secondary">
        <p className="label mb-1">
          <strong>Date:</strong> {label}
        </p>
        <p className="intro" style={{ color: payload[0].stroke }}>
          <strong>Admin Earning:</strong> ${payload[0].value?.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const AdminRevenueCharts = ({ apiData }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [allTimeData, setAllTimeData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(""); // Added error state

  useEffect(() => {
    if (!apiData) {
      setLoading(false);
      setError("No API data provided.");
      return;
    }

    if (apiData.length === 0) {
      setLoading(false);
      setError("No revenue data available to display charts.");
      setWeeklyData([]);
      setAllTimeData([]);
      setSummary({ totalEarning: 0, pendingPayout: 0 });
      return;
    }

    setLoading(true);
    setError("");

    const now = moment();
    const startOfWeek = moment().startOf("isoWeek");

    let totalEarning = 0;
    let pendingPayout = 0;

    // Use a map to aggregate earnings by date for both weekly and all-time
    const weeklyMap = new Map();
    const allTimeMap = new Map();

    apiData.forEach((item) => {
      const date = moment(item.createdAt);
      const dateStr = date.format("YYYY-MM-DD"); // Format for X-axis

      // Aggregate weekly data
      if (
        date.isSameOrAfter(startOfWeek, "day") &&
        date.isSameOrBefore(now, "day")
      ) {
        weeklyMap.set(
          dateStr,
          (weeklyMap.get(dateStr) || 0) + item.adminEarning
        );
      }

      // Aggregate all time data
      allTimeMap.set(
        dateStr,
        (allTimeMap.get(dateStr) || 0) + item.adminEarning
      );

      totalEarning += item.adminEarning;
      if (item.payoutStatus === "pending") {
        pendingPayout += item.adminEarning;
      }
    });

    // Convert maps to array format for Recharts
    const sortedWeekly = Array.from(weeklyMap.entries())
      .map(([date, earning]) => ({ date, adminEarning: earning }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure chronological order

    const sortedAllTime = Array.from(allTimeMap.entries())
      .map(([date, earning]) => ({ date, adminEarning: earning }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ensure chronological order

    setWeeklyData(sortedWeekly);
    setAllTimeData(sortedAllTime);
    setSummary({ totalEarning, pendingPayout });
    setLoading(false);
  }, [apiData]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading revenue charts...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-danger" role="alert">
          <FaExclamationTriangle className="me-2" /> {error}
        </div>
      </Container>
    );
  }

  // Helper to render chart or a no data message
  const renderChart = (data, title, strokeColor) => (
    <Card className="mb-4 shadow-lg border-0 rounded-3">
      <Card.Body className="p-4">
        <h5 className="card-title text-primary mb-4 d-flex align-items-center">
          <FaChartLine className="me-2 fs-4" /> {title}
        </h5>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={data}
              margin={{ top: 15, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="date"
                tickFormatter={(tick) => moment(tick).format("MMM DD")}
                angle={-30}
                textAnchor="end"
                height={50}
                stroke="#666"
              />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="adminEarning"
                stroke={strokeColor}
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: strokeColor,
                  stroke: "#fff",
                  strokeWidth: 1,
                }}
                activeDot={{
                  r: 6,
                  fill: strokeColor,
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                name="Admin Earnings"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-5 bg-light rounded">
            <h6 className="text-muted">No data available for this chart.</h6>
            <p className="text-muted small">
              Try checking a different time period or ensure transactions exist.
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="py-4 bg-light">
      <h2 className="text-center mb-5 text-dark font-weight-bold">
        <FaDollarSign className="me-2 text-success" /> Admin Revenue Dashboard
      </h2>

      {/* Revenue Summary Info Cards */}
      <Row className="mb-5 justify-content-center">
        <Col lg={4} md={6} className="mb-4">
          <Card className="shadow-lg border-0 rounded-3 h-100 bg-success text-white">
            <Card.Body className="d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center mb-3">
                <FaDollarSign className="me-3 fs-1 text-white opacity-75" />
                <div>
                  <h6 className="mb-1 text-uppercase opacity-75">
                    Total Admin Earnings
                  </h6>
                  <h3 className="font-weight-bold">
                    ${summary.totalEarning?.toFixed(2) || "0.00"}
                  </h3>
                </div>
              </div>
              <small className="text-white opacity-75">
                Accumulated earnings from all transactions.
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} className="mb-4">
          <Card className="shadow-lg border-0 rounded-3 h-100 bg-warning text-dark">
            <Card.Body className="d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center mb-3">
                <IoMdMusicalNote className="me-3 fs-1 text-dark opacity-75" />
                <div>
                  <h6 className="mb-1 text-uppercase opacity-75">
                    Total Song Sold
                  </h6>
                  <h3 className="font-weight-bold">{apiData?.length || "0"}</h3>
                </div>
              </div>
              <small className="text-dark opacity-75">
                All time total song sold
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} md={6} className="mb-4">
          <Card className="shadow-lg border-0 rounded-3 h-100 bg-info text-white">
            <Card.Body className="d-flex flex-column justify-content-between">
              <div className="d-flex align-items-center mb-3">
                <FaClipboardList className="me-3 fs-1 text-white opacity-75" />
                <div>
                  <h6 className="mb-1 text-uppercase opacity-75">
                    Total Transactions
                  </h6>
                  <h3 className="font-weight-bold">{apiData.length}</h3>
                </div>
              </div>
              <small className="text-white opacity-75">
                Total number of sales processed.
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row className="justify-content-center">
        <Col lg={12}>
          {renderChart(weeklyData, "This Week - Admin Earnings", "#007bff")}{" "}
          {/* Primary blue */}
        </Col>
        <Col lg={12}>
          {renderChart(allTimeData, "All Time - Admin Earnings", "#28a745")}{" "}
          {/* Success green */}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminRevenueCharts;
