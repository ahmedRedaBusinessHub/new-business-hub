import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ZoomIn } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import Link from "next/link";

interface GallerySectionProps {}

export default function GallerySection({}: GallerySectionProps) {
  const { t } = useI18n();
  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3dvcmtpbmclMjBzcGFjZXxlbnwxfHx8fDE3NjI0MTY3NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: t("Workspaces"),
      gradient: "from-[#0D5BDC]/80 to-[#340F87]/80",
    },
    {
      url: "https://images.unsplash.com/photo-1518107616985-bd48230d3b20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwdGVhbSUyMG1lZXRpbmd8ZW58MXx8fHwxNzYyNDA2OTI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: t("Team"),
      gradient: "from-[#340F87]/80 to-[#0E3F9F]/80",
    },
    {
      url: "https://images.unsplash.com/photo-1575956011521-4d7f5cf0b18e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzJTIwaGFuZHNoYWtlfGVufDF8fHx8MTc2MjQzNjQ4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      alt: t("Successful Partnerships"),
      gradient: "from-[#00B0F0]/80 to-[#007D9B]/80",
    },
    {
      url: "https://images.unsplash.com/photo-1694702740570-0a31ee1525c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjI0MDUzMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: t("The building"),
      gradient: "from-[#00717D]/80 to-[#005671]/80",
    },
    // {
    //   url: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMGNoYXJ0fGVufDF8fHx8MTc2MjQ2MjQ3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    //   alt: t("Growth and Development"),
    //   gradient: "from-[#4587F4]/80 to-[#0D5BDC]/80",
    // },
    {
      url: "https://images.unsplash.com/photo-1630344745908-ed5ffd73199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjZXNzZnVsJTIwZW50cmVwcmVuZXVyfGVufDF8fHx8MTc2MjQ4ODE0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      alt: t("Entrepreneurs"),
      gradient: "from-[#0A2F78]/80 to-[#0E3F9F]/80",
    },
  ];

  return (
    <section
      id="gallery"
      className="py-32 bg-gradient-to-b from-[#F2F2F2] to-white relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0D5BDC]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#340F87]/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#0D5BDC]/10 to-[#340F87]/10 border border-[#0D5BDC]/20 mb-4"
          >
            <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent">
              {t("Our Gallery")}
            </span>
          </motion.div>
          <h2 className="mb-4 bg-gradient-to-r from-[#262626] to-[#0A2F78] bg-clip-text text-transparent">
            {t("The Exhibition")}
          </h2>
          <p className="text-[#262626]/70 max-w-2xl mx-auto">
            {t("Highlights of our journey and achievements with our partners")}
          </p>
        </motion.div>

        {/* Bento grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={`relative overflow-hidden rounded-3xl group cursor-pointer ${
                index === 0 || index === 5 ? "md:col-span-2 lg:col-span-1" : ""
              } ${index === 1 ? "lg:row-span-2" : "aspect-square"}`}
            >
              <div className="relative w-full h-full">
                <ImageWithFallback
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />

                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${image.gradient} opacity-0 group-hover:opacity-100 transition-all duration-500`}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {/* Zoom icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1, rotate: 90 }}
                      transition={{ duration: 0.3 }}
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4"
                    >
                      <ZoomIn className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Image title */}
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-white text-lg px-4 text-center"
                    >
                      {image.alt}
                    </motion.p>
                  </div>
                </div>

                {/* Border gradient animation */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${image.gradient} opacity-50 blur-sm`}
                  ></div>
                </div>
              </div>

              {/* Floating label */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + 0.2 }}
                className="absolute bottom-4 left-4 right-4"
              >
                <div className="glassmorphism rounded-xl px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">{image.alt}</span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
        <div className="text-center pt-20 ">
          <Link href={"/gallery"}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className=" inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#0D5BDC]/10 to-[#340F87]/10 border border-[#0D5BDC]/20 mb-4"
            >
              <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent">
                {t("hero_cta_discover")}
              </span>
            </motion.div>
          </Link>
        </div>
      </div>
    </section>
  );
}
