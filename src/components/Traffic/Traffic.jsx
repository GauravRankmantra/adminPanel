import React, { Fragment, useState, useEffect } from "react";
import { CardBody } from "react-bootstrap";
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
import axios from "axios"; // Axios to make API calls
import styles from "@/assets/scss/Traffic.module.scss";

const Traffic = () => {
    const [close, setClose] = useState(false);
    const [trafficData, setTrafficData] = useState([]); 
    const [loading, setLoading] = useState(true); 

 
    useEffect(() => {
        const fetchTrafficData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/v1/traffic"); // API call to get traffic data
                setTrafficData(response.data.data); 
                setLoading(false); 
            } catch (error) {
                console.error("Error fetching traffic data:", error);
                setLoading(false); 
            }
        };

        fetchTrafficData();
    }, []);

    return (
        <Fragment>
            {!close ? (
                <Card
                    title="Website Traffic"
                    dismissible={true}
                    onClose={() => setClose(!close)}
                >
                    <CardBody className="p-3">
              
                        {loading ? (
                            <div>Loading traffic data...</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={345}>
                                <LineChart
                                    data={trafficData}
                                    fontSize="11px"
                                    color="#999999"
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -10,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" /> 
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="totalVisits"
                                        stroke="#5C6BC0"
                                        strokeWidth={2}
                                        fill="#5C6BC0"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardBody>
                </Card>
            ) : null}
        </Fragment>
    );
};

export default Traffic;
