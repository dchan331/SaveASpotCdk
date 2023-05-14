import { ScheduleConfig } from "../interface";

export enum Venue {
  LaserWolfBrooklyn = '58848',
  WenWen = '59536',
  LArtusi = '25973',
  JeJuNoodleBar = '1543',
  Lilia = '418',
  SixtyThreeClinton = '52711'
}

export const scheduleConfigByVenue: { [key in Venue]?: ScheduleConfig } = {
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
    daysInAdvance: 28
  },
  [Venue.JeJuNoodleBar]: {
    time: '10:00', // Not sure what time tbh
    daysInAdvance: 28
  },
  [Venue.SixtyThreeClinton]: {
    time: '00:00',
    daysInAdvance: 21
  },
  [Venue.WenWen]: {
    time: '00:00',
    daysInAdvance: 14
  },
}