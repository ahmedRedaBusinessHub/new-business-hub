"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/hooks/useI18n";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Calendar, Users, Loader2, Rocket, Tag } from "lucide-react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { getLocalizedLabel } from "@/lib/localizedLabel";
import { staticListsCache } from "@/lib/staticListsCache";

interface StaticListOption {
    id: number;
    name_en: string;
    name_ar: string;
}

interface Program {
    id: number;
    name_ar: string;
    name_en: string | null;
    detail_ar: string | null;
    detail_en: string | null;
    main_image_url?: string | null;
    from_datetime: string | null;
    to_datetime: string | null;
    type: number | null;
}

export function ProgramsList() {
    const { language: locale, t } = useI18n();
    const language = (typeof locale === 'string' ? locale : locale?.[0]) || 'ar';
    const [programs, setPrograms] = useState<Program[]>([]);
    const [programTypes, setProgramTypes] = useState<StaticListOption[]>([]);
    const [selectedType, setSelectedType] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 9; // Grid 3x3

    const fetchPrograms = async (pageNum: number, isLoadMore: boolean = false, typeId: number | null = selectedType) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            let url = `/api/public/programs?page=${pageNum}&limit=${limit}`;
            if (typeId !== null) {
                url += `&type=${typeId}`;
            }

            const res = await fetch(url);
            const responseData = await res.json();

            const newPrograms = responseData.data || [];
            const total = responseData.total || 0;

            if (isLoadMore) {
                setPrograms((prev) => [...prev, ...newPrograms]);
            } else {
                setPrograms(newPrograms);
            }

            setHasMore(pageNum * limit < total);

        } catch (error) {
            console.error("Failed to fetch programs", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchPrograms(1, false, null);

        getTypes();
    }, []);

    const getTypes = async () => {
        const res = await fetch(`/api/public/static-lists?namespace=program.types`);
        const responseData = await res.json();
        // Since we filter by namespace, data should contain one static list record
        const staticList = responseData.data?.[0];
        if (staticList && staticList.config) {
            setProgramTypes(Array.isArray(staticList.config) ? staticList.config : []);
        } else {
            setProgramTypes([]);
        }
    }

    const getTypeName = (typeId: number | null) => {
        if (typeId === null) return null;
        const type = programTypes.find((t) => t.id === typeId);
        return type ? getLocalizedLabel(type.name_en, type.name_ar, language) : null;
    };

    const handleTypeSelect = (typeId: number | null) => {
        setSelectedType(typeId);
        setPage(1);
        fetchPrograms(1, false, typeId);
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPrograms(nextPage, true);
    };



    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-6">

                {/* Type Filter */}
                <div className="flex flex-wrap gap-3 mb-12 justify-center">
                    <Button
                        variant={selectedType === null ? "default" : "outline"}
                        onClick={() => handleTypeSelect(null)}
                        className={`rounded-full px-6 ${selectedType === null ? "bg-primary text-white" : "hover:bg-primary/5"}`}
                    >
                        {language === "ar" ? "الكل" : "All"}
                    </Button>
                    {programTypes.map((type) => (
                        <Button
                            key={type.id}
                            variant={selectedType === type.id ? "default" : "outline"}
                            onClick={() => handleTypeSelect(type.id)}
                            className={`rounded-full px-6 ${selectedType === type.id ? "bg-primary text-white" : "hover:bg-primary/5"}`}
                        >
                            {getLocalizedLabel(type.name_en, type.name_ar, language)}
                        </Button>
                    ))}
                </div>
                {loading && page === 1 ? <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div> : <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="wait">
                            {programs.map((program, index) => (
                                <motion.div
                                    key={program.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="h-full overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group border-0 bg-white/50 backdrop-blur-sm flex flex-col">
                                        <div className="relative h-56 overflow-hidden">
                                            {program.main_image_url ? (
                                                <ImageWithFallback
                                                    src={program.main_image_url}
                                                    alt={language === "ar" ? program.name_ar : program.name_en || program.name_ar}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-500">
                                                    <Rocket className="w-16 h-16 text-primary/20 group-hover:text-primary/40 transition-colors duration-500" />
                                                </div>
                                            )}

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />

                                            {/* Status Badge */}
                                            <div className="absolute top-4 right-4 z-10">
                                                {(() => {
                                                    const now = new Date();
                                                    const from = program.from_datetime ? new Date(program.from_datetime) : null;
                                                    const to = program.to_datetime ? new Date(program.to_datetime) : null;
                                                    let status = { label: "", color: "" };

                                                    if (from && now < from) {
                                                        status = { label: language === "ar" ? "قريباً" : "Upcoming", color: "bg-blue-500" };
                                                    } else if (from && to && now >= from && now <= to) {
                                                        status = { label: language === "ar" ? "متاح للتسجيل" : "Open Now", color: "bg-emerald-500" };
                                                    } else if (to && now > to) {
                                                        status = { label: language === "ar" ? "منتهي" : "Closed", color: "bg-gray-500" };
                                                    } else {
                                                        // Default if no dates
                                                        return null;
                                                    }

                                                    return (
                                                        <span className={`${status.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md bg-opacity-90`}>
                                                            {status.label}
                                                        </span>
                                                    );
                                                })()}
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="flex items-center gap-2 mb-3 text-xs font-medium text-primary">
                                                {program.from_datetime && (
                                                    <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-md">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span>
                                                            {new Date(program.from_datetime).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                )}

                                                {program.type && getTypeName(program.type) && (
                                                    <div className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-md text-secondary-foreground">
                                                        <Tag className="w-3.5 h-3.5" />
                                                        <span>{getTypeName(program.type)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors h-[3.5rem] leading-tight">
                                                {getLocalizedLabel(program.name_en, program.name_ar, language)}
                                            </h3>

                                            <p className="text-muted-foreground mb-6 line-clamp-3 text-sm flex-grow">
                                                {getLocalizedLabel(program.detail_en, program.detail_ar, language)}
                                            </p>

                                            <div className="mt-auto pt-4 border-t border-gray-100">
                                                <Link href={`/programs/${program.id}`} className="block w-full">
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full gap-2 justify-between group-hover:bg-primary group-hover:text-white transition-all duration-300 rounded-xl hover:pl-6 hover:pr-6"
                                                    >
                                                        <span className="font-semibold">{language === "ar" ? "عرض التفاصيل" : "View Details"}</span>
                                                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${language === "ar" ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"}`} />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {hasMore && (
                        <div className="flex justify-center mt-12">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="gap-2"
                            >
                                {loadingMore ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {language === "ar" ? "جاري التحميل..." : "Loading..."}
                                    </>
                                ) : (
                                    language === "ar" ? "تحميل المزيد" : "Load More"
                                )}
                            </Button>
                        </div>
                    )}</>}

                {!loading && programs.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-lg">
                            {language === "ar" ? "لا توجد برامج متاحة حالياً" : "No programs available at the moment"}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
