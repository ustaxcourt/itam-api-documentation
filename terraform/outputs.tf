output "function_app_name" {
  description = "The name of the Azure Function App"
  value       = azurerm_linux_function_app.function.name
}

output "function_app_default_hostname" {
  description = "The default hostname of the Function App"
  value       = azurerm_linux_function_app.function.default_hostname
}

output "function_app_url" {
  description = "The full HTTPS URL of the Function App"
  value       = "https://${azurerm_linux_function_app.function.default_hostname}"
}

output "app_service_plan_name" {
  description = "The name of the App Service Plan"
  value       = azurerm_service_plan.plan.name
}

output "app_insights_instrumentation_key" {
  description = "Instrumentation key for Application Insights"
  value       = azurerm_application_insights.insights.instrumentation_key
  sensitive   = true
}

output "app_insights_connection_string" {
  description = "Connection string for Application Insights"
  value       = azurerm_application_insights.insights.connection_string
  sensitive   = true
}

output "scope" {
  description = "Scope used for Dataverse API access"
  value       = var.scope
}

output "function_auth_app_id" {
  description = "The Application (client) ID of the Function Auth App Registration"
  value       = azuread_application.function_auth_app.client_id
}

output "function_auth_object_id" {
  description = "The Object ID of the Function Auth App Registration"
  value       = azuread_application.function_auth_app.id
}

output "function_auth_sp_id" {
  description = "The Object ID of the Service Principal for the Function Auth App"
  value       = azuread_service_principal.function_auth_sp.id
}

output "function_auth_redirect_uris" {
  description = "Redirect URIs configured for the Function Auth App"
  value       = azuread_application.function_auth_app.web[0].redirect_uris
}

output "function_auth_tenant_id" {
  description = "Tenant ID used for the Function Auth App Registration"
  value       = var.auth_tenant_id
}
