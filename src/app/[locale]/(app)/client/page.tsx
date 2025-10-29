import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default async function ClientDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
        Client Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--color-primary)]">12</p>
            <p className="text-sm text-gray-500 mt-1">Active orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--color-primary)]">
              $2,450
            </p>
            <p className="text-sm text-gray-500 mt-1">Current balance</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
