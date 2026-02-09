import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useI18n } from "@/hooks/useI18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Separator } from "@/components/ui/Separator";
import {
  User,
  Settings,
  CreditCard,
  Users,
  LifeBuoy,
  LogOut,
  KeyRound,
  Bell,
  Palette,
  Shield,
  Mail,
  Moon,
  Sun,
  LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
}

export function ProfileMenu() {
  const router = useRouter();
  const { t } = useI18n("profile_menu");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: session } = useSession(); // Access session data

  const [profile, setProfile] = useState<UserProfile>({
    name: session?.user?.name || "Admin User",
    email: session?.user?.email || "admin@example.com",
    role: session?.user?.role || "Administrator",
    avatar: session?.user?.image || "https://github.com/shadcn.png",
    bio: session?.user?.bio || "",
  });

  // Update profile when session loads
  useEffect(() => {
    if (session?.user) {
      setProfile((prev) => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
        role: session.user.role || prev.role,
        avatar: session.user.image || prev.avatar,
        bio: session.user.bio || prev.bio,
      }));
    }
  }, [session]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Call logout API first to invalidate token on backend
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.warn("Logout API call failed, proceeding with local logout");
      }

      // Sign out from NextAuth (this will clear the session)
      await signOut({
        redirect: false,
      });

      toast.success(t("logout_success"));

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still try to sign out locally even if API call fails
      await signOut({
        redirect: false,
      });
      toast.success(t("logout_success"));
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSaveProfile = () => {
    setIsProfileOpen(false);
    toast.success(t("edit_profile.success"));
  };

  const handleSaveSettings = () => {
    setIsSettingsOpen(false);
    toast.success(t("settings_modal.success"));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative size-8 rounded-full">
            <Avatar className="size-8">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="font-medium">{profile.name}</p>
                <p className="text-muted-foreground">{profile.email}</p>
                <Badge variant="secondary" className="w-fit">
                  {profile.role}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push("/my-programs")}>
              <LayoutGrid className="mr-2 size-4" />
              <span>{t("my_programs")}</span>
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
              <User className="mr-2 size-4" />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={() => router.push("/admin")}>
              <Settings className="mr-2 size-4" />
              <span>{t("settings")}</span>
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <CreditCard className="mr-2 size-4" />
              <span>Billing</span>
            </DropdownMenuItem> */}
          </DropdownMenuGroup>
          {/* <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Users className="mr-2 size-4" />
              <span>Team</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 size-4" />
              <span>Security</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <KeyRound className="mr-2 size-4" />
              <span>API Keys</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 size-4" />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Mail className="mr-2 size-4" />
            <span>Contact</span>
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600"
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 size-4" />
            <span>{isLoggingOut ? t("logging_out") : t("logout")}</span>
            {!isLoggingOut && <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("edit_profile.title")}</DialogTitle>
            <DialogDescription>
              {t("edit_profile.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-20">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback>
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{t("edit_profile.full_name")}</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("edit_profile.email")}</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">{t("edit_profile.role")}</Label>
              <Input
                id="role"
                value={profile.role}
                onChange={(e) =>
                  setProfile({ ...profile, role: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{t("edit_profile.bio")}</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e: any) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
              {t("edit_profile.cancel")}
            </Button>
            <Button onClick={handleSaveProfile}>{t("edit_profile.save")}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("settings_modal.title")}</DialogTitle>
            <DialogDescription>
              {t("settings_modal.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <h4 className="mb-4 flex items-center gap-2">
                <Palette className="size-4" />
                {t("settings_modal.appearance")}
              </h4>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label>{t("settings_modal.dark_mode")}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t("settings_modal.dark_mode_desc")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {darkMode ? (
                    <Moon className="size-4 text-muted-foreground" />
                  ) : (
                    <Sun className="size-4 text-muted-foreground" />
                  )}
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-4 flex items-center gap-2">
                <Bell className="size-4" />
                {t("settings_modal.notifications")}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label>{t("settings_modal.email_notifications")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings_modal.email_notifications_desc")}
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label>{t("settings_modal.push_notifications")}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t("settings_modal.push_notifications_desc")}
                    </p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="mb-4 flex items-center gap-2">
                <Shield className="size-4" />
                {t("settings_modal.security")}
              </h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <KeyRound className="mr-2 size-4" />
                  {t("settings_modal.change_password")}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 size-4" />
                  {t("settings_modal.two_factor")}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              {t("settings_modal.cancel")}
            </Button>
            <Button onClick={handleSaveSettings}>{t("settings_modal.save")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
