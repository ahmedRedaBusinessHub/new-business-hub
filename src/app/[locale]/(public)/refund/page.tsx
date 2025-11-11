import RefundPage from "@/components/features/RefundPage";

import { createGenerateMetadata } from "@/lib/geo";
export const generateMetadata = createGenerateMetadata("refund");

function Refund() {
  return <RefundPage />;
}

export default Refund;
