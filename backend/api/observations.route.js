/**
 * Author: Sahith Thopucherla (st944@njit.edu)
 * Date: October 26, 2026
 * Course: IT-302 Advanced Internet Applications, Section 451
 * Assignment: Phase 3 - CUD MongoDB Data using Node.js
 */

import express from "express";
import CommentsController from "./comments.controller.js";
import ObservationsController from "./observations.controller.js";

const router = express.Router();

router.route("/").get(ObservationsController.apiGetObservations);

// Comments evaluate documents in the original observations collection.
router.route("/comments")
  .get(CommentsController.apiGetComments)
  .post(CommentsController.apiPostComment)
  .put(CommentsController.apiUpdateComment)
  .delete(CommentsController.apiDeleteComment);

export default router;
