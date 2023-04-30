import { ReservationSite, ResyReservation } from './interface';
import { handler } from './resy/handler';

const event: ResyReservation = {
  config: {
    venueId: "59536",
    numSeats: 2,
    date: "2023-05-14"
  },
  site: ReservationSite.Resy,
}

handler(event);