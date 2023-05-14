import axios from "axios";
import { TimeRange } from "../interface";

const baseUrl = 'https://api.resy.com'

const getEstDatetime = (date: string | number | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    timeZone: 'America/New_York'
  });
}

export class ResyClient {
  public apiKey: string;
  public email: string;
  public password: string;
  public authToken: string | undefined;
  public paymentMethodId: string | undefined;
  
  constructor(apiKey: string, email: string, password: string) {
    this.apiKey = apiKey
    this.email = email;
    this.password = password;
  }

  static authorization(apiKey: string): string {
    return `ResyAPI api_key="${apiKey}"`
  }

  async setAuthInfo(): Promise<void> {
    const authUrl = `${baseUrl}/3/auth/password`

    const form = new URLSearchParams()
    form.append('email', this.email)
    form.append('password', this.password)

    try {
      const response = await axios.post(authUrl, form.toString(), {
        headers: {
          Authorization: ResyClient.authorization(this.apiKey),
          Origin: 'https://widgets.resy.com/',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      });

      this.authToken = response.data.token;
      this.paymentMethodId = response.data.payment_method_id
    } catch (err: any) {
      throw new Error(`GetAuthToken ${err.response?.message || err.message}`);
    }
  }

  async findAvailabilities(venueId: string, numSeats: number, day: string, timeRange: TimeRange | undefined): Promise<string[]> {
    const findUrl = `${baseUrl}/4/find`;

    const queryParams = new URLSearchParams({
      venue_id: venueId,
      party_size: numSeats.toString(),
      day,
      lat: '0',
      long: '0'
    });
    try {
      const response = await axios.get(`${findUrl}?${queryParams.toString()}`, {
        headers: {
          Authorization: ResyClient.authorization(this.apiKey),
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-resy-auth-token': this.authToken,
        }
      })
      const venues: any[] = response.data.results.venues;
      if (venues.length === 0) {
        throw new Error(`There are no venues matching venueId ${venueId}`);
      }

      const slots = venues[0].slots
      if (slots.length === 0) {
        throw new Error(`There are no slots matching your criteria`);
      }

      let matchingSlots = slots;
      if (timeRange !== undefined) {
        matchingSlots = slots.filter((slot: any) => {
          const slotStartTime = getEstDatetime(slot.date.start);
          const desireTimeRangeStart = getEstDatetime(`${day} ${timeRange.start}`);
          const desireTimeRangeEnd = getEstDatetime(`${day} ${timeRange.end}`);
          return slotStartTime > desireTimeRangeStart && slotStartTime < desireTimeRangeEnd;
        })
      }

      return matchingSlots.map((slot: { config: { token: string } }) => slot.config.token)
    } catch (err: any) {
      throw new Error(`FindReservation ${err.response?.message || err.message}`);
    }
  }

  async getDetails(numSeats: number, day: string, configId: string): Promise<string> {
    const detailsUrl = `${baseUrl}/3/details`;

    const queryParams = new URLSearchParams({
      party_size: numSeats.toString(),
      day,
      config_id: configId,
    });

    try {
      const response = await axios.get(`${detailsUrl}?${queryParams.toString()}`, {
        headers: {
          Authorization: ResyClient.authorization(this.apiKey),
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-resy-auth-token': this.authToken,
        }
      })
      return response.data.book_token.value;
    } catch (err: any) {
      throw new Error(`GetDetails ${err.response?.message || err.message}`);
    }
  }

  async makeReservation(bookToken: string) {
    const bookUrl = `${baseUrl}/3/book`;
    const form = new URLSearchParams();
    form.append('book_token', bookToken);
    form.append('source_id', 'resy.com-venue-details')
    form.append('struct_payment_method', JSON.stringify({id: this.paymentMethodId}))

    try {
      const response = await axios.post(bookUrl, form.toString(), {
        headers: {
          Authorization: ResyClient.authorization(this.apiKey),
          'x-resy-auth-token': this.authToken,
          Origin: 'https://widgets.resy.com/',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      })

      return response.data;
    } catch (err: any) {
      throw new Error(`MakeReservation ${err.response?.data || err.response?.message || err.message}`);
    }
  }
}