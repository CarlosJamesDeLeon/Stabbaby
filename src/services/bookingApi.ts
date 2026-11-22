import { ApiErrorBody, BookingRequest, BookingResponse } from '../types/booking';

const BASE_URL = '/api/bookings';

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(status: number, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}


async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Please try again in a moment.');
  }

  if (!response.ok) {
    let body: Partial<ApiErrorBody> = {};
    try {
      body = await response.json();
    } catch {
      
    }
    throw new ApiError(
      response.status,
      body.message ?? 'Something went wrong. Please try again.',
      body.errors
    );
  }

  return response.json() as Promise<T>;
}

export const bookingApi = {
  createBooking(payload: BookingRequest): Promise<BookingResponse> {
    return request<BookingResponse>(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  getBooking(referenceCode: string, contactNumber: string): Promise<BookingResponse> {
    const params = new URLSearchParams({ contactNumber });
    return request<BookingResponse>(
      `${BASE_URL}/${encodeURIComponent(referenceCode.trim())}?${params}`
    );
  },

  cancelBooking(referenceCode: string, contactNumber: string): Promise<BookingResponse> {
    return request<BookingResponse>(
      `${BASE_URL}/${encodeURIComponent(referenceCode.trim())}/cancel`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactNumber }),
      }
    );
  },
};