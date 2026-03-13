import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SpaceGallery } from "@/components/features/spaces/space-gallery";

const mockImages = [
    { id: 1, image_url: "/main.jpg", display_order: 1, is_main: true, caption_en: "Main" },
    { id: 2, image_url: "/thumb.jpg", display_order: 2, is_main: false, caption_en: "Thumb 1" },
];

describe("SpaceGallery", () => {
    it("renders empty state", () => {
        render(<SpaceGallery images={[]} />);
        expect(screen.getByText("No images available")).toBeInTheDocument();
    });

    it("renders images", () => {
        render(<SpaceGallery images={mockImages} />);

        // Using test ID or alt text to ensure image exists
        const mainImg = screen.getByAltText("Main");
        expect(mainImg).toBeInTheDocument();

        const thumbImg = screen.getByAltText("Thumb 1");
        expect(thumbImg).toBeInTheDocument();
    });
});
