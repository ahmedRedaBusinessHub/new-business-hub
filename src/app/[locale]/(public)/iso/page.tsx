import ISOPage from "@/components/features/ISOPage";

import { createGenerateMetadata } from "@/lib/geo";

export const generateMetadata = createGenerateMetadata("bookingISO");
export default function ISO() {
  return <ISOPage />;
}
