import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="p-4 border-0 shadow-lg rounded-4">
            <Row className="align-items-center">
              <Col md={4} className="text-center mb-4 mb-md-0">
                <img
                  src={user?.coverImage || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="rounded-circle border shadow-sm"
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    border: '4px solid #e7e7e7',
                  }}
                />
                <h5 className="mt-3  fw-bold">
                  {user?.fullName || 'John Doe'}
                </h5>
                <Badge bg="info" className="mt-2">
                  {user?.role || 'Listener'}
                </Badge>
              </Col>
              <Col md={8}>
                <div className="mb-3">
                  <h6 className=" fw-semibold">Email</h6>
                  <p className="text-muted">{user?.email || 'johndoe@example.com'}</p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted">Bio</h6>
                  <p className="">
                    {user?.bio || 'This user has not set up a bio yet.'}
                  </p>
                </div>
                <div className="mb-3">
                  <h6 className="text-muted">Account Created</h6>
                  <p>{new Date(user?.createdAt).toLocaleDateString() || 'N/A'}</p>
                </div>
                <Row>
                  <Col xs={6}>
                    <h6 className="text-muted">Songs Uploaded (This Month)</h6>
                    <p>{user?.uploadedSongsThisMonth ?? 0}</p>
                  </Col>
                  <Col xs={6}>
                    <h6 className="text-muted">Songs Downloaded (This Month)</h6>
                    <p>{user?.downloadedSongsThisMonth ?? 0}</p>
                  </Col>
                </Row>
                <Button variant="outline-primary" className="mt-3 px-4 rounded-pill">
                  Edit Profile
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
