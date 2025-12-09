import * as cdk from "aws-cdk-lib";
import * as amplify from "aws-cdk-lib/aws-amplify";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { env } from "./env.js";

export class AmplifyStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create service role FIRST before the app
    const serviceRole = new iam.Role(this, "AmplifyRole", {
      assumedBy: new iam.ServicePrincipal("amplify.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AdministratorAccess-Amplify"
        ),
      ],
    });

    // Create Amplify App
    const amplifyApp = new amplify.CfnApp(this, "StairPropertyApp", {
      name: "stair-property",
      description: "Multi-tenant shared ownership property management platform",
      platform: "WEB_COMPUTE",

      // GitHub repository connection
      repository: `https://github.com/HughTupper/stairpay`,
      accessToken: env.GITHUB_TOKEN,
      oauthToken: env.GITHUB_TOKEN,

      // IAM service role
      iamServiceRole: serviceRole.roleArn,

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
        {
          name: "AMPLIFY_MONOREPO_APP_ROOT",
          value: env.APP_ROOT,
        },
        {
          name: "AMPLIFY_DIFF_DEPLOY",
          value: "false", // Set to 'true' to enable differential deploys
        },
        // Optional: Turborepo Remote Caching
        // {
        //   name: "TURBO_TOKEN",
        //   value: env.TURBO_TOKEN,
        // },
        // {
        //   name: "TURBO_TEAM",
        //   value: env.TURBO_TEAM,
        // },
      ],

      // Turborepo-optimized build settings for Next.js 15
      buildSpec: JSON.stringify({
        version: "1.0",
        applications: [
          {
            appRoot: env.APP_ROOT,
            frontend: {
              phases: {
                preBuild: {
                  commands: [
                    // Navigate to monorepo root
                    "cd ../..",

                    // Install all dependencies (npm workspaces)
                    "npm ci",

                    // Optional: Verify environment
                    "node --version",
                    "npm --version",
                    "npx turbo --version",
                  ],
                },
                build: {
                  commands: [
                    // Use Turborepo to build with dependency graph
                    // The '...' suffix includes @stairpay/database and any other deps
                    "npx turbo run build --filter=@stairpay/housing-association-crm...",

                    // Alternative for more verbose logging (debugging):
                    // "npx turbo run build --filter=@stairpay/housing-association-crm... --verbosity=2",
                  ],
                },
              },
              artifacts: {
                baseDirectory: `packages/${env.APP_ROOT}/.next`,
                files: ["**/*"],
              },
              cache: {
                paths: [
                  // Root level node_modules (npm workspaces)
                  "node_modules/**/*",

                  // Turborepo cache directory - CRITICAL for speed
                  ".turbo/**/*",

                  // Next.js build cache
                  `${env.APP_ROOT}/.next/cache/**/*`,

                  // Database package (already built/types committed)
                  "packages/database/dist/**/*",
                  "packages/database/types/**/*",
                ],
              },
            },
          },
        ],
      }),

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
    });

    // Outputs
    new cdk.CfnOutput(this, "AmplifyAppId", {
      value: amplifyApp.attrAppId,
      description: "Amplify App ID",
    });

    new cdk.CfnOutput(this, "AmplifyAppUrl", {
      value: `https://main.${amplifyApp.attrAppId}.amplifyapp.com`,
      description: "Production URL",
    });

    new cdk.CfnOutput(this, "ServiceRoleArn", {
      value: serviceRole.roleArn,
      description: "Amplify Service Role ARN",
    });
  }
}
