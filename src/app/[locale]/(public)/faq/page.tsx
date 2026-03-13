import FAQPage from "@/components/features/FAQPage";
import { createGenerateMetadata } from "@/lib/geo";

export const generateMetadata = createGenerateMetadata("faq");
function FAQ() {
  return <FAQPage />;
}

export default FAQ;
