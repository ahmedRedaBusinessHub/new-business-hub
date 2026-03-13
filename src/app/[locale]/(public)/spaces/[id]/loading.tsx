import { Skeleton } from "@/components/ui/Skeleton";

export default function SpaceDetailsLoading() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl animate-pulse">
            <div className="mb-6 space-y-4">
                <Skeleton className="h-10 w-3/4 max-w-lg" />
                <div className="flex gap-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-24" />
                </div>
            </div>

            <div className="mb-10">
                <Skeleton className="w-full aspect-video md:aspect-[2/1] rounded-xl" />
                <div className="flex gap-2 mt-4">
                    <Skeleton className="h-20 w-32 rounded-md" />
                    <Skeleton className="h-20 w-32 rounded-md" />
                    <Skeleton className="h-20 w-32 rounded-md" />
                    <Skeleton className="h-20 w-32 rounded-md" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>

                    <div className="space-y-4">
                        <Skeleton className="h-8 w-40" />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <Skeleton className="h-96 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}
