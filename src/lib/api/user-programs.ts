import { apiGet, apiPost } from '../api';

const ENDPOINT = "/user-program";

export async function getMyApplications() {
    return apiGet(`${ENDPOINT}/my-applications`, { requireAuth: true });
}

export async function apply(data: any) {
    return apiPost(`${ENDPOINT}/apply`, data, { requireAuth: true });
}

export async function uploadApplicationDocuments(formData: FormData) {
    // Note: handling FormData with node-fetch or native fetch in specific ways might be needed
    // But apiPost stringifies body by default.
    // We might need a custom handling for FormData in api.ts or here.
    // For now, let's assume we can pass it if we handle headers manually.
    // But apiPost sets Content-Type: application/json. 
    // This might fail for FormData.
    // skipping implementation for now as it is not needed for My Programs list.
    throw new Error("Not implemented");
}
