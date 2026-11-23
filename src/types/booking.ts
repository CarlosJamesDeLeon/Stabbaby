export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';


export interface BookingRequest {
  fullName: string;
  contactNumber: string;
  preferredDate: string;
  preferredTime: string; 
  piercingType: string;
  notes?: string;
}


export interface BookingResponse {
  referenceCode: string;
  fullName: string;
  contactNumber: string;
  preferredDate: string;
  preferredTime: string;
  piercingType: string;
  notes: string | null;
  status: BookingStatus;
  createdAt: string;
}


export interface ApiErrorBody {
  status: number;
  message: string;
  errors?: Record<string, string>;
}