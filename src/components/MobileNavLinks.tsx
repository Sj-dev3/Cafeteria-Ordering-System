import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { Store, User, ListChecks, LogOut } from "lucide-react";

export default function MobileNavLinks() {
  const { logout } = useAuth0();

  return (
    <div className="flex flex-col items-center gap-y-6 mt-[15rem] text-left">
      <div className="flex flex-col gap-y-[2.5rem] w-full px-4">
        <Link
          to="/manage-restaurant"
          className="flex items-center gap-2 font-medium text-zinc-950  dark:text-zinc-100"
        >
          <Store size={18} />
          Manage Restaurant
        </Link>

        <Link
          to="/user-profile"
          className="flex items-center gap-2 font-medium text-zinc-950  dark:text-zinc-100"
        >
          <User size={18} />
          User Profile
        </Link>

        <Link
          to="/order-status"
          className="flex items-center gap-2 font-medium text-zinc-950  dark:text-zinc-100"
        >
          <ListChecks size={18} />
          Order Status
        </Link>
      </div>

      <Button
        onClick={() => logout()}
        variant="destructive"
        className="mt-[18rem] flex items-center gap-2 font-bold px-6"
      >
        <LogOut size={18} />
        Logout
      </Button>
    </div>
  );
}
