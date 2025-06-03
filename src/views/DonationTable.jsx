import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Pagination, Spinner, Alert, Container } from "react-bootstrap";

const DonationTable = () => {
  const [donations, setDonations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const limit = 10; // Items per page

  async function executeComplexTask() {
  console.log('Task started');
  try {
    const step1 = await new Promise(resolve => {
      setTimeout(() => {
        console.log('Step 1 complete');
        resolve(10);
      }, 50);
    });

    const step2 = await new Promise((_, reject) => {
      console.log('Step 2 initiated');
      setTimeout(() => {
        console.log('Step 2 failed!');
        reject(new Error('Critical failure'));
      }, 20); // Faster than Step 1's resolve
    });

    console.log('Step 3 complete:', step1 + step2); // Will this run?

  } catch (error) {
    console.error('Caught in executeComplexTask:', error.message);
    return 'Task failed gracefully'; // Returning from async catch
  } finally {
    console.log('Task finished (finally block)');
  }
}

console.log('Before calling task');
const resultPromise = executeComplexTask();
console.log('After calling task');

resultPromise.then(res => console.log('Task result:', res));

console.log('End of script');
  const fetchDonations = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `https://backend-music-xg6e.onrender.com/api/v1/donation?page=${page}&limit=${limit}`
      );
      setDonations(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Failed to load donations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    fetchDonations();
  }, [page]);

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === page}
          onClick={() => setPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.First disabled={page === 1} onClick={() => setPage(1)} />
        <Pagination.Prev
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        />
        {items}
        <Pagination.Next
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        />
        <Pagination.Last
          disabled={page === totalPages}
          onClick={() => setPage(totalPages)}
        />
      </Pagination>
    );
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Donations</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover className="text-center">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Amount (USD)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.length > 0 ? (
                  donations.map((donation, index) => (
                    <tr key={donation._id}>
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>{donation.name}</td>
                      <td>{donation.email}</td>
                      <td>{donation.phone}</td>
                      <td>${donation.amount}</td>
                      <td>
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-muted">
                      No donations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {renderPagination()}
        </>
      )}
    </Container>
  );
};

export default DonationTable;
