

## User Info
1. User: fovus-test-user
2. password: 7HoF7]q!
3. sign-in URL: https://381491879255.signin.aws.amazon.com/console

## Frontend Setup (vite)

1. Clone the repository.
3. Install Node.js if not already installed.
4. Run `npm i` to install dependencies.
5. Run `npm start` to start the application. It will open on `localhost:5173`.

## Backend Setup (aws_cdk)

1. Clone the repository.
2. Navigate to the `aws_cdk` folder.
3. Install Node.js if not already installed.
4. Install the AWS CLI and configure it with your credentials.
5. Run `npm i` to install dependencies.
6. Navigate to the Lambda function directories inside `aws_cdk`.
7. Run `npm i` in each function directory to install dependencies.
8. Navigate back to the parent directory (`aws_cdk`).
9. Run `aws configure`
10. Run `cdk bootstrap` to prepare the AWS environment.
11. Run `cdk synth` to synthesize the AWS CloudFormation template.
12. Run `cdk deploy` to deploy the stack.

## Configuration

- Remember to fill the places where ----------- is found at the code with the correct info.

Resources:
- [Introduction to Root User Sign-in Tutorial](https://docs.aws.amazon.com/signin/latest/userguide/introduction-to-root-user-sign-in-tutorial.html)
- [Creating IAM Users](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html)
- [AWS SDK for JavaScript v3 SSM Client](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ssm/)
- [AWS Lambda Java Handler](https://docs.aws.amazon.com/lambda/latest/dg/java-handler.html)
- [AWS CDK S3 Deployment](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_s3_deployment/README.html)
- [AWS CDK Assets](https://docs.aws.amazon.com/cdk/v2/guide/assets.html)
- [AWS S3 Upload File](https://docs.aws.amazon.com/quickstarts/latest/s3backup/step-2-upload-file.html)
- [AWS CLI SSM Send Command](https://docs.aws.amazon.com/cli/latest/reference/ssm/send-command.html)
- [AWS CLI Configure Files](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
- [AWS IAM Access Keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html?icmpid=docs_iam_console#Using_CreateAccessKey)
- [AWS CDK Constructs](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html)
- [AWS CDK Security IAM](https://docs.aws.amazon.com/cdk/v2/guide/security-iam.html)
- [AWS CDK Permissions](https://docs.aws.amazon.com/pt_br/cdk/v2/guide/permissions.html)
- [AWS IAM Security Credentials](https://docs.aws.amazon.com/IAM/latest/UserGuide/security-creds.html)
- [AWS CDK Hello World](https://docs.aws.amazon.com/cdk/v2/guide/hello_world.html)
- [AWS CDK Working with Stacks](https://docs.aws.amazon.com/cdk/v2/guide/work-with.html)
- [AWS Lambda Runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)
- [AWS CDK Getting Started](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_bootstrap)
- [AWS DynamoDB with AWS CDK](https://dynobase.dev/dynamodb-aws-cdk/#:~:text=With%20AWS%20CDK%2C%20you%20can,2%20properties%3A%20partitionKey%20and%20billingMode%20.&text=DynamoDB%20provides%202%20billing%20modes,the%20billingMode%20property%20to%20dynamodb.)
- [Attach IAM Role Automatically to New VM (YouTube)](https://www.youtube.com/results?search_query=attach+iam+role+automatically+to+new+vm)
- [How to Download S3 Files in EC2 (YouTube)](https://www.youtube.com/results?search_query=how+to+download+s3+files+in+ec2)
- [Simple SSH NPM Package](https://www.npmjs.com/package/simple-ssh)
