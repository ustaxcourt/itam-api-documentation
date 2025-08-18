// Providing generated script created within the XRMToolBox - Dataverse Rest Builder Application
// Script is to be run within USTC - Dev -> Advanced Settings -> Within a web console in the Dynamics 365 navigation page. Generates sample location data from the fac_asset_ref_location table
// Sharlet Claros
// WARNING: Xrm.WebApi doesn't support Retrieve Count
// THE CODE HAS BEEN GENERATED CONSIDERING THESE WARNINGS

// NOTE: retrieveMultipleRecords is available in online mode, if you need this functionality change the call to Xrm.WebApi.online.retrieveMultipleRecords
// https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/reference/xrm-webapi/online
// NOTE: retrieveMultipleRecords is available in offline mode, if you need this functionality change the call to Xrm.WebApi.offline.retrieveMultipleRecords
// https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/reference/xrm-webapi/offline
Xrm.WebApi.retrieveMultipleRecords("crf7f_fac_asset_ref_location", "?$select=crf7f_location_type,crf7f_office_name,statecode").then(
	function success(results) {
		console.log(results);
		for (var i = 0; i < results.entities.length; i++) {
			var result = results.entities[i];
			// Columns
			var crf7f_fac_asset_ref_locationid = result["crf7f_fac_asset_ref_locationid"]; // Guid
			var crf7f_location_type = result["crf7f_location_type"]; // Text
			var crf7f_office_name = result["crf7f_office_name"]; // Text
			var statecode = result["statecode"]; // State
			var statecode_formatted = result["statecode@OData.Community.Display.V1.FormattedValue"];
		}
	},
	function(error) {
		console.log(error.message);
	}
);
