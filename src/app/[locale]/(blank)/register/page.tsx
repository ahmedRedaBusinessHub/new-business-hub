import RegisterPage from "@/components/features/RegisterPage";
import { createGenerateMetadata } from "@/lib/geo";

export const generateMetadata = createGenerateMetadata("register");
// Correct structure for a page.tsx
interface RegisterProps {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Register({ params, searchParams }: RegisterProps) {
  return <RegisterPage />;
}
