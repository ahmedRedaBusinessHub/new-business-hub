"use client";
import { Button } from "@/components/ui/Button";
import { Globe, Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import Logo from "../../features/Logo";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { locales } from "@/types/locales";
import { useI18n } from "@/hooks/useI18n";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

interface NavbarProps {}

export default function Navbar({}: NavbarProps) {
  const pathname = usePathname();
  const { user, status } = useUser();

  const { t, language } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const router = useRouter();

  const searchParams = useSearchParams();
  const getTargetPath = (lang: any) => {
    // preserve current path without the locale segment (if present)
    const currentPath = pathname || "/";
    const segments = currentPath.split("/");

    // segments[0] is empty string because path starts with '/'
    const segment = segments[1];
    if (segment && locales.includes(segment)) {
      segments.splice(1, 1);
    }
    const base = segments.join("/") || "/";
    const query = searchParams ? `?${searchParams.toString()}` : "";
    return `/${lang}${base}${query}`;
  };
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { labelKey: "nav_home", href: pathname == `/${language}` ? "#nav" : "/" },
    {
      labelKey: "nav_about",
      href: "/about-us",
    },
    {
      labelKey: "nav_services",
      href: pathname == `/${language}` ? "#services" : "/#services",
    },
    { labelKey: "nav_workspaces", href: "/workspaces" },
    { labelKey: "nav_getISO", href: "/iso" },
    { labelKey: "nav_follow", href: "/follow-us" },
  ];

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        id="nav"
        className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left"
        style={{
          scaleX,
          backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-end))`,
        }}
      />

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "py-2 sm:py-3" : "py-4 sm:py-6"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className={`rounded-2xl sm:rounded-3xl px-4 sm:px-8 py-4 sm:py-5 transition-all duration-500 ${
              isScrolled
                ? "glassmorphism"
                : "bg-white/10 dark:bg-black/10 backdrop-blur-xl"
            }`}
            style={{
              borderWidth: "1px",
              borderColor: isScrolled
                ? "var(--theme-border)"
                : "rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              {/* Logo Section */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-pointer relative z-10"
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 rounded-xl blur-xl opacity-0 hover:opacity-50 transition-opacity duration-300"
                    style={{ backgroundColor: "var(--theme-primary)" }}
                  />
                  <Logo
                    className="w-10 h-10 sm:w-14 sm:h-14 relative"
                    style={{
                      color: isScrolled ? "var(--theme-primary)" : "white",
                    }}
                  />
                </div>
                <div>
                  <span
                    className="text-xl sm:text-2xl bg-clip-text text-transparent block"
                    style={{
                      backgroundImage: isScrolled
                        ? `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`
                        : "linear-gradient(to right, white, rgba(255, 255, 255, 0.8))",
                    }}
                  >
                    بيزنس هب
                  </span>
                  <span
                    className="text-xs hidden sm:block"
                    style={{
                      color: isScrolled
                        ? "var(--theme-text-secondary)"
                        : "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Business Hub
                  </span>
                </div>
              </motion.div>

              {/* Desktop Menu */}
              <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      className="px-4 py-2 rounded-xl transition-all duration-300 relative group"
                      style={{
                        color: isScrolled
                          ? "var(--theme-text-primary)"
                          : "white",
                      }}
                    >
                      <span className="relative z-10">{t(item.labelKey)}</span>
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          backgroundImage: `linear-gradient(135deg, 
                            color-mix(in srgb, var(--theme-primary) 10%, transparent), 
                            color-mix(in srgb, var(--theme-accent) 10%, transparent))`,
                        }}
                      />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Right Side Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Contact Info - Hidden on mobile */}
                {/* <div className="hidden xl:flex items-center gap-4 ltr:mr-4 rtl:ml-4">
                  <a
                    href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 dark:hover:bg-white/5 transition-colors duration-300"
                  >
                    <Phone
                      className="w-4 h-4"
                      style={{ color: "var(--theme-accent)" }}
                    />
                    <span
                      className="text-sm"
                      style={{
                        color: isScrolled
                          ? "var(--theme-text-secondary)"
                          : "rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      {process.env.NEXT_PUBLIC_PHONE}
                    </span>
                  </a>
                </div> */}

                {/* Language Switcher */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      router.push(
                        getTargetPath(language == "ar" ? "en" : "ar")
                      );
                    }}
                    className="rounded-full hover:bg-white/20 dark:hover:bg-white/10 relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        backgroundImage: `linear-gradient(135deg, var(--theme-primary), var(--theme-accent))`,
                      }}
                    />
                    <Globe
                      className="w-5 h-5 relative z-10"
                      style={{
                        color: isScrolled
                          ? "var(--theme-text-primary)"
                          : "white",
                      }}
                    />
                  </Button>
                </motion.div>
                {/* Login Button */}
                <Button
                  onClick={() => {
                    router.push(user ? "/admin" : "/login");
                  }}
                  variant="outline"
                  className="hidden sm:inline-flex gap-2 px-5 py-2.5 text-sm font-medium transition-all duration-300 relative overflow-hidden group"
                  style={{
                    borderWidth: "2px",
                    borderColor: isScrolled
                      ? "var(--theme-primary)"
                      : "rgba(255, 255, 255, 0.9)",
                    color: isScrolled ? "var(--theme-primary)" : "white",
                    backgroundColor: isScrolled
                      ? "transparent"
                      : "rgba(255, 255, 255, 0.1)",
                    fontSize: "14px",
                  }}
                >
                  {user ? (
                    <span className="relative z-10">
                      {language === "ar" ? "لوحة التحكم" : "Control"}
                    </span>
                  ) : (
                    <span className="relative z-10">
                      {language === "ar" ? "تسجيل الدخول" : "Login"}
                    </span>
                  )}
                </Button>
                {/* CTA Button - Hidden on small screens */}
                <Button
                  onClick={() => {
                    router.push("/contact-us");
                  }}
                  className="hidden md:inline-flex transition-all duration-300 text-white border-0 relative overflow-hidden group"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--theme-gradient-mid), var(--theme-gradient-end))`,
                    }}
                  />
                  <span className="relative z-10">{t("nav_contact")}</span>
                </Button>

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden rounded-full hover:bg-white/20 dark:hover:bg-white/10"
                >
                  {isMobileMenuOpen ? (
                    <X
                      className="w-5 h-5"
                      style={{
                        color: isScrolled
                          ? "var(--theme-text-primary)"
                          : "white",
                      }}
                    />
                  ) : (
                    <Menu
                      className="w-5 h-5"
                      style={{
                        color: isScrolled
                          ? "var(--theme-text-primary)"
                          : "white",
                      }}
                    />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: language === "ar" ? -300 : 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: language === "ar" ? -300 : 300, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.6, 0.05, 0.01, 0.9] }}
              className={`fixed top-0 ${
                language === "ar" ? "left-0" : "right-0"
              } h-full w-80 max-w-[85vw] z-50 lg:hidden`}
              style={{ backgroundColor: "var(--theme-bg-primary)" }}
            >
              <div className="p-6 h-full flex flex-col">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Logo
                      className="w-12 h-12"
                      style={{ color: "var(--theme-primary)" }}
                    />
                    <span
                      className="text-xl bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                      }}
                    >
                      بيزنس هب
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-full"
                  >
                    <X
                      className="w-5 h-5"
                      style={{ color: "var(--theme-text-primary)" }}
                    />
                  </Button>
                </div>

                {/* Mobile Menu Items */}
                <nav className="flex-1 overflow-y-auto">
                  <ul className="space-y-2">
                    {menuItems.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <a
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-3 rounded-xl transition-all duration-300 hover:translate-x-2"
                          style={{
                            color: "var(--theme-text-primary)",
                            backgroundColor: "transparent",
                          }}
                          onMouseEnter={(e: any) => {
                            e.currentTarget.style.backgroundImage = `linear-gradient(135deg, 
                              color-mix(in srgb, var(--theme-primary) 10%, transparent), 
                              color-mix(in srgb, var(--theme-accent) 10%, transparent))`;
                          }}
                          onMouseLeave={(e: any) => {
                            e.currentTarget.style.backgroundImage = "none";
                          }}
                        >
                          {t(item.labelKey)}
                        </a>
                      </motion.li>
                    ))}
                    {/* Login Link for Mobile */}
                    <motion.li
                      initial={{ opacity: 0, x: language === "ar" ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: menuItems.length * 0.1 }}
                    >
                      <Link
                        href={user ? "/admin" : "/login"}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-5 py-4 rounded-xl transition-all duration-300 text-sm font-medium"
                        style={{
                          color: "var(--theme-primary)",
                          backgroundColor:
                            "color-mix(in srgb, var(--theme-primary) 10%, transparent)",
                          fontSize: "14px",
                        }}
                        onMouseEnter={(e: any) => {
                          e.currentTarget.style.backgroundImage = `linear-gradient(135deg, 
                            color-mix(in srgb, var(--theme-primary) 20%, transparent), 
                            color-mix(in srgb, var(--theme-accent) 20%, transparent))`;
                          e.currentTarget.style.transform =
                            language === "ar"
                              ? "translateX(-8px)"
                              : "translateX(8px)";
                        }}
                        onMouseLeave={(e: any) => {
                          e.currentTarget.style.backgroundColor =
                            "color-mix(in srgb, var(--theme-primary) 10%, transparent)";
                          e.currentTarget.style.backgroundImage = "none";
                          e.currentTarget.style.transform = "translateX(0)";
                        }}
                      >
                        {user ? (
                          <>{language === "ar" ? "لوحة التحكم" : "Control"}</>
                        ) : (
                          <>{language === "ar" ? "تسجيل الدخول" : "Login"}</>
                        )}
                      </Link>
                    </motion.li>
                  </ul>
                </nav>

                {/* Mobile Menu Footer */}
                <div className="mt-8 space-y-4">
                  <Button
                    onClick={() => {
                      router.push("/contact-us");
                    }}
                    className="w-full text-white border-0"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--theme-gradient-start), var(--theme-gradient-mid))`,
                    }}
                  >
                    {t("nav_contact")}
                  </Button>

                  <div className="flex items-center gap-3 p-4 rounded-xl glassmorphism">
                    <Phone
                      className="w-5 h-5"
                      style={{ color: "var(--theme-accent)" }}
                    />
                    <div>
                      <p
                        className="text-xs"
                        style={{ color: "var(--theme-text-secondary)" }}
                      >
                        {t("footer_contact")}
                      </p>
                      <a
                        href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}
                        className="text-sm"
                        style={{ color: "var(--theme-text-primary)" }}
                      >
                        {process.env.NEXT_PUBLIC_PHONE}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
