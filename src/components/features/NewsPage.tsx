"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
    Calendar,
    ArrowRight,
    ArrowLeft,
    Clock,
    Tag,
    Search,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/Pagination";
import { useI18n } from "@/hooks/useI18n";
import Link from "next/link";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { getImageUrl, getReadTime } from "@/lib/utils";

interface News {
    id: number;
    title_ar: string;
    title_en: string | null;
    detail_ar: string | null;
    detail_en: string | null;
    status: number;
    main_image_url?: string | null;
    created_at: string | null;
}

export default function NewsPage() {
    const { t, language } = useI18n("news");
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 9,
        total: 0,
        totalPages: 0,
    });

    const categoryColors = [
        "var(--theme-primary)",
        "var(--theme-accent)",
        "var(--theme-accent-light)",
    ];

    const ArrowIcon = language === "ar" ? ArrowLeft : ArrowRight;

    const fetchNews = async () => {
        try {
            if (pagination.page === 1) setLoading(true); // Only show full loader on first page

            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(searchQuery && { search: searchQuery }),
            });

            const response = await fetch(`/api/public/news?${params}`);
            if (response.ok) {
                const data = await response.json();
                console.log("🚀 ~ fetchNews ~ data:", data)
                const newItems = Array.isArray(data.data) ? data.data : [];

                setNews(prev => pagination.page === 1 ? newItems : [...prev, ...newItems]);

                setPagination((prev) => ({
                    ...prev,
                    total: data.total || 0,
                    totalPages: data.totalPages || 0,
                }));
            }
        } catch (error) {
            console.error("Failed to fetch news", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            // If search query changes, we reset everything including triggering a new fetch
            // But we must be careful not to trigger double fetch if page changes too.
            // Actually, setting page to 1 will trigger the other effect.
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 300);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    useEffect(() => {
        fetchNews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page]); // Depend on page, search will reset page to 1 which triggers this.

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, page }));
    };



    return (

        <div className="min-h-screen" style={{ backgroundColor: "var(--theme-bg-primary)" }} dir={language === "ar" ? "rtl" : "ltr"}>
            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <ImageWithFallback
                        src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070"
                        alt="News Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[var(--theme-bg-primary)]" />
                </div>

                <div className="relative z-10 container mx-auto px-4 text-center mt-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-bold mb-6 text-white"
                    >
                        {t("title") || (language === "ar" ? "آخر الأخبار" : "Latest News")}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8"
                    >
                        {t("subtitle") || (language === "ar" ? "تابع آخر المستجدات والأحداث" : "Stay updated with our latest news and events")}
                    </motion.p>

                    {/* Search Bar */}
                    {/* <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative max-w-md mx-auto"
                    >
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rtl:right-3 rtl:left-auto" />
                            <Input
                                placeholder={language === "ar" ? "بحث عن مقالات..." : "Search articles..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-6 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-400 rounded-full focus:bg-white/20 transition-all rtl:pr-10 rtl:pl-4"
                            />
                        </div>
                    </motion.div> */}
                </div>
            </section>

            <div className="container mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">

                {/* Grid */}
                {loading && news.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-96 rounded-3xl animate-pulse bg-gray-200 dark:bg-gray-800" />
                        ))}
                    </div>
                ) : news.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {news.map((item, index) => {
                                const title = language === "ar" ? item.title_ar : (item.title_en || item.title_ar);
                                const content = language === "ar" ? item.detail_ar : (item.detail_en || item.detail_ar);
                                const date = new Date(item.created_at || Date.now());

                                return (
                                    <Link key={item.id} href={`/news/${item.id}`}>
                                        <motion.article
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative h-full"
                                        >
                                            <div className="relative rounded-3xl overflow-hidden glassmorphism transition-all duration-500 h-full flex flex-col border border-transparent hover:border-[var(--theme-accent)]">
                                                {/* Image */}
                                                <div className="relative h-56 overflow-hidden">
                                                    <ImageWithFallback
                                                        src={getImageUrl(item.main_image_url)}
                                                        alt={title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                                                    <div className="absolute top-4 ltr:left-4 rtl:right-4">
                                                        <Badge className="px-3 py-1 bg-black/50 backdrop-blur-md text-white border-0 hover:bg-black/70">
                                                            <Tag className="w-3 h-3 ltr:mr-1 rtl:ml-1" />
                                                            {language === "ar" ? "أخبار" : "News"}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="p-6 flex-1 flex flex-col">
                                                    <div className="flex items-center gap-4 mb-4 text-xs sm:text-sm" style={{ color: "var(--theme-text-secondary)" }}>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{getReadTime(content)} {t("meta.minutes") || (language === "ar" ? "دقيقة" : "min")}</span>
                                                        </div>
                                                    </div>

                                                    <h3 className="mb-3 line-clamp-2 text-xl font-semibold" style={{ color: "var(--theme-text-primary)" }}>
                                                        {title}
                                                    </h3>

                                                    <p className="mb-6 line-clamp-3 text-sm flex-1 opacity-80" style={{ color: "var(--theme-text-secondary)" }}>
                                                        {content ? content.substring(0, 150) + "..." : ""}
                                                    </p>

                                                    <div className="flex items-center text-sm font-medium mt-auto" style={{ color: "var(--theme-accent)" }}>
                                                        {t("readMore") || (language === "ar" ? "اقرأ المزيد" : "Read More")}
                                                        <ArrowIcon className="w-4 h-4 ltr:ml-2 rtl:mr-2 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.article>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Load More Button */}
                        {pagination.page < pagination.totalPages && (
                            <div className="flex justify-center mt-16">
                                <Button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={loading}
                                    className="px-8 py-3 rounded-full"
                                    size="lg"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        t("meta.loadMore") || (language === "ar" ? "عرض المزيد" : "Load More")
                                    )}
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl opacity-60" style={{ color: "var(--theme-text-secondary)" }}>
                            {language === "ar" ? "لا توجد أخبار حالياً" : "No news found at the moment."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
