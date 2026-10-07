/**
 * Author: Sahith Thopucherla (st944@njit.edu)
 * Date: October 6, 2026
 * Course: IT-302, Section 451
 * Assignment: Phase 2 - Read MongoDB Data using Node.js
 */

import assert from "node:assert/strict";
import test from "node:test";
import app from "../server.js";
import ObservationsDAO from "../dao/observationsDAO.js";

const sampleObservations = [
  {
    observationId: 101,
    recordName: "Great Horned Owl observation 101",
    commonName: "Great Horned Owl",
    qualityGrade: "research",
    observedOn: "2026-10-01",
  },
  {
    observationId: 102,
    recordName: "Barred Owl observation 102",
    commonName: "Barred Owl",
    qualityGrade: "research",
    observedOn: "2026-09-28",
  },
];

function createFakeClient() {
  const cursor = {
    sort() {
      return this;
    },
    skip() {
      return this;
    },
    limit() {
      return this;
    },
    async toArray() {
      return sampleObservations;
    },
  };

  const collection = {
    find() {
      return cursor;
    },
    async countDocuments() {
      return sampleObservations.length;
    },
  };

  return {
    db() {
      return {
        collection() {
          return collection;
        },
      };
    },
  };
}

test("GET endpoint returns the Phase 2 response shape", async (context) => {
  await ObservationsDAO.injectDB(createFakeClient());

  const server = app.listen(0, "127.0.0.1");
  context.after(() => new Promise((resolve) => server.close(resolve)));

  await new Promise((resolve) => server.once("listening", resolve));
  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/v1/st944/observations?itemsPerPage=10&pageNumber=0&speciesName=owl`,
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.observations.length, 2);
  assert.equal(body.pageNumber, 0);
  assert.equal(body.itemsPerPage, 10);
  assert.equal(body.totalItems, 2);
  assert.equal(body.totalPages, 1);
  assert.deepEqual(body.filters, { name: "owl" });
});
