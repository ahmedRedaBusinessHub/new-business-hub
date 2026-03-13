import TeamPage from "@/components/features/TeamPage";

import { createGenerateMetadata } from "@/lib/geo";
export const generateMetadata = createGenerateMetadata("teams");

function Team() {
  return <TeamPage />;
}

export default Team;
