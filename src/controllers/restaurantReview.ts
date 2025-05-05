import { RequestHandler } from "express";
import Restaurant from "../models/restaurant";

// ✅ Correct: no return after res.status().json()
export const addReview: RequestHandler = async (req, res) => {
  const userId = req.userid;

  try {
    const { rating, comment } = req.body;
    const { restaurantId } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    restaurant.reviews.push({
      userId,
      rating,
      comment,
      createdAt: new Date(),
    });

    await restaurant.save();

    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
