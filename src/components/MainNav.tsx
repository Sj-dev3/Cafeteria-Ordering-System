import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import UsernameMenu from "./UsernameMenu";
import { ModeToggle } from "./mode-toggle";

export default function MainNav() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  return (
    <span className="flex space-x-2 items-center">
      <ModeToggle />
      {isAuthenticated ? (
        <UsernameMenu />
      ) : (
        <Button
          variant="ghost"
          className="font-bold hover:text-zinc-300 hover:bg-white cursor-pointer"
          onClick={async () => await loginWithRedirect()}
        >
          Log In
        </Button>
      )}
    </span>
  );
}
