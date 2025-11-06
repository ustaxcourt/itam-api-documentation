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

variable "scope" {
  description = "Azure App Registry Scope Environment Variable for Dataverse App"
  type        = string
}

variable "dataverse_url" {
  description = "Azure App Registry Dataverse URL Environment Variable for Dataverse App"
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

variable "auth_identifier_uri" {
  description = "Identifier URI for the authentication App Registration"
  type        = string
}

variable "auth_scope_id" {
  description = "OAuth2 permission scope ID for the authentication App Registration"
  type        = string
}

variable "auth_scope_value" {
  description = "OAuth2 permission scope value for the authentication App Registration"
  type        = string
}

variable "graph_app_id" {
  description = "App ID for Microsoft Graph"
  type        = string
  default     = "00000003-0000-0000-c000-000000000000"
}

variable "graph_user_read_scope_id" {
  description = "Scope ID for Microsoft Graph User.Read"
  type        = string
  default     = "e1fe6dd8-ba31-4d61-89e7-88639da4683d"
}

variable "graph_openid_scope_id" {
  description = "Scope ID for Microsoft Graph OpenID"
  type        = string
  default     = "37f7f235-527c-4136-accd-4a02d197296e"
}

variable "auth_sign_in_audience" {
  description = "Sign-in audience for the authentication App Registration"
  type        = string
  default     = "AzureADMyOrg"
}

variable "dataverse_internal" {
  description = "Dataverse internal access value"
  type        = string
}

variable "auth_client_secret" {
  description = "Access value for authentication"
  type        = string
}

variable "auth_allowed_tenants" {
  description = "Authentication configuration setting"
  type        = string
}
