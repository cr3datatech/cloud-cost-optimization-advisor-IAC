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

## Exactly what cost information is gathered

The analyzer Lambda queries AWS Cost Explorer with a fixed shape.

1. API operation
- GetCostAndUsage

2. Metric collected
- UnblendedCost only

3. Grouping dimension
- SERVICE

4. Time granularity
- DAILY

5. Time window by report frequency
- daily: last 1 day
- weekly: last 7 days

6. Raw source payload persisted
- The full GetCostAndUsage response is stored in CostDataBucket at:
  raw/YYYY/MM/DD/cost-and-usage.json

7. Derived data produced from raw payload
- Service totals are aggregated across the full queried window.
- top_services: top 8 services by aggregated UnblendedCost.
- total_spend: sum of all aggregated service totals in the window.
- recommendations: top 5 services with deterministic actions and estimated_monthly_saving (10% heuristic).
- ai_summary: optional OpenAI summary generated from the processed payload.

8. Processed output persisted
- Stored in AnalysisBucket at:
  analysis/YYYY/MM/DD/report.json
  analysis/latest.json
- Report payload fields:
  generated_at
  window
  top_services
  recommendations
  ai_summary

9. Information not currently gathered
- AmortizedCost and BlendedCost metrics
- Usage quantity metrics
- Grouping by account, linked account, region, tags, usage type, or operation

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
