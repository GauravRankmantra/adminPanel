import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Pagination,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import { FaInfoCircle, FaSearch, FaFilter } from "react-icons/fa"; // Import icons
import TransactionDetailModal from "./TransactionDetailModal";
import AdminRevenueCharts from "../components/AdminRevenueCharts";

// Helper function for currency formatting
const formatCurrency = (amount, currency, locale = "en-US") => {

  if (amount === null || amount === undefined) return "N/A";
  // Ensure amount is treated as a number for formatting
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) return "Invalid Amount";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch (e) {
    console.error("Error formatting currency:", e);
    return `${numericAmount.toFixed(2)} ${currency}`; // Fallback
  }
};

// Helper function for date formatting
const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  try {
    return new Date(isoString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (e) {
    return isoString; // Fallback
  }
};

const SalesFilterPanel = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(`${apiUrl}/sale`);
        // Assuming your API returns an array directly, or response.data.payments
        setPayments(response.data || []);
      } catch (err) {
        setError("Failed to fetch payments. Please try again.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleRowClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  // --- Filtering Logic ---
  const filteredPayments = payments?.filter((payment) => {
    const matchesSearch =
      payment.paymentIntentId
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.receiptEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.buyerId?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.sellerId?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.songId?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "succeeded" && payment.paymentStatus === "succeeded") ||
      (filterStatus === "pending" && payment.paymentStatus === "pending") ||
      (filterStatus === "pending_payout" && payment.payoutStatus === "pending"); // Added payout status filter

    return matchesSearch && matchesStatus;
  });

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container fluid className="py-4">
      <AdminRevenueCharts apiData={payments} />
      <Row className="mb-4">
        <Col>
          <h2 className="text-center text-primary">Payment Transactions</h2>
        </Col>
      </Row>

      {/* Search and Filter Controls */}
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by Payment ID, Email, Buyer, Seller, Song..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1); // Reset page on filter change
            }}
          >
            <option value="all">All Statuses</option>
            <option value="succeeded">Payment Succeeded</option>
            <option value="pending">Payment Pending</option>
            <option value="pending_payout">Payout Pending</option>{" "}
            {/* New filter option */}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("all");
              setCurrentPage(1);
            }}
          >
            <FaFilter className="me-1" />
            Clear Filters
          </Button>
        </Col>
      </Row>

      {loading && (
        <Row className="justify-content-center my-5">
          <Col xs="auto">
            <Spinner animation="border" role="status" className="me-2" />
            <span>Loading payments...</span>
          </Col>
        </Row>
      )}

      {error && (
        <Row className="justify-content-center my-3">
          <Col md={8}>
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {!loading && !error && filteredPayments.length === 0 && (
        <Row className="justify-content-center my-3">
          <Col md={8}>
            <Alert variant="info" className="text-center">
              No payments found matching your criteria.
            </Alert>
          </Col>
        </Row>
      )}

      {!loading && !error && filteredPayments.length > 0 && (
        <>
          <Row>
            <Col>
              <Table striped bordered hover responsive className="shadow-sm">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Payment ID</th>
                    <th>Customer Email</th>
                    <th>Customer Paid</th>
                    <th>Processed Amount</th>
                    <th>Net Earning</th>
                    <th>Seller Earning</th>
                    <th>Admin Earning</th>
                    <th>Payment Status</th>
                    <th>Payout Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((payment, index) => (
                    <tr
                      key={payment._id}
                      onClick={() => handleRowClick(payment)}
                      style={{ cursor: "pointer" }}
                      className="align-middle"
                    >
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{payment.paymentIntentId || "N/A"}</td>
                      <td>{payment.receiptEmail || "N/A"}</td>
                      <td>
                        {formatCurrency(
                          payment.customerFacingAmount,
                          payment.customerFacingCurrency
                        )}
                      </td>
                      <td>
                        {formatCurrency(
                          payment.processedAmount,
                          payment.processedCurrency
                        )}
                      </td>
                      <td>
                        {formatCurrency(
                          payment.netAmount,
                          payment.processedCurrency // Net amount is in processed currency
                        )}
                      </td>
                      <td>
                        {formatCurrency(
                          payment.sellerEarning,
                          payment.processedCurrency // Assuming sellerEarning is in USD or primary currency
                        )}
                      </td>
                      <td>
                        {formatCurrency(
                          payment.adminEarning,
                          payment.processedCurrency // Assuming adminEarning is in USD or primary currency
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge bg-${
                            payment.paymentStatus === "succeeded"
                              ? "success"
                              : payment.paymentStatus === "pending"
                              ? "warning"
                              : "danger"
                          }`}
                        >
                          {payment.paymentStatus || "N/A"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge bg-${
                            payment.payoutStatus === "paid"
                              ? "success"
                              : payment.payoutStatus === "pending"
                              ? "warning"
                              : "info"
                          }`}
                        >
                          {payment.payoutStatus || "N/A"}
                        </span>
                      </td>
                      <td>{formatDate(payment.createdDateTime)}</td>
                      <td className="text-center">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click from triggering
                            handleRowClick(payment);
                          }}
                        >
                          <FaInfoCircle />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Row className="justify-content-center mt-3">
              <Col xs="auto">
                <Pagination>
                  <Pagination.First
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages).keys()].map((number) => (
                    <Pagination.Item
                      key={number + 1}
                      active={number + 1 === currentPage}
                      onClick={() => paginate(number + 1)}
                    >
                      {number + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </Col>
            </Row>
          )}
        </>
      )}

      {selectedTransaction && (
        <TransactionDetailModal
          show={showModal}
          onHide={handleCloseModal}
          transaction={selectedTransaction}
        />
      )}
    </Container>
  );
};

export default SalesFilterPanel;
