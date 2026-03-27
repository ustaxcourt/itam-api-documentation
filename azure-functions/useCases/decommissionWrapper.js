import { decommission } from '../persistence/decommission.js';
import { getAssetByID } from '../persistence/getAssetByID.js';
import { BadRequest } from '../errors/BadRequest.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { addNewEntryToAssetAuditLog } from '../persistence/addNewEntryToAssetAuditLog.js';
import { AUDIT_LOG_CHOICES } from '../entityConstants.js';

export async function decommissionWrapper(id) {
  try {
    const assetDetails = await getAssetByID(id);

    const unassigned =
      assetDetails.user === undefined ||
      assetDetails.user === null ||
      (typeof assetDetails.user === 'string' &&
        assetDetails.user.trim() === '') ||
      (typeof assetDetails.user === 'object' &&
        assetDetails.user !== null &&
        Object.keys(assetDetails.user).length === 0);

    // build the pieces of the body out for the audit log entry in case conditions are met.may move below condition check
    // we are doing all defaults from the asset object we got from getAssetByID and doing action as "decommission"
    const assetName = assetDetails.assetName;
    const choices = AUDIT_LOG_CHOICES;

    // gathering condition encoding
    const conditionLabel = assetDetails?.condition?.trim();
    const conditionCode = choices[conditionLabel];
    if (conditionCode === undefined) {
      throw new InternalServerError(
        `Condition '${conditionLabel ?? '<missing>'}' is not mapped in OptionSet.`,
      );
    }

    if (!unassigned) {
      // Asset has to be unassigned before a decommission - we will try to catch this in the API Controller layer
      throw new BadRequest(
        'This asset must be unassigned before it can be decommissioned! Please unassign the asset and try again.',
      );
    }

    await decommission(id);

    // audit log entry here rather than call another persistence method within another persistence method
    await addNewEntryToAssetAuditLog(
      assetName,
      conditionCode,
      // treating this as no required zendesk ticket id - endpoint does not provide that info as of now
      null,
      null, // no notes
      'Decommissioned',
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    throw new InternalServerError(
      `Decommission operation failed: ${error.message}`,
    );
  }
}
