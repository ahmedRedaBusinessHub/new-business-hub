"use client";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "motion/react";

import {
  Rocket,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Award,
  CheckCircle2,
  ArrowRight,
  Star,
  Sparkles,
  Clock,
  Building,
  Lightbulb,
  Zap,
  Trophy,
  BarChart3,
  Globe2,
  Shield,
  Brain,
  Code,
  Briefcase,
  LineChart,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import Link from "next/link";
import { useI18n } from "@/hooks/useI18n";

// Floating Particle Component
const FloatingParticle = ({ delay = 0, duration = 20, size = 4 }) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white/20 backdrop-blur-sm"
      style={{
        width: size,
        height: size,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, Math.random() * 30 - 15, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// Animated Counter Component
const AnimatedCounter = ({
  value,
  suffix = "",
}: {
  value: string;
  suffix?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const target = parseInt(value.replace(/\D/g, ""));
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {isInView ? count : 0}
      {suffix}
    </span>
  );
};

// Magnetic Button Component
const MagneticButton = ({ children, className, ...props }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3;
    const y = (clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={position}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function AcceleratorProgramsPage() {
  const { language } = useI18n();
  const [activeProgram, setActiveProgram] = useState("tech");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const programs = [
    {
      id: "tech",
      nameAr: "برنامج تسريع التقنية",
      nameEn: "Tech Accelerator Program",
      taglineAr: "لشركات التقنية الناشئة",
      taglineEn: "For Technology Startups",
      duration: language === "ar" ? "6 أشهر" : "6 Months",
      funding: language === "ar" ? "حتى 500 ألف ر.س" : "Up to 500K SAR",
      equity: "5-10%",
      descriptionAr:
        "برنامج متخصص لتسريع نمو الشركات التقنية الناشئة التي لديها منتج جاهز وتسعى للتوسع السريع في السوق.",
      descriptionEn:
        "Specialized program to accelerate the growth of tech startups with ready products seeking rapid market expansion.",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      gradient: "from-[#0D5BDC] to-[#4587F4]",
      gradientAngle: "135deg",
      icon: Rocket,
      accentColor: "#0D5BDC",
      features: [
        {
          titleAr: "الإرشاد التقني",
          titleEn: "Technical Mentorship",
          descAr: "خبراء في الذكاء الاصطناعي، البيانات، والهندسة",
          descEn: "Experts in AI, Data, and Engineering",
          icon: Brain,
        },
        {
          titleAr: "البنية التحتية",
          titleEn: "Infrastructure",
          descAr: "وصول لخوادم السحابة وأدوات التطوير",
          descEn: "Access to cloud servers and dev tools",
          icon: Code,
        },
        {
          titleAr: "شبكة المستثمرين",
          titleEn: "Investor Network",
          descAr: "تواصل مباشر مع مستثمري التقنية",
          descEn: "Direct connection with tech investors",
          icon: Users,
        },
        {
          titleAr: "التطوير السريع",
          titleEn: "Rapid Development",
          descAr: "منهجيات Agile و Sprint للتطوير",
          descEn: "Agile & Sprint methodologies",
          icon: Zap,
        },
      ],
      benefits: [
        language === "ar"
          ? "تمويل أولي حتى 500,000 ر.س"
          : "Seed funding up to 500,000 SAR",
        language === "ar"
          ? "مساحة عمل مجهزة بالكامل"
          : "Fully equipped workspace",
        language === "ar" ? "جلسات إرشاد أسبوعية" : "Weekly mentoring sessions",
        language === "ar"
          ? "ورش عمل تقنية متخصصة"
          : "Specialized tech workshops",
        language === "ar"
          ? "وصول لشبكة المستثمرين"
          : "Access to investor network",
        language === "ar"
          ? "دعم قانوني ومحاسبي"
          : "Legal and accounting support",
      ],
      eligibility: [
        language === "ar"
          ? "منتج تقني في مرحلة MVP أو أكثر"
          : "Tech product at MVP stage or beyond",
        language === "ar"
          ? "فريق تقني متفرغ (2-5 أفراد)"
          : "Full-time tech team (2-5 members)",
        language === "ar" ? "قاعدة مستخدمين أولية" : "Initial user base",
        language === "ar"
          ? "إمكانية التوسع التقني"
          : "Technical scalability potential",
      ],
    },
    {
      id: "fintech",
      nameAr: "برنامج تسريع التقنية المالية",
      nameEn: "FinTech Accelerator Program",
      taglineAr: "للحلول المالية الرقمية",
      taglineEn: "For Digital Financial Solutions",
      duration: language === "ar" ? "6 أشهر" : "6 Months",
      funding: language === "ar" ? "حتى 750 ألف ر.س" : "Up to 750K SAR",
      equity: "7-12%",
      descriptionAr:
        "برنامج مخصص لتسريع الشركات الناشئة في مجال التقنية المالية مع التركيز على الامتثال التنظيمي والتراخيص.",
      descriptionEn:
        "Dedicated program for FinTech startups with focus on regulatory compliance and licensing.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3",
      gradient: "from-[#340F87] to-[#0E3F9F]",
      gradientAngle: "135deg",
      icon: DollarSign,
      accentColor: "#340F87",
      features: [
        {
          titleAr: "الامتثال التنظيمي",
          titleEn: "Regulatory Compliance",
          descAr: "دعم في الحصول على التراخيص المالية",
          descEn: "Support in obtaining financial licenses",
          icon: Shield,
        },
        {
          titleAr: "شراكات بنكية",
          titleEn: "Banking Partnerships",
          descAr: "تواصل مع البنوك والمؤسسات المالية",
          descEn: "Connection with banks and financial institutions",
          icon: Building,
        },
        {
          titleAr: "الأمن السيبراني",
          titleEn: "Cybersecurity",
          descAr: "استشارات أمنية وحماية البيانات",
          descEn: "Security consulting and data protection",
          icon: Shield,
        },
        {
          titleAr: "التمويل المتقدم",
          titleEn: "Advanced Funding",
          descAr: "فرص تمويل أكبر من المستثمرين الماليين",
          descEn: "Larger funding opportunities from financial investors",
          icon: TrendingUp,
        },
      ],
      benefits: [
        language === "ar"
          ? "تمويل يصل إلى 750,000 ر.س"
          : "Funding up to 750,000 SAR",
        language === "ar"
          ? "دعم الامتثال التنظيمي"
          : "Regulatory compliance support",
        language === "ar"
          ? "شراكات مع بنوك محلية"
          : "Partnerships with local banks",
        language === "ar"
          ? "استشارات قانونية متخصصة"
          : "Specialized legal consulting",
        language === "ar"
          ? "تدريب على الأمن السيبراني"
          : "Cybersecurity training",
        language === "ar"
          ? "وصول لمستثمري التقنية المالية"
          : "Access to FinTech investors",
      ],
      eligibility: [
        language === "ar" ? "حل مالي مبتكر" : "Innovative financial solution",
        language === "ar"
          ? "التزام بالمعايير المالية"
          : "Commitment to financial standards",
        language === "ar"
          ? "فريق بخبرة مالية/تقنية"
          : "Team with financial/tech expertise",
        language === "ar"
          ? "خطة للامتثال التنظيمي"
          : "Plan for regulatory compliance",
      ],
    },
    {
      id: "ecommerce",
      nameAr: "برنامج تسريع التجارة الإلكترونية",
      nameEn: "E-Commerce Accelerator Program",
      taglineAr: "للمتاجر الإلكترونية",
      taglineEn: "For Online Stores",
      duration: language === "ar" ? "4 أشهر" : "4 Months",
      funding: language === "ar" ? "حتى 300 ألف ر.س" : "Up to 300K SAR",
      equity: "5-8%",
      descriptionAr:
        "برنامج سريع لتسريع نمو المتاجر الإلكترونية مع التركيز على التسويق الرقمي وزيادة المبيعات.",
      descriptionEn:
        "Fast-paced program to accelerate e-commerce growth with focus on digital marketing and sales increase.",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c",
      gradient: "from-[#00B0F0] to-[#007D9B]",
      gradientAngle: "135deg",
      icon: Globe2,
      accentColor: "#00B0F0",
      features: [
        {
          titleAr: "استراتيجيات التسويق",
          titleEn: "Marketing Strategies",
          descAr: "خبراء في التسويق الرقمي والإعلانات",
          descEn: "Experts in digital marketing and advertising",
          icon: Target,
        },
        {
          titleAr: "تحسين التحويل",
          titleEn: "Conversion Optimization",
          descAr: "تحسين معدلات التحويل والمبيعات",
          descEn: "Improve conversion rates and sales",
          icon: LineChart,
        },
        {
          titleAr: "إدارة السلسلة",
          titleEn: "Supply Chain",
          descAr: "تحسين سلسلة التوريد والشحن",
          descEn: "Optimize supply chain and shipping",
          icon: Briefcase,
        },
        {
          titleAr: "تحليل البيانات",
          titleEn: "Data Analytics",
          descAr: "أدوات تحليل سلوك العملاء",
          descEn: "Customer behavior analytics tools",
          icon: BarChart3,
        },
      ],
      benefits: [
        language === "ar"
          ? "تمويل حتى 300,000 ر.س"
          : "Funding up to 300,000 SAR",
        language === "ar"
          ? "استراتيجيات تسويق رقمي"
          : "Digital marketing strategies",
        language === "ar"
          ? "شراكات مع منصات الدفع"
          : "Payment platform partnerships",
        language === "ar"
          ? "تدريب على تحليل البيانات"
          : "Data analytics training",
        language === "ar"
          ? "دعم في إدارة المخزون"
          : "Inventory management support",
        language === "ar"
          ? "حملات تسويقية مدعومة"
          : "Sponsored marketing campaigns",
      ],
      eligibility: [
        language === "ar" ? "متجر إلكتروني عامل" : "Operational online store",
        language === "ar" ? "مبيعات شهرية واضحة" : "Clear monthly sales",
        language === "ar"
          ? "منتجات فريدة أو مميزة"
          : "Unique or distinctive products",
        language === "ar" ? "خطة نمو واضحة" : "Clear growth plan",
      ],
    },
  ];

  const currentProgram =
    programs.find((p) => p.id === activeProgram) || programs[0];

  const successStories = [
    {
      company: "TechFlow",
      founderAr: "أحمد السعيد",
      founderEn: "Ahmed Al-Saeed",
      programAr: "برنامج تسريع التقنية 2023",
      programEn: "Tech Accelerator 2023",
      achievement:
        language === "ar"
          ? "جولة تمويل بـ 5 مليون ريال"
          : "5M SAR Funding Round",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      quote:
        language === "ar"
          ? "البرنامج غير مسار شركتنا بالكامل وفتح لنا أبواب نجاح لم نكن نتخيلها"
          : "The program completely changed our company trajectory and opened doors we never imagined",
      growth: "400%",
    },
    {
      company: "PayEase",
      founderAr: "فاطمة الأحمدي",
      founderEn: "Fatima Al-Ahmadi",
      programAr: "برنامج تسريع التقنية المالية 2023",
      programEn: "FinTech Accelerator 2023",
      achievement: language === "ar" ? "ترخيص SAMA" : "SAMA License Obtained",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      quote:
        language === "ar"
          ? "دعم الامتثال التنظيمي كان حاسماً في حصولنا على الترخيص"
          : "The regulatory compliance support was crucial in obtaining our license",
      growth: "350%",
    },
    {
      company: "ShopLocal",
      founderAr: "محمد القحطاني",
      founderEn: "Mohammed Al-Qahtani",
      programAr: "برنامج تسريع التجارة الإلكترونية 2024",
      programEn: "E-Commerce Accelerator 2024",
      achievement:
        language === "ar" ? "300% نمو في المبيعات" : "300% Sales Growth",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      quote:
        language === "ar"
          ? "استراتيجيات التسويق التي تعلمناها ضاعفت مبيعاتنا ثلاث مرات"
          : "The marketing strategies we learned tripled our sales",
      growth: "300%",
    },
  ];

  const stats = [
    {
      value: "500+",
      label: language === "ar" ? "مشروع تم تسريعه" : "Projects Accelerated",
      icon: Rocket,
    },
    {
      value: "95%",
      label: language === "ar" ? "معدل النجاح" : "Success Rate",
      icon: Trophy,
    },
    {
      value: "250M+",
      label: language === "ar" ? "ريال تمويل" : "SAR Funding Raised",
      icon: DollarSign,
    },
    {
      value: "150+",
      label: language === "ar" ? "مرشد خبير" : "Expert Mentors",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Cursor Follower */}
      <motion.div
        className="fixed w-6 h-6 rounded-full border-2 border-[#0D5BDC] pointer-events-none z-50 hidden lg:block"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${currentProgram.gradient}`}
          ></div>

          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <FloatingParticle
              key={i}
              delay={i * 0.5}
              duration={15 + i * 2}
              size={3 + Math.random() * 5}
            />
          ))}

          {/* Animated Gradient Mesh */}
          <motion.div
            className="absolute top-0 ltr:left-0 rtl:right-0 w-full h-full opacity-30"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x / 10}% ${
                mousePosition.y / 10
              }%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
            }}
          />

          {/* Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glassmorphism mb-8 border border-white/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-white">
              {language === "ar" ? "برامج التسريع" : "Accelerator Programs"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 text-center leading-tight"
          >
            <motion.span
              className="inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                backgroundImage: "linear-gradient(90deg, #fff, #a0d4ff, #fff)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {language === "ar" ? "تطوير المشاريع" : "Project Development"}
            </motion.span>
            <br />
            <span className="text-white/90">
              {language === "ar" ? "في المسرعات" : "in Accelerators"}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-white/90 text-lg sm:text-xl max-w-3xl mx-auto mb-12 text-center leading-relaxed"
          >
            {language === "ar"
              ? "برامج متخصصة لتسريع نمو المشاريع التقنية والتجارية مع توفير التمويل والإرشاد"
              : "Specialized programs to accelerate tech and business projects with funding and mentorship"}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <MagneticButton>
              <Link href={`/programs/${activeProgram}`}>
                <Button
                  size="lg"
                  className="bg-white text-[#0D5BDC] hover:bg-white/90 px-8 py-6 text-lg rounded-full shadow-2xl group relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#0D5BDC]/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    {language === "ar" ? "استكشف البرامج" : "Explore Programs"}
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight
                        className={`w-5 h-5 ${
                          language === "ar" ? "rotate-180" : ""
                        }`}
                      />
                    </motion.div>
                  </span>
                </Button>
              </Link>
            </MagneticButton>

            <MagneticButton>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white bg-white/10 px-8 py-6 text-lg rounded-full backdrop-blur-md"
              >
                {language === "ar" ? "شاهد الفيديو" : "Watch Video"}
                <motion.div
                  className={`${language === "ar" ? "mr-2" : "ml-2"}`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ▶
                </motion.div>
              </Button>
            </MagneticButton>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-white rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Parallax */}
      <section className="py-20 bg-gradient-to-b from-[#F2F2F2] to-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0D5BDC] to-transparent opacity-50" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="text-center group"
              >
                <div className="relative">
                  {/* Background Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${currentProgram.accentColor}40, transparent)`,
                    }}
                  />

                  <Card className="p-8 border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
                    {/* Animated Border */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${currentProgram.accentColor}, transparent)`,
                        padding: "2px",
                        borderRadius: "1.5rem",
                        WebkitMask:
                          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                      }}
                    />

                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0D5BDC] to-[#4587F4] mb-6 shadow-lg"
                    >
                      <stat.icon className="w-10 h-10 text-white" />
                    </motion.div>

                    <div className="text-4xl sm:text-5xl bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent mb-3">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.value.includes("+") ? "+" : ""}
                      />
                    </div>

                    <p className="text-[#262626]/70">{stat.label}</p>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Tabs with Enhanced Design */}
      <section className="py-24 bg-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgb(13 91 220 / 0.15) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#0D5BDC]/10 to-[#340F87]/10 border border-[#0D5BDC]/20 mb-6"
            >
              <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent">
                {language === "ar"
                  ? "اختر البرنامج المناسب"
                  : "Choose Your Program"}
              </span>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl mb-6">
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="bg-gradient-to-r from-[#262626] via-[#0A2F78] to-[#262626] bg-clip-text text-transparent"
                style={{ backgroundSize: "200% auto" }}
              >
                {language === "ar"
                  ? "برامجنا المتخصصة"
                  : "Our Specialized Programs"}
              </motion.span>
            </h2>
          </motion.div>
          <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-6 h-auto bg-transparent mb-16">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div
                  onClick={() => {
                    setActiveProgram(program.id);
                  }}
                  className="h-auto p-8 data-[state=active]:shadow-2xl transition-all duration-500 rounded-3xl border-2 relative overflow-hidden group w-full"
                  style={{
                    backgroundColor:
                      activeProgram === program.id ? "transparent" : "white",
                    backgroundImage:
                      activeProgram === program.id
                        ? `linear-gradient(${
                            program.gradientAngle
                          }, ${program.gradient
                            .split(" ")[0]
                            .replace("from-[", "")
                            .replace("]", "")}, ${program.gradient
                            .split(" ")[1]
                            .replace("to-[", "")
                            .replace("]", "")})`
                        : "none",
                    color: activeProgram === program.id ? "white" : "#262626",
                    borderColor:
                      activeProgram === program.id ? "transparent" : "#F2F2F2",
                  }}
                >
                  {/* Hover Effect Overlay */}
                  {activeProgram !== program.id && (
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                      style={{
                        background: `linear-gradient(${program.gradientAngle}, ${program.accentColor}, transparent)`,
                      }}
                    />
                  )}

                  <div className="text-center relative z-10">
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <program.icon
                        className={`w-12 h-12 mx-auto mb-4 ${
                          activeProgram === program.id
                            ? "text-white"
                            : "text-[#0D5BDC]"
                        }`}
                      />
                    </motion.div>

                    <p className="text-xl mb-2">
                      {language === "ar" ? program.nameAr : program.nameEn}
                    </p>

                    <p
                      className={`text-sm ${
                        activeProgram === program.id
                          ? "text-white/80"
                          : "text-[#262626]/70"
                      }`}
                    >
                      {language === "ar"
                        ? program.taglineAr
                        : program.taglineEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {programs.map((program) =>
            program.id != activeProgram ? null : (
              <div key={program.id} className={"mt-0 "}>
                <div className="grid lg:grid-cols-5 gap-10 mb-16">
                  {/* Program Image */}
                  <motion.div
                    initial={{ opacity: 0, x: language === "ar" ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-2 relative h-[500px] lg:h-full rounded-[2rem] overflow-hidden group"
                  >
                    <ImageWithFallback
                      src={program.image}
                      alt={language === "ar" ? program.nameAr : program.nameEn}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${program.gradient} opacity-60 group-hover:opacity-70 transition-opacity`}
                    />

                    {/* Animated Border */}
                    <motion.div
                      className="absolute inset-0 border-4 border-white/20 rounded-[2rem]"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(255,255,255,0.2)",
                          "0 0 40px rgba(255,255,255,0.4)",
                          "0 0 20px rgba(255,255,255,0.2)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    <div className="absolute bottom-8 left-8 right-8">
                      <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 mb-3 px-4 py-2">
                        ✨{" "}
                        {language === "ar"
                          ? "برنامج معتمد"
                          : "Certified Program"}
                      </Badge>
                      <h3 className="text-3xl text-white drop-shadow-lg">
                        {language === "ar" ? program.nameAr : program.nameEn}
                      </h3>
                    </div>
                  </motion.div>

                  {/* Program Details */}
                  <motion.div
                    initial={{ opacity: 0, x: language === "ar" ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:col-span-3 space-y-8"
                  >
                    <div>
                      <h2 className="text-4xl sm:text-5xl bg-gradient-to-r from-[#262626] to-[#0A2F78] bg-clip-text text-transparent mb-6">
                        {language === "ar" ? program.nameAr : program.nameEn}
                      </h2>

                      <p className="text-xl text-[#262626]/80 mb-8 leading-relaxed">
                        {language === "ar"
                          ? program.descriptionAr
                          : program.descriptionEn}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {[
                        {
                          icon: Calendar,
                          label: language === "ar" ? "المدة" : "Duration",
                          value: program.duration,
                          color: "#0D5BDC",
                        },
                        {
                          icon: DollarSign,
                          label: language === "ar" ? "التمويل" : "Funding",
                          value: program.funding,
                          color: "#340F87",
                        },
                        {
                          icon: TrendingUp,
                          label: language === "ar" ? "الحصة" : "Equity",
                          value: program.equity,
                          color: "#00B0F0",
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#F2F2F2] to-white border border-[#F2F2F2] hover:border-[#0D5BDC]/30 transition-all relative overflow-hidden group">
                            {/* Hover glow effect */}
                            <motion.div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                              style={{
                                background: `radial-gradient(circle at center, ${item.color}20, transparent)`,
                              }}
                            />

                            <item.icon
                              className="w-8 h-8 mb-3 relative z-10"
                              style={{ color: item.color }}
                            />
                            <p className="text-sm text-[#262626]/60 mb-2 relative z-10">
                              {item.label}
                            </p>
                            <p className="text-lg text-[#262626] relative z-10">
                              {item.value}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <MagneticButton className="flex-1">
                        <Link
                          href={`/programs/${program.id}`}
                          className="block"
                        >
                          <Button
                            size="lg"
                            className={`w-full bg-gradient-to-r ${program.gradient} text-white border-0 hover:scale-105 transition-transform rounded-2xl py-7 text-lg shadow-xl relative overflow-hidden group`}
                          >
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              initial={{ x: "-100%" }}
                              whileHover={{ x: "100%" }}
                              transition={{ duration: 0.5 }}
                            />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {language === "ar"
                                ? "عرض التفاصيل والتقديم"
                                : "View Details & Apply"}
                              <ArrowRight
                                className={`w-6 h-6 ${
                                  language === "ar" ? "rotate-180" : ""
                                }`}
                              />
                            </span>
                          </Button>
                        </Link>
                      </MagneticButton>

                      <MagneticButton>
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-2 border-[#0D5BDC] text-[#0D5BDC] hover:bg-[#0D5BDC] hover:text-white px-8 py-7 text-lg rounded-2xl transition-all"
                        >
                          {language === "ar"
                            ? "تحميل الدليل"
                            : "Download Guide"}
                        </Button>
                      </MagneticButton>
                    </div>
                  </motion.div>
                </div>

                {/* Features Grid with 3D Effect */}
                <div className="mb-16">
                  <h3 className="text-4xl text-center bg-gradient-to-r from-[#262626] to-[#0A2F78] bg-clip-text text-transparent mb-12">
                    {language === "ar" ? "مميزات البرنامج" : "Program Features"}
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {program.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{
                          y: -15,
                          rotateY: 5,
                          rotateX: 5,
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                        className="group cursor-pointer"
                      >
                        <div className="relative h-full p-8 rounded-3xl   bg-gradient-to-br from-white to-[#F2F2F2] border border-[#F2F2F2] hover:border-transparent transition-all duration-500 overflow-hidden shadow-lg hover:shadow-2xl">
                          {/* Animated background gradient on hover */}
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-br ${program.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                            initial={{ scale: 0, borderRadius: "50%" }}
                            whileHover={{ scale: 2, borderRadius: "0%" }}
                            transition={{ duration: 0.5 }}
                          />

                          <div className="relative z-10">
                            <motion.div
                              whileHover={{
                                rotate: [0, -15, 15, -15, 0],
                                scale: 1.1,
                              }}
                              transition={{ duration: 0.6 }}
                              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl  bg-gradient-to-br ${program.gradient} mb-6 shadow-lg`}
                            >
                              <feature.icon className="w-8 h-8 text-white" />
                            </motion.div>

                            <h4 className="mb-3 text-xl text-[#262626]  transition-colors duration-300">
                              {language === "ar"
                                ? feature.titleAr
                                : feature.titleEn}
                            </h4>

                            <p className="text-[#262626]/70  transition-colors duration-300">
                              {language === "ar"
                                ? feature.descAr
                                : feature.descEn}
                            </p>
                          </div>

                          {/* Corner accent */}
                          <motion.div
                            className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-20"
                            style={{
                              background: `radial-gradient(circle at top right, white, transparent)`,
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Benefits & Eligibility with Modern Cards */}
                <div className="grid md:grid-cols-2 gap-10">
                  <motion.div
                    initial={{ opacity: 0, x: language === "ar" ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative h-full p-10 rounded-3xl bg-gradient-to-br from-white to-[#F2F2F2] border border-[#F2F2F2] shadow-xl hover:shadow-2xl transition-all overflow-hidden group">
                      {/* Animated corner gradient */}
                      <motion.div
                        className={`absolute top-0 ltr:left-0 rtl:right-0 w-40 h-40 bg-gradient-to-br ${program.gradient} opacity-10 rounded-full blur-3xl`}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />

                      <div
                        className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${program.gradient} mb-8 shadow-lg relative`}
                      >
                        <Award className="w-10 h-10 text-white" />
                      </div>

                      <h3 className="text-3xl text-[#262626] mb-8 relative">
                        {language === "ar" ? "ما ستحصل عليه" : "What You Get"}
                      </h3>

                      <ul className="space-y-5 relative">
                        {program.benefits.map((benefit, index) => (
                          <motion.li
                            key={index}
                            initial={{
                              opacity: 0,
                              x: language === "ar" ? 20 : -20,
                            }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ x: language === "ar" ? -5 : 5 }}
                            className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-all"
                          >
                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5 text-[#0D5BDC]" />
                            <span className="text-[#262626]/80 text-lg">
                              {benefit}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: language === "ar" ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative h-full p-10 rounded-3xl bg-gradient-to-br from-white to-[#F2F2F2] border border-[#F2F2F2] shadow-xl hover:shadow-2xl transition-all overflow-hidden group">
                      {/* Animated corner gradient */}
                      <motion.div
                        className={`absolute bottom-0 ltr:right-0 rtl:left-0 w-40 h-40 bg-gradient-to-br ${program.gradient} opacity-10 rounded-full blur-3xl`}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.1, 0.2, 0.1],
                        }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                      />

                      <div
                        className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${program.gradient} mb-8 shadow-lg relative`}
                      >
                        <Target className="w-10 h-10 text-white" />
                      </div>

                      <h3 className="text-3xl text-[#262626] mb-8 relative">
                        {language === "ar"
                          ? "معايير القبول"
                          : "Eligibility Criteria"}
                      </h3>

                      <ul className="space-y-5 relative">
                        {program.eligibility.map((criterion, index) => (
                          <motion.li
                            key={index}
                            initial={{
                              opacity: 0,
                              x: language === "ar" ? 20 : -20,
                            }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ x: language === "ar" ? -5 : 5 }}
                            className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-all"
                          >
                            <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5 text-[#340F87]" />
                            <span className="text-[#262626]/80 text-lg">
                              {criterion}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* Success Stories with Enhanced Cards */}
      <section className="py-24 bg-gradient-to-b from-white to-[#F2F2F2] relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 ltr:right-0 rtl:left-0 w-96 h-96 bg-[#0D5BDC]/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#0D5BDC]/10 to-[#340F87]/10 border border-[#0D5BDC]/20 mb-6"
            >
              <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#0D5BDC]" />
                {language === "ar" ? "قصص النجاح" : "Success Stories"}
              </span>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl mb-6">
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="bg-gradient-to-r from-[#262626] via-[#0A2F78] to-[#262626] bg-clip-text text-transparent"
                style={{ backgroundSize: "200% auto" }}
              >
                {language === "ar"
                  ? "شركات ناجحة تخرجت من برامجنا"
                  : "Successful Companies from Our Programs"}
              </motion.span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -15, rotateY: 5 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="overflow-hidden h-full bg-white rounded-3xl hover:shadow-2xl transition-all duration-500 border border-[#F2F2F2] group">
                  <div className="relative h-80 overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <ImageWithFallback
                        src={story.image}
                        alt={story.company}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {/* Achievement Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                      className="absolute top-6 left-6 right-auto"
                    >
                      <Badge className="bg-gradient-to-r from-[#0D5BDC] to-[#4587F4] text-white border-0 px-4 py-2 shadow-lg">
                        {story.achievement}
                      </Badge>
                    </motion.div>

                    {/* Growth Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                      className="absolute bottom-6 right-6 left-auto"
                    >
                      <div className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 rounded-full">
                        📈 {story.growth}
                      </div>
                    </motion.div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl text-[#262626] mb-3 group-hover:text-[#0D5BDC] transition-colors">
                      {story.company}
                    </h3>

                    <p className="text-[#262626]/70 mb-2">
                      {language === "ar" ? story.founderAr : story.founderEn}
                    </p>

                    <p className="text-sm text-[#262626]/60 mb-6">
                      {language === "ar" ? story.programAr : story.programEn}
                    </p>

                    <motion.blockquote
                      className="relative border-l-4 border-[#0D5BDC] pl-6 italic text-[#262626]/80 leading-relaxed"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="absolute -left-2 -top-2 text-4xl text-[#0D5BDC]/20">
                        "
                      </span>
                      {story.quote}
                      <span className="absolute -bottom-6 right-0 text-4xl text-[#0D5BDC]/20">
                        "
                      </span>
                    </motion.blockquote>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Modern Design */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgb(13 91 220 / 0.15) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-1/2 ltr:left-1/4 rtl:right-1/4 w-96 h-96 bg-gradient-to-r from-[#0D5BDC]/20 to-[#340F87]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#0D5BDC]/10 to-[#340F87]/10 border border-[#0D5BDC]/20 mb-8"
            >
              <Sparkles className="w-5 h-5 text-[#0D5BDC]" />
              <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent">
                {language === "ar"
                  ? "ابدأ رحلتك الآن"
                  : "Start Your Journey Now"}
              </span>
            </motion.div>

            <h2 className="text-5xl sm:text-6xl mb-8">
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="bg-gradient-to-r from-[#262626] via-[#0A2F78] to-[#262626] bg-clip-text text-transparent"
                style={{ backgroundSize: "200% auto" }}
              >
                {language === "ar"
                  ? "هل أنت مستعد للانطلاق؟"
                  : "Ready to Get Started?"}
              </motion.span>
            </h2>

            <p className="text-2xl text-[#262626]/70 mb-12 leading-relaxed">
              {language === "ar"
                ? "انضم إلى برامجنا واحصل على الدعم الكامل لتحويل فكرتك إلى مشروع ناجح"
                : "Join our programs and get full support to turn your idea into a successful project"}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <MagneticButton>
                <Link href="/incubation-request">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] text-white border-0 px-12 py-8 text-xl rounded-full hover:scale-105 transition-transform shadow-2xl relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%", skewX: -20 }}
                      whileHover={{ x: "200%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10 flex items-center gap-3">
                      <Rocket className="w-6 h-6" />
                      {language === "ar" ? "قدم طلبك الآن" : "Apply Now"}
                      <ArrowRight
                        className={`w-6 h-6 ${
                          language === "ar" ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </Button>
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#0D5BDC] text-[#0D5BDC] hover:bg-[#0D5BDC] hover:text-white px-12 py-8 text-xl rounded-full transition-all"
                  >
                    {language === "ar" ? "تواصل معنا" : "Contact Us"}
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center z-50 border-4 border-[#F2F2F2]"
        style={{
          background: `conic-gradient(#0D5BDC ${
            scaleProgress.get() * 100
          }%, #F2F2F2 0%)`,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowRight className="w-6 h-6 text-[#0D5BDC] -rotate-90" />
        </motion.div>
      </motion.div>
    </div>
  );
}
