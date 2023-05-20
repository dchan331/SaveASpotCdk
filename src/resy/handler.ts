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

    if (configIds.length === 0) {
      throw new Error('There are no availabilities that fit your criteria');
    }
    let madeReservation = false;
    let index = 0;
    let reservedConfig = undefined
    while (!madeReservation && index < configIds.length) {
      const configId = configIds[index];
      try {
        const bookToken = await resyClient.getDetails(numSeats, date, configId);
        await resyClient.makeReservation(bookToken);
        reservedConfig = configId
        madeReservation = true;
      } catch (e: any) {
        index += 1
      }
    }
    if (reservedConfig) {
      const message = `Successfully made reservation for config ${reservedConfig}`
      console.log(message)
      return {
        message
      }
    }
    const message = `Failed to reserve anything for ${JSON.stringify(event, null, 2)}`
    console.log(message)
    throw new Error(message)
  } catch (err: any) {
    throw new Error(err.message);
  }
}