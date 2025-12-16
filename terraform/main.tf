# Reference existing resource group
data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

# Reference existing storage account
data "azurerm_storage_account" "storage" {
  name                = var.storage_account_name
  resource_group_name = data.azurerm_resource_group.rg.name
}

# Create Service Plan for Linux and Node.js v22
resource "azurerm_service_plan" "plan" {
  name                = "${var.function_app_name}-plan"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "Y1"
}

# Create Application Insights instance
resource "azurerm_application_insights" "insights" {
  name                = "${var.function_app_name}-ai"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  application_type    = "web"
}

# Create Azure Function App
resource "azurerm_linux_function_app" "function" {
  name                       = var.function_app_name
  location                   = data.azurerm_resource_group.rg.location
  resource_group_name        = data.azurerm_resource_group.rg.name
  service_plan_id            = azurerm_service_plan.plan.id
  storage_account_name       = data.azurerm_storage_account.storage.name
  storage_account_access_key = data.azurerm_storage_account.storage.primary_access_key

  identity {
    type = "SystemAssigned"
  }

  tags = {
    "hidden-link: /app-insights-resource-id" = azurerm_application_insights.insights.id
  }

  app_settings = {
    FUNCTIONS_WORKER_RUNTIME              = "node"
    WEBSITE_RUN_FROM_PACKAGE              = "1"
    AzureWebJobsStorage                   = data.azurerm_storage_account.storage.primary_connection_string
    APPINSIGHTS_INSTRUMENTATIONKEY        = azurerm_application_insights.insights.instrumentation_key
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.insights.connection_string

    # These are the environment variables within the azure function app
    STORAGE_ACCOUNT_NAME                     = data.azurerm_storage_account.storage.name
    CLIENT_ID                                = var.dataverse_client_id
    TENANT_ID                                = var.all_tenant_id
    SCOPE                                    = var.scope
    DATAVERSE_URL                            = var.dataverse_url
    DATAVERSE_INTERNAL                       = var.dataverse_internal
    MICROSOFT_PROVIDER_AUTHENTICATION_SECRET = var.auth_client_secret
    WEBSITE_AUTH_AAD_ALLOWED_TENANTS         = var.auth_allowed_tenants
  }

  auth_settings_v2 {
    auth_enabled           = true
    require_authentication = true
    unauthenticated_action = "Return401"
    runtime_version        = "~1"

    active_directory_v2 {
      client_id                  = azuread_application.function_auth_app.client_id
      client_secret_setting_name = "MICROSOFT_PROVIDER_AUTHENTICATION_SECRET"
      allowed_applications       = [azuread_application.function_auth_app.client_id]
      allowed_audiences          = ["api://${azuread_application.function_auth_app.client_id}"]
      tenant_auth_endpoint       = "https://sts.windows.net/${var.all_tenant_id}/v2.0"
    }

    login {
      logout_endpoint                   = "/.auth/logout"
      token_store_enabled               = true
      token_refresh_extension_time      = 72
      cookie_expiration_convention      = "FixedTime"
      cookie_expiration_time            = "08:00:00"
      nonce_expiration_time             = "00:05:00"
      validate_nonce                    = true
      preserve_url_fragments_for_logins = false
    }
  }

  sticky_settings {
    app_setting_names = [
      "MICROSOFT_PROVIDER_AUTHENTICATION_SECRET"
    ]
  }

  site_config {
    application_insights_key              = azurerm_application_insights.insights.instrumentation_key
    application_insights_connection_string = azurerm_application_insights.insights.connection_string

    application_stack {
      node_version = "22"
    }
  }
}
