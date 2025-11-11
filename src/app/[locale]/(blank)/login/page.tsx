import LoginPage from "@/components/features/LoginPage";
import { createGenerateMetadata } from "@/lib/geo";

export const generateMetadata = createGenerateMetadata("login");
// Correct structure for a page.tsx
interface LoginPageProps {
  params: { locale: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Login({ params, searchParams }: LoginPageProps) {
  return <LoginPage />;
}
