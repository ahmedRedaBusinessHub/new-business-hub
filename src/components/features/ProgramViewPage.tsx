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
  Play,
  Image as ImageIcon,
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
import { type Program } from "./ProgramsManagement";
import { staticListsCache } from "@/lib/staticListsCache";
import { getLocalizedLabel } from "@/lib/localizedLabel";
import { Loader2 } from "lucide-react";

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
  const { id } = useParams();
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

  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [programTypes, setProgramTypes] = useState<any[]>([]);
  const [programSubtypes, setProgramSubtypes] = useState<any[]>([]);

  // Fetch static lists
  useEffect(() => {
    const fetchStaticLists = async () => {
      try {
        const typesConfig = await staticListsCache.getByNamespace('program.types');
        setProgramTypes(typesConfig);
        const subtypesConfig = await staticListsCache.getByNamespace('program.subtypes');
        setProgramSubtypes(subtypesConfig);
      } catch (error) {
        console.error('Error fetching static lists:', error);
      }
    };
    fetchStaticLists();
  }, []);

  const getTypeName = (typeId: number | null) => {
    if (typeId === null) return "";
    const type = programTypes.find(t => t.id === typeId);
    return type ? getLocalizedLabel(type.name_en, type.name_ar, `${language}`) : String(typeId);
  };

  const getSubtypeName = (subtypeId: number | null) => {
    if (subtypeId === null) return "";
    const subtype = programSubtypes.find(t => t.id === subtypeId);
    return subtype ? getLocalizedLabel(subtype.name_en, subtype.name_ar, `${language}`) : String(subtypeId);
  };

  // Fetch program data
  useEffect(() => {
    const fetchProgram = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/public/programs/${id}`);
        if (!response.ok) throw new Error("Failed to fetch program");
        const data = await response.json();
        setProgram(data);
      } catch (error) {
        console.error("Error fetching program:", error);
        toast.error(language === "ar" ? "فشل تحميل البرنامج" : "Failed to load program");
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id, language]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Helper to get theme colors based on ID
  const getTheme = (id: number) => {
    const themes = [
      { gradient: "from-[#0D5BDC] to-[#4587F4]", accent: "#0D5BDC" },
      { gradient: "from-[#340F87] to-[#0E3F9F]", accent: "#340F87" },
      { gradient: "from-[#00B0F0] to-[#007D9B]", accent: "#00B0F0" },
      { gradient: "from-[#10B981] to-[#059669]", accent: "#10B981" },
      { gradient: "from-[#F59E0B] to-[#D97706]", accent: "#F59E0B" },
    ];
    return themes[id % themes.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
          <Button onClick={() => navigate.push('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const theme = getTheme(program.id);

  // Parse JSON fields safely
  const parseJson = (json: any) => {
    if (!json) return [];
    if (typeof json === 'string') {
      try {
        return JSON.parse(json);
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(json) ? json : [];
  };

  const programValues = parseJson(program.values);
  const requirements = parseJson(program.application_requirements);
  const documents = parseJson(program.documents_requirements);
  const focusAreas = parseJson(program.focusAreas || []);
  const progressSteps = parseJson(program.progress_steps || []);
  const galleryImages = program.image_urls || [];
  const programDoc = language === 'ar' ? program.document_ar_url : program.document_en_url;

  // Icons for values (cycling)
  const valueIcons = [DollarSign, Target, Award, TrendingUp, Zap, Globe];

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
        style={{ borderColor: theme.accent }}
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
            src={program.main_image_url || program.promo_image || "https://images.unsplash.com/photo-1519389950473-47ba0277781c"}
            alt={language === "ar" ? program.name_ar : (program.name_en || program.name_ar)}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-90`}
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
              background: `radial-gradient(circle at ${mousePosition.x / 10}% ${mousePosition.y / 10
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
            <span className="text-white font-medium">{getTypeName(program.type)}</span>
            {program.subtype && (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                <span className="text-white/90">{getSubtypeName(program.subtype)}</span>
              </>
            )}
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

              {language === "ar" ? program.name_ar : (program.name_en || program.name_ar)}
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-white/90 text-lg sm:text-xl max-w-3xl mb-12 leading-relaxed"
          >

            {language === "ar" ? program.detail_ar : (program.detail_en || program.detail_ar)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            {[
              { icon: Calendar, text: program.from_datetime ? (language === "ar" ? new Date(program.from_datetime).toLocaleDateString('ar-EG') : new Date(program.from_datetime).toLocaleDateString('en-US')) : '-' },
              { icon: DollarSign, text: program.price || (language === "ar" ? "مجاني" : "Free") },
              // { icon: TrendingUp, text: program.equity },
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

          {program.promo_video && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="my-25 flex justify-center"
            >
              <a
                href={program.promo_video}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-white text-[#0D5BDC] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 ml-1" />
                </div>
                <span className="text-lg font-medium">
                  {language === "ar" ? "شاهد الفيديو التعريفي" : "Watch Promo Video"}
                </span>
              </a>
            </motion.div>
          )}

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
                value: formatDate(program.from_datetime || ""),
                color: theme.accent,
              },
              {
                icon: Calendar,
                label: language === "ar" ? "تاريخ الانتهاء" : "End Date",
                value: formatDate(program.to_datetime || ""),
                color: "#340F87",
              },
              {
                icon: Clock,
                label:
                  language === "ar"
                    ? "آخر موعد للتقديم"
                    : "Application Deadline",
                value: formatDate(program.last_registration_date || ""),
                color: "#00B0F0",
              },
              // {
              //   icon: Rocket,
              //   label: language === "ar" ? "حجم الدفعة" : "Batch Size",
              //   value: program.batchSize,
              //   color: "#4587F4",
              // },
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
            {programValues.map((value: any, index: number) => {
              const Icon = valueIcons[index % valueIcons.length];
              return (
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
                      className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      initial={{ scale: 0, borderRadius: "50%" }}
                      whileHover={{ scale: 2, borderRadius: "0%" }}
                      transition={{ duration: 0.5 }}
                    />

                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ rotate: [0, -15, 15, -15, 0], scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.gradient} mb-6 shadow-lg`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>

                      <h3 className="mb-3 text-xl text-[#262626] group-hover:text-white transition-colors duration-300">
                        {language === "ar" ? value.text_ar : value.text_en}
                      </h3>

                      <p className="text-[#262626]/70 group-hover:text-white/90 transition-colors duration-300">
                        {language === "ar" ? value.desc_ar : value.desc_en}
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
              );
            })}
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
            {focusAreas.map((area: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
              >
                <Badge
                  className={`px-8 py-4 text-lg bg-gradient-to-r ${theme.gradient} text-white border-0 rounded-full shadow-lg hover:shadow-2xl transition-all cursor-pointer`}
                >
                  {typeof area === 'string' ? area : (language === "ar" ? area.text_ar : area.text_en)}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Journey / Steps */}
      {progressSteps.length > 0 && (
        <section className="py-24 bg-white relative overflow-hidden">
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
                  <TrendingUp className="w-5 h-5 text-[#0D5BDC]" />
                  {language === "ar" ? "رحلة البرنامج" : "Program Journey"}
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
                  {language === "ar" ? "خطوات البرنامج" : "Program Timeline"}
                </motion.span>
              </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[#0D5BDC]/10 via-[#0D5BDC]/30 to-[#0D5BDC]/10 ${language === 'ar' ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} hidden md:block`} />

                {progressSteps.map((step: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex items-center justify-between mb-12 md:mb-24 ${index % 2 === 0 ? (language === 'ar' ? 'md:flex-row-reverse' : 'md:flex-row') : (language === 'ar' ? 'md:flex-row' : 'md:flex-row-reverse')} flex-col gap-8 md:gap-0`}
                  >
                    {/* Content */}
                    <div className={`w-full md:w-[45%] ${index % 2 === 0 ? (language === 'ar' ? 'text-right' : 'text-left') : (language === 'ar' ? 'text-left' : 'text-right text-left-mobile')}`}>
                      <div className={`p-8 rounded-3xl bg-white border border-[#F2F2F2] shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}>
                        <div className={`absolute top-0 w-2 h-full bg-gradient-to-b ${theme.gradient} ${language === 'ar' ? 'right-0' : 'left-0'}`} />

                        <div className="flex items-center gap-4 mb-4">
                          <span className={`flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${theme.gradient} text-white font-bold text-lg shadow-md`}>
                            {step.number || index + 1}
                          </span>
                          <h3 className="text-xl font-bold text-[#262626]">
                            {language === "ar" ? step.text_ar : step.text_en}
                          </h3>
                        </div>

                        {/* <p className="text-[#262626]/70 leading-relaxed">
                          {language === "ar" ? step.desc_ar : step.desc_en}
                        </p> */}
                      </div>
                    </div>

                    {/* Center Node */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-[#0D5BDC] rounded-full z-10 hidden md:block shadow-[0_0_0_4px_rgba(13,91,220,0.2)]" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-[#F9FAFB] to-white relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#0D5BDC]/10 to-[#340F87]/10 border border-[#0D5BDC]/20 mb-6">
                <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent flex items-center gap-2 justify-center">
                  <ImageIcon className="w-5 h-5 text-[#0D5BDC]" />
                  {language === "ar" ? "معرض الصور" : "Program Gallery"}
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl mb-6 font-bold">
                {language === "ar" ? "لحظات من البرنامج" : "Moments from the Program"}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((img: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg cursor-pointer"
                >
                  <ImageWithFallback
                    src={img}
                    alt={`Gallery Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Downloadable Resources */}
      {programDoc && (
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-3xl bg-gradient-to-br from-[#0D5BDC] to-[#340F87] text-white shadow-2xl relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />

              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-2">
                  {language === "ar" ? "حمل دليل البرنامج" : "Download Program Brochure"}
                </h3>
                <p className="text-white/80 text-lg">
                  {language === "ar" ? "احصل على كافة التفاصيل والمعلومات في ملف واحد" : "Get all the details and information in one file"}
                </p>
              </div>

              <div className="relative z-10 w-full md:w-auto">
                <a
                  href={programDoc.startsWith('http') || programDoc.startsWith('/api') ? programDoc : `/api/public/file?file_url=${encodeURIComponent(programDoc)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 bg-white text-[#0D5BDC] rounded-full font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  <Download className="w-5 h-5" />
                  {language === "ar" ? "تحميل الملف" : "Download PDF"}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Application Requirements */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative Background */}
        <motion.div
          className="absolute top-1/4 ltr:right-0 rtl:left-0 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${theme.accent}20` }}
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
              {requirements.map((req: any, index: number) => (
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
                        background: `radial-gradient(circle at center, ${theme.accent}20, transparent)`,
                      }}
                    />

                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="flex-shrink-0 relative z-10"
                    >
                      <CheckCircle2
                        className="w-7 h-7"
                        style={{ color: theme.accent }}
                      />
                    </motion.div>

                    <div className="relative z-10">
                      <p className="text-[#0D5BDC] font-semibold mb-1">
                        {language === "ar" ? req.text_ar : req.text_en}
                      </p>
                      <p className="text-[#262626]/70 text-sm">
                        {language === "ar" ? req.desc_ar : req.desc_en}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {documents.length > 0 && (
              <>
                <div className="flex items-center gap-4 my-12">
                  <div className="h-px bg-gradient-to-r from-transparent via-[#0D5BDC]/20 to-transparent flex-1" />
                  <span className="text-[#0D5BDC] font-semibold bg-[#F2F2F2]/50 px-4 py-1 rounded-full">
                    {language === "ar" ? "المستندات المطلوبة" : "Required Documents"}
                  </span>
                  <div className="h-px bg-gradient-to-r from-transparent via-[#0D5BDC]/20 to-transparent flex-1" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {documents.map((doc: any, index: number) => (
                    <motion.div
                      key={`doc-${index}`}
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
                            background: `radial-gradient(circle at center, ${theme.accent}20, transparent)`,
                          }}
                        />

                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="flex-shrink-0 relative z-10"
                        >
                          <FileText
                            className="w-7 h-7"
                            style={{ color: theme.accent }}
                          />
                        </motion.div>

                        <div className="relative z-10">
                          <p className="text-[#0D5BDC] font-semibold mb-1">
                            {language === "ar" ? doc.text_ar : doc.text_en}
                          </p>
                          <p className="text-[#262626]/70 text-sm">
                            {language === "ar" ? doc.desc_ar : doc.desc_en}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
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
                style={{ backgroundColor: theme.accent }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl"
                style={{ backgroundColor: theme.accent }}
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
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}
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
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}
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
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}
                    >
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    {language === "ar"
                      ? "المستندات المطلوبة"
                      : "Required Documents"}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {documents.map((doc: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className="space-y-3"
                      >
                        <Label className="text-[#262626]/80 flex flex-col gap-1">
                          <span className="font-semibold">{language === "ar" ? doc.text_ar : doc.text_en}</span>
                          <span className="text-sm text-muted-foreground">{language === "ar" ? doc.desc_ar : doc.desc_en}</span>
                          {/* {doc.required && (
                            <span className="text-red-500">*</span>
                          )} */}
                          <Badge variant="outline" className="w-fit">
                            PDF/Image
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
                    className={`w-full h-16 text-xl rounded-full bg-gradient-to-r ${theme.gradient} text-white border-0 hover:scale-105 transition-transform shadow-2xl relative overflow-hidden group`}
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
                            className={`w-6 h-6 ${language === "ar" ? "rotate-180" : ""
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
          background: `conic-gradient(${theme.accent} ${scaleProgress.get() * 100
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
            style={{ color: theme.accent }}
          />
        </motion.div>
      </motion.div>
    </div >
  );
}
