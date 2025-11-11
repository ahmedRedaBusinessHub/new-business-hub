import { useI18n } from "@/hooks/useI18n";
import { motion } from "motion/react";

import img1 from "@/assets/images/668f7b5beb68ffa78e258e7b_MBS-p-500.png";
import img2 from "@/assets/images/668f7b330b4643ab55a2af30_Alula.png";
import img3 from "@/assets/images/668f7c230ad53cd953279e26_MBS (1)-p-500.png";
import img4 from "@/assets/images/668f7ce82232881730d2abc1_c-p-500.png";
import img5 from "@/assets/images/668f7dfdfa60301a6d0acafe_c (4)-p-500.png";
import img6 from "@/assets/images/668f7e0f9c67d37cb7be2de1_c (3)-p-500.png";
import img7 from "@/assets/images/668f7f1d0b4643ab55a51961_c (6)-p-500.png";
import img8 from "@/assets/images/668f7f012d887504a5d1b604_c (5).png";
import img9 from "@/assets/images/668f7f123b1fbe1cc8ee9601_image-removebg-preview (1).png";
import img10 from "@/assets/images/669e49b058760dc337763071_images-removebg-preview.png";
import img11 from "@/assets/images/666806a3a706eff59d9732ee_namaa-p-500.png";
import img12 from "@/assets/images/666806bbe335dfee5d8625c7_logo-p-500.png";
import img13 from "@/assets/images/6668067b78d75e6a6cebacc4_22f430bdfcd08a97018186e19af1e903-p-500.png";
import img14 from "@/assets/images/6668081f554e44b758a38b66_amana-logo-p-500.png";
import img15 from "@/assets/images/6668092f118ee12514595537_m_Logo.png";
import img16 from "@/assets/images/66680768b453d64c4dec2ff3.png";
import img17 from "@/assets/images/666807356a52d785ab7f1118_بنك-التنمية-الاجتماعية.png";
import img18 from "@/assets/images/666940684d5f15e82f0ff2d1_image-removebg-preview (2).png";
import img19 from "@/assets/images/Alrayyan_Colleges_Logo.png";
import img20 from "@/assets/images/images.png";
import img21 from "@/assets/images/IU_ALL_H_COLOR_RGB.svg";
import img22 from "@/assets/images/MOkmlwSC_400x400.jpg";
import img23 from "@/assets/images/ntdp-logo-white.svg";
import img24 from "@/assets/images/space_apps_003.png";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PartnersSectionProps {}

export default function PartnersSection({}: PartnersSectionProps) {
  const { t } = useI18n();
  const partners = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    img13,
    img14,
    img15,
    img16,
    img17,
    img18,
    img19,
    img20,
    img21,
    img22,
    img23,
    img24,
  ];

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
            {[...partners].map((partner, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 group"
              >
                <div className="px-10 py-6 rounded-2xl bg-white border border-[#F2F2F2] hover:border-transparent transition-all duration-300 relative overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0D5BDC] to-[#340F87] opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

                  <span className="text-[#262626] group-hover:bg-gradient-to-r group-hover:from-[#0D5BDC] group-hover:to-[#340F87] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 whitespace-nowrap relative z-10">
                    <ImageWithFallback
                      src={partner.src}
                      className="h-30 w-auto"
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
