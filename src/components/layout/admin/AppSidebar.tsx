"use client";

import Logo from "@/components/features/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/Sidebar";
import { useI18n } from "@/hooks/useI18n";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  FileText,
  MessageSquare,
  Tag,
  CreditCard,
  Database,
} from "lucide-react";
import Link from "next/link";

const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin",
    isActive: true,
  },
  {
    title: "Users",
    icon: Users,
    url: "/admin/users",
  },
  // {
  //   title: "Products",
  //   icon: Package,
  //   url: "#",
  // },
  // {
  //   title: "Orders",
  //   icon: ShoppingCart,
  //   url: "#",
  // },
  // {
  //   title: "Analytics",
  //   icon: BarChart3,
  //   url: "#",
  // },
];

const managementItems = [
  // {
  //   title: "Categories",
  //   icon: Tag,
  //   url: "#",
  // },
  // {
  //   title: "Payments",
  //   icon: CreditCard,
  //   url: "#",
  // },
  // {
  //   title: "Content",
  //   icon: FileText,
  //   url: "#",
  // },
  // {
  //   title: "Messages",
  //   icon: MessageSquare,
  //   url: "#",
  // },
  {
    title: "Contacts",
    icon: MessageSquare,
    url: "/admin/contacts",
  },
  {
    title: "Organizations",
    icon: Package,
    url: "/admin/organizations",
  },
  {
    title: "Third Parties",
    icon: Package,
    url: "/admin/third-parties",
  },
  {
    title: "News",
    icon: FileText,
    url: "/admin/news",
  },
  {
    title: "Newsletter",
    icon: FileText,
    url: "/admin/newsletter-subscriptions",
  },
  {
    title: "Programs",
    icon: FileText,
    url: "/admin/programs",
  },
  {
    title: "Projects",
    icon: FileText,
    url: "/admin/projects",
  },
  {
    title: "Reviews",
    icon: FileText,
    url: "/admin/reviews",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/admin/settings",
  },
  {
    title: "Cache Management",
    icon: Database,
    url: "/admin/cache-management",
  },
];

export function AppSidebar() {
  const { language } = useI18n();
  return (
    <Sidebar collapsible="icon" side={language == "ar" ? "right" : "left"}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg   text-primary-foreground">
                  <Logo />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate">Business Hub</span>
                  <span className="truncate text-muted-foreground">
                    بيزنس هب
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <a href="#">
                <Settings />
                <span>Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
