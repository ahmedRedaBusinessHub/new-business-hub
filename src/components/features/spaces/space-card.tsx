import { useTranslations, useLocale } from "next-intl";
import NextLink from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import AppImage from "@/components/ui/Image";
import { formatCurrency } from "@/lib/utils";
import { SpaceListItem, SpaceType } from "@/types/api/spaces";
import { Users, Star, MapPin } from "lucide-react";

interface SpaceCardProps {
    space: SpaceListItem;
}

export function SpaceCard({ space }: SpaceCardProps) {
    const t = useTranslations();
    const locale = useLocale() as 'ar-SA' | 'en-US' | 'ar' | 'en';
    const currencyLocale = locale.startsWith('ar') ? 'ar-SA' : 'en-US';

    const name = locale.startsWith('ar') ? space.name_ar : space.name_en;
    const branchName = locale.startsWith('ar') ? space.branch.name_ar : space.branch.name_en;

    const getSpaceTypeLabel = (type: SpaceType) => {
        switch (type) {
            case SpaceType.HOT_DESK: return t("workspaces_type_desk", { defaultMessage: "Hot Desk" });
            case SpaceType.PRIVATE_OFFICE: return t("workspaces_type_office", { defaultMessage: "Private Office" });
            case SpaceType.MEETING_ROOM: return t("workspaces_type_meeting_room", { defaultMessage: "Meeting Room" });
            case SpaceType.EVENT_SPACE: return t("workspaces_type_event_space", { defaultMessage: "Event Space" });
            default: return t("workspaces_type_unknown", { defaultMessage: "Space" });
        }
    };

    return (
        <Card className="group overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border/50 hover:border-primary/30 bg-card rounded-2xl relative isolate">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
                <AppImage
                    src={space.main_image || "/images/placeholder-space.jpg"}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Badge variant="secondary" className="font-semibold bg-background/90 backdrop-blur-md text-foreground shadow-lg border-none px-3 py-1">
                        {getSpaceTypeLabel(space.space_type)}
                    </Badge>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex justify-between items-end gap-2">
                        <div>
                            <h3 className="font-bold text-xl sm:text-2xl line-clamp-1 group-hover:text-primary-100 transition-colors drop-shadow-md" title={name}>{name}</h3>
                            <div className="flex items-center text-white/80 mt-1 text-sm font-medium drop-shadow-md">
                                <MapPin className="w-4 h-4 me-1.5" />
                                <span className="line-clamp-1">{branchName}</span>
                            </div>
                        </div>
                        {space.average_rating ? (
                            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20 shrink-0">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-bold text-white">{space.average_rating.toFixed(1)}</span>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            <CardContent className="p-5 grow flex flex-col gap-4">
                <div className="flex items-center text-muted-foreground text-sm font-medium bg-muted/50 rounded-lg p-3 transition-colors group-hover:bg-muted/80">
                    <Users className="w-5 h-5 me-2.5 text-primary" />
                    <span>
                        {t("space_capacity_label", { capacity: space.capacity })}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/50 mt-auto">
                <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">
                        {t("space_starting_from", { defaultMessage: "Starting from" })}
                    </span>
                    <span className="font-bold text-primary text-2xl flex items-baseline">
                        {formatCurrency(space.hourly_rate, currencyLocale)}
                        <span className="text-xs font-normal text-muted-foreground ml-1">
                            /{t("space_pricing_hourly", { defaultMessage: "hour" })}
                        </span>
                    </span>
                </div>
                <Button asChild variant="default" className="w-full sm:w-auto rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group-hover:-translate-y-0.5">
                    <NextLink href={`/${locale}/spaces/${space.id}`}>
                        {t("space_view_details", { defaultMessage: "View Details" })}
                    </NextLink>
                </Button>
            </CardFooter>
        </Card>
    );
}
