export enum ReservationSite {
  Resy = 'resy',
  Tock = 'tock',
  OpenTable = 'opentable'
}

type ResyConfig = {
  venueId: string,
  numSeats: number,
  date: string,
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
