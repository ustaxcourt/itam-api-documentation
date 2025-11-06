# We are using a separate tenant for the authentication provider
provider "azuread" {
  tenant_id = var.auth_tenant_id
}

resource "azuread_application" "function_auth_app" {
  display_name     = "${var.function_app_name}-authentication"
  identifier_uris  = [var.auth_identifier_uri]

  web {
    homepage_url  = "https://${azurerm_linux_function_app.function.default_hostname}"
    redirect_uris = var.auth_redirect_uris

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
      id                         = var.auth_scope_id
      type                       = "User"
      user_consent_description   = "Allow the application to access ustc-itam-apis on your behalf."
      user_consent_display_name  = "Access ustc-itam-apis"
      value                      = var.auth_scope_value
    }
  }

  required_resource_access {
    resource_app_id = var.graph_app_id

    resource_access {
      id   = var.graph_user_read_scope_id
      type = "Scope"
    }

    resource_access {
      id   = var.graph_openid_scope_id
      type = "Scope"
    }
  }

  sign_in_audience = var.auth_sign_in_audience
}

resource "azuread_service_principal" "function_auth_sp" {
  client_id = azuread_application.function_auth_app.client_id
}
