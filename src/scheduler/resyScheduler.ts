import { Command } from 'commander';
import { CreateScheduleCommand, CreateScheduleInput, FlexibleTimeWindowMode, SchedulerClient } from "@aws-sdk/client-scheduler";
import { ReservationSite, ResyReservation, TimeRange } from '../interface';

const resyScheduler = new Command();

resyScheduler.name('resyScheduler')
  .description('CLI to schedule resy reservation')
  .requiredOption('--accountId <accountId>', 'AWS Account ID')
  .requiredOption('--region <region>', 'AWS Region')
  .requiredOption('--venueId <venueId>', 'Venue ID')
  .requiredOption('--numSeats <numSeats>', 'Number of seats')
  .requiredOption('--reservationDate <reservationDate>', 'Date of the reservation in yyyy-mm-dd format')
  .requiredOption('--scheduleDateTime <scheduleDateTime>', 'Datetime of the schedule in yyyy-mm-ddThh:mm:ss format')
  .option('--earliest <earliest>', 'Earliest start time in hh:mm 24h format')
  .option('--latest <latest>', 'latest start time in hh:mm 24h format')
  .action(async (args) => {
    const { venueId, numSeats, reservationDate, earliest, latest, scheduleDateTime, region, accountId } = args
    if ((latest && !earliest) || (earliest && !latest)) {
      throw new Error('Earliest and Latest have to be both provided or neither')
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

    const input: CreateScheduleInput = {
      Name: `Venue-${venueId}-${Date.now()}`,
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
  });


resyScheduler.parse();