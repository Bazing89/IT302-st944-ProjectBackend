/**
 * Author: Sahith Thopucherla (st944@njit.edu)
 * Date: October 26, 2026
 * Course: IT-302 Advanced Internet Applications, Section 451
 * Assignment: Phase 3 - CUD MongoDB Data using Node.js
 */
import "dotenv/config";
import { writeFile } from "node:fs/promises";
import { MongoClient, BSON } from "mongodb";
const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  for (const name of [process.env.MONGODB_COLLECTION, process.env.MONGODB_COMMENTS_COLLECTION || "comments_st944"]) {
    if (!/^[a-zA-Z0-9_]+$/.test(name)) throw new Error("Collection name must contain only letters, numbers, and underscores.");
    const documents = await db.collection(name).find({}).sort({ _id: 1 }).toArray();
    await writeFile(new URL(`../../database-export/${name}.json`, import.meta.url), BSON.EJSON.stringify(documents, null, 2) + "\n");
    console.log(`Exported ${documents.length} documents from ${name}.`);
  }
} finally { await client.close(); }
