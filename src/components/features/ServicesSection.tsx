import { motion } from "motion/react";
import { Rocket, Building2, Award, Briefcase } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";
import Link from "next/link";

interface ServicesSectionProps {}

export default function ServicesSection({}: ServicesSectionProps) {
  const { t } = useI18n();
  const services = [
    {
      title: t("Business Accelerators"),
      description: t(
        "Intensive programs to accelerate your projects growth and professional development"
      ),
      icon: Rocket,
      gradient: "from-[#0D5BDC] to-[#4587F4]",
      href: "/accelerator",
    },
    {
      title: t("Business Incubation"),
      description: t(
        "We provide a supportive environment to incubate your project from idea to implementation"
      ),
      icon: Building2,
      gradient: "from-[#340F87] to-[#0E3F9F]",
      href: "/incubation",
    },
    {
      title: t("ISO Certifications"),
      description: t(
        "We help you obtain internationally recognized ISO certifications"
      ),
      icon: Award,
      gradient: "from-[#00B0F0] to-[#007D9B]",
      href: "/iso",
    },
    {
      title: t("Workspaces"),
      description: t(
        "Shared workspaces equipped with the latest technologies and facilities"
      ),
      icon: Briefcase,
      gradient: "from-[#00717D] to-[#005671]",
      href: "/workspaces",
    },
  ];

  return (
    <section id="services" className="py-32 bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(13 91 220 / 0.15) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

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
              {t("services_badge")}
            </span>
          </motion.div>
          <h2 className="mb-4 bg-gradient-to-r from-[#262626] to-[#0A2F78] bg-clip-text text-transparent">
            {t("companyService")}
          </h2>
          <p className="text-[#262626]/70 max-w-2xl mx-auto">
            {t("companyServiceDoc")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Link href={service.href} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                {/* Main card */}
                <div className="relative h-full p-8 rounded-3xl bg-gradient-to-br from-[#F2F2F2] to-white border border-[#F2F2F2] hover:border-transparent transition-all duration-500 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>

                  {/* Blur overlay on hover */}
                  <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-sm transition-all duration-500"></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} mb-6 transition-shadow duration-300`}
                    >
                      <service.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="mb-3 text-[#262626] group-hover:text-white transition-colors duration-300">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#262626]/70 group-hover:text-white/90 transition-colors duration-300">
                      {service.description}
                    </p>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>
                </div>

                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-30 blur-2xl -z-10 transition-opacity duration-500`}
                ></div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
