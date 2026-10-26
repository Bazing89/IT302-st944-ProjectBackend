/**
 * Author: Sahith Thopucherla (st944@njit.edu)
 * Date: October 26, 2026
 * Course: IT-302 Advanced Internet Applications, Section 451
 * Assignment: Phase 3 - CUD MongoDB Data using Node.js
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import { MongoClient, BSON, ObjectId } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  const observations = BSON.EJSON.parse(await readFile(new URL("../../database-export/observations_st944.json", import.meta.url), "utf8"));
  // Upserts preserve existing observations and comments when setup is repeated.
  const collection = db.collection(process.env.MONGODB_COLLECTION);
  for (const observation of observations) {
    await collection.updateOne({ _id: observation._id }, { $setOnInsert: observation }, { upsert: true });
  }
  const comments = db.collection(process.env.MONGODB_COMMENTS_COLLECTION || "comments_st944");
  await comments.updateOne({ _id: new ObjectId("700000000000000000000001") }, { $setOnInsert: {
    observationId: 402264585,
    text: "The Green Heron identification is supported by its compact body and long bill. A closer photograph would make the plumage details easier to assess.",
    userName: "Sahith Thopucherla", userId: "st944", lastModified: new Date(),
  } }, { upsert: true });
  console.log("Observation data and one realistic comment are ready.");
} finally { await client.close(); }
