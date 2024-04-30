import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: "-------------------------",
        secretAccessKey: "---------------------------",
    },
});
const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });

try {
    const key = process.argv[2];

    const params = {
        TableName: 'AwsCdkStack-fovuschalldbE78F1684-1RT4JCRJ168SY',
        Key: { id: { S: key } }
    };

    const Item = await dynamoDBClient.send(new GetItemCommand(params));

    if (Item) {
        console.log('Record found:');

        const s3Params = {
            Bucket: 'awscdkstack-fovuschallbucketa315c89c-30c00ouglzmi',
            Key: Item?.Item?.file_name?.S
        };
        const file_obj = await s3Client.send(new GetObjectCommand(s3Params));
        const str = await file_obj?.Body?.transformToString();
        const merged_str = str.concat(" \n ", Item?.Item?.input_text?.S);

        const uploadParams = { ...s3Params, Body: merged_str };
        const resp_data = await s3Client.send(new PutObjectCommand(uploadParams));

        console.log("Successfully uploaded data to bucket at | " + Item?.Item?.file_name?.S);

        const tableUploadParams = {
            TableName: 'AwsCdkStack-fovuschalldbE78F1684-1RT4JCRJ168SY',
            Item: {
                'id': { S: Item?.Item?.id?.S },
                'input_file_path': { S: `s3://${s3Params.Bucket}/${s3Params.Key}` }
            }
        };
        await dynamoDBClient.send(new PutItemCommand(tableUploadParams));

        console.log("Data inserted into table | ");


    } else {
        console.log('Record not found');
    }
} catch (error) {
    console.error('Error fetching record:', error);
    throw error;
}
