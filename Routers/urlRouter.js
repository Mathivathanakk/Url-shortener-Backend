import express from "express";
import {
  createShortUrl,
  redirectShortUrl,
  urlCalculation,
} from "../Controllers/urlController.js";
import authMiddlewares from "../Middlewares/authMiddleWare.js";

const router = express.Router();

router.post("/url", authMiddlewares, createShortUrl);//creating the shorturl
router.get("/:shortId", redirectShortUrl);//redirecting the shorturl
router.get("/urlCount/day/month", authMiddlewares, urlCalculation);//shorturl created per day and for month

export default router;
