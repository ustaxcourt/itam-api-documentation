import { recommission } from '../persistence/recommission.js';
import { getAssetByID } from '../persistence/getAssetByID.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { BadRequest } from '../errors/BadRequest.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { addNewEntryToAssetAuditLog } from '../persistence/addNewEntryToAssetAuditLog.js';
import { AUDIT_LOG_CHOICES } from '../entityConstants.js';

export async function recommissionWrapper(id) {
  try {
    const assetDetails = await getAssetByID(id);

    // Build the pieces of the body out for the audit log entry in case conditions are met
    // We are doing all defaults from the asset object we got from getAssetByID and doing action as "recommission"
    const assetName = assetDetails.assetName;
    const choices = AUDIT_LOG_CHOICES;

    // Gathering condition encoding
    const conditionLabel = assetDetails?.condition?.trim();
    const conditionCode = choices[conditionLabel];
    if (conditionCode === undefined) {
      throw new InternalServerError(
        `Condition '${conditionLabel ?? '<missing>'}' is not mapped in OptionSet.`,
      );
    }

    await recommission(id);

    // Audit log entry here rather than call another persistence method within another persistence method
    await addNewEntryToAssetAuditLog(
      assetName,
      conditionCode,
      // Treating this as no required zendesk ticket id - endpoint does not provide that info as of now
      null,
      null, // No notes
      'Recommissioned',
    );
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof BadRequest) {
      throw error;
    }

    throw new InternalServerError(
      `Recommission operation failed: ${error.message}`,
    );
  }
}
