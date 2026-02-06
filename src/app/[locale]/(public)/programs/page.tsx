import ProgramsPage from "@/components/features/ProgramsPage";

import { createGenerateMetadata } from "@/lib/geo";

export const generateMetadata = createGenerateMetadata("allPrograms");

function Programs() {
  return <ProgramsPage />;
}

export default Programs;
