"use client";

import { useState, useEffect } from "react";
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
import { Settings, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DynamicIcon } from "@/lib/icon-map";

interface NavigationItem {
  id: number;
  name: string;
  namespace: string;
  icon: string | null;
  type: number;
  url: string;
  order_no: number | null;
}

interface NavigationData {
  mainMenu: NavigationItem[];
  management: NavigationItem[];
}

export function AppSidebar() {
  const { language, t } = useI18n("admin");
  const pathname = usePathname();
  const [navigation, setNavigation] = useState<NavigationData>({
    mainMenu: [],
    management: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        setLoading(true);
        const lang = language === "ar" ? "ar" : "en";
        const response = await fetch(`/api/objects/navigation?lang=${lang}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch navigation");
        }

        const result = await response.json();
        if (result.status === 1 && result.data) {
          setNavigation(result.data);
        }
      } catch (error) {
        console.error("Error fetching navigation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigation();
  }, [language]);

  const isActive = (url: string) => {
    if (url === "/admin") {
      return pathname === "/admin" || pathname === "/admin/";
    }
    return pathname?.startsWith(url);
  };

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
                  <span className="truncate">{t("sidebar.businessHub")}</span>
                  <span className="truncate text-muted-foreground">
                    {t("sidebar.businessHubAr")}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {navigation.mainMenu.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>{t("sidebar.mainMenu")}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigation.mainMenu.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                          tooltip={item.name}
                        >
                          <Link href={item.url}>
                            {item.icon && (
                              <DynamicIcon
                                name={item.icon}
                                className="size-4"
                                size={16}
                              />
                            )}
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {navigation.management.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>{t("sidebar.management")}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigation.management.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                          tooltip={item.name}
                        >
                          <Link href={item.url}>
                            {item.icon && (
                              <DynamicIcon
                                name={item.icon}
                                className="size-4"
                                size={16}
                              />
                            )}
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={t("sidebar.settings")}>
              <a href="#">
                <Settings />
                <span>{t("sidebar.settings")}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
