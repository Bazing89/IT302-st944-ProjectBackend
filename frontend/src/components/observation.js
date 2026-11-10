// Sahith Thopucherla | st944@njit.edu | November 9, 2026
// IT-302 Advanced Internet Applications, Section 451
// Phase 4 Read Node.js Data using React.js Assignment

import { useEffect, useState } from 'react';
import { Alert, Card, Col, Row } from 'react-bootstrap';
import { Link, useLocation, useParams } from 'react-router-dom';
import ObservationsDataService from '../service/ObservationsDataService';

export default function Observation() {
  const { id } = useParams();
  const { state } = useLocation();
  const [observation, setObservation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const request = new AbortController();
    setObservation(null);
    setError('');
    // A direct visit retrieves the record using only the ID in the URL.
    ObservationsDataService.getById(id, request.signal)
      .then((record) => {
        if (!request.signal.aborted) setObservation(record);
      })
      .catch((failure) => {
        if (request.signal.aborted) return;
        setError([400, 404].includes(failure.response?.status)
          ? 'This observation could not be found.'
          : 'The observation could not be loaded.');
      });
    return () => request.abort();
  }, [id]);

  return (
    <>
      <Link to={state?.search ? '/observations?' + state.search : '/observations'}>Back to observations</Link>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {!observation && !error && <p role="status" className="mt-3">Loading observation…</p>}
      {observation && (
        <article className="mt-3">
          <h1>{observation.commonName}</h1>
          <p className="lead fst-italic">{observation.scientificName}</p>
          <Row className="g-4">
            {observation.image && (
              <Col md={5}>
                <img className="img-fluid rounded" src={observation.image} alt={observation.commonName} />
              </Col>
            )}
            <Col md={7}>
              <Card>
                <Card.Body>
                  <h2 className="h5">Observation details</h2>
                  <dl className="row mb-0">
                    <dt className="col-sm-4">Observed on</dt><dd className="col-sm-8">{observation.observedOn}</dd>
                    <dt className="col-sm-4">Location</dt><dd className="col-sm-8">{observation.placeGuess ?? 'Unspecified'}</dd>
                    <dt className="col-sm-4">Observer</dt><dd className="col-sm-8">{observation.observer}</dd>
                    <dt className="col-sm-4">Taxonomic group</dt><dd className="col-sm-8">{observation.iconicTaxon}</dd>
                    <dt className="col-sm-4">Quality grade</dt><dd className="col-sm-8 text-capitalize">{observation.qualityGrade}</dd>
                    <dt className="col-sm-4">Observation ID</dt><dd className="col-sm-8">{observation.observationId}</dd>
                  </dl>
                  <a href={observation.observationUrl}>View original observation on iNaturalist</a>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </article>
      )}
    </>
  );
}
