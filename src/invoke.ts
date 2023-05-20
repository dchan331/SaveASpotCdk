import { ReservationSite, ResyReservation } from './interface';
import { Venue } from './resy/constants';
import { handler } from './resy/handler';

const event: ResyReservation = {
  config: {
    venueId: Venue.WenWen,
    numSeats: 2,
    date: "2023-06-02",
    timeRange: {
      start: "18:00",
      end: "18:30"
    }
  },
  site: ReservationSite.Resy,
}

handler(event);