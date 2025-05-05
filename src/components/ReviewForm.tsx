import React, { useState } from "react";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Props = {
  restaurantId: string;
};

export default function ReviewForm({ restaurantId }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { getAccessTokenSilently } = useAuth0();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const accessToken = await getAccessTokenSilently();

    await fetch(`${API_BASE_URL}/api/restaurant/${restaurantId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ rating, comment }),
    });

    toast.success("Review submitted successfully");

    setRating(1);
    setComment("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Write a Review</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl h-[90vh] overflow-y-auto shadow-none border border-gray-300 bg-white dark:bg-zinc-950">
        <DialogHeader>
          <DialogTitle className="text-2xl mt-10 flex items-center justify-center">
            Leave a Review
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-[3rem] mt-4">
          <div>
            <Label className="mb-3">Rating (1-5)</Label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full p-2 rounded border"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="mb-3">Comment (optional)</Label>
            <Input
              placeholder="Your comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="dark:bg-zinc-950"
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Submit Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
