import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export type HitCounterProps = {
  downstream: lambda.IFunction;
  readCapacity?: number;
};

export class HitCounter extends Construct {
  public readonly handler: lambda.IFunction;
  public readonly table: dynamodb.ITable;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    if (
      props.readCapacity !== undefined &&
      (props.readCapacity < 5 || props.readCapacity > 20)
    ) {
      throw new Error('readCapacity must be greater than 5 and less than 20');
    }
    super(scope, id);

    const table = new dynamodb.Table(this, 'Hits', {
      partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      readCapacity: props.readCapacity ?? 5,
    });

    const hitCounterHandler = new lambda.Function(this, 'HitCounterHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'hitCounter.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: table.tableName,
      },
    });

    this.handler = hitCounterHandler;
    this.table = table;

    table.grant(hitCounterHandler, 'dynamodb:UpdateItem');
    props.downstream.grantInvoke(hitCounterHandler);
  }
}
