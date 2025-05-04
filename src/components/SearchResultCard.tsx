import { Restaurant } from "@/types";
import { Link } from "react-router-dom";
import { AspectRatio } from "./ui/aspect-ratio";
import { Banknote, Clock, Dot, Star } from "lucide-react";
import { Card } from "./ui/card";

type Props = {
  restaurant: Restaurant;
};

const SearchResultCard = ({ restaurant }: Props) => {
  return (
    <Card>
      <Link
        to={`/detail/${restaurant._id}`}
        className="grid lg:grid-cols-[2fr_3fr] gap-5 group"
      >
        <AspectRatio ratio={16 / 6}>
          <img
            src={restaurant.imageUrl}
            className="rounded-md w-full h-full object-cover"
          />
        </AspectRatio>
        <div>
          <h3 className="text-2xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <span className="group-hover:underline">
              {restaurant.restaurantName}
            </span>
            {restaurant.reviewSummary?.averageRating !== null && (
              <span className="flex items-center gap-1 text-yellow-500 text-sm font-medium no-underline">
                <Star className="w-4 h-4 fill-yellow-500 stroke-yellow-500" />
                <span className="no-underline">
                  {restaurant.reviewSummary?.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-500 no-underline">
                  ({restaurant.reviewSummary?.totalReviews})
                </span>
              </span>
            )}
          </h3>
          <div id="card-content" className="grid md:grid-cols-2 gap-2">
            <div className="flex flex-row flex-wrap">
              {restaurant.cuisines.map((item, index) => (
                <span className="flex">
                  <span>{item}</span>
                  {index < restaurant.cuisines.length - 1 && <Dot />}
                </span>
              ))}
            </div>
            <div className="flex gap-2 flex-col">
              <div className="flex items-center gap-1 text-green-600">
                <Clock className="text-green-600" />
                {restaurant.estimatedDeliveryTime} mins
              </div>
              <div className="flex items-center gap-1">
                <Banknote />
                Delivery from ${(restaurant.deliveryPrice / 100).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default SearchResultCard;
