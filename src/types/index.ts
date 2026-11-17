export interface PiercingItem {
  id: string;
  category: 'ear' | 'nose' | 'lip' | 'eyebrow' | 'dermal' | 'body';
  title: string;
  price: string;
  description: string;
  image: string;
  spanClass?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  shiftDown?: boolean;
}

export interface StudioHour {
  days: string;
  time: string;
}

export interface BookingPayload {
  full_name: string;
  contact_number: string;
  preferred_date: string;
  preferred_time: string;
  piercing_type: string;
  message?: string;
}

export interface ContactPayload {
  name: string;
  contact: string;
  subject: string;
  message: string;
}
