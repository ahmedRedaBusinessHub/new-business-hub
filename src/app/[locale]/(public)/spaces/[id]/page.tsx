import { getTranslations } from "next-intl/server";
import { apiGet } from "@/lib/api";
import { SpaceDetailsResponse } from "@/types/api/spaces";
import { SpaceGallery } from "@/components/features/spaces/space-gallery";
import { PricingTable } from "@/components/features/spaces/pricing-table";
import { AmenitiesList } from "@/components/features/spaces/amenities-list";
import { AvailabilityCalendar } from "@/components/features/spaces/availability-calendar";
import { MapPin, Users, Clock, Info } from "lucide-react";
import { notFound } from "next/navigation";
import { OperatingHoursCard } from "@/components/features/spaces/operating-hours/operating-hours-card";
import { transformOperatingHours } from "@/lib/utils/operating-hours-transformer";
import { Suspense } from "react";

import { SpaceReviewsSection } from "@/components/features/reviews/space-reviews-section";

// Define getServerSpaceDetails and rest...
async function getServerSpaceDetails(
  id: string,
): Promise<SpaceDetailsResponse> {
  const res = await apiGet(`/coworking-spaces/${id}`, { requireAuth: false });
  if (!res.ok) {
    throw new Error("Failed to fetch space details");
  }
  const json = await res.json();
  return json.data;
}

// Define generateMetadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id, locale } = await params;
  try {
    let x: any = await getServerSpaceDetails(id);
    const space = x.data;
    console.log("🚀 ~ generateMetadata ~ space:", space)
    const title = locale === "ar" ? space.name_ar : space.name_en;
    const description =
      locale === "ar" ? space.description_ar : space.description_en;

    return {
      title: `${title} | BusinessHub`,
      description:
        description?.substring(0, 160) ||
        "Explore coworking spaces at BusinessHub.",
      openGraph: {
        images: space.images?.find((i: any) => i.is_main)?.image_url
          ? [space.images.find((i: any) => i.is_main)!.image_url]
          : [],
      },
    };
  } catch (error) {
    return {
      title: "Space Details | BusinessHub",
    };
  }
}

export default async function SpaceDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale });

  let space: SpaceDetailsResponse;
  try {
    let x: any = await getServerSpaceDetails(id);
    space = x.data;
  } catch (error) {
    console.error("Error fetching space details:", error);
    notFound();
  }
  const name = locale === "ar" ? space.name_ar : space.name_en;
  const description =
    locale === "ar" ? space.description_ar : space.description_en;
  const branchName =
    locale === "ar" ? space.branch?.name_ar : space.branch?.name_en;
  const operating_hours =
    space?.operating_hours || space.branch?.operating_hours;
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">


      {/* Gallery Section */}
      <div className="mb-16">
        <div className="rounded-3xl overflow-hidden shadow-2xl border bg-muted/20">
          <SpaceGallery
            images={
              space.space_images.length
                ? space.space_images
                : [
                  {
                    id: 0,
                    image_url: "/images/logo.svg",
                    caption_ar: undefined,
                    caption_en: undefined,
                    display_order: 0,
                    is_main: true,
                  }, {
                    id: 1,
                    image_url: "/images/logo.svg",
                    caption_ar: undefined,
                    caption_en: undefined,
                    display_order: 0,
                    is_main: false,
                  },
                ]
            }
          />
        </div>
      </div>
      {/* Header Section */}
      <div className="mb-10 space-y-4">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
            {space.space_type?.replace(/_/g, " ").toLowerCase()}
          </span>
          {space.average_rating && space.average_rating > 0 && (
            <div className="flex items-center gap-1 px-3 py-1 bg-yellow-400/10 text-yellow-700 text-xs font-bold rounded-full">
              <span className="text-yellow-500">★</span>
              <span>{space.average_rating.toFixed(1)}</span>
              <span className="text-yellow-600/50 font-medium ml-0.5">
                ({space.total_reviews})
              </span>
            </div>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {name}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium">
          {branchName && (
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="p-1.5 rounded-lg bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-sm">{branchName}</span>
            </div>
          )}
          <div className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-secondary text-secondary-foreground">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-sm">
              {t("space_capacity_label", { capacity: space.capacity })}
            </span>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-16">
          {/* Description Section */}
          <section className="space-y-6">
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-bold tracking-tight">
                {t("space_about_title") || "Experience the Space"}
              </h2>
              <div className="h-1 flex-1 bg-gradient-to-r from-primary/20 to-transparent rounded-full" />
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p className="whitespace-pre-line">{description}</p>
            </div>
          </section>

          {/* Amenities Section */}
          <section className="bg-secondary/10 p-8 rounded-3xl border border-secondary/20">
            <AmenitiesList amenities={space.space_amenities || []} />
          </section>

          {/* Pricing Section */}
          <section className="space-y-6">
            <PricingTable
              hourlyRate={space.hourly_rate}
              dailyRate={space.daily_rate}
              weeklyRate={space.weekly_rate}
              monthlyRate={space.monthly_rate}
            />
          </section>
          {/* Operating Hours Section */}
          {operating_hours &&
            Object.keys(operating_hours.schedule).length > 0 && (
              <Suspense
                fallback={
                  <div className="h-32 animate-pulse bg-muted rounded-3xl" />
                }
              >
                {(() => {
                  const transformedHours =
                    transformOperatingHours(operating_hours);
                  if (!transformedHours) return null;
                  return (
                    <OperatingHoursCard operatingHours={transformedHours} />
                  );
                })()}
              </Suspense>
            )}

          {/* Reviews Section */}
          <SpaceReviewsSection spaceId={space.id} />
        </div>

        {/* Sidebar */}

        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <AvailabilityCalendar
            spaceId={space.id}
            operatingHours={space.operating_hours}
          />

          <div className="mt-8 p-6 rounded-3xl bg-muted/30 border border-dashed border-muted-foreground/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Info size={24} />
            </div>
            <div>
              <p className="text-sm font-bold">
                {t("space_sidebar_help_title") || "Need help booking?"}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("space_sidebar_help_desc") ||
                  "Our team is available to assist you."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
