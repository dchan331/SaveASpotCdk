import * as cdk from 'aws-cdk-lib'
import { ReservationStack } from './reservationStack';

const app = new cdk.App();

new ReservationStack(app, 'ReservationStack', {});
