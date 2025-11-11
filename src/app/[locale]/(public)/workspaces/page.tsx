import WorkspacesPage from "@/components/features/WorkspacesPage";

import { createGenerateMetadata } from "@/lib/geo";
export const generateMetadata = createGenerateMetadata("workspaces");

function Workspaces() {
  return <WorkspacesPage />;
}

export default Workspaces;
