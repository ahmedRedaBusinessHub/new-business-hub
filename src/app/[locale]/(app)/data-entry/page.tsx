import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function DataEntryDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
        Data Entry Dashboard
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full" variant="default">
            Add New Entry
          </Button>
          <Button className="w-full" variant="outline">
            View Pending Entries
          </Button>
          <Button className="w-full" variant="outline">
            Generate Report
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Entries Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--color-primary)]">67</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[var(--color-primary)]">23</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
