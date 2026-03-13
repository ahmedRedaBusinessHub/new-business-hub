import IncubationPage from "@/components/features/IncubationPage";

import { createGenerateMetadata } from "@/lib/geo";

export const generateMetadata = createGenerateMetadata("bookingIncubation");
export default function Incubation() {
  return <IncubationPage />;
}
