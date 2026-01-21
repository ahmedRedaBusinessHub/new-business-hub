import NewsPage from "@/components/features/NewsPage";
import { createGenerateMetadata } from "@/lib/geo";

export const generateMetadata = createGenerateMetadata("news");

export default function News() {
    return <NewsPage />;
} 
