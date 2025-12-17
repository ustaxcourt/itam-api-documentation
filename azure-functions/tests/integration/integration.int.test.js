const baseUrl = 'http://localhost:7071';
const existingAssetId = '8d204fa8-69d7-f011-8543-000d3a5928e0';
const nonExistentAssetId = '00000000-0000-0000-0000-000000000000';
const existingUserId = '2c5d33ef-d4f3-4574-b49a-69e376ee43bb';
const nonExistentUserId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const existingLocationId = 'df164d9a-69d7-f011-8544-000d3a35fa12';
const existingLocationName = 'San Francisco';
const nonExistentLocationId = '04d494f4-b5b9-f011-bbd2-000d3a56dc3b';
const existingJobTitleId = 'b09cf686-30d5-f011-8544-7c1e52177972';
const nonExistingJobTitleId = 'b09cf686-30d5-f011-8544-7c1e52177973';

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

  //location endpoint

  it('DELETE Location - should display proper assignment information in query after new unassignment', async () => {
    const unassignRes = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/location/${existingLocationId}`,
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
    expect(body.data).toHaveProperty('osVersion');
    expect(body.data).toHaveProperty('phone');
    expect(body.data).toHaveProperty('user');
    expect(body.data).toHaveProperty('location');
    expect(body.data.location).toBeNull();
  });

  it('POST Location - should assign a location successfully', async () => {
    //get and save current location
    let result = await fetch(`${baseUrl}/api/v1/assets/${existingAssetId}`, {
      method: 'GET',
      headers: { Authorization: 'Bearer mocked-token' },
    });
    expect(result.status).toBe(200);
    let body = await result.json();

    //run call to change location
    result = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/location/${existingLocationId}`,
      {
        method: 'POST',
        headers: { Authorization: 'Bearer mocked-token' },
      },
    );
    expect(result.status).toBe(200);
    body = await result.json();
    expect(body).toHaveProperty('message', 'Successfully assigned location');

    //check if location name is changed to be expected
    result = await fetch(`${baseUrl}/api/v1/assets/${existingAssetId}`, {
      method: 'GET',
      headers: { Authorization: 'Bearer mocked-token' },
    });
    expect(result.status).toBe(200);
    body = await result.json();
    expect(body).toHaveProperty('message', 'Success');
    expect(body.data).toHaveProperty('activation');
    expect(body.data).toHaveProperty('assetName');
    expect(body.data).toHaveProperty('itemStatus');
    expect(body.data).toHaveProperty('osVersion');
    expect(body.data).toHaveProperty('phone');
    expect(body.data).toHaveProperty('user');
    expect(body.data).toHaveProperty('location');
    expect(body.data.location).toBe(existingLocationName);

    //change back location to original - for future
    /*
    result = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/location/${currentLocationId}`,
      {
        method: 'POST',
        headers: { Authorization: 'Bearer mocked-token' },
      },
    );
    expect(result.status).toBe(200);
    body = await result.json();
    expect(body).toHaveProperty('message', 'Successfully assigned location');
    */
  });

  it('POST Location - should return 404 when assigning for a non-existent asset', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${nonExistentAssetId}/location/${existingLocationId}`,
      {
        method: 'POST',
        headers: { Authorization: 'Bearer mocked-token' },
      },
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.message).toBe(`No asset found for ID: ${nonExistentAssetId}`);
  });

  it('POST Location - should return 404 when trying to assign a location that does not exist', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/location/${nonExistentLocationId}`,
      {
        method: 'POST',
        headers: { Authorization: 'Bearer mocked-token' },
      },
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.message).toBe(
      `No location found for ID: ${nonExistentLocationId}`,
    );
  });

  it('GET Job Titles - should display proper job title infomation after querying', async () => {
    const getTitleInfoResult = await fetch(
      `${baseUrl}/api/v1/titleinfo/${existingJobTitleId}/`,
      {
        method: 'GET',
        headers: { Authorization: 'Bearer mocked-token' },
      },
    );

    expect(getTitleInfoResult.status).toBe(200);

    const body = await getTitleInfoResult.json();
    expect(body).toHaveProperty('message', 'Success');
    expect(body.data).toHaveProperty('requiredItems');
    expect(body.data).toHaveProperty('JobTitle');
    expect(body.data.requiredItems[0]).toHaveProperty('assetType');
    expect(body.data.requiredItems[0]).toHaveProperty('minimumQuantity');
    expect(body.data.requiredItems[0]).toHaveProperty('maximumQuantity');
    expect(body.data.requiredItems[0]).toHaveProperty('Items');
    expect(body.data.requiredItems[0].Items[0]).toHaveProperty('itemName');
    expect(body.data.requiredItems[0].Items[0]).toHaveProperty('itemMaximum');
  });

  it('GET Job Titles - should return 404 when trying to query a job title that does not exist', async () => {
    const getTitleInfoResult = await fetch(
      `${baseUrl}/api/v1/titleinfo/${nonExistingJobTitleId}/`,
      {
        method: 'GET',
        headers: { Authorization: 'Bearer mocked-token' },
      },
    );

    expect(getTitleInfoResult.status).toBe(404);
    const body = await getTitleInfoResult.json();
    expect(body.message).toBe(
      `No job title found for ID: ${nonExistingJobTitleId}`,
    );
  });
});
