provider "azurerm" {
  features {}
  subscription_id = var.subscription_id

}

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

  site_config {
    # optional remove if causing issues
    application_insights_key = azurerm_application_insights.insights.instrumentation_key
  }

  identity {
    type = "SystemAssigned"
  }

  app_settings = {
    FUNCTIONS_WORKER_RUNTIME               = "node"
    WEBSITE_RUN_FROM_PACKAGE              = "1"
    AzureWebJobsStorage                   = data.azurerm_storage_account.storage.primary_connection_string
    APPINSIGHTS_INSTRUMENTATIONKEY        = azurerm_application_insights.insights.instrumentation_key
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.insights.connection_string


    # OAuth and Storage Settings
    STORAGE_ACCOUNT_NAME = data.azurerm_storage_account.storage.name
    TABLE_NAME           = var.table_name
    CLIENT_ID            = var.client_id
    TENANT_ID            = var.tenant_id
    REDIRECT_URI         = var.redirect_uri
  }
}
