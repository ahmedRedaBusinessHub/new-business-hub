import { getTranslations } from "next-intl/server";
import { ServicesSelector } from "@/components/features/services/services-selector";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale });
    return {
        title: `${t("services_hero_title")} | Business Hub`,
        description: t("services_hero_description"),
    };
}

export default async function ServicesPage({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale });

    return (
        <div className="container py-12">
            <div className="mb-10 text-center">
                <h1 className="mb-4 text-4xl font-bold md:text-5xl">{t("services_hero_title")}</h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                    {t("services_hero_description")}
                </p>
            </div>

            <div className="mx-auto max-w-5xl">
                <ServicesSelector selectedServices={[]} onChange={() => { }} />
            </div>
        </div>
    );
}
