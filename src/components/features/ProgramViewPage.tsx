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
  Clock,
  DollarSign,
  FileText,
  Download,
  CheckCircle2,
  Upload,
  User,
  Mail,
  Phone,
  Building,
  Sparkles,
  ArrowLeft,
  TrendingUp,
  Target,
  Award,
  Zap,
  Users,
  Globe,
  Send,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { toast } from "sonner";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useI18n } from "@/hooks/useI18n";
import { useParams, useRouter } from "next/navigation";

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

// Magnetic Button Component
const MagneticButton = ({ children, className, ...props }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const { left, top, width, height } = rect;
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

export default function ProgramViewPage() {
  const { programId } = useParams();
  const { language } = useI18n();
  const navigate = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: File | null;
  }>({
    businessPlan: null,
    financialProjections: null,
    teamCV: null,
    presentationDeck: null,
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    projectName: "",
    projectDescription: "",
    funding: "",
    teamSize: "",
    website: "",
    linkedin: "",
  });

  // Mock program data - would come from API/database
  const programs: { [key: string]: any } = {
    tech: {
      id: "tech",
      nameAr: "برنامج تسريع التقنية",
      nameEn: "Tech Accelerator Program",
      descriptionAr:
        "برنامج متخصص لتسريع نمو شركات التقنية الناشئة التي لديها منتج جاهز وتسعى للتوسع السريع في السوق",
      descriptionEn:
        "Specialized program to accelerate growth of tech startups with ready products seeking rapid market expansion",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      gradient: "from-[#0D5BDC] to-[#4587F4]",
      gradientAngle: "135deg",
      accentColor: "#0D5BDC",
      type: language === "ar" ? "تسريع أعمال" : "Business Accelerator",
      duration: language === "ar" ? "6 أشهر" : "6 Months",
      startDate: "2025-03-01",
      endDate: "2025-08-31",
      applicationDeadline: "2025-02-15",
      funding: language === "ar" ? "حتى 500,000 ر.س" : "Up to 500,000 SAR",
      equity: "5-10%",
      batchSize: language === "ar" ? "20 شركة" : "20 Companies",
      focusAreas: [
        language === "ar" ? "الذكاء الاصطناعي" : "Artificial Intelligence",
        language === "ar" ? "الأمن السيبراني" : "Cybersecurity",
        language === "ar" ? "التقنية المالية" : "FinTech",
        language === "ar" ? "التعليم التقني" : "EdTech",
        language === "ar" ? "إنترنت الأشياء" : "IoT",
      ],
      values: [
        {
          titleAr: "التمويل المباشر",
          titleEn: "Direct Funding",
          descAr: "تمويل يصل إلى 500,000 ر.س مقابل حصة من 5-10%",
          descEn: "Funding up to 500,000 SAR for 5-10% equity stake",
          icon: DollarSign,
        },
        {
          titleAr: "الإرشاد المتخصص",
          titleEn: "Expert Mentorship",
          descAr: "جلسات إرشاد أسبوعية مع خبراء التقنية والأعمال",
          descEn: "Weekly mentorship sessions with tech and business experts",
          icon: Target,
        },
        {
          titleAr: "التدريب المكثف",
          titleEn: "Intensive Training",
          descAr: "برنامج تدريبي شامل يغطي جميع جوانب نمو الأعمال",
          descEn:
            "Comprehensive training program covering all aspects of business growth",
          icon: Award,
        },
        {
          titleAr: "الوصول للمستثمرين",
          titleEn: "Investor Access",
          descAr: "يوم عرض أمام أكثر من 100 مستثمر ومؤسسة تمويلية",
          descEn: "Demo day with 100+ investors and funding institutions",
          icon: TrendingUp,
        },
      ],
      requirements: [
        language === "ar"
          ? "منتج تقني جاهز (MVP) أو في مرحلة متقدمة"
          : "Ready tech product (MVP) or advanced stage",
        language === "ar"
          ? "فريق تأسيسي متفرغ (2-5 أعضاء)"
          : "Full-time founding team (2-5 members)",
        language === "ar"
          ? "نموذج عمل واضح وقابل للتوسع"
          : "Clear and scalable business model",
        language === "ar"
          ? "سوق مستهدف محدد بوضوح"
          : "Clearly defined target market",
        language === "ar"
          ? "خطة نمو وتوسع واضحة"
          : "Clear growth and expansion plan",
        language === "ar"
          ? "التزام كامل بالبرنامج لمدة 6 أشهر"
          : "Full commitment to 6-month program",
      ],
      documents: [
        {
          nameAr: "خطة العمل التفصيلية",
          nameEn: "Detailed Business Plan",
          required: true,
          format: "PDF",
          key: "businessPlan",
        },
        {
          nameAr: "التوقعات المالية (3 سنوات)",
          nameEn: "Financial Projections (3 Years)",
          required: true,
          format: "PDF/Excel",
          key: "financialProjections",
        },
        {
          nameAr: "السيرة الذاتية لأعضاء الفريق",
          nameEn: "Team Members CVs",
          required: true,
          format: "PDF",
          key: "teamCV",
        },
        {
          nameAr: "عرض تقديمي للمشروع (Pitch Deck)",
          nameEn: "Project Presentation (Pitch Deck)",
          required: true,
          format: "PDF/PPT",
          key: "presentationDeck",
        },
      ],
    },
    fintech: {
      id: "fintech",
      nameAr: "برنامج التقنية المالية",
      nameEn: "FinTech Accelerator Program",
      descriptionAr:
        "برنامج متخصص للحلول المالية الرقمية مع التركيز على الامتثال التنظيمي والابتكار المالي",
      descriptionEn:
        "Specialized program for digital financial solutions focusing on regulatory compliance and financial innovation",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3",
      gradient: "from-[#340F87] to-[#0E3F9F]",
      gradientAngle: "135deg",
      accentColor: "#340F87",
      type: language === "ar" ? "تسريع أعمال" : "Business Accelerator",
      duration: language === "ar" ? "6 أشهر" : "6 Months",
      startDate: "2025-04-01",
      endDate: "2025-09-30",
      applicationDeadline: "2025-03-15",
      funding: language === "ar" ? "حتى 750,000 ر.س" : "Up to 750,000 SAR",
      equity: "7-12%",
      batchSize: language === "ar" ? "15 شركة" : "15 Companies",
      focusAreas: [
        language === "ar" ? "المدفوعات الرقمية" : "Digital Payments",
        language === "ar" ? "البلوكشين" : "Blockchain",
        language === "ar" ? "الإقراض التقني" : "Digital Lending",
        language === "ar" ? "التأمين التقني" : "InsurTech",
        language === "ar" ? "إدارة الثروات" : "Wealth Management",
      ],
      values: [
        {
          titleAr: "التمويل المباشر",
          titleEn: "Direct Funding",
          descAr: "تمويل يصل إلى 750,000 ر.س مقابل حصة من 7-12%",
          descEn: "Funding up to 750,000 SAR for 7-12% equity stake",
          icon: DollarSign,
        },
        {
          titleAr: "الامتثال التنظيمي",
          titleEn: "Regulatory Compliance",
          descAr: "دعم كامل للحصول على التراخيص والموافقات التنظيمية",
          descEn:
            "Full support for obtaining licenses and regulatory approvals",
          icon: Award,
        },
        {
          titleAr: "شبكة البنوك",
          titleEn: "Banking Network",
          descAr: "وصول مباشر لشبكة من البنوك والمؤسسات المالية",
          descEn:
            "Direct access to network of banks and financial institutions",
          icon: Target,
        },
        {
          titleAr: "خبراء FinTech",
          titleEn: "FinTech Experts",
          descAr: "إرشاد من خبراء التقنية المالية والامتثال",
          descEn: "Mentorship from FinTech and compliance experts",
          icon: TrendingUp,
        },
      ],
      requirements: [
        language === "ar"
          ? "حل مالي رقمي مبتكر"
          : "Innovative digital financial solution",
        language === "ar"
          ? "فهم عميق للوائح المالية"
          : "Deep understanding of financial regulations",
        language === "ar"
          ? "فريق ذو خبرة في المجال المالي"
          : "Team with financial industry experience",
        language === "ar"
          ? "نموذج أعمال متوافق مع اللوائح"
          : "Regulation-compliant business model",
        language === "ar"
          ? "خطة للحصول على التراخيص"
          : "Plan for obtaining licenses",
        language === "ar"
          ? "شراكات محتملة مع مؤسسات مالية"
          : "Potential partnerships with financial institutions",
      ],
      documents: [
        {
          nameAr: "خطة العمل التفصيلية",
          nameEn: "Detailed Business Plan",
          required: true,
          format: "PDF",
          key: "businessPlan",
        },
        {
          nameAr: "تقرير الامتثال التنظيمي",
          nameEn: "Regulatory Compliance Report",
          required: true,
          format: "PDF",
          key: "financialProjections",
        },
        {
          nameAr: "السيرة الذاتية لأعضاء الفريق",
          nameEn: "Team Members CVs",
          required: true,
          format: "PDF",
          key: "teamCV",
        },
        {
          nameAr: "عرض تقديمي للمشروع",
          nameEn: "Project Presentation",
          required: true,
          format: "PDF/PPT",
          key: "presentationDeck",
        },
      ],
    },
    ecommerce: {
      id: "ecommerce",
      nameAr: "برنامج التجارة الإلكترونية",
      nameEn: "E-Commerce Accelerator Program",
      descriptionAr:
        "برنامج متخصص للمتاجر الإلكترونية التي تسعى لزيادة المبيعات والتوسع في السوق",
      descriptionEn:
        "Specialized program for online stores seeking sales growth and market expansion",
      image: "https://images.unsplash.com/photo-1557821552-17105176677c",
      gradient: "from-[#00B0F0] to-[#007D9B]",
      gradientAngle: "135deg",
      accentColor: "#00B0F0",
      type: language === "ar" ? "تسريع أعمال" : "Business Accelerator",
      duration: language === "ar" ? "4 أشهر" : "4 Months",
      startDate: "2025-02-15",
      endDate: "2025-06-15",
      applicationDeadline: "2025-02-01",
      funding: language === "ar" ? "حتى 300,000 ر.س" : "Up to 300,000 SAR",
      equity: "5-8%",
      batchSize: language === "ar" ? "25 شركة" : "25 Companies",
      focusAreas: [
        language === "ar" ? "التسويق الرقمي" : "Digital Marketing",
        language === "ar" ? "اللوجستيات والشحن" : "Logistics & Shipping",
        language === "ar" ? "تجربة المستخدم" : "User Experience",
        language === "ar" ? "التحليلات والبيانات" : "Analytics & Data",
        language === "ar" ? "إدارة المخزون" : "Inventory Management",
      ],
      values: [
        {
          titleAr: "التمويل التسويقي",
          titleEn: "Marketing Funding",
          descAr: "تمويل يصل إلى 300,000 ر.س للتسويق والنمو",
          descEn: "Funding up to 300,000 SAR for marketing and growth",
          icon: DollarSign,
        },
        {
          titleAr: "خبراء التسويق",
          titleEn: "Marketing Experts",
          descAr: "جلسات مع خبراء التسويق الرقمي والتجارة الإلكترونية",
          descEn: "Sessions with digital marketing and e-commerce experts",
          icon: Target,
        },
        {
          titleAr: "شبكة اللوجستيات",
          titleEn: "Logistics Network",
          descAr: "وصول لشبكة موردي الخدمات اللوجستية",
          descEn: "Access to logistics service providers network",
          icon: Award,
        },
        {
          titleAr: "أدوات التحليل",
          titleEn: "Analytics Tools",
          descAr: "أدوات تحليل متقدمة لتتبع الأداء والنمو",
          descEn: "Advanced analytics tools for performance tracking",
          icon: TrendingUp,
        },
      ],
      requirements: [
        language === "ar" ? "متجر إلكتروني فعال" : "Active online store",
        language === "ar"
          ? "مبيعات شهرية لا تقل عن 50,000 ر.س"
          : "Monthly sales of at least 50,000 SAR",
        language === "ar" ? "فريق تشغيلي متفرغ" : "Full-time operational team",
        language === "ar"
          ? "استراتيجية تسويق واضحة"
          : "Clear marketing strategy",
        language === "ar" ? "نظام إدارة مخزون" : "Inventory management system",
        language === "ar" ? "خطة توسع جغرافي" : "Geographic expansion plan",
      ],
      documents: [
        {
          nameAr: "خطة العمل",
          nameEn: "Business Plan",
          required: true,
          format: "PDF",
          key: "businessPlan",
        },
        {
          nameAr: "تقارير المبيعات (6 أشهر)",
          nameEn: "Sales Reports (6 Months)",
          required: true,
          format: "PDF/Excel",
          key: "financialProjections",
        },
        {
          nameAr: "استراتيجية التسويق",
          nameEn: "Marketing Strategy",
          required: true,
          format: "PDF",
          key: "teamCV",
        },
        {
          nameAr: "السجل التجاري",
          nameEn: "Commercial Registration",
          required: true,
          format: "PDF",
          key: "presentationDeck",
        },
      ],
    },
  };

  const program = programs[programId || "tech"] || programs.tech;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileUpload = (
    documentType: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFiles((prev) => ({
        ...prev,
        [documentType]: file,
      }));
      toast.success(
        language === "ar"
          ? `تم رفع الملف: ${file.name}`
          : `File uploaded: ${file.name}`
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.projectName
    ) {
      toast.error(
        language === "ar"
          ? "يرجى ملء جميع الحقول المطلوبة"
          : "Please fill in all required fields"
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        language === "ar"
          ? "تم تقديم الطلب بنجاح! سنتواصل معك قريباً"
          : "Application submitted successfully! We will contact you soon"
      );

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        projectName: "",
        projectDescription: "",
        funding: "",
        teamSize: "",
        website: "",
        linkedin: "",
      });
      setUploadedFiles({
        businessPlan: null,
        financialProjections: null,
        teamCV: null,
        presentationDeck: null,
      });
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === "ar"
      ? date.toLocaleDateString("ar-SA")
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  return (
    <div
      className="min-h-screen bg-white overflow-hidden"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Animated Cursor Follower */}
      <motion.div
        className="fixed w-6 h-6 rounded-full border-2 pointer-events-none z-50 hidden lg:block"
        style={{ borderColor: program.accentColor }}
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={program.image}
            alt={language === "ar" ? program.nameAr : program.nameEn}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${program.gradient} opacity-90`}
          ></div>

          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
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
            <span className="text-white">{program.type}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight"
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
              {language === "ar" ? program.nameAr : program.nameEn}
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-white/90 text-lg sm:text-xl max-w-3xl mb-12 leading-relaxed"
          >
            {language === "ar" ? program.descriptionAr : program.descriptionEn}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            {[
              { icon: Calendar, text: program.duration },
              { icon: DollarSign, text: program.funding },
              { icon: TrendingUp, text: program.equity },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.3 }}
              >
                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-6 py-3 text-base">
                  <item.icon
                    className={`w-5 h-5 ${language === "ar" ? "ml-2" : "mr-2"}`}
                  />
                  {item.text}
                </Badge>
              </motion.div>
            ))}
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

      {/* Program Details Grid */}
      <section className="py-20 bg-gradient-to-b from-[#F2F2F2] to-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0D5BDC] to-transparent opacity-50" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Calendar,
                label: language === "ar" ? "تاريخ البدء" : "Start Date",
                value: formatDate(program.startDate),
                color: program.accentColor,
              },
              {
                icon: Calendar,
                label: language === "ar" ? "تاريخ الانتهاء" : "End Date",
                value: formatDate(program.endDate),
                color: "#340F87",
              },
              {
                icon: Clock,
                label:
                  language === "ar"
                    ? "آخر موعد للتقديم"
                    : "Application Deadline",
                value: formatDate(program.applicationDeadline),
                color: "#00B0F0",
              },
              {
                icon: Rocket,
                label: language === "ar" ? "حجم الدفعة" : "Batch Size",
                value: program.batchSize,
                color: "#4587F4",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group"
              >
                <div className="relative">
                  {/* Background Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                    style={{ backgroundColor: `${item.color}40` }}
                  />

                  <div className="relative p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-[#F2F2F2] hover:border-transparent hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    {/* Animated Border */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}, transparent)`,
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
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${item.color}, ${item.color}CC)`,
                      }}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="mb-2 text-[#262626]">{item.label}</h3>
                    <p className="text-[#262626]/70 text-lg">{item.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Values */}
      <section className="py-24 bg-white relative overflow-hidden">
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
                {language === "ar" ? "القيمة المقدمة" : "Program Values"}
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
                {language === "ar" ? "ماذا ستحصل عليه" : "What You Get"}
              </motion.span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {program.values.map((value: any, index: number) => (
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
                <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-white to-[#F2F2F2] border border-[#F2F2F2] hover:border-transparent transition-all duration-500 overflow-hidden shadow-lg hover:shadow-2xl">
                  {/* Animated background gradient on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${program.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    initial={{ scale: 0, borderRadius: "50%" }}
                    whileHover={{ scale: 2, borderRadius: "0%" }}
                    transition={{ duration: 0.5 }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ rotate: [0, -15, 15, -15, 0], scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${program.gradient} mb-6 shadow-lg`}
                    >
                      <value.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="mb-3 text-xl text-[#262626] group-hover:text-white transition-colors duration-300">
                      {language === "ar" ? value.titleAr : value.titleEn}
                    </h3>

                    <p className="text-[#262626]/70 group-hover:text-white/90 transition-colors duration-300">
                      {language === "ar" ? value.descAr : value.descEn}
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
      </section>

      {/* Focus Areas */}
      <section className="py-20 bg-gradient-to-b from-[#F2F2F2] to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#0D5BDC]/10 to-[#340F87]/10 border border-[#0D5BDC]/20 mb-6"
            >
              <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent flex items-center gap-2 justify-center">
                <Target className="w-5 h-5 text-[#0D5BDC]" />
                {language === "ar" ? "مجالات التركيز" : "Focus Areas"}
              </span>
            </motion.div>

            <h2 className="text-4xl sm:text-5xl">
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="bg-gradient-to-r from-[#262626] via-[#0A2F78] to-[#262626] bg-clip-text text-transparent"
                style={{ backgroundSize: "200% auto" }}
              >
                {language === "ar"
                  ? "مجالات التخصص"
                  : "Areas of Specialization"}
              </motion.span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto">
            {program.focusAreas.map((area: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
              >
                <Badge
                  className={`px-8 py-4 text-lg bg-gradient-to-r ${program.gradient} text-white border-0 rounded-full shadow-lg hover:shadow-2xl transition-all cursor-pointer`}
                >
                  {area}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Requirements */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative Background */}
        <motion.div
          className="absolute top-1/4 ltr:right-0 rtl:left-0 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${program.accentColor}20` }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

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
              <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#0D5BDC]" />
                {language === "ar" ? "شروط التقديم" : "Requirements"}
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
                  ? "متطلبات التقديم"
                  : "Application Requirements"}
              </motion.span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {program.requirements.map((req: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: language === "ar" ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: language === "ar" ? -5 : 5, scale: 1.02 }}
                  className="group"
                >
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-[#F2F2F2] to-white border border-[#F2F2F2] hover:border-transparent hover:shadow-xl transition-all relative overflow-hidden">
                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle at center, ${program.accentColor}20, transparent)`,
                      }}
                    />

                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="flex-shrink-0 relative z-10"
                    >
                      <CheckCircle2
                        className="w-7 h-7"
                        style={{ color: program.accentColor }}
                      />
                    </motion.div>

                    <span className="text-[#262626]/80 text-lg leading-relaxed relative z-10">
                      {req}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-24 bg-gradient-to-b from-[#F2F2F2] to-white relative overflow-hidden">
        {/* Decorative Elements */}
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
              <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent flex items-center gap-2 justify-center">
                <Send className="w-5 h-5 text-[#0D5BDC]" />
                {language === "ar" ? "تقديم الطلب" : "Submit Application"}
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
                {language === "ar" ? "قدم الآن" : "Apply Now"}
              </motion.span>
            </h2>

            <p className="text-xl text-[#262626]/70 max-w-2xl mx-auto">
              {language === "ar"
                ? "املأ النموذج أدناه وسنتواصل معك في أقرب وقت"
                : "Fill out the form below and we will contact you shortly"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative p-10 lg:p-16 rounded-3xl bg-white border-2 border-[#F2F2F2] shadow-2xl overflow-hidden">
              {/* Decorative gradient orbs */}
              <motion.div
                className="absolute -top-20 -left-20 w-40 h-40 rounded-full opacity-20 blur-3xl"
                style={{ backgroundColor: program.accentColor }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl"
                style={{ backgroundColor: program.accentColor }}
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.2, 0.3],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                {/* Personal Information */}
                <div>
                  <h3 className="text-2xl text-[#262626] mb-6 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${program.gradient} flex items-center justify-center`}
                    >
                      <User className="w-5 h-5 text-white" />
                    </div>
                    {language === "ar"
                      ? "المعلومات الشخصية"
                      : "Personal Information"}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="fullName" className="text-[#262626]/80">
                        {language === "ar" ? "الاسم الكامل" : "Full Name"} *
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="h-14 rounded-xl border-2 border-[#F2F2F2] focus:border-[#0D5BDC] transition-colors"
                        placeholder={
                          language === "ar"
                            ? "أدخل اسمك الكامل"
                            : "Enter your full name"
                        }
                      />
                    </motion.div>

                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="email" className="text-[#262626]/80">
                        {language === "ar" ? "البريد الإلكتروني" : "Email"} *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-14 rounded-xl border-2 border-[#F2F2F2] focus:border-[#0D5BDC] transition-colors"
                        placeholder={
                          language === "ar"
                            ? "البريد الإلكتروني"
                            : "your@email.com"
                        }
                      />
                    </motion.div>

                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="phone" className="text-[#262626]/80">
                        {language === "ar" ? "رقم الهاتف" : "Phone Number"} *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="h-14 rounded-xl border-2 border-[#F2F2F2] focus:border-[#0D5BDC] transition-colors"
                        placeholder={
                          language === "ar" ? "رقم الهاتف" : "+966 XX XXX XXXX"
                        }
                      />
                    </motion.div>

                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="company" className="text-[#262626]/80">
                        {language === "ar" ? "اسم الشركة" : "Company Name"}
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="h-14 rounded-xl border-2 border-[#F2F2F2] focus:border-[#0D5BDC] transition-colors"
                        placeholder={
                          language === "ar" ? "اسم الشركة" : "Company name"
                        }
                      />
                    </motion.div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Project Information */}
                <div>
                  <h3 className="text-2xl text-[#262626] mb-6 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${program.gradient} flex items-center justify-center`}
                    >
                      <Rocket className="w-5 h-5 text-white" />
                    </div>
                    {language === "ar"
                      ? "معلومات المشروع"
                      : "Project Information"}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="space-y-2 md:col-span-2"
                    >
                      <Label
                        htmlFor="projectName"
                        className="text-[#262626]/80"
                      >
                        {language === "ar" ? "اسم المشروع" : "Project Name"} *
                      </Label>
                      <Input
                        id="projectName"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        required
                        className="h-14 rounded-xl border-2 border-[#F2F2F2] focus:border-[#0D5BDC] transition-colors"
                        placeholder={
                          language === "ar" ? "اسم المشروع" : "Project name"
                        }
                      />
                    </motion.div>

                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="space-y-2 md:col-span-2"
                    >
                      <Label
                        htmlFor="projectDescription"
                        className="text-[#262626]/80"
                      >
                        {language === "ar"
                          ? "وصف المشروع"
                          : "Project Description"}{" "}
                        *
                      </Label>
                      <Textarea
                        id="projectDescription"
                        name="projectDescription"
                        value={formData.projectDescription}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="rounded-xl border-2 border-[#F2F2F2] focus:border-[#0D5BDC] transition-colors"
                        placeholder={
                          language === "ar"
                            ? "اكتب وصفاً تفصيلياً لمشروعك..."
                            : "Write a detailed description of your project..."
                        }
                      />
                    </motion.div>

                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="teamSize" className="text-[#262626]/80">
                        {language === "ar" ? "حجم الفريق" : "Team Size"}
                      </Label>
                      <Input
                        id="teamSize"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleChange}
                        className="h-14 rounded-xl border-2 border-[#F2F2F2] focus:border-[#0D5BDC] transition-colors"
                        placeholder={
                          language === "ar"
                            ? "عدد أعضاء الفريق"
                            : "Number of team members"
                        }
                      />
                    </motion.div>

                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="funding" className="text-[#262626]/80">
                        {language === "ar"
                          ? "التمويل المطلوب"
                          : "Funding Needed"}
                      </Label>
                      <Input
                        id="funding"
                        name="funding"
                        value={formData.funding}
                        onChange={handleChange}
                        className="h-14 rounded-xl border-2 border-[#F2F2F2] focus:border-[#0D5BDC] transition-colors"
                        placeholder={
                          language === "ar" ? "المبلغ المطلوب" : "Amount needed"
                        }
                      />
                    </motion.div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Documents */}
                <div>
                  <h3 className="text-2xl text-[#262626] mb-6 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${program.gradient} flex items-center justify-center`}
                    >
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    {language === "ar"
                      ? "المستندات المطلوبة"
                      : "Required Documents"}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {program.documents.map((doc: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className="space-y-3"
                      >
                        <Label className="text-[#262626]/80 flex items-center gap-2">
                          {language === "ar" ? doc.nameAr : doc.nameEn}
                          {doc.required && (
                            <span className="text-red-500">*</span>
                          )}
                          <Badge variant="outline" className="ml-auto">
                            {doc.format}
                          </Badge>
                        </Label>

                        <div className="relative group">
                          <Input
                            type="file"
                            onChange={(e) => handleFileUpload(doc.key, e)}
                            className="h-14 rounded-xl border-2 border-dashed border-[#F2F2F2] hover:border-[#0D5BDC] transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#0D5BDC] file:text-white hover:file:bg-[#0D5BDC]/90"
                          />

                          {uploadedFiles[doc.key] && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute top-2 right-2"
                            >
                              <CheckCircle2 className="w-6 h-6 text-green-500" />
                            </motion.div>
                          )}
                        </div>

                        {uploadedFiles[doc.key] && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-green-600 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {uploadedFiles[doc.key]?.name}
                          </motion.p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <MagneticButton className="w-full mt-12">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className={`w-full h-16 text-xl rounded-full bg-gradient-to-r ${program.gradient} text-white border-0 hover:scale-105 transition-transform shadow-2xl relative overflow-hidden group`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: "-100%", skewX: -20 }}
                      whileHover={{ x: "200%" }}
                      transition={{ duration: 0.6 }}
                    />

                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Zap className="w-6 h-6" />
                          </motion.div>
                          {language === "ar"
                            ? "جاري الإرسال..."
                            : "Submitting..."}
                        </>
                      ) : (
                        <>
                          <Send className="w-6 h-6" />
                          {language === "ar"
                            ? "تقديم الطلب"
                            : "Submit Application"}
                          <ArrowRight
                            className={`w-6 h-6 ${
                              language === "ar" ? "rotate-180" : ""
                            }`}
                          />
                        </>
                      )}
                    </span>
                  </Button>
                </MagneticButton>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-white shadow-2xl flex items-center justify-center z-50 border-4 border-[#F2F2F2]"
        style={{
          background: `conic-gradient(${program.accentColor} ${
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
          <ArrowRight
            className="w-6 h-6 -rotate-90"
            style={{ color: program.accentColor }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
