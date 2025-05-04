import React, { useState } from "react";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { Input } from "./ui/input";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Props = {
  restaurantId: string;
};

export default function ReviewForm({ restaurantId }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { getAccessTokenSilently } = useAuth0();

  const handleSubmit = async (e: React.FormEvent) => {
    const accessToken = await getAccessTokenSilently();
    e.preventDefault();
    await fetch(`${API_BASE_URL}/api/restaurant/${restaurantId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ rating, comment }),
    });

    //Optional
    setRating(1);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="text-2xl flex justify-center">
        Please leave a review!{" "}
      </label>
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>

      <label className="flex">Leave us a comment (optional)</label>
      {/* <textarea value={comment} onChange={(e) => setComment(e.target.value)} /> */}
      <Input value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button onSubmit={handleSubmit}>Where is my button</Button>
    </form>
  );
}
