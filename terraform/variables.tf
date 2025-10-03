variable "resource_group_name" {
  description = "Name of the existing Azure resource group"
  type        = string
}

variable "storage_account_name" {
  description = "Name of the existing Azure Storage Account"
  type        = string
}

variable "function_app_name" {
  description = "Name of the Azure Function App to be created"
  type        = string
}


variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
  sensitive   = true
}
