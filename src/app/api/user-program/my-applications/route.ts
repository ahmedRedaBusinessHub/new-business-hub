import { getMyApplications } from "@/lib/api/user-programs";
import { handleApiRequest } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
    return handleApiRequest(
        () => getMyApplications(),
        { successStatus: 200 }
    );
}
