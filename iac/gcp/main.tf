terraform {
  required_version = ">= 1.6.0"
}

variable "project_id" {
  type = string
}

variable "region" {
  type = string
}

variable "cost_dataset" {
  type = string
}

variable "analysis_bucket" {
  type = string
}

variable "report_sender_email" {
  type = string
}

variable "report_frequency" {
  type = string
}

variable "email_recipients" {
  type = string
}

output notes {
  value = "Placeholder template. Add resources for billing export ingestion, analysis runtime, storage, and email delivery."
}
