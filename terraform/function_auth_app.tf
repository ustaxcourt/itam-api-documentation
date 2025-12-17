resource "azuread_application" "function_auth_app" {
  # Unique per environment
  display_name     = "${var.auth_app_display_name}-${var.env}"

  # Unique identifier URI per environment
  identifier_uris  = ["api://${var.auth_app_display_name}-${var.env}"]

  web {
    homepage_url  = "https://${var.function_app_name}.azurewebsites.net"
    redirect_uris = var.auth_redirect_uris

    implicit_grant {
      access_token_issuance_enabled = false
      id_token_issuance_enabled     = true
    }
  }

  api {
    requested_access_token_version = 2
    mapped_claims_enabled          = false

    # Letting Entra ID generate the scope GUID (omitting `id` config) to retain uniquness per env
    oauth2_permission_scope {
      value                      = var.auth_scope_value
      type                       = "User"
      enabled                    = true
      admin_consent_display_name = "Access ustc-itam-apis"
      admin_consent_description  = "Allow the application to access ustc-itam-apis on behalf of the signed-in user."
      user_consent_display_name  = "Access ustc-itam-apis"
      user_consent_description   = "Allow the application to access ustc-itam-apis on your behalf."
    }
  }

  required_resource_access {
    resource_app_id = var.graph_app_id
    resource_access { id = var.graph_user_read_scope_id, type = "Scope" }
    resource_access { id = var.graph_openid_scope_id,     type = "Scope" }
  }

  sign_in_audience = var.auth_sign_in_audience
}

resource "azuread_service_principal" "function_auth_sp" {
  client_id = azuread_application.function_auth_app.client_id
}

resource "azuread_application_password" "function_auth_secret" {
  application_object_id = azuread_application.function_auth_app.id
  display_name          = "terraform-generated"
  end_date              = "2026-12-17T00:00:00Z"
}
