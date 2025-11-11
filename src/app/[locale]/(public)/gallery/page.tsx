import GalleryPage from "@/components/features/GalleryPage";
import { createGenerateMetadata } from "@/lib/geo";
export const generateMetadata = createGenerateMetadata("gallery");

function Gallery() {
  return <GalleryPage />;
}

export default Gallery;
