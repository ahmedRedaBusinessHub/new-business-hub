import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ZoomIn } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/Dialog";

interface GalleryItem {
  id: number;
  title_ar: string;
  title_en: string;
  main_image_url: string;
  image_urls: string[];
}

interface GallerySectionProps {
  limit?: number;
}

export default function GallerySection({ limit = 6 }: GallerySectionProps) {
  const { t, language } = useI18n();
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedGallery) {
      setActiveImage(selectedGallery.main_image_url);
    }
  }, [selectedGallery]);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const res = await fetch(`/api/public/galleries?limit=${limit}`);
        if (res.ok) {
          const data = await res.json();
          setGalleries(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch galleries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, [limit]);

  const getLocalized = (ar: string, en: string) => {
    return language === "ar" ? ar || en : en || ar;
  };

  const gradients = [
    "from-[#0D5BDC]/80 to-[#340F87]/80",
    "from-[#340F87]/80 to-[#0E3F9F]/80",
    "from-[#00B0F0]/80 to-[#007D9B]/80",
    "from-[#00717D]/80 to-[#005671]/80",
    "from-[#4587F4]/80 to-[#0D5BDC]/80",
    "from-[#0A2F78]/80 to-[#0E3F9F]/80",
  ];

  if (!loading && galleries.length === 0) {
    return null;
  }

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
          {galleries.map((item, index) => {
            const title = getLocalized(item.title_ar, item.title_en);
            const gradient = gradients[index % gradients.length];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedGallery(item)}
                // className={`relative overflow-hidden rounded-3xl group cursor-pointer ${(index === 0 || index === 5) && galleries.length >= 6 ? "md:col-span-2 lg:col-span-1" : ""
                //   } ${index === 1 && galleries.length >= 6 ? "lg:row-span-2" : "aspect-square"}`}
                className={`relative overflow-hidden rounded-3xl group cursor-pointer ${index === 0 || index === 5 ? "md:col-span-2 lg:col-span-1" : ""
                  } ${index === 1 ? "lg:row-span-2" : "aspect-square"}`}
              >
                <div className="relative w-full h-full">
                  <ImageWithFallback
                    src={item.main_image_url || "/placeholder-image.jpg"}
                    alt={title}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-0 group-hover:opacity-100 transition-all duration-500`}
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
                        {title}
                      </motion.p>
                    </div>
                  </div>

                  {/* Border gradient animation */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-50 blur-sm`}
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
                    <span className="text-white text-sm">{title}</span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        {limit <= 6 && <div className="text-center pt-20 ">
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
        </div>}
      </div>

      {/* Gallery Modal */}
      <Dialog open={!!selectedGallery} onOpenChange={(open) => !open && setSelectedGallery(null)}>
        <DialogContent className="max-w-5xl h-[95vh] flex flex-col p-0 overflow-hidden bg-white/95 backdrop-blur-xl border-none">
          {selectedGallery && (
            <>
              <div className="p-6 pb-2 shrink-0 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent">
                    {getLocalized(selectedGallery.title_ar, selectedGallery.title_en)}
                  </DialogTitle>
                  <DialogDescription>
                    {/* Optional description if available */}
                  </DialogDescription>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Main Active Image */}
                <div className="relative w-full h-[50vh] md:h-[60vh] rounded-2xl overflow-hidden shadow-2xl bg-gray-50 flex items-center justify-center">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <ImageWithFallback
                      src={activeImage || selectedGallery.main_image_url}
                      alt="Main View"
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                </div>

                {/* Thumbnails Grid */}
                {selectedGallery.image_urls && selectedGallery.image_urls.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 border-l-4 border-[#0D5BDC] pl-3">
                      {t("More Images")}
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {/* Include Main Image in thumbnails too? Optional, but good practice if user wants to go back */}
                      <div
                        onClick={() => setActiveImage(selectedGallery.main_image_url)}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${activeImage === selectedGallery.main_image_url
                          ? "ring-4 ring-[#0D5BDC] scale-95 opacity-100 shadow-xl"
                          : "hover:scale-105 hover:shadow-lg opacity-70 hover:opacity-100"
                          }`}
                      >
                        <ImageWithFallback
                          src={selectedGallery.main_image_url}
                          alt="Main Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {selectedGallery.image_urls.map((imgUrl, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveImage(imgUrl)}
                          className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${activeImage === imgUrl
                            ? "ring-4 ring-[#0D5BDC] scale-95 opacity-100 shadow-xl"
                            : "hover:scale-105 hover:shadow-lg opacity-70 hover:opacity-100"
                            }`}
                        >
                          <ImageWithFallback
                            src={imgUrl}
                            alt={`Gallery Image ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
