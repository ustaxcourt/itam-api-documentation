terraform {
  backend "azurerm" {
    resource_group_name   = "ustc-maz-rg-itam"
    storage_account_name  = "eapps"
    container_name        = "tfstate"
    key                   = "itam-api/terraform.tfstate"

    use_azuread_auth      = true
  }
}
