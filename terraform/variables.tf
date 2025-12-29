variable "env" {
  description = "Environment name (e.g., test, prod)"
  type        = string
}

variable "resource_group_name" {
  description = "Name of the existing Azure resource group"
  type        = string
}

variable "storage_account_name" {
  description = "Name of the existing Azure Storage Account"
  type        = string
}

variable "scope" {
  description = "Azure App Registry Scope Environment Variable for Dataverse App"
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

variable "dataverse_url" {
  description = "Azure App Registry Dataverse URL Environment Variable for Dataverse App"
  type        = string
}

variable "all_tenant_id" {
  description = "Tenant ID for everything since everything is under one tenant"
  type        = string
}

variable "auth_redirect_uris" {
  description = "List of redirect URIs for the authentication App Registration"
  type        = list(string)
}

variable "auth_sign_in_audience" {
  description = "Sign-in audience for the authentication App Registration"
  type        = string
  default     = "AzureADMyOrg"
}

variable "auth_allowed_tenants" {
  description = "Authentication configuration setting"
  type        = string
}

variable "dataverse_app_display_name" {
  description = "Display name of the Dataverse App Registration"
  type        = string
}

variable "auth_app_display_name" {
  description = "Display name of the Dataverse App Registration"
  type        = string
}

variable "dataverse_sign_in_audience" {
  description = "Sign-in audience for the Dataverse App Registration"
  type        = string
  default     = "AzureADMyOrg"
}

variable "dataverse_app_owners" {
  description = "List of owner object IDs for the Dataverse App Registration"
  type        = list(string)
}

# Dataverse App Web app settings
variable "dataverse_homepage_url" {
  description = "Homepage URL for the Dataverse web application"
  type        = string
  default     = "https://account.activedirectory.windowsazure.com:444/applications/default.aspx?metadata=customappsso|ISV9.1|primary|z"
}

variable "dataverse_redirect_uris" {
  description = "Redirect URIs for the Dataverse web application"
  type        = list(string)
}
