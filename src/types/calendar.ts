export interface TimeSlotAvailability {
  time: string;
  available: boolean;
  walkInHour: boolean;
}

export interface DayAvailabilityResponse {
  date: string;
  blocked: boolean;
  blockedReason: string | null;
  walkInDay: boolean;
  walkInHours: string | null;
  fullyBooked: boolean;
  slots: TimeSlotAvailability[];
}

export interface UnavailableDateItem {
  date: string;
  type: 'BLOCKED' | 'FULLY_BOOKED';
  reason?: string | null;
}

export interface UnavailableDatesResponse {
  unavailableDates: string[];
  blockedDates: string[];
  fullyBookedDates: string[];
  details: UnavailableDateItem[];
}
