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

variable "function_app_name" {
  description = "Name of the Azure Function App to be created"
  type        = string
}

variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
  sensitive   = true
}

variable "auth_client_id" {
  description = "Authentication app client ID"
  type        = string
}

variable "dataverse_client_id" {
  description = "Dataverse app client ID"
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

variable "all_tenant_id" {
  description = "Tenant ID for everything since everything is under one tenant"
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

variable "dataverse_app_display_name" {
  description = "Display name of the Dataverse App Registration"
  type        = string
}

variable "dataverse_sign_in_audience" {
  description = "Sign-in audience for the Dataverse App Registration"
  type        = string
  default     = "AzureADMyOrg"
}

variable "dataverse_identifier_uris" {
  description = "Identifier URIs for the Dataverse App Registration"
  type        = list(string)
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

# Exposed API (scope)
variable "dataverse_scope_id" {
  description = "Stable ID for the Dataverse oauth2_permission_scope"
  type        = string
}

variable "dataverse_scope_value" {
  description = "Scope value for Dataverse oauth2_permission_scope"
  type        = string
}

# Required resource access (Graph, SharePoint, custom API)
variable "sharepoint_app_id" {
  description = "App ID for SharePoint Online"
  type        = string
  default     = "00000007-0000-0000-c000-000000000000"
}

variable "sharepoint_resource_access_ids" {
  description = "List of {id, type} for required SharePoint resource access"
  type = list(object({
    id   = string
    type = string
  }))
  default = [
    { id = "78ce3f0f-a1ce-49c2-8cde-64b5c0896db4", type = "Scope" },
  ]
}

variable "custom_api_app_id" {
  description = "App ID for custom API (entra connector)"
  type        = string
  default     = "f5cda511-d71d-4f10-a5dd-ec2627475e75"
}

variable "custom_api_scope_id" {
  description = "Scope ID for custom API access"
  type        = string
  default     = "f4539fe0-7aa1-47af-9608-7098d66c87e6"
}
