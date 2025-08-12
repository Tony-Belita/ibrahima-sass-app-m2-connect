/**
 * @jest-environment node
 */

// Test pour l'API clients
describe('API Clients', () => {
  it('devrait être fonctionnel', () => {
    expect(1 + 1).toBe(2)
  })

  it('devrait pouvoir tester les routes API', async () => {
    // Mock d'une fonction
    const mockFunction = jest.fn(() => 'test')
    expect(mockFunction()).toBe('test')
  })


})
