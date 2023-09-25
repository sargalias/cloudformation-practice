import { Handler } from 'aws-lambda';

const handler: Handler = async (event) => {
  console.log('request:', JSON.stringify(event, undefined, 2));
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plan' },
    body: `Hello, CDK! You've hit ${event.path}\n`,
  };
};

export { handler };
