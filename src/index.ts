import { Context } from "aws-lambda";
import { ReservationSite, ReservationTypes } from "./interface";
import { handler as resyHandler } from "./resy/handler";

interface ReservationResponse {
  message: string;
}

export const handler = async (event: ReservationTypes, context: Context): Promise<ReservationResponse> => {
  if (event.site === ReservationSite.Resy) {
    return resyHandler(event);
  } else {
    throw new Error(`${event.site} must be one of ${Object.values(ReservationSite).join(', ')}`);
  }
}