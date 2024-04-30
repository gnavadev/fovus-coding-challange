import { nanoid } from 'nanoid';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

export const handler = async (event, context) => {
  try {
    if (!event) {
      throw new Error('Request body is missing');
    }

    const dynamoDBClient = new DynamoDBClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: "----------------------------",
        secretAccessKey: "---------------------------------",
      },
    });

    const requestBody = JSON.parse(event.body);

    const id = nanoid();
    const dynamoDBParams = {
      TableName: 'AwsCdkStack-fovuschalldbE78F1684-1RT4JCRJ168SY',
      Item: {
        id: { S: id },
        input_text: { S: requestBody.inputText },
        input_file_path: { S: requestBody.inputFileS3Path},
      },
    };

    await dynamoDBClient.send(new PutItemCommand(dynamoDBParams));

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '-----------------------', // Replace with your client's origin
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true', 
      },
      body: JSON.stringify({ message: 'Data saved successfully' }),
    };

    return response;
  } catch (error) {
    const response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '-----------------------', // Replace with your client's origin
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true', 
      },
      body: JSON.stringify({ message: 'Internal server error' }),
    };

    console.log('Response Headers:', response.headers); 
    return response;
  }
};