# Cloud Cost Optimization Advisor IaC

This repository contains separate infrastructure-as-code templates for AWS, Azure, and GCP, with a shared `.env` contract and npm deployment entrypoints.

## Scope

Each cloud implementation is independent and will provision resources for:

1. Periodic cost data ingestion
2. AI-assisted cost optimization analysis
3. Storage of raw and analyzed outputs
4. Daily or weekly email delivery to configured recipients

## Repository Layout

- `iac/aws/main.yaml`: AWS CloudFormation template
- `iac/azure/main.bicep`: Azure Bicep template
- `iac/gcp/main.tf`: GCP Terraform template
- `scripts/deploy-aws.mjs`: AWS deployment entrypoint
- `scripts/deploy-azure.mjs`: Azure deployment entrypoint
- `scripts/deploy-gcp.mjs`: GCP deployment entrypoint
- `.env.example`: shared configuration contract

## Prerequisites

Install tooling for each provider you plan to deploy:

1. Node.js 18+
2. AWS CLI (for AWS deploy)
3. Azure CLI (for Azure deploy)
4. Terraform CLI (for GCP deploy)
5. Cloud credentials configured locally

Install project dependencies:

```bash
npm install
```

## Configuration

Create `.env` from `.env.example` and provide values for the target cloud.

Important:

1. Keep only one source of truth for shared keys such as `REPORT_FREQUENCY` and `EMAIL_RECIPIENTS`.
2. Use cloud secret managers for sensitive runtime keys in production.
3. The current IaC files are baseline placeholders and should be expanded with concrete resources.

## Deploy Commands

Deploy each cloud independently:

```bash
npm run deploy:aws
npm run deploy:azure
npm run deploy:gcp
```

## Current Status

The deployment scripts and variable contracts are in place. The provider templates are scaffolded and ready for full resource implementation.
