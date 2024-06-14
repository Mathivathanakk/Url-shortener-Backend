import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./Database/config.js";
import urlRouter from "./Routers/urlRouter.js";
import userRouter from "./Routers/userRouter.js";
//importing part

//declaration
dotenv.config();

const app = express();
//middleware
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);


//connection DB
connectDB();

//routes

app.use("/api", urlRouter);
app.use("/api/user",userRouter)

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to my app" });
});

//running port
app.listen(process.env.PORT, () => {
  console.log("App is listening to the port");
});
