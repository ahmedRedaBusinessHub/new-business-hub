import { auth } from "@/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { AuthSession } from "@/types/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session: AuthSession | any = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome back, {session.user?.name || "Admin"}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[var(--color-primary)]">
              1,234
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[var(--color-primary)]">
              456
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[var(--color-primary)]">
              $12,345
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
