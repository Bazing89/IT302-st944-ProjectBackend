/**
 * Author: Sahith Thopucherla (st944@njit.edu)
 * Date: November 9, 2026
 * Course: IT-302 Advanced Internet Applications, Section 451
 * Assignment: Phase 4 - Read Node.js Data using React.js
 */

import express from "express";
import CommentsController from "./comments.controller.js";
import ObservationsController from "./observations.controller.js";

const router = express.Router();

router.route("/").get(ObservationsController.apiGetObservations);
router.get("/id/:id", ObservationsController.apiGetObservation);

// Comments evaluate documents in the original observations collection.
router.route("/comments")
  .get(CommentsController.apiGetComments)
  .post(CommentsController.apiPostComment)
  .put(CommentsController.apiUpdateComment)
  .delete(CommentsController.apiDeleteComment);

export default router;
