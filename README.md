# Cloud Cost Optimization Advisor IaC

This repository contains separate infrastructure-as-code implementations for AWS, Azure, and GCP.

Only AI settings are shared. Provider operational settings are cloud-specific.

## What is implemented now

AWS is implemented end to end.

Azure and GCP templates are still scaffold placeholders.

## AWS End-to-End Path

The AWS path currently works as follows:

1. Scheduled execution
- EventBridge schedule triggers the analyzer Lambda daily or weekly.

2. Cost collection and analysis
- Analyzer Lambda reads AWS Cost Explorer data.
- It builds deterministic optimization recommendations.
- It calls OpenAI Chat Completions for a concise AI summary.

3. Storage
- Raw Cost Explorer response is written to the raw S3 bucket.
- Processed report is written to the analysis S3 bucket under analysis/...

4. Event-driven notification
- Analysis bucket has EventBridge notifications enabled.
- S3 object-created event is matched by an EventBridge rule.
- Mailer Lambda is triggered for new analysis objects.

5. Email distribution
- Mailer Lambda reads the report object.
- Mailer publishes the report content to an SNS topic.
- SNS sends the email to subscribed endpoint(s).

Important:
- SNS email subscriptions require confirmation from the recipient mailbox.

## Repository Layout

- iac/aws/main.yaml: AWS CloudFormation template (implemented)
- iac/azure/main.bicep: Azure Bicep template (scaffold)
- iac/gcp/main.tf: GCP Terraform template (scaffold)
- scripts/deploy-aws.mjs: AWS deploy entrypoint
- scripts/deploy-azure.mjs: Azure deploy entrypoint
- scripts/deploy-gcp.mjs: GCP deploy entrypoint
- .env.example: environment contract
- iac/aws/README.md: AWS template documentation
- iac/azure/README.md: Azure template documentation
- iac/gcp/README.md: GCP template documentation

## Prerequisites

1. Node.js 18+
2. npm
3. Cloud CLIs based on target provider:
- AWS CLI for AWS
- Azure CLI for Azure
- Terraform + gcloud for GCP

Install dependencies:

```bash
npm install
```

## Configuration

1. Copy .env.example to .env.
2. Set shared AI keys:
- AI_PROVIDER
- AI_MODEL
- OPENAI_API_KEY
3. Set AWS-specific keys for AWS deployment:
- AWS_PROFILE
- AWS_REGION
- AWS_STACK_NAME
- AWS_COST_BUCKET
- AWS_ANALYSIS_BUCKET
- AWS_REPORT_FREQUENCY
- AWS_REPORT_SENDER_EMAIL

## Deployment Commands

```bash
npm run deploy:aws
npm run deploy:azure
npm run deploy:gcp
```

## AWS Quick Test

1. Deploy:

```bash
npm run deploy:aws
```

2. Resolve function and invoke manually:

```powershell
$env:AWS_PROFILE='your-profile'
$env:AWS_REGION='eu-north-1'
$env:AWS_STACK_NAME='cost-advisor-aws'
$fn = aws cloudformation describe-stack-resource --stack-name $env:AWS_STACK_NAME --logical-resource-id AdvisorFunction --query "StackResourceDetail.PhysicalResourceId" --output text --profile $env:AWS_PROFILE --region $env:AWS_REGION
aws lambda invoke --function-name $fn --payload "{}" --cli-binary-format raw-in-base64-out lambda-response.json --profile $env:AWS_PROFILE --region $env:AWS_REGION
Get-Content .\lambda-response.json
```

3. Confirm SNS email subscription if you do not receive reports.

## Troubleshooting

1. No email arrives
- Confirm SNS subscription status is Confirmed.
- Check CloudWatch logs for the report mailer Lambda.

2. Lambda invoke fails
- Verify AWS profile and region.
- Verify OpenAI key is present in .env and was deployed.

3. Template editor shows unresolved CloudFormation tags
- Configure YAML custom tags in your editor for CloudFormation intrinsic functions.
