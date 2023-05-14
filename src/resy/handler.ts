import { ResyClient } from "./resyClient";
import { ReservationResponse, ResyReservation } from '../interface'

export const handler = async (event: ResyReservation): Promise<ReservationResponse> => {
  try {
    const { venueId, numSeats, date, timeRange } = event.config;
    const apiKey = process.env.RESY_API_KEY!;
    const email = process.env.RESY_EMAIL!;
    const password = process.env.RESY_PASSWORD!;

    const resyClient = new ResyClient(apiKey, email, password);
    await resyClient.setAuthInfo();
    const configIds = await resyClient.findAvailabilities(venueId, numSeats, date, timeRange);
    let madeReservation = false;
    let index = 0;
    if (configIds.length === 0) {
      throw new Error('There are no availabilities that fit your criteria');
    } 
    while (!madeReservation && index < configIds.length) {
      const configId = configIds[index];
      const bookToken = await resyClient.getDetails(numSeats, date, configId);
      await resyClient.makeReservation(bookToken);
      madeReservation = true;
    }

    return {
      message: "success"
    }
  } catch (err: any) {
    throw new Error(err.message);
  }
}