import Stripe from "stripe";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant";
import Order from "../models/order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userid })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1?: string; // Make optional
    city?: string;         // Make optional
  };
  restaurantId: string;
  orderType: "delivery" | "pickup"; // Add orderType
};

const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_ENDPOINT_SECRET
    );
  } catch (error: any) {
    console.log(error);
    res.status(400).send(`Webhook error: ${error.message}`);
    return
  }

  if (event.type === "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return
    }

    order.totalAmount = event.data.object.amount_total;
    order.status = "paid";

    await order.save();
  }

  res.status(200).send();
};

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userid,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      orderType: checkoutSessionRequest.orderType, // Save orderType
      createdAt: new Date(),
    });

    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );

    // Pass orderType to createSession
    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      checkoutSessionRequest.orderType === "delivery" ? restaurant.deliveryPrice : 0, // Pass 0 if pickup
      restaurant._id.toString(),
      checkoutSessionRequest.orderType // Pass orderType
    );

    if (!session.url) {
      res.status(500).json({ message: "Error creating stripe session" });
      return
    }

    await newOrder.save();
    res.json({ url: session.url });
  } catch (error: any) {
    console.log(error);
    // Check for validation errors specifically
    if (error.message.includes('Address and city are required')) {
       res.status(400).json({ message: error.message });
    } else {
       res.status(500).json({ message: error.raw?.message || error.message || "An unknown error occurred" });
    }
  }
};

const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[]
): Stripe.Checkout.SessionCreateParams.LineItem[] => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
    }

    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "usd", // Changed to USD
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };

    return line_item;
  });

  return lineItems;
};

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number, // Price is now conditional (0 for pickup)
  restaurantId: string,
  orderType: "delivery" | "pickup" // Receive orderType
) => {

  // Conditionally add shipping options only for delivery
  const shippingOptions = orderType === "delivery" && deliveryPrice > 0 ? [
    {
      shipping_rate_data: {
        display_name: "Delivery",
        type: "fixed_amount" as const,
        fixed_amount: {
          amount: deliveryPrice, // Use the passed deliveryPrice
          currency: "usd", // Ensure currency matches line items
        },
      },
    },
  ] : undefined; // Set to undefined if pickup or deliveryPrice is 0


  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: shippingOptions, // Use the conditional options
    mode: "payment",
    metadata: {
      orderId,
      restaurantId,
      orderType, // Optionally store orderType in metadata too
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
  });

  return sessionData;
};

export default {
  getMyOrders,
  createCheckoutSession,
  stripeWebhookHandler,
};
