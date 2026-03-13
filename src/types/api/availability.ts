export interface AvailabilityValidation {
    code: string;
    message: string;
    passed: boolean;
}

export interface AvailabilityResponse {
    status: number;
    available: boolean;
    total_quantity?: number;
    booked_quantity?: number;
    available_quantity?: number;
    start_datetime?: string;
    end_datetime?: string;
    message?: string;
    validations?: AvailabilityValidation[];
}

export interface TimeSlot {
    start_time: string;
    end_time: string;
    is_available: boolean;
    price?: number;
}

export interface AvailabilityRequest {
    space_id: number;
    start_datetime: string;
    end_datetime: string;
    attendees?: number;
}
