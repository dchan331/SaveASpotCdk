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
   - RESY_EMAIL - used to generate an `Auth Token` from login credentials
   - RESY_PASSWORD - used to generate an `Auth Token` from login credentials
2. Run deployment steps

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
