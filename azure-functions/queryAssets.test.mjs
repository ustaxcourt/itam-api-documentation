
import queryAsset from './queryAsset.js'

test('should return correct asset JSON structure with expected data types', async () => {
  const context = {};
  const req = {};

  await queryAsset(context, req);

  const response = context.res.body;

  expect(typeof response.assetName).toBe('string');
  expect(typeof response.location).toBe('string');
  expect(typeof response.itemStatus).toBe('string');
  expect(response.phone).toBeNull();
  expect(typeof response.condition).toBe('string');
  expect(response.activation).toBeNull();
  expect(typeof response.user).toBe('string');
  expect(response.osVersion).toBeNull();
});
