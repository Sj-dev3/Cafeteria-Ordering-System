import { useAuth0 } from "@auth0/auth0-react";
// Import from your local UI components instead of directly from Radix
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator"; // Import from local ui
import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button"; // Keep this as it's already correct

const UsernameMenu = () => {
  const { user, logout } = useAuth0();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-3 font-bold hover:text-zinc-300 gap-2 outline-none cursor-pointer dark:text-zinc-300">
        {" "}
        {/* Added outline-none for better focus state */}
        <CircleUserRound className="text-zinc-900 dark:text-zinc-300" />
        {user?.email}
      </DropdownMenuTrigger>
      {/* DropdownMenuContent now uses the styled version from ./ui */}
      <DropdownMenuContent className="dark:bg-zinc-950">
        <DropdownMenuItem>
          <Link
            to="/manage-restaurant"
            className="font-bold hover:text-zinc-300 dark:text-zinc-300"
          >
            Manage Restaurant
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            to="/user-profile"
            className="font-bold hover:text-zinc-300 dark:text-zinc-300"
          >
            User Profile
          </Link>
        </DropdownMenuItem>
        {/* Add the new Order Status link here */}
        <DropdownMenuItem>
          <Link
            to="/order-status"
            className="font-bold hover:text-zinc-300 dark:text-zinc-300"
          >
            Order Status
          </Link>
        </DropdownMenuItem>
        {/* Separator now uses the styled version from ./ui */}
        <Separator />
        <DropdownMenuItem>
          {/* Ensure Button is imported correctly from ./ui/button */}
          <Button
            onClick={() => logout()}
            className="flex flex-1 font-bold bg-zinc-900 cursor-pointer hover:bg-zinc-300 hover:text-zinc-900 dark:bg-zinc-300 dark:hover:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UsernameMenu;
