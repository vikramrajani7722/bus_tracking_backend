import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// routes import
import userRouter from "./routes/user.routes.js";
import busRouter from "./routes/bus.routes.js";

app.use("/users", userRouter);
app.use("/bus", busRouter);

// http://localhost:8000/users

export { app };
