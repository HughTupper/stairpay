#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

// Placeholder for global infrastructure stacks
const app = new cdk.App();

// Future stacks:
// - NetworkingStack (VPCs, subnets)
// - MonitoringStack (CloudWatch, SNS)
// - SecurityStack (IAM, KMS)

app.synth();
