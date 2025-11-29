#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { AmplifyStack } from '../lib/amplify-stack'

const app = new cdk.App()

new AmplifyStack(app, 'StairPropertyAmplifyStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'eu-west-2',
  },
  description: 'AWS Amplify infrastructure for StairProperty platform',
  tags: {
    Project: 'StairProperty',
    Environment: 'Production',
    ManagedBy: 'CDK',
  },
})

app.synth()
