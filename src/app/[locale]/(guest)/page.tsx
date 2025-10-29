import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
          Next.js Enterprise Application
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
          A scalable, secure application with multi-theme support, role-based authentication,
          and internationalization built with Next.js 16.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
