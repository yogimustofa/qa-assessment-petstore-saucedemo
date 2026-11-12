// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Endpoint: DELETE /pet/{petId} - Delete a pet by ID
 */
test.describe('API Endpoint: DELETE /pet/{petId}', () => {

  test('DELETE-001: [Positive] Successfully delete an existing pet by ID', async ({ request }) => {
    // 1. Create a pet to guarantee existence
    const petId = Math.floor(Math.random() * 1000000000) + 300000;
    const createRes = await request.post('pet', {
      data: {
        id: petId,
        name: 'PetForDeletion',
        status: 'available'
      }
    });
    expect(createRes.status()).toBe(200);

    // 2. Delete the created pet
    const deleteRes = await request.delete(`pet/${petId}`, {
      headers: { api_key: 'special-key' }
    });
    expect(deleteRes.status()).toBe(200);

    const deleteBody = await deleteRes.json();
    expect(deleteBody.code).toBe(200);
    expect(deleteBody.message).toBe(String(petId));

    // 3. Confirm deletion (GET should return 404)
    const verifyGet = await request.get(`pet/${petId}`);
    expect(verifyGet.status()).toBe(404);
  });

  test('DELETE-002: [Negative] Attempt to delete non-existent pet ID returns 404', async ({ request }) => {
    const nonExistentId = 999999999999999;
    const response = await request.delete(`pet/${nonExistentId}`, {
      headers: { api_key: 'special-key' }
    });

    expect(response.status()).toBe(404);
  });

});
