import { Order } from "@/types"; // Make sure Order type is imported or defined
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to calculate the expected total amount based on cart items and delivery price
export const calculateExpectedOrderTotal = (order: Order): number | null => {
  // Ensure we have the necessary populated data
  if (!order.restaurant || !order.cartItems || !order.restaurant.menuItems) {
    console.warn("Cannot calculate total: Missing populated order data for order", order._id);
    return null; // Indicate calculation isn't possible
  }

  // Calculate sum of cart items
  const itemsTotal = order.cartItems.reduce((sum, cartItem) => {
    // Find the corresponding menu item price from the populated restaurant data
    const menuItem = order.restaurant.menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      console.warn(`Menu item ${cartItem.menuItemId} not found in restaurant data for order ${order._id}`);
      return sum; // Skip if menu item not found
    }

    // Price is already in pence/cents in the schema
    return sum + Number(menuItem.price) * Number(cartItem.quantity);
  }, 0);

  // Add delivery price (also in pence/cents)
  const totalWithDelivery = itemsTotal + order.restaurant.deliveryPrice;

  return totalWithDelivery; // Return total in pence/cents
};

// Function to format the price
export const formatPrice = (priceInPence: number | null | undefined): string => {
  if (typeof priceInPence !== 'number') {
    // Return a default value or handle as needed if calculation fails
    return "N/A";
  }
  return `$${(priceInPence / 100).toFixed(2)}`;
};

