"use client";

import { useEffect, useState } from "react";

import { useI18n } from "@/hooks/useI18n";
import { motion } from "motion/react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Calendar, CheckCircle, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Interface for UserProgram based on backend response
interface UserProgram {
    id: number;
    status: number;
    created_at: string;
    programs: {
        id: number;
        name_ar: string;
        name_en: string;
        detail_ar: string;
        detail_en: string;
        main_image_id?: number;
        promo_image?: string;
    };
    upload_documents: any[];
}

export default function MyProgramsList() {
    const { t, language } = useI18n();
    const [programs, setPrograms] = useState<UserProgram[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const responseData = await fetch('/api/user-program/my-applications');
                const response = await responseData.json();

                if (response.status === 1 && Array.isArray(response.data)) {
                    setPrograms(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch my programs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    const getStatusBadge = (status: number) => {
        switch (status) {
            case 0:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <Clock className="w-3 h-3" />
                        {t("status_pending") || "Pending"}
                    </span>
                );
            case 1:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        {t("status_approved") || "Approved"}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                        {t("status_unknown") || "Unknown"}
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="overflow-hidden border-none shadow-sm bg-white/50 dark:bg-black/20">
                        <Skeleton className="h-48 w-full" />
                        <CardHeader className="space-y-2">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (programs.length === 0) {
        return (
            <div className="text-center py-20 bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center">
                        <Clock className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold">{t("no_programs_yet") || "No programs found"}</h3>
                    <p className="text-muted-foreground">
                        {t("no_programs_desc") || "You haven't subscribed to any programs yet."}
                    </p>
                    <Button onClick={() => router.push("/programs")}>
                        {t("browse_programs") || "Browse Programs"}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((userProgram, index) => (
                <motion.div
                    key={userProgram.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 border-none bg-white dark:bg-white/5 group">
                        <div className="relative h-48 w-full overflow-hidden">
                            {userProgram.programs.promo_image ? (
                                <ImageWithFallback
                                    src={userProgram.programs.promo_image}
                                    alt={language === "ar" ? userProgram.programs.name_ar : userProgram.programs.name_en || userProgram.programs.name_ar}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 flex items-center justify-center">
                                    <span className="text-4xl">🚀</span>
                                </div>
                            )}
                            {/* <div className="absolute top-4 right-4 ltr:right-4 rtl:left-4">
                                {getStatusBadge(userProgram.status)}
                            </div> */}
                        </div>

                        <CardHeader>
                            <CardTitle className="line-clamp-1 text-lg">
                                {language === "ar" ? userProgram.programs.name_ar : userProgram.programs.name_en}
                            </CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {new Date(userProgram.created_at).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US")}
                                </span>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-grow">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {language === "ar" ? userProgram.programs.detail_ar : userProgram.programs.detail_en}
                            </p>
                        </CardContent>

                        <CardFooter className="pt-4 border-t border-gray-100 dark:border-white/10">
                            <Button
                                variant="outline"
                                className="w-full hover:bg-primary hover:text-white transition-colors"
                                onClick={() => router.push(`/programs/${userProgram.programs.id}`)}
                            >
                                {t("view_details") || "View Details"}
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
