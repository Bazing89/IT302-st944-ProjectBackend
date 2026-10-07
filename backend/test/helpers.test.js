/**
 * Author: Sahith Thopucherla (st944@njit.edu)
 * Date: October 6, 2026
 * Course: IT-302, Section 451
 * Assignment: Phase 2 - Read MongoDB Data using Node.js
 */

import assert from "node:assert/strict";
import test from "node:test";
import { parseNonNegativeInteger } from "../api/observations.controller.js";
import { escapeRegularExpression } from "../dao/observationsDAO.js";

test("parseNonNegativeInteger accepts zero and positive integers", () => {
  assert.equal(parseNonNegativeInteger("0", 20), 0);
  assert.equal(parseNonNegativeInteger("25", 20), 25);
});

test("parseNonNegativeInteger falls back for invalid values", () => {
  assert.equal(parseNonNegativeInteger("-1", 20), 20);
  assert.equal(parseNonNegativeInteger("2.5", 20), 20);
  assert.equal(parseNonNegativeInteger("abc", 20), 20);
});

test("escapeRegularExpression makes user text safe for a MongoDB regex", () => {
  assert.equal(escapeRegularExpression("bird (adult)?"), "bird \\(adult\\)\\?");
});
