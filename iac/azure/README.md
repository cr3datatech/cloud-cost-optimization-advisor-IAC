# Azure IaC

This directory contains the Azure Bicep template for the Cloud Cost Optimization Advisor.

## Files

- main.bicep: Azure template

## Current status

Scaffold placeholder.

## What exists today

- Parameter definitions for expected configuration inputs
- Placeholder output describing intended implementation

## Planned implementation

1. Cost ingestion from Azure billing/cost data
2. Storage for raw and analyzed outputs
3. Analysis runtime with AI integration
4. Scheduled execution
5. Email report delivery

## Deploy

From repository root:

```bash
npm run deploy:azure
```

This command is handled by scripts/deploy-azure.mjs and reads values from .env.
