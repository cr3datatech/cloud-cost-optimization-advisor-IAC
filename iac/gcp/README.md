# GCP IaC

This directory contains the GCP Terraform template for the Cloud Cost Optimization Advisor.

## Files

- main.tf: GCP template

## Current status

Scaffold placeholder.

## What exists today

- Terraform variable definitions for expected configuration inputs
- Placeholder output describing intended implementation

## Planned implementation

1. Billing export ingestion
2. Storage for raw and analyzed outputs
3. Analysis runtime with AI integration
4. Scheduled execution
5. Email report delivery

## Deploy

From repository root:

```bash
npm run deploy:gcp
```

This command is handled by scripts/deploy-gcp.mjs and reads values from .env.
