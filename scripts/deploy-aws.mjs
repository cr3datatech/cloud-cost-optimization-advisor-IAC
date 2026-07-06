import { getEnv, projectPath, requireEnv, runCommand } from "./deploy-common.mjs";

requireEnv([
  "AWS_PROFILE",
  "AWS_REGION",
  "AWS_STACK_NAME",
  "AWS_COST_BUCKET",
  "AWS_ANALYSIS_BUCKET",
  "AWS_REPORT_SENDER_EMAIL",
  "REPORT_FREQUENCY",
  "EMAIL_RECIPIENTS"
]);

const profile = process.env.AWS_PROFILE;
const profileArgs = ["--profile", profile];

if (getEnv("AWS_AUTO_SSO_LOGIN", "false").toLowerCase() === "true") {
  runCommand("aws", ["sso", "login", ...profileArgs]);
}

runCommand("aws", ["sts", "get-caller-identity", ...profileArgs]);

const templateFile = projectPath("iac/aws/main.yaml");

runCommand("aws", [
  "cloudformation",
  "deploy",
  ...profileArgs,
  "--stack-name",
  process.env.AWS_STACK_NAME,
  "--template-file",
  templateFile,
  "--capabilities",
  "CAPABILITY_NAMED_IAM",
  "--region",
  process.env.AWS_REGION,
  "--parameter-overrides",
  `CostDataBucketName=${process.env.AWS_COST_BUCKET}`,
  `AnalysisBucketName=${process.env.AWS_ANALYSIS_BUCKET}`,
  `ReportSenderEmail=${process.env.AWS_REPORT_SENDER_EMAIL}`,
  `ReportFrequency=${process.env.REPORT_FREQUENCY}`,
  `EmailRecipients=${process.env.EMAIL_RECIPIENTS}`
]);

console.log("AWS deployment complete.");
