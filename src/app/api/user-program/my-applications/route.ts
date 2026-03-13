import { getMyApplications } from "@/lib/api/user-programs";
import { handleApiRequest } from "@/lib/api";

export async function GET() {
    return handleApiRequest(
        () => getMyApplications(),
        { successStatus: 200 }
    );
}
