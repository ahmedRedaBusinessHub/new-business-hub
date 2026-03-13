import { useRef, useCallback } from "react";
import { Separator } from "@/components/ui/Separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/Sidebar";
import { NotificationCenter } from "@/components/layout/notification-center";
import { ProfileMenu } from "@/components/features/ProfileMenu";
import { useI18n } from "@/hooks/useI18n";
import { useKeyboardShortcut } from "@/lib/hooks/use-keyboard-shortcut";

export function Header() {
  const { t } = useI18n("admin");
  const searchRef = useRef<HTMLInputElement>(null);

  const focusSearch = useCallback(() => {
    searchRef.current?.focus();
    searchRef.current?.select();
  }, []);

  useKeyboardShortcut(focusSearch, { key: "k", modifiers: ["meta"] });

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">{t("header.dashboard")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("header.overview")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            ref={searchRef}
            type="search"
            placeholder={t("header.searchPlaceholder")}
            className="w-[300px] pl-8"
            aria-label={t("header.searchPlaceholder")}
            aria-keyshortcuts="Meta+K"
          />
        </div>
      </div>
      <NotificationCenter />
      <ProfileMenu />
    </header>
  );
}
