import { getUserSession } from "@/app/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User } from "lucide-react";
import Logout from "./logout";

export async function AvatarProfile() {
  const session = await getUserSession();
  const fn = session.email![0];
  return (
    <div className="hover:cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            {session.image && (
              <AvatarImage src={session.image!} alt={session.email!} />
            )}
            <AvatarFallback>{fn}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Logout />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
