import PrivacyPage from "@/components/features/PrivacyPage";

import { createGenerateMetadata } from "@/lib/geo";
export const generateMetadata = createGenerateMetadata("privacy");

function Privacy() {
  return <PrivacyPage />;
}

export default Privacy;
