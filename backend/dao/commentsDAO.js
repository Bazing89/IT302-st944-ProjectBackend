/**
 * Author: Sahith Thopucherla (st944@njit.edu)
 * Date: October 26, 2026
 * Course: IT-302 Advanced Internet Applications, Section 451
 * Assignment: Phase 3 - CUD MongoDB Data using Node.js
 */

import { ObjectId } from "mongodb";

let commentsCollection;

export default class CommentsDAO {
  static async injectDB(client) {
    commentsCollection = client.db(process.env.MONGODB_DB)
      .collection(process.env.MONGODB_COMMENTS_COLLECTION || "comments_st944");
    await commentsCollection.createIndex({ observationId: 1, lastModified: -1 });
  }

  static async getComments(observationId) {
    return commentsCollection.find({ observationId }).sort({ lastModified: -1 }).toArray();
  }

  static async addComment(observationId, text, userName, userId) {
    // Dates come from the server so clients cannot forge lastModified.
    const comment = { observationId, text, userName, userId, lastModified: new Date() };
    const result = await commentsCollection.insertOne(comment);
    return { ...comment, _id: result.insertedId };
  }

  static async updateComment(commentId, text, userId) {
    // Both identifiers must match; one user cannot change another user's comment.
    return commentsCollection.findOneAndUpdate(
      { _id: new ObjectId(commentId), userId },
      { $set: { text, lastModified: new Date() } },
      { returnDocument: "after" },
    );
  }

  static async deleteComment(commentId, userId) {
    const result = await commentsCollection.deleteOne({ _id: new ObjectId(commentId), userId });
    return result.deletedCount;
  }
}
