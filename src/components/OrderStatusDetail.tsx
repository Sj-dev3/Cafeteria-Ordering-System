import { Order } from "@/types";
import { Separator } from "./ui/separator";
// Import the helper functions
import { calculateExpectedOrderTotal, formatPrice } from "@/lib/utils";

type Props = {
  order: Order;
};

const OrderStatusDetail = ({ order }: Props) => {
  // Use confirmed totalAmount if available, otherwise calculate the expected total
  const totalToDisplay = order.totalAmount ?? calculateExpectedOrderTotal(order);

  return (
    <div className="space-y-5">
      <div className="flex flex-col">
        <span className="font-bold">Delivering to:</span>
        <span>{order.deliveryDetails.name}</span>
        <span>
          {order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-bold">Your Order</span>
        <ul>
          {order.cartItems.map((item) => (
            // Add a key prop for React list rendering
            <li key={item.menuItemId}>
              {item.name} x {item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div className="flex flex-col">
        <span className="font-bold">Total</span>
        {/* Format the determined total (confirmed or calculated) */}
        <span>{formatPrice(totalToDisplay)}</span>
      </div>
    </div>
  );
};

export default OrderStatusDetail;
