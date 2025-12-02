#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AmplifyStack } from "../lib/amplify-stack.js";
import { env } from "../lib/env.js";

const app = new cdk.App();

new AmplifyStack(app, "StairPropertyAmplifyStack", {
  env: {
    account: env.CDK_DEFAULT_ACCOUNT,
    region: env.CDK_DEFAULT_REGION,
  },
  description: "AWS Amplify infrastructure for StairProperty platform",
  tags: {
    Project: "StairProperty",
    Environment: "Production",
    ManagedBy: "CDK",
  },
});

app.synth();
