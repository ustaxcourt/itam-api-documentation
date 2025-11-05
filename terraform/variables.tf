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

variable "client_id" {
  description = "Azure AD Application (Client) ID for OAuth"
  type        = string
}

variable "tenant_id" {
  description = "Azure AD Tenant ID"
  type        = string
}

variable "auth_tenant_id" {
  description = "Tenant ID for the authentication App Registration"
  type        = string
}

variable "auth_redirect_uris" {
  description = "List of redirect URIs for the authentication App Registration"
  type        = list(string)
}
