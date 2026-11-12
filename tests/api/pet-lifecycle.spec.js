// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * End-to-End API Integration Workflow
 * Tests the full lifecycle of a Pet entity across all 3 endpoints:
 * POST (Create) -> GET (Query by status) -> DELETE (Remove) -> GET (Verify 404)
 */
test.describe('API E2E Integration: Pet Lifecycle', () => {

  test('LIFECYCLE-001: Complete Pet lifecycle workflow', async ({ request }) => {
    const cyclePetId = Math.floor(Math.random() * 1000000000) + 400000;
    const cyclePetName = `E2E_Puppy_${cyclePetId}`;

    // Step 1: POST /pet - Create new pet
    const postRes = await request.post('pet', {
      data: {
        id: cyclePetId,
        name: cyclePetName,
        status: 'available'
      }
    });
    expect(postRes.status()).toBe(200);
    const postData = await postRes.json();
    expect(postData.id).toBe(cyclePetId);

    // Step 2: GET /pet/findByStatus - Query available pets
    const getRes = await request.get('pet/findByStatus', {
      params: { status: 'available' }
    });
    expect(getRes.status()).toBe(200);

    // Step 3: DELETE /pet/{id} - Delete the pet
    const delRes = await request.delete(`pet/${cyclePetId}`, {
      headers: { api_key: 'special-key' }
    });
    expect(delRes.status()).toBe(200);

    // Step 4: GET /pet/{id} - Verify entity is deleted (404)
    const verifyRes = await request.get(`pet/${cyclePetId}`);
    expect(verifyRes.status()).toBe(404);
  });

});
