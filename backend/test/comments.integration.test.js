/**
 * Author: Sahith Thopucherla (st944@njit.edu)
 * Date: October 26, 2026
 * Course: IT-302 Advanced Internet Applications, Section 451
 * Assignment: Phase 3 - CUD MongoDB Data using Node.js
 */
import assert from "node:assert/strict";
import test from "node:test";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";
import app from "../server.js";
import ObservationsDAO from "../dao/observationsDAO.js";
import CommentsDAO from "../dao/commentsDAO.js";

test("comment lifecycle persists in MongoDB, validates inputs, and matches user IDs", async (t) => {
  const database = await MongoMemoryServer.create();
  t.after(() => database.stop());
  const client = new MongoClient(database.getUri());
  await client.connect();
  t.after(() => client.close());
  process.env.MONGODB_DB = "phase3_test";
  process.env.MONGODB_COLLECTION = "observations_st944";
  await client.db(process.env.MONGODB_DB).collection(process.env.MONGODB_COLLECTION)
    .insertOne({ observationId: 402264585, commonName: "Green Heron" });
  await ObservationsDAO.injectDB(client);
  await CommentsDAO.injectDB(client);
  const server = app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const url = `http://127.0.0.1:${server.address().port}/api/v1/st944/observations/comments`;
  async function send(method, body) {
    const result = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return { status: result.status, body: await result.json() };
  }
  const input = { observationId: 402264585, text: "The Green Heron identification is supported by its compact body and long bill.", userName: "Sahith Thopucherla", userId: "st944" };
  assert.equal((await send("POST", { ...input, text: " " })).status, 400);
  assert.equal((await send("POST", { ...input, userId: { $ne: null } })).status, 400);
  assert.equal((await send("POST", { ...input, observationId: 999 })).status, 404);
  const created = await send("POST", input);
  assert.equal(created.status, 201);
  const commentId = created.body.comment._id;
  assert.ok(Date.parse(created.body.comment.lastModified));
  const collection = client.db(process.env.MONGODB_DB).collection("comments_st944");
  assert.equal(await collection.countDocuments(), 1);
  const before = await collection.findOne({ userId: "st944" });
  assert.ok(before.lastModified instanceof Date);
  const update = { commentId, userId: "st944", text: "The long bill and short neck support the Green Heron identification; a clearer photograph would help confirm the plumage." };
  assert.equal((await send("PUT", { ...update, userId: "another-user" })).status, 404);
  assert.equal((await send("DELETE", { commentId, userId: "another-user" })).status, 404);
  assert.equal((await send("PUT", { ...update, commentId: "invalid" })).status, 400);
  const updated = await send("PUT", update);
  assert.equal(updated.status, 200);
  assert.equal(updated.body.comment.text, update.text);
  assert.equal(updated.body.comment.userName, input.userName);
  assert.ok(Date.parse(updated.body.comment.lastModified) > Date.parse(created.body.comment.lastModified));
  const listed = await fetch(`${url}?observationId=${input.observationId}`).then(r => r.json());
  assert.equal(listed.comments[0].text, update.text);
  assert.equal((await send("DELETE", { commentId, userId: "st944" })).body.deletedCount, 1);
  assert.equal(await collection.countDocuments(), 0);
  assert.equal((await send("DELETE", { commentId, userId: "st944" })).status, 404);
});
