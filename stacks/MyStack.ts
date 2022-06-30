import * as iam from "aws-cdk-lib/aws-iam";
import * as iamFloyd from "cdk-iam-floyd";
import { StackContext, Api } from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  const permission = new iamFloyd.Ec2().toStartInstances();

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        permissions: toPermissions(permission),
      }
    },
    routes: {
      "GET /": "functions/lambda.handler",
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url
  });
}

function toPermissions(
  ...statements: (iamFloyd.PolicyStatement | iam.PolicyStatement)[]
): iam.PolicyStatement[] {
  return statements.map((policy) => iam.PolicyStatement.fromJson(policy.toJSON()));
}