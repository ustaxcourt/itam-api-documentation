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
