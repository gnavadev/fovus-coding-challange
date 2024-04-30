

## User Info
User: fovus-test-user
password: 7HoF7]q!
sign-in URL: https://381491879255.signin.aws.amazon.com/console

## Frontend Setup (vite)

1. Clone the repository.
3. Install Node.js if not already installed.
4. Run `npm i` to install dependencies.
5. Run `npm start` to start the application. It will open on `localhost:3000`.

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
