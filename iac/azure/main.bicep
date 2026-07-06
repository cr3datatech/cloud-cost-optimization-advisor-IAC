targetScope = 'resourceGroup'

@description('Storage account name for raw and analyzed cost data')
param storageAccountName string

@description('Sender email address used by the reporting service')
param reportSenderEmail string

@description('Report frequency')
@allowed([
  'daily'
  'weekly'
])
param reportFrequency string

@description('Comma separated report recipients')
param emailRecipients string

output notes string = 'Placeholder template. Add resources for Cost Management export, analysis runtime, storage, and email delivery.'
