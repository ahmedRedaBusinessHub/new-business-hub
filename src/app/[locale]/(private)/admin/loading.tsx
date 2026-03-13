import { Skeleton } from "@/components/ui/Skeleton";
import { SkeletonTable } from "@/components/ui/SkeletonTable";

export default function AdminLoading() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>

            <div className="rounded-md border bg-card p-1">
                <SkeletonTable rows={8} columns={5} />
            </div>
        </div>
    );
}
