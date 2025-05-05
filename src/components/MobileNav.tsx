import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { CircleUserRound, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import MobileNavLinks from "./MobileNavLinks";
import { ModeToggle } from "./mode-toggle";

export default function MobileNav() {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  return (
    <Sheet>
      <div className="flex items-center justify-between px-2 py-1 gap-4">
        <ModeToggle />
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="text-zinc-950 dark:text-white size-[1.75rem]" />
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent className="space-y-3">
        <SheetTitle>
          {isAuthenticated ? (
            <span className="flex items-center font-bold gap-2 pt-[4.25rem] pb-[1.75rem] justify-center">
              <CircleUserRound className="text-black dark:text-white" />
              {user?.email}
            </span>
          ) : (
            <span className="flex justify-center font-bold pt-[4.25rem]">
              {" "}
              Welcome to Cafeteria.com
            </span>
          )}
        </SheetTitle>

        <SheetDescription className="flex flex-col gap-4 justify-center items-center">
          {isAuthenticated ? (
            <MobileNavLinks />
          ) : (
            <Button
              onClick={() => loginWithRedirect()}
              className="flex-1 font-bold bg-zinc-950 w-[85%]"
            >
              Log In
            </Button>
          )}
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
