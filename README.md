# SaveASportCdk

## Setup
1. Setup an [AWS Account](https://aws.amazon.com/console/)
2. Setup [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
3. Install packages by running `npm install`
4. Compile typescript to javascript `npm run build`
5. Bootstrap AWS account for CDK `cdk bootstrap`

## Deployment
1. Synthesize CDK `cdk synth`
2. Deploy CDK changes `cdk deploy`
 
### Resy
1. Set Environment Variables
   - RESY_API_KEY - Can be found in network tab by vising a [restaurant site](https://resy.com/cities/ny/wenwen?date=2023-04-30&seats=2) Look for a `find` request. Something like `authorization: ResyAPI api_key="SOME_KEY"`
   - RESY_EMAIL - From login credentials: used to generate an `Auth Token`
   - RESY_PASSWORD - From login credentials: used to generate an `Auth Token`
2. Run deployment steps
3. To invoke the lambda, an example event can be found in `src/invoke.ts`
4. To add a schedule `npm run scheduleResy -- --help`, all times are in EST
    ```
    CLI to schedule resy reservation

    Options:
      --accountId <accountId>                AWS Account ID
      --region <region>                      AWS Region
      --venueId <venueId>                    Venue ID, found in src/resy/constants.ts, feel free to add more!
      --numSeats <numSeats>                  Number of seats
      --reservationDate <reservationDate>    Date of the reservation in yyyy-mm-dd format
      --earliest <earliest>                  Earliest start time in hh:mm 24h format
      --latest <latest>                      latest start time in hh:mm 24h format
      -h, --help                             display help for command
    ```
   - Example
      ```
      npm run scheduleResy -- --accountId 123456789 \
      --region us-east-1 --venueId 25973 --numSeats 4 \
      --reservationDate 2023-06-03 \
      --earliest 18:00 --latest 20:00
      ```

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
