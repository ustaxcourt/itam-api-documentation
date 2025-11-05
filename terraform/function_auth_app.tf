# We are using a separate tenant for the authentication provider
provider "azuread" {
  tenant_id = var.auth_tenant_id
}

resource "azuread_application" "function_auth_app" {
  display_name = "${var.function_app_name}-authentication"
  identifier_uris = ["api://c12534f2-4a69-4377-9ff5-20bc4250a039"]

  web {
    homepage_url = "https://ustc-itam-apis.azurewebsites.net"
    redirect_uris = var.auth_redirect_uris # This is a list of URIs
    implicit_grant {
      access_token_issuance_enabled = false
      id_token_issuance_enabled     = true
    }
  }

  api {
  requested_access_token_version = 2
  mapped_claims_enabled          = false

  oauth2_permission_scope {
    admin_consent_description  = "Allow the application to access ustc-itam-apis on behalf of the signed-in user."
    admin_consent_display_name = "Access ustc-itam-apis"
    enabled                    = true
    id                         = "d965b0b5-0e72-4e6b-8438-1160de82ddd4"
    type                       = "User"
    user_consent_description   = "Allow the application to access ustc-itam-apis on your behalf."
    user_consent_display_name  = "Access ustc-itam-apis"
    value                      = "user_impersonation"
  }
  }

  required_resource_access {
    resource_app_id = "00000003-0000-0000-c000-000000000000" # Microsoft Graph

    resource_access {
      id   = "e1fe6dd8-ba31-4d61-89e7-88639da4683d" # User.Read
      type = "Scope"
    }

    resource_access {
      id   = "37f7f235-527c-4136-accd-4a02d197296e" # OpenID
      type = "Scope"
    }
  }

  sign_in_audience = "AzureADMyOrg"
}

resource "azuread_service_principal" "function_auth_sp" {
  client_id = azuread_application.function_auth_app.client_id
}
