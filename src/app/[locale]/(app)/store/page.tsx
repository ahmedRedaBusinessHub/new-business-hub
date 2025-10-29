import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default async function StoreDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
        Store Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--color-primary)]">
              234
            </p>
            <p className="text-sm text-gray-500 mt-1">Total products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--color-primary)]">45</p>
            <p className="text-sm text-gray-500 mt-1">New orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--color-primary)]">
              $8,920
            </p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
