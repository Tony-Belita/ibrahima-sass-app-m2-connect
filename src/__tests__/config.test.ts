// Test simple pour vérifier la configuration Jest
describe('Configuration Test', () => {
  it('should run basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle async operations', async () => {
    const promise = Promise.resolve('success')
    await expect(promise).resolves.toBe('success')
  })

  it('should mock environment correctly', () => {
    expect(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY).toBe('test-key')
  })
})
