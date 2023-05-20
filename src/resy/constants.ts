import { ScheduleConfig } from "../interface";

export enum Venue {
  LaserWolfBrooklyn = '58848',
  WenWen = '59536',
  LArtusi = '25973',
  JeJuNoodleBar = '1543',
  Lilia = '418',
  SixtyThreeClinton = '52711',
  Carbone = '6194',
  ISodi = '443',
  Rezdora = '5771',
  DonAngie = '1505',
  Ariari = '65520',
  CharesPrimeRib = '834'
}

// Days in advance does not include today
// If today is Saturday May 20, Friday May 26 is 6 days away
export const scheduleConfigByVenue: { [key in Venue]: ScheduleConfig } = {
  [Venue.LaserWolfBrooklyn]: {
    time: '10:00',
    daysInAdvance: 21
  },
  [Venue.LArtusi]: {
    time: '09:00',
    daysInAdvance: 14
  },
  [Venue.Lilia]: {
    time: '10:00',
    daysInAdvance: 27
  },
  [Venue.JeJuNoodleBar]: {
    time: '10:00', // Not sure what time tbh
    daysInAdvance: 29
  },
  [Venue.SixtyThreeClinton]: {
    time: '00:00',
    daysInAdvance: 21
  },
  [Venue.WenWen]: {
    time: '00:00',
    daysInAdvance: 14
  },
  [Venue.Carbone]: {
    time: '10:00',
    daysInAdvance: 29
  },
  [Venue.ISodi]: {
    time: '00:00',
    daysInAdvance: 13
  },
  [Venue.Rezdora]: {
    time: '09:00',
    daysInAdvance: 29
  },
  [Venue.DonAngie]: {
    time: '09:00',
    daysInAdvance: 6
  },
  [Venue.Ariari]: {
    time: '00:00',
    daysInAdvance: 29
  },
  [Venue.CharesPrimeRib]: {
    time: '09:00',
    daysInAdvance: 20
  }
}