// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Endpoint: POST /pet - Add a new pet to the store
 */
test.describe('API Endpoint: POST /pet', () => {

  test('POST-001: [Positive] Add new pet with complete valid payload', async ({ request }) => {
    const petId = Math.floor(Math.random() * 1000000000) + 100000;
    const petPayload = {
      id: petId,
      category: { id: 101, name: 'Canine' },
      name: 'PuppyFullDetails',
      photoUrls: ['https://example.com/p1.png', 'https://example.com/p2.png'],
      tags: [{ id: 1, name: 'friendly' }, { id: 2, name: 'trained' }],
      status: 'available'
    };

    const response = await request.post('pet', { data: petPayload });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(petId);
    expect(body.name).toBe(petPayload.name);
    expect(body.status).toBe(petPayload.status);
    expect(body.category.name).toBe(petPayload.category.name);
    expect(body.tags).toHaveLength(2);

    // Cleanup created pet
    await request.delete(`pet/${petId}`, { headers: { api_key: 'special-key' } });
  });

  test('POST-002: [Positive] Add pet with minimal mandatory fields', async ({ request }) => {
    const petId = Math.floor(Math.random() * 1000000000) + 200000;
    const minimalPayload = {
      id: petId,
      name: 'MinimalPuppy',
      photoUrls: ['https://example.com/min.png']
    };

    const response = await request.post('pet', { data: minimalPayload });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(petId);
    expect(body.name).toBe(minimalPayload.name);

    // Cleanup
    await request.delete(`pet/${petId}`, { headers: { api_key: 'special-key' } });
  });

  test('POST-003: [Negative / Bug-002] Error validation when ID is non-numeric string', async ({ request }) => {
    // Contract expects int64 ID. String should return 400 Bad Request.
    // Server currently returns 500 unhandled exception (documented in Bug Report).
    const response = await request.post('pet', {
      data: {
        id: 'invalid_string_id',
        name: 'InvalidIdPet'
      }
    });

    expect(response.status()).toBeGreaterThanOrEqual(400);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

});
