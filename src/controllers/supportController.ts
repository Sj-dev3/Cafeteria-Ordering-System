import SupportTicket from "../models/supportTicket";
import { Request, RequestHandler, Response } from "express";

//@ts-ignore
export const reportIssue: RequestHandler = async (req, res) => {
  const { name, email, description } = req.body;

  if (!name || !email || !description) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const ticket = new SupportTicket({ name, email, description });
  await ticket.save();

  res.status(200).json({ message: "Issue submitted and saved." });
};
