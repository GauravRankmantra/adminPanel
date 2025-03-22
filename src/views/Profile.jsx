import React, { Fragment } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'; // Bootstrap components

const Profile = () => {
  // Get user info from localStorage and parse it
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Fragment>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-lg">
              <Card.Body>
                <Row className="justify-content-center">
                  <Col md={4} className="text-center">
                    {/* User's profile image */}
                    <img
                      src={user?.coverImage || 'https://via.placeholder.com/150'}
                      alt="User Profile"
                      className="rounded-circle img-fluid mb-3"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                  </Col>
                  <Col md={8}>
                    <h3 className="mb-3">{user?.fullName || 'John Doe'}</h3>
                    <p>
                      <strong>Email:</strong> {user?.email || 'johndoe@example.com'}
                    </p>
                    <p>
                      <strong>Bio:</strong> {user?.bio || 'This user has not set up a bio yet.'}
                    </p>
                    <p>
                      <strong>Account Created:</strong> {new Date(user?.createdAt).toLocaleDateString() || 'N/A'}
                    </p>
                    <p>
                      <strong>Uploaded Songs This Month:</strong> {user?.uploadedSongsThisMonth || 0}
                    </p>
                    <p>
                      <strong>Downloaded Songs This Month:</strong> {user?.downloadedSongsThisMonth || 0}
                    </p>
                    <Button variant="primary" className="mt-3">
                      Edit Profile
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Profile;
