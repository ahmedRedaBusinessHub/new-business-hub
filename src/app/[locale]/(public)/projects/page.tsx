import OurWorkPage from "@/components/features/OurWorkPage";

import { createGenerateMetadata } from "@/lib/geo";
export const generateMetadata = createGenerateMetadata("projects");

function Projects() {
  return <OurWorkPage />;
}

export default Projects;
