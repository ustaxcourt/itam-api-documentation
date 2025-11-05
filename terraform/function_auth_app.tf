# We are using a separate tenant for the authentication provider
provider "azuread" {
  tenant_id = var.auth_tenant_id
}

resource "azuread_application" "function_auth_app" {
  display_name = "${var.function_app_name}-auth"

  web {
    redirect_uris = var.auth_redirect_uris # This is a list of URIs
    implicit_grant {
      access_token_issuance_enabled = false
      id_token_issuance_enabled     = true
    }
  }

  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000" # Microsoft Graph

    resource_access {
      id   = "37f7f235-527c-4136-accd-4a02d197296e" # Replace with actual permission ID for `openid`
      type = "Scope"
    }
  }

  sign_in_audience = "AzureADMyOrg"
}

resource "azuread_service_principal" "function_auth_sp" {
  application_id = azuread_application.function_auth_app.application_id
}
