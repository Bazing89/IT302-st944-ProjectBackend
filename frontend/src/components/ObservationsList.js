// Sahith Thopucherla | st944@njit.edu | November 9, 2026
// IT-302 Advanced Internet Applications, Section 451
// Phase 4 Read Node.js Data using React.js Assignment

import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import ObservationsDataService from '../service/ObservationsDataService';

export default function ObservationsList() {
  const [params, setParams] = useSearchParams();
  const name = params.get('name') ?? '';
  const requestedPage = Number(params.get('page'));
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 0;
  const [query, setQuery] = useState(name);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => setQuery(name), [name]);

  useEffect(() => {
    const request = new AbortController();
    setData(null);
    setError(false);
    // Cancel pending requests when the filter changes or the user leaves the list.
    ObservationsDataService.getAll(name, page, request.signal)
      .then((result) => {
        if (!request.signal.aborted) setData(result);
      })
      .catch(() => {
        if (!request.signal.aborted) setError(true);
      });
    return () => request.abort();
  }, [name, page]);

  function updateSearch(nextName, nextPage) {
    const next = new URLSearchParams();
    if (nextName) next.set('name', nextName);
    if (nextPage) next.set('page', nextPage);
    setParams(next);
  }

  function submit(event) {
    event.preventDefault();
    updateSearch(query.trim(), 0);
  }

  return (
    <>
      <h1>Wildlife observations</h1>
      <p>Explore records from iNaturalist and search by common or scientific name.</p>
      <Form onSubmit={submit} className="mb-4">
        <Form.Group controlId="observationName">
          <Form.Label>Species name</Form.Label>
          <div className="d-flex gap-2">
            <Form.Control value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Enter a species name" />
            <Button type="submit">Search</Button>
            {name && <Button variant="outline-secondary" onClick={() => updateSearch('', 0)}>Clear</Button>}
          </div>
        </Form.Group>
      </Form>
      {error && <Alert variant="danger">The observations could not be loaded.</Alert>}
      {!data && !error && <p role="status">Loading observations…</p>}
      {data && (
        <>
          <p role="status">
            {data.totalItems === 1 ? '1 observation found.' : data.totalItems + ' observations found.'}
            {name && <> Search: <strong>{name}</strong>.</>}
          </p>
          {data.observations.length === 0 && <p>There are no records on this page.</p>}
          <Row xs={1} md={2} lg={3} className="g-3">
            {data.observations.map((observation) => (
              <Col key={observation._id}>
                <Card className="h-100">
                  {observation.image && (
                    <Card.Img variant="top" src={observation.image} alt={observation.commonName} loading="lazy" style={{ height: '11rem', objectFit: 'cover' }} />
                  )}
                  <Card.Body className="d-flex flex-column align-items-start">
                    <Card.Title as="h2" className="h5">{observation.commonName}</Card.Title>
                    <Card.Text>
                      <em>{observation.scientificName}</em><br />
                      Observed on {observation.observedOn} in {observation.placeGuess ?? 'an unspecified location'}.
                    </Card.Text>
                    <Button as={Link} to={'/observations/' + observation._id} state={{ search: params.toString() }} className="mt-auto" variant="outline-primary">
                      View observation
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          {(data.totalPages > 1 || page > 0) && (
            <nav aria-label="Observation pages" className="d-flex align-items-center gap-3 mt-4">
              <Button variant="outline-secondary" disabled={page === 0} onClick={() => updateSearch(name, page - 1)}>Previous</Button>
              <span>Page {page + 1} of {Math.max(data.totalPages, 1)}</span>
              <Button variant="outline-secondary" disabled={page + 1 >= data.totalPages} onClick={() => updateSearch(name, page + 1)}>Next</Button>
            </nav>
          )}
        </>
      )}
    </>
  );
}
