# Dataverse App Registration
resource "azuread_application" "dataverse_app" {
  # Unique display name per environment
  display_name     = var.dataverse_app_display_name
  sign_in_audience = var.dataverse_sign_in_audience

  # Unique identifier URI per environment
  identifier_uris = ["api://${var.dataverse_app_display_name}"]

  owners = var.dataverse_app_owners

  # Expose API (Dataverse scope - to be generated and unique per env)
  api {
    mapped_claims_enabled          = false
    requested_access_token_version = 2
  }

  # Web app configuration
  web {
    homepage_url  = var.dataverse_homepage_url
    redirect_uris = var.dataverse_redirect_uris

    implicit_grant {
      access_token_issuance_enabled = true
      id_token_issuance_enabled     = true
    }
  }

  # Required resource access — Microsoft Graph
  required_resource_access {
    resource_app_id = local.graph_app_id
    resource_access {
      id   = local.graph_user_read_scope_id
      type = "Scope"
    } # User.Read
    resource_access {
      id   = local.graph_openid_scope_id
      type = "Scope"
    } # OpenID
  }
}

# Service Principal (Enterprise App) for Dataverse app
resource "azuread_service_principal" "dataverse_sp" {
  client_id = azuread_application.dataverse_app.client_id
}

# Dataverse Internal
resource "azuread_application_password" "dataverse_app_secret" {
  application_id = azuread_application.dataverse_app.id
  display_name   = "terraform-generated"
  end_date       = "2026-12-17T00:00:00Z"

  lifecycle {
    create_before_destroy = true
  }
}
