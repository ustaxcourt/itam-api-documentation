# Reference existing resource group
data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

# Reference existing storage account
data "azurerm_storage_account" "storage" {
  name                = var.storage_account_name
  resource_group_name = data.azurerm_resource_group.rg.name
}

resource "azurerm_storage_container" "deployment" {
  name                  = "${var.function_app_name}-deployment"
  storage_account_id    = data.azurerm_storage_account.storage.id
  container_access_type = "private"
}

# Create Service Plan (Flex, Consumption)
resource "azurerm_service_plan" "plan" {
  name                = "${var.function_app_name}-flex-plan"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "FC1"
}

# Create Application Insights (per env)
resource "azurerm_application_insights" "insights" {
  name                = "${var.function_app_name}-ai"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  application_type    = "web"
}

# Create Azure Function App (Flex Consumption)
resource "azurerm_function_app_flex_consumption" "function" {
  name                        = var.function_app_name
  location                    = data.azurerm_resource_group.rg.location
  resource_group_name         = data.azurerm_resource_group.rg.name
  service_plan_id             = azurerm_service_plan.plan.id
  storage_container_type      = "blobContainer"
  storage_container_endpoint  = "${data.azurerm_storage_account.storage.primary_blob_endpoint}${azurerm_storage_container.deployment.name}"
  storage_authentication_type = "StorageAccountConnectionString"
  storage_access_key          = data.azurerm_storage_account.storage.primary_access_key
  runtime_name                = "node"
  runtime_version             = "22"

  identity {
    type = "SystemAssigned"
  }

  tags = {
    "hidden-link: /app-insights-resource-id" = azurerm_application_insights.insights.id
  }

  # ---------- App settings (per env) ----------
  app_settings = {
    APPINSIGHTS_INSTRUMENTATIONKEY = azurerm_application_insights.insights.instrumentation_key

    # These are the environment variables within the azure function app (per env)
    STORAGE_ACCOUNT_NAME = data.azurerm_storage_account.storage.name
    DATAVERSE_CLIENT_ID  = azuread_application.dataverse_app.client_id
    TENANT_ID            = var.all_tenant_id
    SCOPE                = var.scope
    DATAVERSE_URL        = var.dataverse_url
    GLOBAL_MAINTENANCE   = "false"

    # This now makes it managed by terraform - to update just terraform apply with new end date and verify change in azure function app per env
    DATAVERSE_INTERNAL                       = azuread_application_password.dataverse_app_secret.value
    MICROSOFT_PROVIDER_AUTHENTICATION_SECRET = azuread_application_password.function_auth_secret.value

    # Single-tenant
    WEBSITE_AUTH_AAD_ALLOWED_TENANTS = var.auth_allowed_tenants
  }

  # ---------- Bind Easy Auth to the per-env Auth App ----------
  auth_settings_v2 {
    auth_enabled           = true
    require_authentication = true
    unauthenticated_action = "Return401"
    runtime_version        = "~1"

    active_directory_v2 {
      # Bind to the env's Auth App
      client_id                  = azuread_application.function_auth_app.client_id
      client_secret_setting_name = "MICROSOFT_PROVIDER_AUTHENTICATION_SECRET"

      # Accept tokens whose 'aud' matches the env Auth App's identifier URIs
      allowed_audiences    = azuread_application.function_auth_app.identifier_uris
      allowed_applications = [azuread_application.function_auth_app.client_id]
      tenant_auth_endpoint = "https://sts.windows.net/${var.all_tenant_id}/v2.0"
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
    app_setting_names = ["MICROSOFT_PROVIDER_AUTHENTICATION_SECRET", "DATAVERSE_INTERNAL"]
  }

  site_config {
    application_insights_key               = azurerm_application_insights.insights.instrumentation_key
    application_insights_connection_string = azurerm_application_insights.insights.connection_string
  }
}
