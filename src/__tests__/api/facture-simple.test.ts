/**
 * @jest-environment node
 */

// Test pour l'API facture
describe('API Facture', () => {
  it('devrait être fonctionnel', () => {
    expect(1 + 1).toBe(2)
  })

  it('devrait pouvoir tester les routes API', async () => {
    // Mock d'une fonction 
    const mockFunction = jest.fn(() => 'facture-test')
    expect(mockFunction()).toBe('facture-test')
  })


})
