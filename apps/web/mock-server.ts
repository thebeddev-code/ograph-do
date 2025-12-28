import { createMiddleware } from "@mswjs/http-middleware";
import cors from "cors";
import express from "express";
import logger from "pino-http";

import { initializeDb, reinitializeDb } from "@/testing/mocks/db";
import { handlers } from "@/testing/mocks/handlers";

const app = express();

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(
  logger({
    level: "info",
    redact: ["req.headers", "res.headers"],
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: true,
      },
    },
  }),
);
app.use(createMiddleware(...handlers));
// Reset server
app.get("/api/v1/reset", async (req, res) => {
  await reinitializeDb();
  res.send("Successfully reset the db!");
});

initializeDb().then(() => {
  console.log("Mock DB initialized");
  app.listen(process.env.NEXT_PUBLIC_MOCK_API_PORT, () => {
    console.log(
      `Mock API server started at http://localhost:${process.env.NEXT_PUBLIC_MOCK_API_PORT}`,
    );
  });
});
