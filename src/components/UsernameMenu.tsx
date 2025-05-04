import { useAuth0 } from "@auth0/auth0-react";
// Import from your local UI components instead of directly from Radix
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator"; // Import from local ui
import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button"; // Keep this as it's already correct

const UsernameMenu = () => {
    const { user, logout } = useAuth0();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center px-3 font-bold hover:text-orange-500 gap-2 outline-none"> {/* Added outline-none for better focus state */}
                <CircleUserRound className="text-orange-500" />
                {user?.email}
            </DropdownMenuTrigger>
            {/* DropdownMenuContent now uses the styled version from ./ui */}
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link to = "/manage-restaurant" className="font-bold hover:text-orange-500">
                        Manage Restaurant
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link to = "/user-profile" className="font-bold hover:text-orange-500">
                        User Profile
                    </Link>
                </DropdownMenuItem>
                {/* Add the new Order Status link here */}
                <DropdownMenuItem>
                    <Link to = "/order-status" className="font-bold hover:text-orange-500">
                        Order Status
                    </Link>
                </DropdownMenuItem>
                {/* Separator now uses the styled version from ./ui */}
                <Separator/>
                <DropdownMenuItem>
                    {/* Ensure Button is imported correctly from ./ui/button */}
                    <Button
                        onClick ={() => logout()}
                        className="flex flex-1 font-bold bg-orange-500"
                    >
                        Logout
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export default UsernameMenu;