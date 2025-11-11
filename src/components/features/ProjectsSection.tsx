import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ExternalLink } from "lucide-react";
import { Badge } from "../ui/Badge";
import { useI18n } from "@/hooks/useI18n";
import Link from "next/link";

interface ProjectsSectionProps {}

export default function ProjectsSection({}: ProjectsSectionProps) {
  const { t } = useI18n();
  const projects = [
    {
      title: t("E-Learning Platform"),
      description: t(
        "An integrated educational platform offering courses in various fields"
      ),
      image:
        "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3dvcmtpbmclMjBzcGFjZXxlbnwxfHx8fDE3NjI0MTY3NTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: [t("Education"), t("Technology")],
      gradient: "from-[#0D5BDC] to-[#340F87]",
    },
    {
      title: t("Application Express Delivery"),
      description: t(
        "An express delivery app that connects customers with service providers"
      ),
      image:
        "https://images.unsplash.com/photo-1694702740570-0a31ee1525c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjI0MDUzMjh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: [t("Services"), t("Apps")],
      gradient: "from-[#00717D] to-[#005671]",
    },
    {
      title: t("Inventory Management System"),
      description: t(
        "An intelligent inventory and sales management system for small businesses"
      ),
      image:
        "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMGNoYXJ0fGVufDF8fHx8MTc2MjQ2MjQ3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: [t("Management"), t("Software")],
      gradient: "from-[#00B0F0] to-[#007D9B]",
    },
    {
      title: t("Smart Booking Platform"),
      description: t("A platform for easily booking appointments and services"),
      image:
        "https://images.unsplash.com/photo-1518107616985-bd48230d3b20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwdGVhbSUyMG1lZXRpbmd8ZW58MXx8fHwxNzYyNDA2OTI2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      tags: [t("Booking"), t("Services")],
      gradient: "from-[#340F87] to-[#0E3F9F]",
    },
    {
      title: t("Health and Fitness App"),
      description: t("A comprehensive app for tracking health and fitness"),
      image:
        "https://images.unsplash.com/photo-1630344745908-ed5ffd73199a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjZXNzZnVsJTIwZW50cmVwcmVuZXVyfGVufDF8fHx8MTc2MjQ4ODE0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: [t("Health"), t("Applications")],
      gradient: "from-[#4587F4] to-[#0D5BDC]",
    },
    {
      title: t("Electronic Payment System"),
      description: t("Secure and easy-to-use electronic payment solutions"),
      image:
        "https://images.unsplash.com/photo-1575956011521-4d7f5cf0b18e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzJTIwaGFuZHNoYWtlfGVufDF8fHx8MTc2MjQzNjQ4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      tags: [t("Finance"), t("Technology")],
      gradient: "from-[#0A2F78] to-[#0E3F9F]",
    },
  ];

  return (
    <section id="work" className="py-32 bg-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D5BDC]/5 via-[#340F87]/5 to-[#00B0F0]/5 opacity-50"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgb(13 91 220 / 0.1) 1px, transparent 0)",
            backgroundSize: "50px 50px",
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
            className="inline-block px-4 py-2 rounded-full bg-white border border-[#F2F2F2] mb-4"
          >
            <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent">
              {t("Our Work")}
            </span>
          </motion.div>
          <h2 className="mb-4 bg-gradient-to-r from-[#262626] to-[#0A2F78] bg-clip-text text-transparent">
            {t("Our Projects")}
          </h2>
          <p className="text-[#262626]/70 max-w-2xl mx-auto">
            {t(
              "A collection of successful projects that we helped develop and launch"
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <motion.div
                whileHover={{ y: -10 }}
                className="relative h-full overflow-hidden rounded-3xl bg-white transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${project.gradient} opacity-0 group-hover:opacity-80 transition-opacity duration-500 flex items-center justify-center`}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                    >
                      <ExternalLink className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>

                  {/* Floating badge */}
                  <motion.div
                    className="absolute top-4 left-4"
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <div className="px-3 py-1 rounded-full glassmorphism text-white text-sm">
                      #{index + 1}
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="mb-3 text-[#262626] group-hover:bg-gradient-to-r group-hover:from-[#0D5BDC] group-hover:to-[#340F87] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {project.title}
                  </h3>
                  <p className="text-[#262626]/70 mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className={`bg-gradient-to-r ${project.gradient} text-white border-none transition-shadow duration-300`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${project.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                ></div>
              </motion.div>

              {/* External glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-20 blur-2xl -z-10 rounded-3xl transition-opacity duration-500`}
              ></div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="text-center pt-20 ">
        <Link href={"/projects"}>
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
    </section>
  );
}
