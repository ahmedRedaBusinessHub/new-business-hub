import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScrollArea } from "@/components/ui/Scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import { Separator } from "@/components/ui/Separator";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  AlertCircle,
  Info,
  UserPlus,
  ShoppingCart,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/components/ui/utils";

interface Notification {
  id: string;
  type:
    | "info"
    | "warning"
    | "success"
    | "message"
    | "user"
    | "order"
    | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "order",
    title: "New Order Received",
    message: "Order #12345 has been placed by John Doe",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "user",
    title: "New User Registration",
    message: "Jane Smith joined your platform",
    time: "15 min ago",
    read: false,
  },
  {
    id: "3",
    type: "message",
    title: "New Message",
    message: "You have 3 unread messages from support team",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "4",
    type: "warning",
    title: "Low Stock Alert",
    message: "5 products are running low on inventory",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "Payment Received",
    message: "$2,450 payment confirmed for invoice #INV-001",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "6",
    type: "system",
    title: "System Update",
    message: "System maintenance scheduled for tonight at 2 AM",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "7",
    type: "info",
    title: "Weekly Report Ready",
    message: "Your analytics report for this week is ready to download",
    time: "1 day ago",
    read: true,
  },
];

const getNotificationIcon = (type: Notification["type"]) => {
  const iconClass = "size-4";
  switch (type) {
    case "order":
      return <ShoppingCart className={iconClass} />;
    case "user":
      return <UserPlus className={iconClass} />;
    case "message":
      return <MessageSquare className={iconClass} />;
    case "warning":
      return <AlertCircle className={iconClass} />;
    case "success":
      return <Check className={iconClass} />;
    case "system":
      return <Settings className={iconClass} />;
    default:
      return <Info className={iconClass} />;
  }
};

const getNotificationColor = (type: Notification["type"]) => {
  switch (type) {
    case "order":
      return "bg-blue-500/10 text-blue-600";
    case "user":
      return "bg-green-500/10 text-green-600";
    case "message":
      return "bg-purple-500/10 text-purple-600";
    case "warning":
      return "bg-orange-500/10 text-orange-600";
    case "success":
      return "bg-emerald-500/10 text-emerald-600";
    case "system":
      return "bg-gray-500/10 text-gray-600";
    default:
      return "bg-blue-500/10 text-blue-600";
  }
};

export function NotificationList() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-1 right-1 size-2 rounded-full bg-red-600" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center"
              >
                {unreadCount}
              </Badge>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} new</Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-0 text-sm"
            >
              <CheckCheck className="mr-1 size-3" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="size-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "relative flex gap-3 px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer group",
                    !notification.read && "bg-accent/30"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full",
                      getNotificationColor(notification.type)
                    )}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-sm leading-tight",
                          !notification.read && "font-semibold"
                        )}
                      >
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="size-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" className="w-full" onClick={clearAll}>
                Clear All Notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
