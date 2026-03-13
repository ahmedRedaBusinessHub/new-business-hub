"use client";
import { User } from "@/types/auth";
import { useSession } from "next-auth/react";

export function useUser() {
  const { data: session, status } = useSession();
  const user = session?.user as User | undefined;

  return { user, status, session };
}
