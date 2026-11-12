// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Task 2: API Automation Testing
 * Targets 3 Swagger Petstore Endpoints:
 * 1. POST /pet - Add a new pet
 * 2. GET /pet/findByStatus - Find pets by status
 * 3. DELETE /pet/{petId} - Delete a pet by ID
 */
test.describe('Swagger Petstore API Automation Suite', () => {
  // Generate unique ID per run to avoid collision
  const testPetId = Math.floor(Math.random() * 1000000000) + 100000;
  const testPetPayload = {
    id: testPetId,
    category: {
      id: 101,
      name: 'Canine'
    },
    name: 'AutomationPuppy',
    photoUrls: [
      'https://example.com/puppy1.png',
      'https://example.com/puppy2.png'
    ],
    tags: [
      { id: 1, name: 'playwright' },
      { id: 2, name: 'automation' }
    ],
    status: 'available'
  };

  test.describe('Endpoint 1: POST /pet - Add a new pet', () => {

    test('API-TC-001: [Positive] Successfully add a new pet with complete valid payload', async ({ request }) => {
      const response = await request.post('pet', {
        data: testPetPayload
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      
      expect(body.id).toBe(testPetId);
      expect(body.name).toBe(testPetPayload.name);
      expect(body.status).toBe(testPetPayload.status);
      expect(body.category.name).toBe(testPetPayload.category.name);
      expect(body.tags).toHaveLength(2);
    });

    test('API-TC-002: [Positive] Successfully add a pet with minimal mandatory fields', async ({ request }) => {
      const minimalId = Math.floor(Math.random() * 1000000000) + 200000;
      const minimalPayload = {
        id: minimalId,
        name: 'MinimalPet',
        photoUrls: ['https://example.com/min.png']
      };

      const response = await request.post('pet', {
        data: minimalPayload
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.id).toBe(minimalId);
      expect(body.name).toBe(minimalPayload.name);

      // Cleanup minimal pet
      await request.delete(`pet/${minimalId}`, {
        headers: { api_key: 'special-key' }
      });
    });

    test('API-TC-003: [Negative / Bug Verification] Server behavior when sending invalid data type for ID', async ({ request }) => {
      // In Swagger contract, ID is int64. Passing string should return 400 Bad Request.
      // But server currently throws 500 unhandled exception (logged as BUG-002).
      const response = await request.post('pet', {
        data: {
          id: 'invalid_string_id',
          name: 'InvalidDataTypePet'
        }
      });

      // Assert that it returns an error status code (>= 400)
      expect(response.status()).toBeGreaterThanOrEqual(400);
      const body = await response.json();
      expect(body).toHaveProperty('message');
    });

  });

  test.describe('Endpoint 2: GET /pet/findByStatus - Find pets by status', () => {

    test('API-TC-004: [Positive] Fetch pets with status "available"', async ({ request }) => {
      const response = await request.get('pet/findByStatus', {
        params: { status: 'available' }
      });

      expect(response.status()).toBe(200);
      const pets = await response.json();

      expect(Array.isArray(pets)).toBeTruthy();
      expect(pets.length).toBeGreaterThan(0);

      // Verify each pet has the expected schema and status
      const sample = pets.slice(0, 10);
      for (const pet of sample) {
        expect(pet).toHaveProperty('id');
        expect(pet.status).toBe('available');
      }
    });

    test('API-TC-005: [Positive] Fetch pets with status "pending"', async ({ request }) => {
      const response = await request.get('pet/findByStatus', {
        params: { status: 'pending' }
      });

      expect(response.status()).toBe(200);
      const pets = await response.json();
      expect(Array.isArray(pets)).toBeTruthy();
      
      const sample = pets.slice(0, 10);
      for (const pet of sample) {
        expect(pet.status).toBe('pending');
      }
    });

    test('API-TC-006: [Positive] Fetch pets with status "sold"', async ({ request }) => {
      const response = await request.get('pet/findByStatus', {
        params: { status: 'sold' }
      });

      expect(response.status()).toBe(200);
      const pets = await response.json();
      expect(Array.isArray(pets)).toBeTruthy();

      const sample = pets.slice(0, 10);
      for (const pet of sample) {
        expect(pet.status).toBe('sold');
      }
    });

    test('API-TC-007: [Positive] Fetch pets with multiple comma-separated statuses', async ({ request }) => {
      const response = await request.get('pet/findByStatus', {
        params: { status: 'available,pending' }
      });

      expect(response.status()).toBe(200);
      const pets = await response.json();
      expect(Array.isArray(pets)).toBeTruthy();
    });

    test('API-TC-008: [Negative / Edge Case] Handle invalid query parameter value', async ({ request }) => {
      const response = await request.get('pet/findByStatus', {
        params: { status: 'unknown_status_xyz' }
      });

      // API returns 200 with empty array (or 400 according to spec)
      expect(response.status()).toBe(200);
      const pets = await response.json();
      expect(Array.isArray(pets)).toBeTruthy();
      expect(pets).toHaveLength(0);
    });

  });

  test.describe('Endpoint 3: DELETE /pet/{petId} - Delete a pet by ID', () => {

    test('API-TC-009: [Positive] Successfully delete an existing pet by ID', async ({ request }) => {
      // Step 1: Ensure pet exists by creating one
      const petToDeleteId = Math.floor(Math.random() * 1000000000) + 300000;
      const createRes = await request.post('pet', {
        data: {
          id: petToDeleteId,
          name: 'PetToBeDeleted',
          status: 'available'
        }
      });
      expect(createRes.status()).toBe(200);

      // Step 2: Delete the pet
      const deleteResponse = await request.delete(`pet/${petToDeleteId}`, {
        headers: { api_key: 'special-key' }
      });

      expect(deleteResponse.status()).toBe(200);
      const deleteBody = await deleteResponse.json();
      expect(deleteBody.code).toBe(200);
      expect(deleteBody.message).toBe(String(petToDeleteId));

      // Step 3: Verify pet is no longer found (GET returns 404)
      const verifyGet = await request.get(`pet/${petToDeleteId}`);
      expect(verifyGet.status()).toBe(404);
    });

    test('API-TC-010: [Negative] Attempt to delete non-existent pet ID returns 404', async ({ request }) => {
      const nonExistentId = 999999999999999;
      const response = await request.delete(`pet/${nonExistentId}`, {
        headers: { api_key: 'special-key' }
      });

      expect(response.status()).toBe(404);
    });

  });

  // End-to-End API Workflow Chaining: POST -> GET -> DELETE -> Verify GET (404)
  test.describe('E2E Lifecycle: POST -> GET by Status -> DELETE -> Verify 404', () => {
    test('API-TC-011: Complete Pet Lifecycle Integration Flow', async ({ request }) => {
      const cyclePetId = Math.floor(Math.random() * 1000000000) + 400000;
      const cyclePetName = `CyclePet_${cyclePetId}`;

      // 1. Create
      const postRes = await request.post('pet', {
        data: {
          id: cyclePetId,
          name: cyclePetName,
          status: 'available'
        }
      });
      expect(postRes.status()).toBe(200);

      // 2. Query status list
      const getRes = await request.get('pet/findByStatus', {
        params: { status: 'available' }
      });
      expect(getRes.status()).toBe(200);

      // 3. Delete
      const delRes = await request.delete(`pet/${cyclePetId}`, {
        headers: { api_key: 'special-key' }
      });
      expect(delRes.status()).toBe(200);

      // 4. Verify Deleted
      const verifyRes = await request.get(`pet/${cyclePetId}`);
      expect(verifyRes.status()).toBe(404);
    });
  });

});
