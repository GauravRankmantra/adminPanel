import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Table,
  Spinner,
  Container,
  Row,
  Col,
  Card,
  Badge, // Added Card for a nicer spinner container
} from "react-bootstrap";
import axios from "axios";
import { MdEdit } from "react-icons/md"; // Kept for consistency, though not used in current UI
import {
  FaFilter,
  FaMoneyBillWave,
  FaShoppingCart,
  FaDollarSign,
  FaInfoCircle,
} from "react-icons/fa"; // Added more icons
import AdminRevenueCharts from "../components/AdminRevenueCharts";

const apiUrl = "https://backend-music-xg6e.onrender.com/";
// const apiUrl = "http://localhost:5000/";

const statusEnum = ["pending", "paid", "rejected"]; // Left as is, per instructions

const SalesFilterPanel = () => {
  const [filter, setFilter] = useState("pending"); // Left as is, per instructions
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null); // Left as is, per instructions
  const [updatedStatus, setUpdatedStatus] = useState(""); // Left as is, per instructions

  const [purchaseData, setPurchaseData] = useState([]); // Data for AdminRevenueCharts

  // Fetch sales based on status filter
  const fetchSales = async () => {
    setLoading(true);
    try {
      // Note: The filter is currently not applied to the API call as per previous instructions.
      // If you intend to use the filter for the table, you'll need to re-enable `?status=${filter}` in the URL.
      const res = await axios.get(`${apiUrl}api/v1/sale`, {
        withCredentials: true,
      });
      setSales(res.data);
      setPurchaseData(res.data); // Assuming AdminRevenueCharts needs all sales data
    } catch (err) {
      console.error("Failed to fetch sales:", err);
      // Optional: Add a toast notification for fetch error
      // toast.error("Failed to load sales data.");
    } finally {
      setLoading(false);
    }
  };

  // Update status for a specific sale (currently not used in the UI, left as is)
  const handleStatusUpdate = async (id) => {
    try {
      await axios.patch(
        `${apiUrl}api/v1/sale/${id}`,
        { payoutStatus: updatedStatus },
        { withCredentials: true }
      );
      setEditingId(null);
      fetchSales(); // Refresh sales after update
    } catch (err) {
      console.error("Failed to update status:", err);
      // Optional: Add a toast notification for update error
      // toast.error("Failed to update sale status.");
    }
  };

  useEffect(() => {
    fetchSales();
    // The filter dependency is removed here because the API call currently doesn't use it.
    // If you re-enable filtering for the table, remember to add 'filter' back here.
  }, []);

  return (
    <>
      {/* Admin Revenue Charts Section */}
      {/* This component will receive all sales data to compute revenue stats */}
      <AdminRevenueCharts apiData={purchaseData} />

      <Container className="my-5 p-4 bg-white rounded shadow-lg">
        {/* Sales Overview Header */}
        <Row className="mb-4 align-items-center">
          <Col>
            <h3 className="mb-0 text-primary d-flex align-items-center">
              <FaShoppingCart className="me-3 fs-3 text-info" />{" "}
              {/* Shopping cart icon */}
              Sales Transactions
            </h3>
          </Col>
          {/* Filter section commented out as per instructions */}
          {/* <Col md="auto" className="ms-md-auto">
            <Form.Group controlId="statusFilter" className="mb-0">
              <Form.Label className="visually-hidden">Filter by Status</Form.Label>
              <Form.Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-select-sm"
              >
                {statusEnum.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col> */}
        </Row>

        {/* Loading State for Sales Table */}
        {loading ? (
          <Card className="text-center py-5 my-4 shadow-sm border-0 rounded-3">
            <Card.Body>
              <Spinner animation="border" variant="primary" className="mb-3" />
              <p className="lead text-muted">Loading sales transactions...</p>
              <p className="text-muted small">
                Please wait while we fetch the latest data.
              </p>
            </Card.Body>
          </Card>
        ) : (
          /* Sales Table */
          <Table
            striped
            bordered
            hover
            responsive
            className="bg-light rounded shadow-sm"
          >
            <thead className="table-dark">
              <tr>
                <th>
                  Song{" "}
                  <FaInfoCircle
                    className="ms-1 text-muted small"
                    title="Song Title"
                  />
                </th>
                <th>
                  Buyer{" "}
                  <FaInfoCircle
                    className="ms-1 text-muted small"
                    title="Purchasing User"
                  />
                </th>
                <th>
                  Seller{" "}
                  <FaInfoCircle
                    className="ms-1 text-muted small"
                    title="Selling Artist"
                  />
                </th>
                <th>
                  Amount{" "}
                  <FaDollarSign
                    className="ms-1 text-success small"
                    title="Total Amount Paid by Buyer"
                  />
                </th>
                <th>
                  Received{" "}
                  <FaDollarSign
                    className="ms-1 text-info small"
                    title="Actual Amount Received After Payment Gateway Fees"
                  />
                </th>
                <th>
                  Seller Earning{" "}
                  <FaDollarSign
                    className="ms-1 text-warning small"
                    title="70% of Received Amount for Seller"
                  />
                </th>
                <th>
                  Platform Fee{" "}
                  <FaDollarSign
                    className="ms-1 text-danger small"
                    title="Stripe's Processing Fee"
                  />
                </th>
                <th>
                  Admin Earning{" "}
                  <FaDollarSign
                    className="ms-1 text-primary small"
                    title="30% of Received Amount Minus Stripe Fee"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id}>
                  <td>
                    {sale.songId?.title || (
                      <span className="text-muted fst-italic">N/A</span>
                    )}
                  </td>
                  <td>
                    {sale.buyerId?.fullName || (
                      <span className="text-muted fst-italic">N/A</span>
                    )}
                  </td>
                  <td>
                    {sale.sellerId?.fullName || (
                      <span className="text-muted fst-italic">N/A</span>
                    )}
                    {sale.sellerId?.admin && (
                      <Badge bg="info" size="sm" className="ms-2">
                        AD
                      </Badge> // Bootstrap primary badge for "AD"
                    )}
                  </td>
                  <td>${sale.amountPaid?.toFixed(2) || "0.00"}</td>
                  <td>${sale.amountReceved?.toFixed(2) || "0.00"}</td>
                  <td>${sale.sellerEarning?.toFixed(2) || "0.00"}</td>
                  <td>${sale.platformShare?.toFixed(2) || "0.00"}</td>
                  <td>${sale.adminEarning?.toFixed(2) || "0.00"}</td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-4 text-muted fst-italic"
                  >
                    <FaInfoCircle className="me-2" /> No sales transactions
                    found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
};

export default SalesFilterPanel;
