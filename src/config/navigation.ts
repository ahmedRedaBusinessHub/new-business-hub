import { UserRole } from "@/types/auth";

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  roles: UserRole[];
}

export const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    roles: ["admin", "data-entry", "client", "store"],
  },
  {
    label: "Users",
    href: "/admin/users",
    roles: ["admin"],
  },
  {
    label: "Products",
    href: "/store",
    roles: ["admin", "store"],
  },
  {
    label: "Orders",
    href: "/client",
    roles: ["admin", "client", "store"],
  },
  {
    label: "Data Entry",
    href: "/data-entry",
    roles: ["admin", "data-entry"],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    roles: ["admin"],
  },
];

export function getNavigationForRole(role: UserRole): NavItem[] {
  return navigationItems.filter((item) => item.roles.includes(role));
}
