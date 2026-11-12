// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Endpoint: GET /pet/findByStatus - Find pets by status
 */
test.describe('API Endpoint: GET /pet/findByStatus', () => {

  test('GET-001: [Positive] Fetch pets with status "available"', async ({ request }) => {
    const response = await request.get('pet/findByStatus', {
      params: { status: 'available' }
    });

    expect(response.status()).toBe(200);
    const pets = await response.json();

    expect(Array.isArray(pets)).toBeTruthy();
    expect(pets.length).toBeGreaterThan(0);

    // Validate schema of sample results
    const sample = pets.slice(0, 10);
    for (const pet of sample) {
      expect(pet).toHaveProperty('id');
      expect(pet.status).toBe('available');
    }
  });

  test('GET-002: [Positive] Fetch pets with status "pending"', async ({ request }) => {
    const response = await request.get('pet/findByStatus', {
      params: { status: 'pending' }
    });

    expect(response.status()).toBe(200);
    const pets = await response.json();
    expect(Array.isArray(pets)).toBeTruthy();

    const sample = pets.slice(0, 10);
    for (const pet of sample) {
      expect(pet).toHaveProperty('id');
      expect(pet.status).toBe('pending');
    }
  });

  test('GET-003: [Positive] Fetch pets with status "sold"', async ({ request }) => {
    const response = await request.get('pet/findByStatus', {
      params: { status: 'sold' }
    });

    expect(response.status()).toBe(200);
    const pets = await response.json();
    expect(Array.isArray(pets)).toBeTruthy();

    const sample = pets.slice(0, 10);
    for (const pet of sample) {
      expect(pet).toHaveProperty('id');
      expect(pet.status).toBe('sold');
    }
  });

  test('GET-004: [Positive] Fetch pets with multiple statuses (available,pending)', async ({ request }) => {
    const response = await request.get('pet/findByStatus', {
      params: { status: 'available,pending' }
    });

    expect(response.status()).toBe(200);
    const pets = await response.json();
    expect(Array.isArray(pets)).toBeTruthy();
  });

  test('GET-005: [Edge Case / Bug-003] Query with invalid status string', async ({ request }) => {
    const response = await request.get('pet/findByStatus', {
      params: { status: 'unsupported_status_value' }
    });

    // Swagger spec specifies 400 Invalid status, actual is 200 with []
    expect(response.status()).toBe(200);
    const pets = await response.json();
    expect(Array.isArray(pets)).toBeTruthy();
    expect(pets).toHaveLength(0);
  });

});
