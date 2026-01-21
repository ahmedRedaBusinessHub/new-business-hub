import { motion } from "motion/react";
import { Star, Quote, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { useI18n } from "@/hooks/useI18n";
import { useEffect, useState } from "react";

interface Review {
  id: number;
  name_ar: string;
  name_en: string;
  comment_ar: string;
  comment_en: string;
  job_title_ar: string;
  job_title_en: string;
  image_url: string;
}

export default function ReviewsSection() {
  const { t, language } = useI18n("reviews");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/public/reviews?limit=4");
        if (res.ok) {
          const data = await res.json();
          setReviews(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getLocalized = (ar: string, en: string) => {
    return language === "ar" ? ar || en : en || ar;
  };

  const gradients = [
    "from-[var(--theme-accent)] to-[var(--theme-accent-light)]",
    "from-[var(--theme-primary)] to-[var(--theme-secondary)]",
    "from-[var(--theme-accent-light)] to-[var(--theme-primary)]",
    "from-[var(--theme-primary)] to-[var(--theme-accent)]",
  ];

  if (!loading && reviews.length === 0) {
    return null;
  }

  return (
    <section
      className="py-20 sm:py-32 lg:py-40 relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: "var(--theme-bg-secondary)" }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full blur-2xl opacity-10"
            style={{
              backgroundColor:
                i % 2 === 0 ? "var(--theme-accent)" : "var(--theme-primary)",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glassmorphism mb-6"
          >
            <ThumbsUp
              className="w-4 h-4"
              style={{ color: "var(--theme-accent)" }}
            />
            <span
              className="text-sm bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
              }}
            >
              {t("badge")}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-3xl sm:text-4xl lg:text-5xl leading-20"
            style={{ color: "var(--theme-text-primary)" }}
          >
            {t("title")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-base sm:text-lg"
            style={{ color: "var(--theme-text-secondary)" }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => {
            const name = getLocalized(review.name_ar, review.name_en);
            const comment = getLocalized(review.comment_ar, review.comment_en);
            const position = getLocalized(review.job_title_ar, review.job_title_en);

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                {/* Gradient glow */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                  style={{
                    backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                  }}
                />

                {/* Review Card */}
                <div className="relative p-8 sm:p-10 rounded-3xl glassmorphism h-full flex flex-col">
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{
                        backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                      }}
                    >
                      <Quote className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-current"
                        style={{ color: "var(--theme-accent)" }}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p
                    className="mb-8 leading-relaxed text-base sm:text-lg flex-1"
                    style={{ color: "var(--theme-text-secondary)" }}
                  >
                    "{comment}"
                  </p>

                  {/* Divider */}
                  <div
                    className="h-px w-full mb-6"
                    style={{
                      backgroundImage: `linear-gradient(to right, transparent, var(--theme-border), transparent)`,
                    }}
                  />

                  {/* Reviewer Info */}
                  <div className="flex items-center gap-4">
                    <Avatar
                      className="w-14 h-14 sm:w-16 sm:h-16 ring-2 ring-offset-2"
                    // ringColor="var(--theme-accent)"
                    // ringOffsetColo="var(--theme-bg-secondary)"
                    >
                      <AvatarImage
                        src={review.image_url}
                        alt={name}
                      />
                      <AvatarFallback
                        className="text-white"
                        style={{
                          backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                        }}
                      >
                        {name ? name.charAt(0) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4
                        className="text-base sm:text-lg"
                        style={{ color: "var(--theme-text-primary)" }}
                      >
                        {name}
                      </h4>
                      <p
                        className="text-sm"
                        style={{ color: "var(--theme-text-secondary)" }}
                      >
                        {position}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
