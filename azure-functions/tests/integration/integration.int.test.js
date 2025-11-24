const baseUrl = 'http://localhost:7071';
const existingAssetId = '6aa09331-b7b9-f011-bbd2-000d3a56dc3a';
// const nonExistentAssetId = '00000000-0000-0000-0000-000000000000';
// const existingUserId = '12345678-aaaa-bbbb-cccc-1234567890ab';
// const nonExistentUserId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

describe('Integration for ITAM Project', () => {
  it('should fetch an existing asset successfully', async () => {
    const res = await fetch(`${baseUrl}/api/v1/assets/${existingAssetId}`, {
      method: 'GET',
      headers: { Authorization: 'Bearer mocked-token' },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('message', 'Success');
    expect(body.data).toHaveProperty('assetName');
    expect(body.data).toHaveProperty('itemStatus');
  });

  it('should remove assignment successfully', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/assignments`,
      {
        method: 'DELETE',
        headers: { Authorization: 'Bearer mocked-token' },
      },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toMatch(/Successfully updated item assignment/);
  });
});
