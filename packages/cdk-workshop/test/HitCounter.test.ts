import { Capture, Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { HitCounter } from '../lib/HitCounter';

test('DynamoDB table created', () => {
  const stack = new cdk.Stack();

  const downstream = new lambda.Function(stack, 'TestFunction', {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'greet.handler',
    code: lambda.Code.fromAsset('lambda'),
  });

  new HitCounter(stack, 'MyTestConstruct', { downstream });

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::DynamoDB::Table', 1);

  const envCapture = new Capture();
  template.hasResourceProperties('AWS::Lambda::Function', {
    Environment: envCapture,
  });
  expect(envCapture.asObject()).toEqual({
    Variables: {
      DOWNSTREAM_FUNCTION_NAME: {
        Ref: 'TestFunction22AD90FC',
      },
      HITS_TABLE_NAME: {
        Ref: 'MyTestConstructHits24A357F0',
      },
    },
  });
});

test('HitCounter throws error when read capacity is less than 5', () => {
  const stack = new cdk.Stack();

  const downstream = new lambda.Function(stack, 'TestFunction', {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'greet.handler',
    code: lambda.Code.fromAsset('lambda'),
  });

  expect(
    () =>
      new HitCounter(stack, 'MyTestConstruct', {
        downstream,
        readCapacity: 3,
      }),
  ).toThrowError();
});
