terraform {
  # Partial backend configuration approach - config based on env
  backend "azurerm" {}

  required_version = ">= 1.13.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      # Matching current installed major/minor
      version = "~> 4.46"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 3.6"
    }
  }
}
