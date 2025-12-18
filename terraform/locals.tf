locals {
  env_ns = uuidv5("dns", var.env)

  # Function Auth App scope GUID (env + app label + scope value)
  auth_scope_id      = uuidv5(local.env_ns, "function_auth:${var.auth_scope_value}")

  # Dataverse App scope GUID (env + app label + scope value)
  dataverse_scope_id = uuidv5(local.env_ns, "dataverse:${var.dataverse_scope_value}")
}
