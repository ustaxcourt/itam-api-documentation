provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  tenant_id       = var.all_tenant_id
}

provider "azuread" {
  tenant_id = var.all_tenant_id
}
