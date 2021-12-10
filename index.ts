import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

let config = new pulumi.Config();
let version = config.get("functionVersion") || "1.0";

// function from gitlab package repo
const functionZipUrl = `https://gitlab.com/api/v4/projects/21384727/packages/maven/ch/dulce/quarkus-lambda-gitlab/${version}/quarkus-lambda-gitlab-${version}-bin.zip`;

// Configure IAM so that the AWS Lambda can be run.
const role = new aws.iam.Role('functionRole', {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
        Service: "lambda.amazonaws.com"
    })
});
new aws.iam.RolePolicyAttachment("zipTpsReportsFuncRoleAttach", {
    role: role,
    policyArn: aws.iam.ManagedPolicies.AWSLambdaBasicExecutionRole,
});

// Next, create the Lambda function itself:
const docsHandlerFunc = new aws.lambda.Function("docsHandlerFunc", {
    code: new pulumi.asset.RemoteArchive(functionZipUrl),
    runtime: aws.lambda.CustomRuntime,
    role: role.arn,
    handler: "na",
    environment: {
        variables: {
            DISABLE_SIGNAL_HANDLERS: "true",
        },
    },
});

// Export the function
export const functionArn = docsHandlerFunc.arn;

