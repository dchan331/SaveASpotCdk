import { Command } from 'commander';
import { v4 } from 'uuid';
import { CreateScheduleCommand, CreateScheduleInput, FlexibleTimeWindowMode, SchedulerClient } from "@aws-sdk/client-scheduler";
import { ReservationSite, ResyReservation, ScheduleConfig, TimeRange } from '../interface';
import { scheduleConfigByVenue, Venue } from '../resy/constants';

const resyScheduler = new Command();

resyScheduler.name('resyScheduler')
  .description('CLI to schedule resy reservation')
  .requiredOption('--accountId <accountId>', 'AWS Account ID')
  .requiredOption('--region <region>', 'AWS Region')
  .requiredOption('--venueId <venueId>', 'Venue ID, found in src/resy/constants.ts, feel free to add more!')
  .requiredOption('--numSeats <numSeats>', 'Number of seats')
  .requiredOption('--reservationDate <reservationDate>', 'Date of the reservation in yyyy-mm-dd format')
  .option('--earliest <earliest>', 'Earliest start time in hh:mm 24h format')
  .option('--latest <latest>', 'latest start time in hh:mm 24h format')
  .action(async (args) => {
    try {
      const { venueId, numSeats, reservationDate, earliest, latest, region, accountId } = args
      if ((latest && !earliest) || (earliest && !latest)) {
        throw new Error('Earliest and Latest have to both be provided or neither')
      }

      let timeRange: TimeRange | undefined = undefined
      if (latest && earliest) {
        timeRange = {
          start: earliest,
          end: latest
        }
      }
      const resyEvent: ResyReservation = {
        site: ReservationSite.Resy,
        config: {
          venueId,
          numSeats,
          date: reservationDate,
          timeRange,
        }
      }

      console.log(resyEvent)

      const scheduleConfig: ScheduleConfig | undefined = scheduleConfigByVenue[venueId as Venue];
      if (!scheduleConfig) {
        throw new Error(`There is no config for venue ${venueId}. You can add config in src/resy/constants.ts`)
      }
      const { time, daysInAdvance } = scheduleConfig;
      const scheduleDate = new Date(reservationDate)
      scheduleDate.setDate(scheduleDate.getDate() - daysInAdvance)
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() - 4) // adjust to EST
      if (scheduleDate.getTime() < currentDate.getTime()) {
        const earliestReserveDate = new Date(currentDate.setDate(currentDate.getDate() + daysInAdvance + 1))
          .toISOString()
          .slice(0, 10);

        throw new Error(`Venue ${venueId} schedules ${daysInAdvance} days in advance. The earliest reservation date is ${earliestReserveDate}`)
      }

      const scheduleDateTime = `${new Date(scheduleDate).toISOString().slice(0,10)}T${time}:00`
      const input: CreateScheduleInput = {
        Name: `Venue-${venueId}-${reservationDate}-${v4()}`,
        Target: {
          Arn: `arn:aws:lambda:${region}:${accountId}:function:ResyScheduler`,
          RoleArn: `arn:aws:iam::${accountId}:role/LambdaInvokeScheduler`,
          Input: JSON.stringify(resyEvent),
          RetryPolicy: {
            MaximumRetryAttempts: 5
          }
        },
        ScheduleExpression: `at(${scheduleDateTime})`,
        ScheduleExpressionTimezone: 'America/New_York',
        FlexibleTimeWindow: {
          Mode: FlexibleTimeWindowMode.OFF
        }
      }

      const client = new SchedulerClient({ region });
      const command = new CreateScheduleCommand(input)
      await client.send(command)
      console.log(`Added schedule at Venue ${venueId} for ${scheduleDateTime}`)
    } catch (e: any) {
      console.log(`🚨 ${e.message}`)
    }
  });


resyScheduler.parse();