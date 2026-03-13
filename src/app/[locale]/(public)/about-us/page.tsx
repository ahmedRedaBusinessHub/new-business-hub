import AboutPage from "@/components/features/AboutPage";
import { createGenerateMetadata } from "@/lib/geo";

export const generateMetadata = createGenerateMetadata("about");
function AboutUs() {
  return <AboutPage />;
}

export default AboutUs;
