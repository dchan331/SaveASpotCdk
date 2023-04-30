import { ResyClient } from "./resyClient";
import { ReservationResponse, ResyReservation } from '../interface'

export const handler = async (event: ResyReservation): Promise<ReservationResponse> => {
  try {
    const { venueId, numSeats, date } = event.config;
    const apiKey = process.env.RESY_API_KEY!;
    const email = process.env.RESY_EMAIL!;
    const password = process.env.RESY_PASSWORD!;

    const resyClient = new ResyClient(apiKey, email, password);
    await resyClient.setAuthInfo();
    const configIds = await resyClient.findAvailabilities(venueId, numSeats, date);
    let madeReservation = false;
    let index = 0;

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