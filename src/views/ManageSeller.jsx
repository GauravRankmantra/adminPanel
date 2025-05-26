import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Pagination,
} from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import SellerDetailModal from "./SellerDetailModal";
import SalesFilterPanel from "./SalesFilterPanel";

// --- API Constants & Service (Integrated directly) ---
const BASE_URL = "https://backend-music-xg6e.onrender.com/api/v1";

const API_ENDPOINTS = {
  GET_PENDING_REQUESTS_COUNT: `${BASE_URL}/seller/pending-requests/count`,
  GET_ACTIVE_SELLERS_COUNT: `${BASE_URL}/seller/active-sellers/count`,
  GET_VERIFICATION_REQUESTS: `${BASE_URL}/seller/verification-requests`,
  GET_ACTIVE_SELLERS: `${BASE_URL}/seller/active-sellers`,
  GET_REJCTED_SELLERS: `${BASE_URL}/seller/disable-sellers`,
  CONFIRM_USER_REQUEST: `${BASE_URL}/seller/confirm-request`,
  DISABLE_USER: `${BASE_URL}/seller/disable-request`,
  GET_REJECTED_SELLERS_COUNT: `${BASE_URL}/seller/rejected-seller/count`,
};

// Helper to get token (MOCK: Replace with your actual auth logic, e.g., from localStorage)
const getAuthToken = () => {
  // In a real app, you'd get this from localStorage, Redux store, or Auth context
  // Example: return localStorage.getItem('accessToken');
  return "YOUR_ADMIN_ACCESS_TOKEN_HERE"; // *** IMPORTANT: Replace with a valid admin token for testing ***
};

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

const ITEMS_PER_PAGE = 8; // Number of items to display per page

const ManageSeller = () => {
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [activeSellersCount, setActiveSellersCount] = useState(0);
  const [rejectedSellerCount, setRejectedSellerCount] = useState(0);
  const [userList, setUserList] = useState([]); // Stores the raw data from API (either active sellers or pending requests)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("approved"); // 'approved' or 'pending'
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  // --- API Calls ---

  // Fetches the counts for pending requests and active sellers
  const fetchCounts = useCallback(async () => {
    try {
      const [pendingRes, activeRes, rejectedRes] = await Promise.all([
        axios.get(API_ENDPOINTS.GET_PENDING_REQUESTS_COUNT, getConfig()),
        axios.get(API_ENDPOINTS.GET_ACTIVE_SELLERS_COUNT),
        axios.get(API_ENDPOINTS.GET_REJECTED_SELLERS_COUNT),
      ]);
      setPendingRequestsCount(pendingRes.data.data.count);
      setActiveSellersCount(activeRes.data.data.count);
      setRejectedSellerCount(rejectedRes.data.data.count);
    } catch (err) {
      console.error("Error fetching counts:", err);
      setError("Failed to load dashboard counts. Please try again.");
    }
  }, []);

  // Fetches the list of users based on the selected filter type
  const fetchUserList = useCallback(
    async (type) => {
      setLoading(true);
      setError(null);
      try {
        let response;
        if (type === "approved") {
          response = await axios.get(API_ENDPOINTS.GET_ACTIVE_SELLERS);
        } else if (type === "rejected") {
          response = await axios.get(`${API_ENDPOINTS.GET_REJCTED_SELLERS}`);
        } else if (type === "pending") {
          response = await axios.get(
            `${API_ENDPOINTS.GET_VERIFICATION_REQUESTS}/pending`,
            getConfig()
          );
        }
        setUserList(response.data.data);
        setCurrentPage(1); // Reset to the first page when the filter changes
      } catch (err) {
        console.error(`Error fetching ${type} users:`, err);
        setError(`Failed to load ${type} users. Please try again.`);
        setUserList([]);
      } finally {
        setLoading(false);
      }
    },
    [] // No dependencies, as filterType is passed as an argument
  );

  // Confirms a user's verification request
  const handleConfirmRequest = async (userId) => {
    if (window.confirm("Are you sure you want to approve this user?")) {
      try {
        setLoading(true); // Show loading state during approval
        await axios.post(
          API_ENDPOINTS.CONFIRM_USER_REQUEST,
          { userId },
          getConfig()
        );
        alert("User approved successfully!");
        // Re-fetch all data to ensure counts and lists are updated
        await Promise.all([fetchCounts(), fetchUserList(filterType)]);
      } catch (err) {
        console.error("Error confirming user:", err);
        setError("Failed to approve user. Please try again.");
      } finally {
        setLoading(false); // Hide loading state
      }
    }
  };

  const handleDisableRequest = async (userId) => {
    if (window.confirm("Are you sure you want to Delete this user?")) {
      try {
        setLoading(true);
        await axios.post(API_ENDPOINTS.DISABLE_USER, { userId }, getConfig());
        alert("User Disable successfully!");
        // Re-fetch all data to ensure counts and lists are updated
        await Promise.all([fetchCounts(), fetchUserList(filterType)]);
      } catch (err) {
        console.error("Error confirming user:", err);
        setError("Failed to approve user. Please try again.");
      } finally {
        setLoading(false); // Hide loading state
      }
    }
  };

  // --- Effects ---

  // Effect to fetch initial data and re-fetch when filterType changes
  useEffect(() => {
    fetchCounts();
    fetchUserList(filterType);
  }, [fetchCounts, fetchUserList, filterType]);

  // --- Event Handlers ---

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleShowDetailModal = (seller) => {
    setSelectedSeller(seller);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedSeller(null);
  };

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = userList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(userList.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= totalPages &&
      pageNumber !== currentPage
    ) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5; // Number of page buttons to show around the current page

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.Item
          key={1}
          onClick={() => handlePageChange(1)}
          active={currentPage === 1}
        >
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" />);
      }
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          onClick={() => handlePageChange(number)}
          active={number === currentPage}
        >
          {number}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" />);
      }
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          active={currentPage === totalPages}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4 text-center text-dark">Admin Dashboard</h1>

      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      {/* --- Counts Display --- */}
      <Row className="my-4">
        <Col md={4} className="mb-3">
          <Card className="text-center bg-primary text-white shadow-sm">
            <Card.Body>
              <Card.Title className="h3">Pending Requests</Card.Title>
              <Card.Text className="h1">{pendingRequestsCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center bg-success text-white shadow-sm">
            <Card.Body>
              <Card.Title className="h3">Active Sellers</Card.Title>
              <Card.Text className="h1">{activeSellersCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="text-center bg-danger text-white shadow-sm">
            <Card.Body>
              <Card.Title className="h3">Rejected Sellers</Card.Title>
              <Card.Text className="h1">{rejectedSellerCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- Filter and User List --- */}
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <h2 className="mb-0">User List</h2>
        </Col>
        <Col md={6} className="text-md-end">
          <Form.Group controlId="filterSelect">
            <Form.Label className="me-2">Filter By:</Form.Label>
            <Form.Select
              value={filterType}
              onChange={handleFilterChange}
              className="d-inline-block w-auto"
            >
              <option value="approved">Approved Sellers</option>
              <option value="pending">Pending Requests</option>
              <option value="rejected">Rejected Sellers</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {currentItems.length > 0 ? (
            <Row>
              {currentItems.map((user) => (
                <Col md={4} lg={3} className="mb-4" key={user._id}>
                  <Card
                    className={`h-100 shadow-sm border-0 ${
                      filterType === "pending" ? "border-warning" : ""
                    }`}
                    // --- CLICK HANDLER FOR MODAL ---
                    onClick={() => handleShowDetailModal(user)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Conditional rendering for image based on filterType */}
                    {filterType === "approved" && (
                      <Card.Img
                        variant="top"
                        src={
                          user.coverImage ||
                          "https://via.placeholder.com/400x200?text=No+Cover"
                        }
                        alt={`${user.fullName}'s cover`}
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                    )}
                    {filterType === "rejected" && (
                      <Card.Img
                        variant="top"
                        src={
                          user.coverImage ||
                          "https://via.placeholder.com/400x200?text=No+Cover"
                        }
                        alt={`${user.fullName}'s cover`}
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                    )}
                    {filterType === "pending" && (
                      <Card.Img
                        variant="top"
                        src={
                          user.coverImage ||
                          "https://via.placeholder.com/150?text=No+Avatar"
                        }
                        alt={`${user.fullName}'s avatar`}
                        style={{
                          height: "150px",
                          width: "150px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          margin: "1rem auto",
                        }}
                      />
                    )}

                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="mb-1 text-truncate">
                        {user.fullName}
                      </Card.Title>
                      {user.email && (
                        <Card.Subtitle className="mb-2 text-muted small text-truncate">
                          {user.email}
                        </Card.Subtitle>
                      )}

                      {filterType === "approved" && (
                        <>
                          <p className="mb-1">
                            <strong>Total Sales:</strong>{" "}
                            <span className="text-success">
                              ${user.totalSellerEarnings?.toFixed(2) || "0.00"}
                            </span>
                          </p>
                          <p className="mb-0">
                            <strong>Songs Sold:</strong>{" "}
                            {user.totalSongsSold || 0}
                          </p>
                          {user.bio && (
                            <p
                              className="text-muted small mt-2 mb-0 text-truncate"
                              style={{ maxHeight: "3em", overflow: "hidden" }}
                            >
                              {user.bio}
                            </p>
                          )}
                          {user.popularity !== undefined && (
                            <p className="text-muted small mb-0">
                              <strong>Popularity:</strong> {user.popularity}
                            </p>
                          )}
                          <Button
                            size="sm"
                            className="mt-auto w-100"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDisableRequest(user._id);
                            }}
                            variant="danger"
                          >
                            Disable
                          </Button>
                        </>
                      )}

                      {filterType === "rejected" && (
                        <>
                          <p className="mb-1">
                            <strong>Total Sales:</strong>{" "}
                            <span className="text-success">
                              ${user.totalSellerEarnings?.toFixed(2) || "0.00"}
                            </span>
                          </p>
                          <p className="mb-0">
                            <strong>Songs Sold:</strong>{" "}
                            {user.totalSongsSold || 0}
                          </p>
                          {user.bio && (
                            <p
                              className="text-muted small mt-2 mb-0 text-truncate"
                              style={{ maxHeight: "3em", overflow: "hidden" }}
                            >
                              {user.bio}
                            </p>
                          )}
                          {user.popularity !== undefined && (
                            <p className="text-muted small mb-0">
                              <strong>Popularity:</strong> {user.popularity}
                            </p>
                          )}
                          <Button
                            size="sm"
                            className="mt-auto w-100"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleConfirmRequest(user._id);
                            }}
                            variant="warning"
                          >
                            Aprove again
                          </Button>
                        </>
                      )}

                      {filterType === "pending" && (
                        <>
                          <p className="text-warning small mb-2 text-center">
                            Verification Pending
                          </p>
                          <Button
                            variant="success"
                            size="sm"
                            className="mt-auto w-100"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleConfirmRequest(user._id);
                            }}
                          >
                            Approve
                          </Button>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Alert variant="info" className="text-center">
              {filterType === "approved"
                ? "No active sellers found."
                : "No pending verification requests."}
            </Alert>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="justify-content-center my-4">
              <Pagination.First
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {renderPaginationItems()}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          )}
        </>
      )}
      <SalesFilterPanel />

      <SellerDetailModal
        show={showDetailModal}
        onHide={handleCloseDetailModal}
        seller={selectedSeller}
      />
    </Container>
  );
};

export default ManageSeller;
