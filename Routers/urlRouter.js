import express from "express";
import {
  createShortUrl,
  redirectShortUrl,
  urlCalculation,
} from "../Controllers/urlController.js";
import authMiddlewares from "../Middlewares/authMiddleWare.js";

const router = express.Router();

router.post("/url", authMiddlewares, createShortUrl);
router.get("/:shortId", redirectShortUrl);
router.get("/urlCount/day/month", authMiddlewares, urlCalculation);

export default router;
