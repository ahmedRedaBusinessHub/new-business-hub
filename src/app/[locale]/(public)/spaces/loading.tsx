import { Skeleton } from "@/components/ui/Skeleton";

export default function SpacesLoading() {
    return (
        <div className="container py-10">
            <div className="mb-8">
                <Skeleton className="h-10 w-64 mb-4" />
                <Skeleton className="h-6 w-96" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-card p-5 rounded-xl border space-y-6">
                        <Skeleton className="h-6 w-24 mb-6" />
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <Skeleton className="h-5 w-32 mb-6" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-2 rounded-xl border p-4 h-full bg-card">
                                <Skeleton className="w-full aspect-4/3 rounded-lg" />
                                <div className="flex justify-between items-center mt-4 mb-2">
                                    <Skeleton className="w-1/2 h-6" />
                                    <Skeleton className="w-8 h-4" />
                                </div>
                                <Skeleton className="w-1/3 h-4 mb-4" />
                                <Skeleton className="w-full h-10 mt-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
