import { ReservationSite, ResyReservation } from './interface';
import { Venue } from './resy/constants';
import { handler } from './resy/handler';

const event: ResyReservation = {
  config: {
    venueId: Venue.WenWen,
    numSeats: 2,
    date: "2023-05-10",
    timeRange: {
      start: "18:10",
      end: "18:19"
    }
  },
  site: ReservationSite.Resy,
}

handler(event);