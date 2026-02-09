"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowUpRight,
  Briefcase,
  Users,
  Layers,
  FileClock,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/Skeleton";
import { useTranslations } from "next-intl";

export function DashboardContent() {
  const t = useTranslations("dashboard");
  const { stats, recentUsers, isLoading } = useDashboardStats();

  const statCards = [
    {
      title: t("totalProjects"),
      value: stats.projectsCount,
      icon: Briefcase,
    },
    {
      title: t("totalPrograms"),
      value: stats.programsCount,
      icon: Layers,
    },
    {
      title: t("totalUsers"),
      value: stats.usersCount,
      icon: Users,
    },
    {
      title: t("pendingApplications"),
      value: stats.pendingApplicationsCount,
      icon: FileClock,
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("overview.title")}</CardTitle>
            <CardDescription>
              {t("overview.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              {t("overview.chartPlaceholder")}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("recentUsers.title")}</CardTitle>
            <CardDescription>
              {t("recentUsers.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[150px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                ))
              ) : recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.email} className="flex items-center">
                    <Avatar className="size-9">
                      <AvatarImage
                        src={user.image_url || undefined}
                        alt={`${user.first_name} ${user.last_name}`}
                      />
                      <AvatarFallback>
                        {user.first_name?.[0]}
                        {user.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  {t("recentUsers.noUsersFound")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pendingApplications")}</CardTitle>
            <Badge variant="outline">{stats.pendingApplicationsCount}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplicationsCount}</div>
            <p className="text-xs text-muted-foreground">
              {t("pendingAppsCard.requireReview")}
            </p>
            <Button className="w-full mt-4" variant="outline" size="sm">
              {t("pendingAppsCard.viewAll")}
              <ArrowUpRight className="ml-2 size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
