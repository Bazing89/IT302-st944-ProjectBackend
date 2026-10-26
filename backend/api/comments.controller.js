/**
 * Author: Sahith Thopucherla (st944@njit.edu)
 * Date: October 26, 2026
 * Course: IT-302 Advanced Internet Applications, Section 451
 * Assignment: Phase 3 - CUD MongoDB Data using Node.js
 */

import CommentsDAO from "../dao/commentsDAO.js";
import ObservationsDAO from "../dao/observationsDAO.js";

function validText(value, maxLength) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
}

function validObservationId(value) {
  return Number.isSafeInteger(value) && value > 0;
}

function validCommentId(value) {
  return typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);
}

export default class CommentsController {
  static async apiGetComments(request, response, next) {
    try {
      const observationId = Number(request.query.observationId);
      if (!validObservationId(observationId)) {
        return response.status(400).json({ status: "failure", error: "A positive integer observationId query parameter is required." });
      }
      return response.json({ comments: await CommentsDAO.getComments(observationId) });
    } catch (error) { next(error); }
  }

  static async apiPostComment(request, response, next) {
    try {
      const { observationId, text, userName, userId } = request.body ?? {};
      if (!validObservationId(observationId) || !validText(text, 5000) || !validText(userName, 100) || !validText(userId, 100)) {
        return response.status(400).json({ status: "failure", error: "Provide observationId (positive integer), text, userName, and userId (nonempty strings)." });
      }
      if (!await ObservationsDAO.getObservationById(observationId)) {
        return response.status(404).json({ status: "failure", error: "Observation not found." });
      }
      const comment = await CommentsDAO.addComment(observationId, text.trim(), userName.trim(), userId.trim());
      return response.status(201).json({ status: "success", comment });
    } catch (error) { next(error); }
  }

  static async apiUpdateComment(request, response, next) {
    try {
      const { commentId, text, userId } = request.body ?? {};
      if (!validCommentId(commentId) || !validText(text, 5000) || !validText(userId, 100)) {
        return response.status(400).json({ status: "failure", error: "Provide commentId (24 hexadecimal characters), text, and userId." });
      }
      const comment = await CommentsDAO.updateComment(commentId, text.trim(), userId.trim());
      if (!comment) {
        return response.status(404).json({ status: "failure", error: "Comment not found for this user." });
      }
      return response.json({ status: "success", comment });
    } catch (error) { next(error); }
  }

  static async apiDeleteComment(request, response, next) {
    try {
      const { commentId, userId } = request.body ?? {};
      if (!validCommentId(commentId) || !validText(userId, 100)) {
        return response.status(400).json({ status: "failure", error: "Provide commentId (24 hexadecimal characters) and userId." });
      }
      const deletedCount = await CommentsDAO.deleteComment(commentId, userId.trim());
      if (!deletedCount) {
        return response.status(404).json({ status: "failure", error: "Comment not found for this user." });
      }
      return response.json({ status: "success", deletedCount, commentId });
    } catch (error) { next(error); }
  }
}
