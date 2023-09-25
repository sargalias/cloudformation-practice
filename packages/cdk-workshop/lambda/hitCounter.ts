import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { Handler } from 'aws-cdk-lib/aws-lambda';

const dynamoDbClient = new DynamoDBClient({});
const lambdaClient = new LambdaClient();

export const handler: Handler = async (event: any) => {
  console.log('request:', JSON.stringify(event, undefined, 2));

  // update dynamo entry for 'path' with hits++
  const dynamoCommand = new UpdateItemCommand({
    TableName: process.env.HITS_TABLE_NAME,
    Key: { path: { S: event.path } },
    UpdateExpression: 'Add hits :incr',
    ExpressionAttributeValues: { ':incr': { N: '1' } },
  });
  await dynamoDbClient.send(dynamoCommand);
  const lambdaCommand = new InvokeCommand({
    FunctionName: process.env.DOWNSTREAM_FUNCTION_NAME,
    Payload: JSON.stringify(event),
  });

  const { Payload } = await lambdaClient.send(lambdaCommand);

  const result = Buffer.from(Payload!).toString();

  console.log('downstream response:', JSON.stringify(result, undefined, 2));

  // return response back to upstream caller
  return JSON.parse(result);
};
