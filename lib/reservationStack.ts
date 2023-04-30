import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class ReservationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createResyLambda();
  }

  private createResyLambda(): void {
    new lambda.Function(this, 'ResyScheduler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('dist/src/index.zip'),
      functionName: "ResyScheduler",
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(60),
      architecture: lambda.Architecture.ARM_64,
      environment: {
        RESY_API_KEY: process.env.RESY_API_KEY!,
        RESY_EMAIL: process.env.RESY_EMAIL!,
        RESY_PASSWORD: process.env.RESY_PASSWORD!,
      }
    });
  }
}
