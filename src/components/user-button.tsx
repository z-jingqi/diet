"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />;
  }

  if (status === "authenticated") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src={session.user?.image ?? ""} alt={session.user?.name ?? ""} />
            <AvatarFallback>
              {session.user?.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button onClick={() => signIn("github")}>
      Sign In
    </Button>
  );
}
