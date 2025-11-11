import TermsPage from "@/components/features/TermsPage";

import { createGenerateMetadata } from "@/lib/geo";
export const generateMetadata = createGenerateMetadata("terms");

function Terms() {
  return <TermsPage />;
}

export default Terms;
