export enum ReservationSite {
  Resy = 'resy',
}

export type TimeRange = {
  start: string,
  end: string,
};

type ResyConfig = {
  venueId: string,
  numSeats: number,
  date: string,
  timeRange?: TimeRange
}

interface Reservation {
  site: ReservationSite,
}

export interface ResyReservation extends Reservation {
  site: ReservationSite.Resy,
  config: ResyConfig
}

export type ReservationTypes = ResyReservation;

export interface ReservationResponse {
  message: string;
}

export type ScheduleConfig = { daysInAdvance: number, time: string }
