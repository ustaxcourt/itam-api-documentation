const baseUrl = 'http://localhost:7071';
const existingAssetId = '6aa09331-b7b9-f011-bbd2-000d3a56dc3a';
const nonExistentAssetId = '00000000-0000-0000-0000-000000000000';
const existingUserId = 'c0181fd9-fdc4-4578-945d-aaae011feec7';
const nonExistentUserId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

describe('Integration testing for ITAM Project', () => {
  it('should fetch an existing asset successfully', async () => {
    const res = await fetch(`${baseUrl}/api/v1/assets/${existingAssetId}`, {
      method: 'GET',
      headers: { Authorization: 'Bearer mocked-token' },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('message', 'Success');
    expect(body.data).toHaveProperty('activation');
    expect(body.data).toHaveProperty('assetName');
    expect(body.data).toHaveProperty('itemStatus');
    expect(body.data).toHaveProperty('location');
    expect(body.data).toHaveProperty('osVersion');
    expect(body.data).toHaveProperty('phone');
    expect(body.data).toHaveProperty('user');
  });

  it('should return 404 when querying for a non-existent asset', async () => {
    const res = await fetch(`${baseUrl}/api/v1/assets/${nonExistentAssetId}`, {
      method: 'GET',
      headers: { Authorization: 'Bearer mocked-token' },
    });
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.message).toBe(`No asset found for ID: ${nonExistentAssetId}`);
  });

  it('should assign an asset to an existing user successfully', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/assignments/${existingUserId}`,
      {
        method: 'POST',
        headers: { Authorization: 'Bearer mocked-token' },
      },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toMatch(/Successfully updated item assignment/);
    expect(body.data).toBe(existingAssetId);
  });

  it('should display proper user assignment information in query after new assignment', async () => {
    const assignRes = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/assignments/${existingUserId}`,
      {
        method: 'POST',
        headers: { Authorization: 'Bearer mocked-token' },
      },
    );
    expect(assignRes.status).toBe(200);
    const res = await fetch(`${baseUrl}/api/v1/assets/${existingAssetId}`, {
      method: 'GET',
      headers: { Authorization: 'Bearer mocked-token' },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('message', 'Success');
    expect(body.data).toHaveProperty('activation');
    expect(body.data).toHaveProperty('assetName');
    expect(body.data).toHaveProperty('itemStatus');
    expect(body.data).toHaveProperty('location');
    expect(body.data).toHaveProperty('osVersion');
    expect(body.data).toHaveProperty('phone');
    expect(body.data).toHaveProperty('user');
    expect(body.data).toHaveProperty('user.email');
    expect(body.data).toHaveProperty('user.name');
  });

  it('should return 404 when trying to assign a user that does not exist', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/assignments/${nonExistentUserId}`,
      {
        method: 'POST',
        headers: { Authorization: 'Bearer mocked-token' },
      },
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.message).toBe(`No user found for ID: ${nonExistentUserId}`);
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
    expect(body.data).toBe(existingAssetId);
  });

  it('should display proper assignment information in query after new unassignment', async () => {
    const unassignRes = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/assignments/`,
      {
        method: 'DELETE',
        headers: { Authorization: 'Bearer mocked-token' },
      },
    );
    expect(unassignRes.status).toBe(200);
    const res = await fetch(`${baseUrl}/api/v1/assets/${existingAssetId}`, {
      method: 'GET',
      headers: { Authorization: 'Bearer mocked-token' },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('message', 'Success');
    expect(body.data).toHaveProperty('activation');
    expect(body.data).toHaveProperty('assetName');
    expect(body.data).toHaveProperty('itemStatus');
    expect(body.data).toHaveProperty('location');
    expect(body.data).toHaveProperty('osVersion');
    expect(body.data).toHaveProperty('phone');
    expect(body.data).toHaveProperty('user');
    expect(body.data.user).toBeNull();
  });
});
