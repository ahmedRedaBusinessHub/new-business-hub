import ContactSection from "@/components/features/ContactSection";

import { createGenerateMetadata } from "@/lib/geo";

export const generateMetadata = createGenerateMetadata("contactUs");
export default function ContactUsPage() {
  return <ContactSection />;
}
