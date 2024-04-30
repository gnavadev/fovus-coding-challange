import { EC2Client, RunInstancesCommand, TerminateInstancesCommand, DescribeInstancesCommand } from '@aws-sdk/client-ec2';
import { DynamoDBClient, UpdateItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { SSMClient, SendCommandCommand } from '@aws-sdk/client-ssm';

export async function handler(event, context) {
    try {
        const event_key = event?.Records[0]?.dynamodb?.Keys?.id?.S;

        const dynamoDBClient = new DynamoDBClient({ region: 'us-east-1' });
        const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

        const ec2Client = new EC2Client({ region: "us-east-1" });
        const ssmClient = new SSMClient({ region: "us-east-1" });

        const db_get_command = new GetCommand({
            TableName: "AwsCdkStack-fovuschalldbE78F1684-1RT4JCRJ168SY",
            Key: {
                id: event_key,
            },
        });

        
        const db_obj = await docClient.send(db_get_command);
        if (db_obj?.Item?.visited == undefined) {

            const instance = new RunInstancesCommand({
                MaxCount: 1,
                MinCount: 1,
                ImageId: 'ami-07caf09b362be10b8',
                InstanceType: 't2.micro',
                SecurityGroupIds: ['sg-07daeb8dc29976aff'],
                SubnetId: ['subnet-04d5cbe24f1d3b711'],
            });
            const response = await ec2Client.send(instance);

            const instanceId = response?.Instances[0]?.InstanceId;
            console.log(`Instance ${instanceId} created successfully.`);

            const update_command = new UpdateItemCommand({
                TableName: "AwsCdkStack-fovuschalldbE78F1684-1RT4JCRJ168SY",
                Key: {
                    "id": { S: event_key },
                },
                UpdateExpression: "SET visited = :vis",
                ExpressionAttributeValues: {
                    ":vis": { BOOL: true },
                },
            });
            await docClient.send(update_command);
            console.log("Record visiqted successfully.");

            async function waitUntilInstanceRunning(params) {
                const { client, Filters } = params;
                let instanceStatus = '';
              
                while (instanceStatus !== 'running') {
                  const data = await client.send(new DescribeInstancesCommand({ Filters }));
                  instanceStatus = data.Reservations[0].Instances[0].State.Name;
              
                  if (instanceStatus === 'running') {
                    return 'Instance is now running';
                  } else {
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                  }
                }
              }

            const resp = await waitUntilInstanceRunning({
            client: ec2Client,
            Filters: [
                {
                Name: 'instance-id',
                Values: [instanceId],
                },
            ],
            });
            
            console.log(`Instance ${instanceId} is now running & checks passed | ${resp}`);
            (`Instance ${instanceId} is now running & checks passed | ${resp}`);

            const data = await ec2Client.send(new DescribeInstancesCommand({ InstanceIds: [instanceId] }));
            const instance_public_DNS = data?.Reservations[0]?.Instances[0].PublicDnsName;

            const command = new SendCommandCommand({
                InstanceIds: [instanceId],
                DocumentName: 'AWS-RunShellScript',
                Parameters: {
                    commands: [
                        'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash',
                        'source ~/.bashrc',
                        'nvm install --lts',
                        'npm install @aws-sdk/client-dynamodb',
                        'npm install @aws-sdk/client-s3',
                        'wget https://cdk-hnb659fds-assets-381491879255-us-east-1.s3.amazonaws.com/script.mjs',
                        `node script.mjs ${event_key}`,
                    ],
                },
            });
            await ssmClient.send(command);
            console.log("Commands sent to instance successfully.");

            const terminate_instance = new TerminateInstancesCommand({
                InstanceIds: [instanceId],
            });
            await ec2Client.send(terminate_instance);
            console.log("Terminating instances:");
        } else {
            console.log("Bad Request | Event already processed.")
        }

        const response = {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '-----------------------', // Replace with your client's origin
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Allow-Credentials': 'true', 
            },
            body: JSON.stringify({
              message: `EC2 instance created and file downloaded successfully.`
            }),
          }
          
        return response;
    } catch (err) {
        console.error('Error:', err);
        const response = {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '-----------------------', // Replace with your client's origin
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Credentials': 'true', 
            },
            body: JSON.stringify({
                message: `Error creating EC2 instance: ${err.message}`
            }),
        };

        console.log('Response Headers:', response.headers); 
        return response;
    }
}