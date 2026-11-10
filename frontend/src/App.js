// Sahith Thopucherla | st944@njit.edu | November 9, 2026
// IT-302 Advanced Internet Applications, Section 451
// Phase 4 Read Node.js Data using React.js Assignment

import { useState } from 'react';
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import ObservationsList from './components/ObservationsList';
import Observation from './components/observation';

function Login({ onLogin }) {
  function submit(event) {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get('name').trim();
    if (name) onLogin(name);
  }

  return (
    <>
      <h1>Log in</h1>
      <p>Enter a display name for this session.</p>
      <Form onSubmit={submit}>
        <Form.Group className="mb-3" controlId="displayName">
          <Form.Label>Display name</Form.Label>
          <Form.Control name="name" required />
        </Form.Group>
        <Button type="submit">Log in</Button>
      </Form>
    </>
  );
}

export default function App() {
  // Login is local UI state for this read-only application.
  const [user, setUser] = useState(null);
  return (
    <>
      <Navbar bg="dark" variant="dark" expand>
        <Container className="flex-wrap gap-2">
          <Navbar.Brand as={Link} to="/observations">iNaturalist Observations</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/observations">Observations</Nav.Link>
          </Nav>
          {user ? (
            <div className="d-flex align-items-center gap-2">
              <Navbar.Text>Signed in as {user}</Navbar.Text>
              <Button size="sm" variant="outline-light" onClick={() => setUser(null)}>Log out</Button>
            </div>
          ) : <Nav><Nav.Link as={Link} to="/login">Log in</Nav.Link></Nav>}
        </Container>
      </Navbar>
      <Container as="main" className="py-4">
        <Routes>
          <Route index element={<ObservationsList />} />
          <Route path="observations" element={<ObservationsList />} />
          <Route path="observations/:id" element={<Observation />} />
          <Route path="login" element={user ? <Navigate to="/observations" replace /> : <Login onLogin={setUser} />} />
          <Route path="*" element={<Navigate to="/observations" replace />} />
        </Routes>
      </Container>
    </>
  );
}
