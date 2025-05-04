import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema({
  name: String,
  email: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);
export default SupportTicket;
