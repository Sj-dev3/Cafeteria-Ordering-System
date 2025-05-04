import express from "express";
import { reportIssue } from "../controllers/supportController";

const router = express.Router();

router.post("/report", reportIssue);

export default router;
