resource "azuread_application" "function_auth_app" {
  # Unique per environment
  display_name = var.auth_app_display_name

  # Unique identifier URI per environment
  identifier_uris = ["api://${var.auth_app_display_name}"]

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
  }

  required_resource_access {
    resource_app_id = local.graph_app_id
    resource_access {
      id   = local.graph_user_read_scope_id
      type = "Scope"
    }
    resource_access {
      id   = local.graph_openid_scope_id
      type = "Scope"
    }
  }

  sign_in_audience = var.auth_sign_in_audience
}

resource "azuread_service_principal" "function_auth_sp" {
  client_id = azuread_application.function_auth_app.client_id
}

resource "azuread_application_password" "function_auth_secret" {
  application_id = azuread_application.function_auth_app.id
  display_name   = "terraform-generated"
  end_date       = "2026-12-17T00:00:00Z"
}
