import AcceleratorPage from "@/components/features/AcceleratorPage";

import { createGenerateMetadata } from "@/lib/geo";

export const generateMetadata = createGenerateMetadata("bookingAccelerator");
function Accelerator() {
  return <AcceleratorPage />;
}

export default Accelerator;
