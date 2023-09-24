import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stateMachine = new sfn.StateMachine(
      this,
      'CdkHelloWorldStateMachine',
      {
        definitionBody: sfn.DefinitionBody.fromFile(
          './lib/helloWorldStepFunction.json',
        ),
      },
    );
  }
}
