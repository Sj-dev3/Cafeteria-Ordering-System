import { CartItem } from "@/pages/DetailPage";
import { Restaurant } from "@/types";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Trash } from "lucide-react";

type Props = {
  restaurant: Restaurant;
  cartItems: CartItem[];
  removeFromCart: (cartItem: CartItem) => void;
  orderType: "delivery" | "pickup"; // Receive orderType
};

const OrderSummary = ({ restaurant, cartItems, removeFromCart, orderType }: Props) => { // Add orderType to destructuring
  const getTotalCost = () => {
    const totalInPence = cartItems.reduce(
      (total, cartItem) => total + cartItem.price * cartItem.quantity,
      0
    );

    // Only add delivery price if orderType is delivery
    const totalWithDelivery = orderType === "delivery"
      ? totalInPence + restaurant.deliveryPrice
      : totalInPence;

    // Format using USD
    return `$${(totalWithDelivery / 100).toFixed(2)}`;
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight flex justify-between">
          <span>Your Order</span>
          {/* Display the calculated total */}
          <span>{getTotalCost()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {cartItems.map((item) => (
          <div className="flex justify-between" key={item._id}> {/* Add key */}
            <span>
              <Badge variant="outline" className="mr-2">
                {item.quantity}
              </Badge>
              {item.name}
            </span>
            <span className="flex items-center gap-1">
              <Trash
                className="cursor-pointer"
                color="red"
                size={20}
                onClick={() => removeFromCart(item)}
              />
              {/* Format using USD */}
              ${((item.price * item.quantity) / 100).toFixed(2)}
            </span>
          </div>
        ))}
        <Separator />
        {/* Conditionally render delivery fee */}
        {orderType === "delivery" && (
          <div className="flex justify-between">
            <span>Delivery</span>
            {/* Format using USD */}
            <span>${(restaurant.deliveryPrice / 100).toFixed(2)}</span>
          </div>
        )}
        {/* Separator might be needed only if delivery is shown */}
        {orderType === "delivery" && <Separator />}
      </CardContent>
    </>
  );
};

export default OrderSummary;
