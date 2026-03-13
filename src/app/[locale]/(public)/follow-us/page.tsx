import FollowUsPage from "@/components/features/FollowUs";
import { createGenerateMetadata } from "@/lib/geo";
export const generateMetadata = createGenerateMetadata("followUs");
export default function FollowUs() {
  return <FollowUsPage />;
}
