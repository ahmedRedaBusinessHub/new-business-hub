import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ExternalLink, Facebook, Twitter, Linkedin, Instagram, Youtube, Globe } from "lucide-react";
import { Badge } from "../ui/Badge";
import { useI18n } from "@/hooks/useI18n";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Project {
  id: number;
  title_ar?: string;
  title_en?: string;
  detail_ar?: string;
  detail_en?: string;
  main_image_url?: string;
  image_urls?: string[];
  type?: number;
  category_ids?: number[];
  categories?: Category[];
  link?: string;
  social_media?: any;
}

interface Category {
  id: number;
  name_ar?: string;
  name_en?: string;
}

interface ProjectsSectionProps {
  limit?: number;
}

const gradients = [
  "from-[#0D5BDC] to-[#340F87]",
  "from-[#00717D] to-[#005671]",
  "from-[#00B0F0] to-[#007D9B]",
  "from-[#340F87] to-[#0E3F9F]",
  "from-[#4587F4] to-[#0D5BDC]",
  "from-[#0A2F78] to-[#0E3F9F]",
];

export default function ProjectsSection({ limit = 6 }: ProjectsSectionProps) {
  const { t, language } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {

        const response = await fetch(`/api/public/projects-by-type?type=1&limit=${limit}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }

        const data = await response.json();
        setProjects(data.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const getProjectTitle = (project: Project) => {
    return language === "ar" ? project.title_ar : project.title_en;
  };

  const getProjectDescription = (project: Project) => {
    return language === "ar" ? project.detail_ar : project.detail_en;
  };

  const getProjectImage = (project: Project) => {
    return project.main_image_url || project.image_urls?.[0] || "";
  };

  const getProjectGradient = (index: number) => {
    return gradients[index % gradients.length];
  };

  const getCategoryName = (category: Category) => {
    return language === "ar" ? category.name_ar : category.name_en;
  };

  return (
    <section id="work" className="py-32 bg-white relative overflow-hidden">


      <div className="container mx-auto px-6 relative z-10" >
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
          {projects.map((project, index) => {
            const gradient = getProjectGradient(index);
            const title = getProjectTitle(project);
            const description = getProjectDescription(project);
            const image = getProjectImage(project);

            // Parse social media
            const socialMedia = typeof project.social_media === 'string'
              ? JSON.parse(project.social_media)
              : project.social_media || {};

            const hasMainLink = !!project.link;
            const hasSocialLinks = Object.keys(socialMedia).length > 0;

            const SocialIcon = ({ platform, className }: { platform: string, className?: string }) => {
              switch (platform.toLowerCase()) {
                case 'facebook': return <Facebook className={className} />;
                case 'twitter':
                case 'x': return <Twitter className={className} />;
                case 'linkedin': return <Linkedin className={className} />;
                case 'instagram': return <Instagram className={className} />;
                case 'youtube': return <Youtube className={className} />;
                default: return <Globe className={className} />;
              }
            };

            return (
              <motion.div
                key={project.id}
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
                      src={image}
                      alt={title || "Project"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-0 group-hover:opacity-90 transition-opacity duration-500 flex flex-col items-center justify-center gap-4`}
                    >
                      {/* Main Link */}
                      {hasMainLink && (
                        <Link href={project.link!} target="_blank" rel="noopener noreferrer">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors"
                          >
                            <ExternalLink className="w-8 h-8 text-white" />
                          </motion.div>
                        </Link>
                      )}

                      {/* Social Media Links */}
                      {hasSocialLinks && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3"
                        >
                          {Object.entries(socialMedia).map(([platform, url], i) => (
                            <Link
                              key={platform}
                              href={url as string}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.2, y: -2 }}
                                transition={{ delay: 0.1 + (i * 0.05) }}
                                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors"
                                title={platform}
                              >
                                <SocialIcon platform={platform} className="w-5 h-5 text-white" />
                              </motion.div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
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
                      {title}
                    </h3>
                    <p className="text-[#262626]/70 mb-4">
                      {description}
                    </p>

                    {/* Category Tags */}
                    {project.categories && project.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.categories.map((category) => (
                          <Badge
                            key={category.id}
                            variant="secondary"
                            className={`bg-gradient-to-r ${gradient} text-white border-none transition-shadow duration-300`}
                          >
                            {getCategoryName(category)}
                          </Badge>
                        ))}
                      </div>
                    )}                  </div>

                  {/* Bottom accent line */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                  ></div>
                </motion.div>

                {/* External glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 blur-2xl -z-10 rounded-3xl transition-opacity duration-500`}
                ></div>
              </motion.div>
            );
          })}
        </div>
      </div>
      {limit <= 6 && <div className="text-center pt-20   "  >
        <Link href={"/projects"}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#0D5BDC]/10 to-[#340F87]/10 border border-[#0D5BDC]/20 mb-4"
          >
            <span className="bg-gradient-to-r from-[#0D5BDC] to-[#340F87] bg-clip-text text-transparent">
              {t("hero_cta_discover")}
            </span>
          </motion.div>
        </Link>
      </div>}
    </section>
  );
}
