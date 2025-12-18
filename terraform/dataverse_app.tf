# Dataverse App Registration
resource "azuread_application" "dataverse_app" {
  # Unique display name per environment
  display_name     = "${var.dataverse_app_display_name}"
  sign_in_audience = var.dataverse_sign_in_audience

  # Unique identifier URI per environment
  identifier_uris  = ["api://${var.dataverse_app_display_name}"]

  owners = var.dataverse_app_owners

  # Expose API (Dataverse scope - to be generated and unique per env)
  api {
    mapped_claims_enabled          = false
    requested_access_token_version = 2

    # Letting Entra ID generate the scope GUID (omitting 'id') for uniqueness per env
    oauth2_permission_scope {
      id                         = local.dataverse_scope_id     # GUID per env
      value                      = var.dataverse_scope_value
      type                       = "User"
      enabled                    = true
      admin_consent_display_name = "Access ustc-itam-entra-connector"
      admin_consent_description  = "Allow the application to access ustc-itam-entra-connector on behalf of the signed-in user."
      user_consent_display_name  = "Access ustc-itam-entra-connector"
      user_consent_description   = "Allow the application to access ustc-itam-entra-connector on your behalf."
    }
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
    resource_app_id = var.graph_app_id
    resource_access {
      id = var.graph_user_read_scope_id
      type = "Scope"
    } # User.Read
    resource_access {
      id = var.graph_openid_scope_id
      type = "Scope"
    } # OpenID
  }

  # Required resource access — SharePoint Online
  required_resource_access {
    resource_app_id = var.sharepoint_app_id
    dynamic "resource_access" {
      for_each = var.sharepoint_resource_access_ids
      content {
        id = resource_access.value.id
        type = resource_access.value.type
      }
    }
  }

  # Required resource access — Custom API (entra connector)
  required_resource_access {
    resource_app_id = var.custom_api_app_id
    resource_access {
      id = var.custom_api_scope_id
      type = "Scope"
    }
  }
}

# Service Principal (Enterprise App) for Dataverse app
resource "azuread_service_principal" "dataverse_sp" {
  client_id = azuread_application.dataverse_app.client_id
}

# Dataverse Internal
resource "azuread_application_password" "dataverse_app_secret" {
  application_id        = azuread_application.dataverse_app.id
  display_name          = "terraform-generated"
  end_date              = "2026-12-17T00:00:00Z"
}
