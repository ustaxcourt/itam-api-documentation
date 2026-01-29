const baseUrl = process.env.API_BASE_URL || 'http://localhost:7071';
const bearerToken = process.env.bearerToken || 'Bearer mocked-token';

const existingAssetId = '8d204fa8-69d7-f011-8543-000d3a5928e0';
const malformedAssetId = '8d204fa8-69d7-f011-85';
const nonExistentAssetId = '00000000-0000-0000-0000-000000000000';
const existingUserId = '2c5d33ef-d4f3-4574-b49a-69e376ee43bb';
const nonExistentUserId = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const existingLocationId = 'df164d9a-69d7-f011-8544-000d3a35fa12';
const malformedLocationId = 'df164d9a-69d7-f011-854';
const existingLocationName = 'San Francisco';
const nonExistentLocationId = '04d494f4-b5b9-f011-bbd2-000d3a56dc3b';
const existingJobTitleId = '76c0a78f-5cd4-f011-8544-000d3a5b5036';
const nonExistingJobTitleId = 'b09cf686-30d5-f011-8544-7c1e52177973';
const malformedJobTitleId = 'b09cf686-30d5-f0';

describe('Integration testing for ITAM Project', () => {
  //GET an asset
  it('GET Assets - should fetch an existing asset successfully', async () => {
    const res = await fetch(`${baseUrl}/api/v1/assets/${existingAssetId}`, {
      method: 'GET',
      headers: { Authorization: bearerToken },
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

  it('GET Assets - should return 404 when querying for a non-existent asset', async () => {
    const res = await fetch(`${baseUrl}/api/v1/assets/${nonExistentAssetId}`, {
      method: 'GET',
      headers: { Authorization: bearerToken },
    });
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.message).toBe(`No asset found for ID: ${nonExistentAssetId}`);
  });

  it('GET Assets - should return 400 when querying for a malformed asset', async () => {
    const res = await fetch(`${baseUrl}/api/v1/assets/${malformedAssetId}`, {
      method: 'GET',
      headers: { Authorization: bearerToken },
    });
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.message).toBe(`Resource not found`);
    expect(body.data).toBe(null);
  });

  // assign a user an asset

  it('POST User Assignments - should assign an asset to an existing user successfully', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/assignments/${existingUserId}`,
      {
        method: 'POST',
        headers: {
          Authorization: bearerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zendeskTicketId: 123,
          condition: 'Good',
          notes: 'these are notes',
        }),
      },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toMatch(/Successfully updated item assignment/);
    expect(body.data).toBe(existingAssetId);
  });

  it('POST User Assignments - should return 400 when zendeskTicketId is a string', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/assignments/${existingUserId}`,
      {
        method: 'POST',
        headers: {
          Authorization: bearerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zendeskTicketId: 'this is a string',
          condition: 'Good',
          notes: 'these are notes',
        }),
      },
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toMatch('zendeskTicketId must be number');
    expect(body.data).toBe(null);
  });

  it('POST User Assignments - should return 404 when passing a malformed asset id', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${malformedAssetId}/assignments/${existingUserId}`,
      {
        method: 'POST',
        headers: {
          Authorization: bearerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zendeskTicketId: 123,
          condition: 'Good',
          notes: 'these are notes',
        }),
      },
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.message).toMatch('Resource not found');
    expect(body.data).toBe(null);
  });

  it('POST User Assignments - should return 400 when passing request with a missing body', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/assignments/${existingUserId}`,
      {
        method: 'POST',
        headers: {
          Authorization: bearerToken,
          'Content-Type': 'application/json',
        },
      },
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toMatch('Missing body within request');
    expect(body.data).toBe(null);
  });

  it('POST User Assignments - should display proper user assignment information in query after new assignment', async () => {
    const assignRes = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/assignments/${existingUserId}`,
      {
        method: 'POST',
        headers: {
          Authorization: bearerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zendeskTicketId: 123,
          condition: 'Good',
          notes: 'these are notes',
        }),
      },
    );
    expect(assignRes.status).toBe(200);
    const res = await fetch(`${baseUrl}/api/v1/assets/${existingAssetId}`, {
      method: 'GET',
      headers: { Authorization: bearerToken },
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

  it('POST User Assignments - should return 404 when trying to assign a user that does not exist', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/assignments/${nonExistentUserId}`,
      {
        method: 'POST',
        headers: {
          Authorization: bearerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zendeskTicketId: 123,
          condition: 'Good',
          notes: 'these are notes',
        }),
      },
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.message).toBe(`No user found for ID: ${nonExistentUserId}`);
  });

  it('POST User Assignments - should return 404 when trying to assign a user that does not exist (Malformed userId)', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/assignments/${nonExistentUserId}`,
      {
        method: 'POST',
        headers: {
          Authorization: bearerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zendeskTicketId: 123,
          condition: 'Good',
          notes: 'these are notes',
        }),
      },
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.message).toBe(`No user found for ID: ${nonExistentUserId}`);
  });

  it('DELETE User Assignments - should remove assignment successfully', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/assignments`,
      {
        method: 'DELETE',
        headers: {
          Authorization: bearerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zendeskTicketId: 123,
          condition: 'Good',
          notes: 'these are notes',
        }),
      },
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toMatch(/Successfully updated item assignment/);
    expect(body.data).toBe(existingAssetId);
  });

  it('DELETE User Assignments - should show 404 when malformed assetid is passed', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${malformedAssetId}/assignments`,
      {
        method: 'DELETE',
        headers: {
          Authorization: bearerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zendeskTicketId: 123,
          condition: 'Good',
          notes: 'these are notes',
        }),
      },
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.message).toMatch('Resource not found');
    expect(body.data).toBe(null);
  });

  it('DELETE User Assignments - should display proper assignment information in query after new unassignment', async () => {
    const unassignRes = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/assignments/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: bearerToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zendeskTicketId: 123,
          condition: 'Good',
          notes: 'these are notes',
        }),
      },
    );
    expect(unassignRes.status).toBe(200);
    const res = await fetch(`${baseUrl}/api/v1/assets/${existingAssetId}`, {
      method: 'GET',
      headers: { Authorization: bearerToken },
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
        headers: { Authorization: bearerToken },
      },
    );
    expect(unassignRes.status).toBe(200);
    const res = await fetch(`${baseUrl}/api/v1/assets/${existingAssetId}`, {
      method: 'GET',
      headers: { Authorization: bearerToken },
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
      headers: { Authorization: bearerToken },
    });
    expect(result.status).toBe(200);
    let body = await result.json();

    //run call to change location
    result = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/location/${existingLocationId}`,
      {
        method: 'POST',
        headers: { Authorization: bearerToken },
      },
    );
    expect(result.status).toBe(200);
    body = await result.json();
    expect(body).toHaveProperty('message', 'Successfully assigned location');

    //check if location name is changed to be expected
    result = await fetch(`${baseUrl}/api/v1/assets/${existingAssetId}`, {
      method: 'GET',
      headers: { Authorization: bearerToken },
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
        headers: { Authorization: bearerToken },
      },
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.message).toBe(`No asset found for ID: ${nonExistentAssetId}`);
  });

  it('POST Location - should return 404 when assigning for a malformed asset', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${malformedAssetId}/location/${existingLocationId}`,
      {
        method: 'POST',
        headers: { Authorization: bearerToken },
      },
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.message).toMatch('Resource not found');
    expect(body.data).toBe(null);
  });

  it('POST Location - should return 404 when assigning for a malformed location', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/location/${malformedLocationId}`,
      {
        method: 'POST',
        headers: { Authorization: bearerToken },
      },
    );
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.message).toMatch('Resource not found');
    expect(body.data).toBe(null);
  });

  it('POST Location - should return 404 when trying to assign a location that does not exist', async () => {
    const res = await fetch(
      `${baseUrl}/api/v1/assets/${existingAssetId}/location/${nonExistentLocationId}`,
      {
        method: 'POST',
        headers: { Authorization: bearerToken },
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
      `${baseUrl}/api/v1/job-titles/${existingJobTitleId}/requirements`,
      {
        method: 'GET',
        headers: { Authorization: bearerToken },
      },
    );

    expect(getTitleInfoResult.status).toBe(200);

    const body = await getTitleInfoResult.json();
    expect(body).toHaveProperty('message', 'Success');

    expect(body.data).toHaveProperty('requiredAssets');
    expect(body.data).toHaveProperty('jobTitle');
    expect(body.data.requiredAssets[0]).toHaveProperty('assetType');
    expect(body.data.requiredAssets[0]).toHaveProperty('minimumQuantity');
    expect(body.data.requiredAssets[0]).toHaveProperty('maximumQuantity');
    expect(body.data.requiredAssets[0]).toHaveProperty('models');
    expect(body.data.requiredAssets[0].models[0]).toHaveProperty('modelName');
    expect(body.data.requiredAssets[0].models[0]).toHaveProperty(
      'modelMaximum',
    );
    expect(body.data.requiredAssets[0].models[0]).toHaveProperty(
      'modelMinimum',
    );
  });

  it('GET Job Titles - should return 404 when trying to query a job title that does not exist', async () => {
    const getTitleInfoResult = await fetch(
      `${baseUrl}/api/v1/job-titles/${nonExistingJobTitleId}/requirements`,
      {
        method: 'GET',
        headers: { Authorization: bearerToken },
      },
    );

    expect(getTitleInfoResult.status).toBe(404);
    const body = await getTitleInfoResult.json();
    expect(body.message).toBe(`Resource not found`);
  });

  it('GET Job Titles - should return 404 when trying to query a malformed job title id that does not exist', async () => {
    const getTitleInfoResult = await fetch(
      `${baseUrl}/api/v1/job-titles/${malformedJobTitleId}/requirements`,
      {
        method: 'GET',
        headers: { Authorization: bearerToken },
      },
    );

    expect(getTitleInfoResult.status).toBe(404);
    const body = await getTitleInfoResult.json();
    expect(body.message).toMatch('Resource not found');
    expect(body.data).toBe(null);
  });
});
