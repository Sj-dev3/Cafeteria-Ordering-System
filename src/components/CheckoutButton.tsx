import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import LoadingButton from "./LoadingButton";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import UserProfileForm, {
  UserFormData,
} from "@/forms/user-profile-form/UserProfileForm";
import { useGetMyUser } from "@/api/MyUserApi";
// Remove RadioGroup and Label imports if no longer used elsewhere here
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";

type Props = {
  onCheckout: (userFormData: UserFormData) => void;
  disabled: boolean;
  isLoading: boolean;
  orderType: "delivery" | "pickup"; // Keep orderType to pass down
  // Remove setOrderType prop
  // setOrderType: (type: "delivery" | "pickup") => void;
};

// Remove setOrderType from destructuring
const CheckoutButton = ({
  onCheckout,
  disabled,
  isLoading,
  orderType,
}: Props) => {
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    loginWithRedirect,
  } = useAuth0();
  const { pathname } = useLocation();
  const { currentUser, isLoading: isGetUserLoading } = useGetMyUser();

  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: pathname,
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <Button
        onClick={onLogin}
        className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex-1"
      >
        Log in to check out
      </Button>
    );
  }

  if (isAuthLoading || !currentUser || isLoading) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          className="bg-zinc-950 hover:bg-zinc-300 hover:text-zinc-950 dark:bg-white dark:hover:bg-zinc-900 dark:hover:text-gray-50 flex-1 cursor-pointer"
        >
          Go to checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50 dark:bg-zinc-950">
        {/* Remove Radio Group UI from here */}
        <UserProfileForm
          currentUser={currentUser}
          onSave={onCheckout}
          isLoading={isGetUserLoading} // Pass the correct loading state
          title={
            orderType === "delivery"
              ? "Confirm Delivery Details"
              : "Confirm Pickup Details"
          } // Dynamic title
          buttonText="Continue to payment"
          // Pass orderType to conditionally render fields in the form
          orderType={orderType}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
