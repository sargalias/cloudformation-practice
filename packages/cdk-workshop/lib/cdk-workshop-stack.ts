import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { HitCounter } from './HitCounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const greet = new lambda.Function(this, 'GreetHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'greet.handler',
      code: lambda.Code.fromAsset('lambda'),
    });

    const greetWithCounter = new HitCounter(this, 'GreetHitCounter', {
      downstream: greet,
    });

    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: greetWithCounter.handler,
    });

    new TableViewer(this, 'ViewHitCounter', {
      title: 'Greet Hits',
      table: greetWithCounter.table,
    });
  }
}
