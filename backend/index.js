/**
 * Author: Sahith Thopucherla (st944@njit.edu)
 * Date: October 6, 2026
 * Course: IT-302, Section 451
 * Assignment: Phase 2 - Read MongoDB Data using Node.js
 */

import "dotenv/config";
import { MongoClient } from "mongodb";
import app from "./server.js";
import ObservationsDAO from "./dao/observationsDAO.js";

const requiredVariables = ["MONGODB_URI", "MONGODB_DB", "MONGODB_COLLECTION"];
const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
  console.error(`Missing environment variables: ${missingVariables.join(", ")}`);
  process.exit(1);
}

const port = Number.parseInt(process.env.PORT ?? "5000", 10);
const client = new MongoClient(process.env.MONGODB_URI);

async function startServer() {
  try {
    await client.connect();
    await ObservationsDAO.injectDB(client);

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
      console.log(`GET http://localhost:${port}/api/v1/st944/observations`);
    });
  } catch (error) {
    console.error("Unable to connect to MongoDB and start the server:", error);
    await client.close().catch(() => {});
    process.exit(1);
  }
}

async function shutDown(signal) {
  console.log(`\n${signal} received. Closing MongoDB connection.`);
  await client.close();
  process.exit(0);
}

process.on("SIGINT", () => shutDown("SIGINT"));
process.on("SIGTERM", () => shutDown("SIGTERM"));

startServer();
