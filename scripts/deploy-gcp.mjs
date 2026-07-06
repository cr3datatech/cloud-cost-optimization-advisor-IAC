import { hasEnv, requireEnv, runCommand } from "./deploy-common.mjs";

requireEnv([
  "GCP_PROJECT_ID",
  "GCP_REGION",
  "GCP_COST_DATASET",
  "GCP_ANALYSIS_BUCKET",
  "GCP_REPORT_SENDER_EMAIL",
  "REPORT_FREQUENCY",
  "EMAIL_RECIPIENTS"
]);

if (hasEnv("GOOGLE_APPLICATION_CREDENTIALS")) {
  runCommand("gcloud", [
    "auth",
    "activate-service-account",
    "--key-file",
    process.env.GOOGLE_APPLICATION_CREDENTIALS
  ]);
} else {
  runCommand("gcloud", ["auth", "application-default", "login"]);
}

runCommand("gcloud", ["config", "set", "project", process.env.GCP_PROJECT_ID]);

runCommand("terraform", ["-chdir=iac/gcp", "init", "-upgrade"]);

runCommand("terraform", [
  "-chdir=iac/gcp",
  "apply",
  "-auto-approve",
  `-var=project_id=${process.env.GCP_PROJECT_ID}`,
  `-var=region=${process.env.GCP_REGION}`,
  `-var=cost_dataset=${process.env.GCP_COST_DATASET}`,
  `-var=analysis_bucket=${process.env.GCP_ANALYSIS_BUCKET}`,
  `-var=report_sender_email=${process.env.GCP_REPORT_SENDER_EMAIL}`,
  `-var=report_frequency=${process.env.REPORT_FREQUENCY}`,
  `-var=email_recipients=${process.env.EMAIL_RECIPIENTS}`
]);

console.log("GCP deployment complete.");
