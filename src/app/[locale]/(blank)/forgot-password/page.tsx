import ForgotPasswordPage from "@/components/features/ForgotPasswordPage";
import { createGenerateMetadata } from "@/lib/geo";

export const generateMetadata = createGenerateMetadata("forgot-password");
// Correct structure for a page.tsx
interface ForgotPasswordProps {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function ForgotPassword({
  params,
  searchParams,
}: ForgotPasswordProps) {
  return <ForgotPasswordPage />;
}
