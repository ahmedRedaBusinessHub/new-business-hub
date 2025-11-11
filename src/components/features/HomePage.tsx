"use client";
import HeroSection from "@/components/features/HeroSection";
import PartnersSection from "@/components/features/PartnersSection";
import ValuesSection from "@/components/features/ValuesSection";
import StatsSection from "@/components/features/StatsSection";
import ServicesSection from "@/components/features/ServicesSection";
import RequirementsSection from "@/components/features/RequirementsSection";
import StagesSection from "@/components/features/StagesSection";
import CompaniesSection from "@/components/features/CompaniesSection";
import ProjectsSection from "@/components/features/ProjectsSection";
import GallerySection from "@/components/features/GallerySection";
import AboutSection from "@/components/features/AboutSection";
import MissionSection from "@/components/features/MissionSection";
import CEOSection from "@/components/features/CEOSection";
import ReviewsSection from "@/components/features/ReviewsSection";
import NewsSection from "@/components/features/NewsSection";
import { useParams } from "next/navigation";
import { useI18n } from "@/hooks/useI18n";

interface HomePageProps {}

export default function HomePage({}: HomePageProps) {
  return (
    <>
      <HeroSection />
      <PartnersSection />
      <ValuesSection />
      <StatsSection />
      <AboutSection />
      <MissionSection />
      <ServicesSection />
      <RequirementsSection />
      <StagesSection />
      <CompaniesSection />
      <CEOSection />
      <ReviewsSection />
      <ProjectsSection />
      <GallerySection />
      <NewsSection />
    </>
  );
}
