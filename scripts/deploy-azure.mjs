import { hasEnv, requireEnv, runCommand, projectPath } from "./deploy-common.mjs";

requireEnv([
  "AZURE_SUBSCRIPTION_ID",
  "AZURE_LOCATION",
  "AZURE_RESOURCE_GROUP",
  "AZURE_DEPLOYMENT_NAME",
  "AZURE_STORAGE_ACCOUNT",
  "AZURE_REPORT_SENDER_EMAIL",
  "REPORT_FREQUENCY",
  "EMAIL_RECIPIENTS"
]);

const templateFile = projectPath("iac/azure/main.bicep");

if (hasEnv("AZURE_CLIENT_ID") && hasEnv("AZURE_CLIENT_SECRET") && hasEnv("AZURE_TENANT_ID")) {
  runCommand("az", [
    "login",
    "--service-principal",
    "--username",
    process.env.AZURE_CLIENT_ID,
    "--password",
    process.env.AZURE_CLIENT_SECRET,
    "--tenant",
    process.env.AZURE_TENANT_ID
  ]);
} else {
  runCommand("az", ["login", "--use-device-code"]);
}

runCommand("az", ["account", "set", "--subscription", process.env.AZURE_SUBSCRIPTION_ID]);

runCommand("az", [
  "group",
  "create",
  "--name",
  process.env.AZURE_RESOURCE_GROUP,
  "--location",
  process.env.AZURE_LOCATION
]);

runCommand("az", [
  "deployment",
  "group",
  "create",
  "--name",
  process.env.AZURE_DEPLOYMENT_NAME,
  "--resource-group",
  process.env.AZURE_RESOURCE_GROUP,
  "--template-file",
  templateFile,
  "--parameters",
  `storageAccountName=${process.env.AZURE_STORAGE_ACCOUNT}`,
  `reportSenderEmail=${process.env.AZURE_REPORT_SENDER_EMAIL}`,
  `reportFrequency=${process.env.REPORT_FREQUENCY}`,
  `emailRecipients=${process.env.EMAIL_RECIPIENTS}`
]);

console.log("Azure deployment complete.");
