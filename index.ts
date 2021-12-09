import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// function from gitlab package repo
const functionZipUrl = "https://gitlab.com/api/v4/packages/maven/ch/dulce/quarkus-lambda-gitlab/1.0/quarkus-lambda-gitlab-1.0-bin.zip";

// Configure IAM so that the AWS Lambda can be run.
const role = new aws.iam.Role('functionRole', {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
        Service: "lambda.amazonaws.com"
    })
});

// Next, create the Lambda function itself:
const docsHandlerFunc = new aws.lambda.Function("docsHandlerFunc", {
    code: new pulumi.asset.RemoteArchive(functionZipUrl),
    runtime: aws.lambda.CustomRuntime,
    role: role.arn,
    handler: "na"
});

// Export the function
export const functionArn = docsHandlerFunc.arn;

