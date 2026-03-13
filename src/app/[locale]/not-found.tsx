import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {
    const t = useTranslations();

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-extrabold tracking-tight mb-4 text-primary">404</h1>
            <h2 className="text-2xl font-bold mb-4">{t('common_not_found_title') || "Page Not Found"}</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                {t('common_not_found_description') || "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed."}
            </p>
            <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
                {t('common_return_home') || "Return Home"}
            </Link>
        </div>
    );
}
