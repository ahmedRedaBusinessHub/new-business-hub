import { auth } from "@/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { redirect } from "next/navigation";
import { AuthSession } from "@/types/auth";

export default async function SettingsPage() {
  const session: AuthSession | any = await auth();

  if (!session || session.user?.role !== "admin") {
    redirect("/admin");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
        Settings
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Application Name
              </label>
              <Input defaultValue="Enterprise App" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Support Email
              </label>
              <Input type="email" defaultValue="support@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Max Users
              </label>
              <Input type="number" defaultValue="1000" />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
