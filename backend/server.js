/**
 * Author: Sahith Thopucherla (st944@njit.edu)
 * Date: October 26, 2026
 * Course: IT-302 Advanced Internet Applications, Section 451
 * Assignment: Phase 3 - CUD MongoDB Data using Node.js
 */

import cors from "cors";
import express from "express";
import observationsRouter from "./api/observations.route.js";

const app = express();

app.use(cors());
app.use(express.json());

// The assignment requires a root endpoint that includes the student's UCID.
app.use("/api/v1/st944/observations", observationsRouter);

app.get("/", (_request, response) => {
  response.json({
    message: "IT-302 Phase 3 iNaturalist Observations API",
    endpoint: "/api/v1/st944/observations",
  });
});

app.get("/health", (_request, response) => response.json({ status: "ok" }));

app.use((_request, response) => {
  response.status(404).json({ error: "Route not found" });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  const status = error.type === "entity.parse.failed" ? 400 : 500;
  response.status(status).json({ status: "failure", error: status === 400 ? "Invalid JSON request body" : "Internal server error" });
});

export default app;
