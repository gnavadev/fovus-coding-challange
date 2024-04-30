import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambdaEventSource from 'aws-cdk-lib/aws-lambda-event-sources';

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'fovuschallbucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const fovuschalldb = new dynamodb.Table(this, 'fovuschalldb', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_IMAGE,
    });


    const lambdaFunction = new lambda.Function(this, 'Function', {
      code: lambda.Code.fromAsset('lib/lambda_vm'),
      handler: 'index.handler',
      functionName: 'TableStreamHandler',
      runtime: lambda.Runtime.NODEJS_LATEST
    });



    const saveToDynamoDBFunction = new lambda.Function(this, 'SaveToDynamoDBFunction', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lib/lambda'),
      environment: {
        TABLE_NAME: fovuschalldb.tableName,
      },
    });
    fovuschalldb.grantWriteData(saveToDynamoDBFunction);

    const api = new apigateway.RestApi(this, 'fovuschallapi', {
      restApiName: 'Fovus Challange API',
      description: 'Fovus Challange API',
      defaultCorsPreflightOptions: {
        allowOrigins: ['---------------------------------'], //Replace with your client's origin
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['*'],
        allowCredentials: true,
      },
    })

    
    const saveToDynamoDBIntegration = new apigateway.LambdaIntegration(saveToDynamoDBFunction);
    api.root.addResource('save').addMethod('POST', saveToDynamoDBIntegration);


    lambdaFunction.addEventSource(new lambdaEventSource.DynamoEventSource(fovuschalldb, {
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
    }));
    

  }
}