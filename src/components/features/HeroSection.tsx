import { motion } from "motion/react";
import { ArrowDown, Sparkles } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
interface HeroSectionProps {}

export default function HeroSection({}: HeroSectionProps) {
  const { t } = useI18n();
  return (
    <section className="relative min-h-screen flex items-end justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={"/videos/HeroSectionVideo.mp4"} type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to bottom right, 
              color-mix(in srgb, var(--theme-primary-dark) 90%, transparent), 
              color-mix(in srgb, var(--theme-secondary) 80%, transparent), 
              color-mix(in srgb, var(--theme-primary) 90%, transparent))`,
          }}
        ></div>

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 ltr:left-1/4 rtl:right-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--theme-primary) 30%, transparent)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 ltr:right-1/4 rtl:left-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--theme-secondary) 30%, transparent)",
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 text-center flex   items-center     px-4 sm:px-6 max-w-5xl mx-auto"
        style={{
          flexDirection: "column",
          // backgroundColor: "rgba(0, 0, 0, 0.4)",
          justifyContent: "end",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism   mb-16"
        >
          <Sparkles
            className="w-4 h-4"
            style={{ color: "var(--theme-accent-light)" }}
          />
          <span className="text-white text-sm">
            {t("Innovation & Entrepreneurship Hub")}
          </span>
        </motion.div>

        {/* <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-white text-4xl sm:text-5xl leading-20 md:text-7xl lg:text-8xl mb-6 leading-tight"
        >
          <span className="block">نبدأ معك من</span>
          <span
            className="block bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, var(--theme-accent), var(--theme-accent-light), var(--theme-primary))`,
            }}
          >
            الفكرة إلى النجاح
          </span>
        </motion.h1> */}
        {/* 
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-white/90 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-16"
        >
          {language === "ar"
            ? "شريكك في تحويل الأفكار إلى مشاريع ناجحة ومبتكرة"
            : "Your partner in transforming ideas into successful and innovative projects"}
        </motion.p> */}

        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            className="text-white px-6 sm:px-8 py-5 sm:py-6 transition-all duration-300 hover:scale-105 border-0 w-full sm:w-auto"
            style={{
              backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
              boxShadow:
                "0 20px 60px color-mix(in srgb, var(--theme-primary) 50%, transparent)",
            }}
          >
            {language === "ar" ? "ابدأ رحلتك الآن" : "Start Your Journey"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="glassmorphism border-white/30 text-white hover:bg-white/20 px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto"
          >
            {language === "ar" ? "اكتشف المزيد" : "Discover More"}
          </Button>
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2  "
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-6 h-6 text-white/70" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
