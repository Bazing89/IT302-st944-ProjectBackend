/**
 * Author: Sahith Thopucherla (st944@njit.edu)
 * Date: October 6, 2026
 * Course: IT-302, Section 451
 * Assignment: Phase 2 - Read MongoDB Data using Node.js
 */

import express from "express";
import ObservationsController from "./observations.controller.js";

const router = express.Router();

router.route("/").get(ObservationsController.apiGetObservations);

export default router;
