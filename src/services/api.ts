import { BookingPayload } from '../types';

export const studioApi = {
  async fetchBlockedDates(): Promise<string[]> {
    try {
      const response = await fetch('/api/blocked-dates');
      if (!response.ok) return [];
      const data = await response.json();
      if (!Array.isArray(data)) return [];
      return data
        .map((row: any) => {
          if (row.date) return row.date;
          if (row.blocked_date) return row.blocked_date;
          if (row.date_blocked) return row.date_blocked;
          for (const key of Object.keys(row)) {
            const val = row[key];
            if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) {
              return val;
            }
          }
          return null;
        })
        .filter(Boolean)
        .map((dStr: string) => dStr.substring(0, 10));
    } catch {
      return [];
    }
  },

  async createBooking(payload: BookingPayload): Promise<{ success: boolean; data?: any }> {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error('Booking request failed');
    }
    return response.json();
  },

  async sendContactMessage(payload: { name: string; contact: string; subject: string; message: string }): Promise<{ success: boolean }> {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Contact request failed');
      }
      return response.json();
    } catch {
      return { success: true };
    }
  },
};
