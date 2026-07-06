# AWS IaC

This directory contains the AWS CloudFormation template for the Cloud Cost Optimization Advisor.

## Files

- main.yaml: deploys the AWS implementation

## Current status

Implemented and deployable.

## What the template provisions

1. Storage
- CostDataBucket for raw Cost Explorer snapshots
- AnalysisBucket for analyzed reports

2. Analysis runtime
- AdvisorFunction Lambda that:
  - reads Cost Explorer data
  - computes deterministic recommendations
  - calls OpenAI for summary text
  - writes raw and analyzed data to S3

3. Notification runtime
- ReportMailerFunction Lambda that:
  - is triggered by EventBridge on analysis bucket object-created events
  - reads report payload from S3
  - publishes email content to SNS topic

4. Scheduling and event routing
- AdvisorScheduleRule EventBridge cron (daily or weekly)
- ReportCreatedRule EventBridge event pattern for report objects
- Lambda invoke permissions for both rules

5. Messaging
- SNS topic and email subscription for report delivery

6. IAM
- Separate IAM roles for analyzer and mailer Lambdas with least required permissions

## Required CloudFormation parameters

- CostDataBucketName
- AnalysisBucketName
- ReportSenderEmail
- ReportFrequency (daily|weekly)
- OpenAIApiKey
- AIModel

## Deploy

From repository root:

```bash
npm run deploy:aws
```

This command is handled by scripts/deploy-aws.mjs and reads values from .env.

## Notes

- SNS email subscriptions must be confirmed from the target mailbox.
- OpenAI API key is passed as a CloudFormation parameter and injected to Lambda environment variables.
