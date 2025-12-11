# Existing Dataverse App Registration
resource "azuread_application" "dataverse_app" {
  # Populating after terraform import
}

# Existing Service Principal (Enterprise App) for Dataverse app
resource "azuread_service_principal" "dataverse_sp" {
  # Populating after terraform import
}
