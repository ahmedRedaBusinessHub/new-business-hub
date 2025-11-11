"use client";
import { AuthSession } from "@/types/auth";
import { useSession } from "next-auth/react";

export function useUser() {
  const { data: session, status } = useSession();
  const user = session?.user as AuthSession | undefined | any;

  return { user, status };
}
