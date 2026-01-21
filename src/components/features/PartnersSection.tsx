import { useI18n } from "@/hooks/useI18n";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getImageUrl } from "@/lib/utils";

interface PartnersSectionProps { }

export default function PartnersSection({ }: PartnersSectionProps) {
  const { t } = useI18n();
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch("/api/public/success-partners?limit=100");
        if (response.ok) {
          const data = await response.json();
          console.log("🚀 ~ fetchPartners ~ data:", data)
          setPartners(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Duplicate partners to ensure seamless loop if we have data
  const displayPartners = partners.length > 0 ? [...partners, ...partners, ...partners] : [];

  if (loading) return null; // Or a loading skeleton
  if (partners.length === 0) return null;

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#F2F2F2] to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#0D5BDC]/10 to-[#340F87]/10 border border-[#0D5BDC]/20 mb-4"
          >
            <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent text-sm">
              {t("They Trust Us")}
            </span>
          </motion.div>
          <h2 className="bg-gradient-to-r from-[#262626] to-[#0A2F78] bg-clip-text text-transparent">
            {t("Our Partners")}
          </h2>
        </motion.div>

        <div className="relative" style={{ overflow: "hidden" }}>
          <motion.div
            className="flex gap-8"
            animate={{
              x: [0, -1000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {displayPartners.map((partner, index) => (
              <motion.div
                key={`${partner.id}-${index}`}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 group"
              >
                <div className="px-10 py-6 rounded-2xl bg-white border border-[#F2F2F2] hover:border-transparent transition-all duration-300 relative overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0D5BDC] to-[#340F87] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

                  <span className="text-[#262626] group-hover:bg-gradient-to-r group-hover:from-[#0D5BDC] group-hover:to-[#340F87] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 whitespace-nowrap relative z-10">
                    <ImageWithFallback
                      src={getImageUrl(partner.image_url)}
                      alt={partner.name_en || partner.name_ar}
                      className="h-30 w-auto max-h-[80px] object-contain"
                    />
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
