"use client";

import { Button } from "@/components/ui/Button";
import { signOut } from "next-auth/react";
export function Header() {
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-(--color-background)">
      <div className="h-full px-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-(--color-foreground)">
          Enterprise App
        </h1>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
