import { useGetRestaurant } from "@/api/RestaurantApi";
import MenuItem from "@/components/MenuItem";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardFooter } from "@/components/ui/card"; // Import CardContent
import { useState } from "react";
import { useParams } from "react-router-dom";
import { MenuItem as MenuItemType } from "../types";
import CheckoutButton from "@/components/CheckoutButton";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { useCreateCheckoutSession } from "@/api/OrderApi";
// Import RadioGroup components and Label
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ReviewForm from "@/components/ReviewForm";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const DetailPage = () => {
  const { restaurantId } = useParams();
  const { restaurant, isLoading } = useGetRestaurant(restaurantId);
  const { createCheckoutSession, isLoading: isCheckoutLoading } =
    useCreateCheckoutSession();

  // State for order type remains here
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  const addToCart = (menuItem: MenuItemType) => {
    setCartItems((prevCartItems) => {
      const existingCartItem = prevCartItems.find(
        (cartItem) => cartItem._id === menuItem._id
      );

      let updatedCartItems;

      if (existingCartItem) {
        updatedCartItems = prevCartItems.map((cartItem) =>
          cartItem._id === menuItem._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        updatedCartItems = [
          ...prevCartItems,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ];
      }

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      );

      return updatedCartItems;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter(
        (item) => cartItem._id !== item._id
      );

      sessionStorage.setItem(
        `cartItems-${restaurantId}`,
        JSON.stringify(updatedCartItems)
      );

      return updatedCartItems;
    });
  };

  const onCheckout = async (userFormData: UserFormData) => {
    if (!restaurant) {
      return;
    }

    // Ensure address is included only if delivery is selected
    const deliveryDetailsToSend =
      orderType === "delivery"
        ? {
            name: userFormData.name,
            addressLine1: userFormData.addressLine1,
            city: userFormData.city,
            country: userFormData.country,
            email: userFormData.email as string,
          }
        : {
            name: userFormData.name, // Still need name/email for pickup
            email: userFormData.email as string,
          };

    const checkoutData = {
      cartItems: cartItems.map((cartItem) => ({
        menuItemId: cartItem._id,
        name: cartItem.name,
        quantity: cartItem.quantity.toString(),
      })),
      restaurantId: restaurant._id,
      deliveryDetails: deliveryDetailsToSend, // Use conditional details
      orderType: orderType, // Include selected order type
    };

    const data = await createCheckoutSession(checkoutData);
    window.location.href = data.url;
  };

  if (isLoading || !restaurant) {
    return "Loading...";
  }

  return (
    <div className="flex flex-col gap-10">
      <RestaurantInfo restaurant={restaurant} />
      <AspectRatio ratio={16 / 5}>
        <img
          src={restaurant.imageUrl}
          className="rounded-md object-cover h-full w-full"
        />
      </AspectRatio>
      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-4">
          {restaurant.menuItems.map((menuItem) => (
            <MenuItem
              key={menuItem._id}
              menuItem={menuItem}
              addToCart={() => addToCart(menuItem)}
            />
          ))}
        </div>
        <div>
          <Card>
            {/* OrderSummary still receives orderType to display fee correctly */}
            <OrderSummary
              restaurant={restaurant}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              orderType={orderType}
            />
            {/* Add Radio Group UI here, inside CardContent */}
            <CardContent>
              <div className="mt-4">
                {" "}
                {/* Add some margin */}
                <Label className="text-lg font-semibold mb-2 block">
                  Order Option
                </Label>
                <RadioGroup
                  defaultValue={orderType}
                  onValueChange={(value) =>
                    setOrderType(value as "delivery" | "pickup")
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery-page" />{" "}
                    {/* Use unique ID */}
                    <Label htmlFor="delivery-page">Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup-page" />{" "}
                    {/* Use unique ID */}
                    <Label htmlFor="pickup-page">Pickup</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            
            <CardFooter>
              {/* CheckoutButton now needs orderType passed to it so it can pass it to the form */}
              <div className="flex flex-col gap-4 w-full">
                {restaurantId && <ReviewForm restaurantId={restaurantId} />}
                <CheckoutButton
                  disabled={cartItems.length === 0}
                  onCheckout={onCheckout}
                  isLoading={isCheckoutLoading}
                  orderType={orderType} // Pass orderType down
                />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
