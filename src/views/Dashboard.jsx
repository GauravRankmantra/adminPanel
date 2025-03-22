import { Alert, Badge, Col, Container, Row } from "react-bootstrap";
import { Bar, BarChart, Line, LineChart } from "recharts";
import StatsCard from "@/components/StatsCard/StatsCard";
import Traffic from "@/components/Traffic/Traffic";
import axios from "axios";

import Download from "@/components/Download/Download";
import Revenue from "@/components/Revenue/Revenue";

import SocialCounter from "@/components/SocialCounter/SocialCounter";

import RealTime from "@/components/RealTime/RealTime";
import { useEffect, useState } from "react";
import SongsUploadedChart from "../components/SongsUploadedChart";

const Dashboard = () => {
  const data1 = [
    {
      name: "Page A",
      uv: 2000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 6000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 4000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 8000,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 4000,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 6000,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 2000,
      pv: 4300,
      amt: 2100,
    },
    {
      name: "Page G",
      uv: 5000,
      pv: 4300,
      amt: 2100,
    },
  ];

  const data2 = [
    {
      name: "Page A",
      uv: 400,
      pv: 400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 30,
      pv: 25000,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 10,
      pv: 10500,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 20,
      pv: 50000,
      amt: 2000,
    },
  ];

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalNewUser, setTotalNewUser] = useState(0); // Initialize as 0

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/admin/users"
        );

        setTotalUsers(response.data.totalUsers);
     
      } catch (error) {
        console.error("Error fetching users", error); // Handle error
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/user/new-users"
        );

        // Set users from API response
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users", error); // Handle error
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Calculate total new users only when 'users' state is updated
    const calculateTotalNewUsers = () => {
      const total = users.reduce((acc, user) => acc + user.newUsers, 0);
      setTotalNewUser(total);
    };

    if (users.length > 0) {
      calculateTotalNewUsers();
    }
  }, [users]);

  return (
    <Container fluid className="p-0">
      <Alert variant="success" dismissible>
        <Badge bg="success">Welcome</Badge> Welcom to Admin panel
      </Alert>

      <Row className="gy-4 gx-4 mb-4">
        <Col sm={12} md={6} lg={3} xl={3}>
          <StatsCard
            type="revenue-counter"
            bgColor="#5c6bc0"
            symbol="$"
            counter={2356}
            isCounter={true}
            title="Revenue"
            icon="fa-solid fa-dollar-sign"
          />
        </Col>
        <Col sm={12} md={6} lg={3} xl={3}>
          <StatsCard
            type="revenue-counter"
            bgColor="#66bb6a"
            symbolPosition="right"
            symbol="%"
            counter={23}
            isCounter={true}
            title="Revenue"
            icon={
              <BarChart width={100} height={80} data={data1}>
                <Bar dataKey="uv" fill="#fff" />
              </BarChart>
            }
          />
        </Col>
        <Col sm={12} md={6} lg={3} xl={3}>
          <StatsCard
            type="revenue-counter"
            bgColor="#ffa726"
            counter={totalUsers}
            isCounter={true}
            title="Total Users"
            icon="fa-solid fa-user-group"
          />
        </Col>
        <Col sm={12} md={6} lg={3} xl={3}>
          <StatsCard
            type="revenue-counter"
            bgColor="#42a5f5"
            counter={totalNewUser}
            isCounter={true}
            title="New Users"
            icon={
              <LineChart width={100} height={67} data={data2}>
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#fff"
                  strokeWidth={2}
                />
              </LineChart>
            }
          />
        </Col>
      </Row>

      <Row className="gy-4 gx-4 mb-4">
        <Col md={12} lg={5} xl={5}>
          <RealTime />
        </Col>
        <Col md={12} lg={7} xl={7}>
          <Traffic />
        </Col>
      </Row>
      <Row className="gy-4 gx-4 mb-4">
        <Col >
          <SongsUploadedChart />
        </Col>

      </Row>
      <Row className="justify-content-center gy-4 gx-4 mb-4">
        <Col md={12} lg={6} xl={6}>
          <Row className="justify-content-center gy-4 gx-4">
            <Col sm={12} md={6}>
              <Download />
            </Col>
            <Col sm={12} md={6}>
              <Revenue />
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="justify-content-center gy-4 gx-4 mb-10">
        {" "}
        <Col md={12} lg={8} xl={8}>
          <Row className="justify-content-center gy-4 gx-4">
            {" "}
            <Col sm={12} md={4}>
              <SocialCounter
                padding="28px"
                bgColor="#1DA1F2"
                icon="fa-brands fa-twitter"
                count="1875980"
                isCounter={true}
              />
            </Col>
            <Col sm={12} md={4}>
              <SocialCounter
                padding="28px"
                bgColor="#3B5998"
                icon="fa-brands fa-facebook-f"
                count="1875980"
                isCounter={true}
              />
            </Col>
            <Col sm={12} md={4}>
              <SocialCounter
                padding="28px"
                bgColor="#833AB4"
                icon="fa-brands fa-instagram"
                count="1875980"
                isCounter={true}
              />
            </Col>
          </Row>
        </Col>
        {/* <Col md={12} lg={4} xl={4}>
        <Timeline />
      </Col> */}
      </Row>

      {/* <Row className="gy-4 gx-4">
                <Col className="" md={12} lg={6}>
                    <AnalyticsStats />
                </Col>
                <Col md={12} lg={6}>
                    <Row className="gy-4 gx-4">
                        <Col md={6}>
                            <WeatherStats />
                        </Col>
                        <Col md={6}>
                            <SocialStats />
                        </Col>
                    </Row>
                    <Col className="mt-4">
                        <Row className="gy-4 gx-4">
                            <Col md={6}>
                                <MonthlyStats />
                            </Col>
                            <Col md={6}>
                                <DeviceVisitorStats />
                            </Col>
                        </Row>
                    </Col>
                </Col>
            </Row> */}
    </Container>
  );
};

export default Dashboard;
