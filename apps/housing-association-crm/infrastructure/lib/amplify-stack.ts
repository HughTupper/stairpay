import * as cdk from "aws-cdk-lib";
import * as amplify from "aws-cdk-lib/aws-amplify";
import { Construct } from "constructs";
import { env } from "./env.js";

export class AmplifyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Amplify App
    const amplifyApp = new amplify.CfnApp(this, "StairPropertyApp", {
      name: "stair-property",
      description: "Multi-tenant shared ownership property management platform",
      platform: "WEB_COMPUTE",

      // Environment variables
      environmentVariables: [
        {
          name: "NEXT_PUBLIC_SUPABASE_URL",
          value: env.NEXT_PUBLIC_SUPABASE_URL,
        },
        {
          name: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
          value: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
        },
        {
          name: "_LIVE_UPDATES",
          value: JSON.stringify([
            {
              pkg: "next",
              type: "internal",
              version: "15.5.6",
            },
          ]),
        },
      ],

      // Build settings for Next.js 15
      buildSpec: cdk.Fn.sub(
        JSON.stringify({
          version: "1.0",
          applications: [
            {
              appRoot: ".",
              frontend: {
                phases: {
                  preBuild: {
                    commands: ["npm ci"],
                  },
                  build: {
                    commands: ["npm run build"],
                  },
                },
                artifacts: {
                  baseDirectory: ".next",
                  files: ["**/*"],
                },
                cache: {
                  paths: ["node_modules/**/*", ".next/cache/**/*"],
                },
              },
            },
          ],
        })
      ),

      // IAM service role for Amplify
      iamServiceRole: this.createAmplifyServiceRole().roleArn,

      // Custom rewrites and redirects
      customRules: [
        {
          source: "/<*>",
          status: "404",
          target: "/404",
        },
        {
          source:
            "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>",
          status: "200",
          target: "/index.html",
        },
      ],
    });

    // Main branch for production
    new amplify.CfnBranch(this, "MainBranch", {
      appId: amplifyApp.attrAppId,
      branchName: "main",
      enableAutoBuild: true,
      enablePullRequestPreview: false,
      stage: "PRODUCTION",
      framework: "Next.js - SSR",
    });

    // Feature branch for preview environments
    new amplify.CfnBranch(this, "FeatureBranch", {
      appId: amplifyApp.attrAppId,
      branchName: "feature/*",
      enableAutoBuild: true,
      enablePullRequestPreview: true,
      stage: "DEVELOPMENT",
      framework: "Next.js - SSR",
    });

    // Outputs
    new cdk.CfnOutput(this, "AmplifyAppId", {
      value: amplifyApp.attrAppId,
      description: "Amplify App ID",
      exportName: "StairPropertyAmplifyAppId",
    });

    new cdk.CfnOutput(this, "AmplifyAppUrl", {
      value: `https://main.${amplifyApp.attrDefaultDomain}`,
      description: "Amplify App URL",
      exportName: "StairPropertyAmplifyAppUrl",
    });
  }

  private createAmplifyServiceRole(): cdk.aws_iam.Role {
    const role = new cdk.aws_iam.Role(this, "AmplifyServiceRole", {
      assumedBy: new cdk.aws_iam.ServicePrincipal("amplify.amazonaws.com"),
      description: "IAM role for Amplify to deploy Next.js app",
    });

    // Add necessary permissions for Amplify
    role.addManagedPolicy(
      cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AdministratorAccess-Amplify"
      )
    );

    return role;
  }
}
