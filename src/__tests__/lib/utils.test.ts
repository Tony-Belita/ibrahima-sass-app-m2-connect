import { cn } from '@/lib/utils'

describe('Utilitaires', () => {
  describe('cn (className helper)', () => {
    it('devrait combiner des classes correctement', () => {
      const result = cn('text-red-500', 'bg-blue-500')
      expect(result).toContain('text-red-500')
      expect(result).toContain('bg-blue-500')
    })

    it('devrait gérer les classes conditionnelles', () => {
      const isActive = true
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toContain('base-class')
      expect(result).toContain('active-class')
    })

    it('devrait gérer les classes conditionnelles fausses', () => {
      const isActive = false
      const result = cn('base-class', isActive && 'active-class')
      expect(result).toContain('base-class')
      expect(result).not.toContain('active-class')
    })

    it('devrait fusionner les classes Tailwind conflictuelles', () => {
      const result = cn('px-2 py-1', 'p-3')
      expect(result).toContain('p-3')
      expect(result).not.toContain('px-2')
      expect(result).not.toContain('py-1')
    })

    it('devrait gérer les tableaux de classes', () => {
      const result = cn(['text-sm', 'font-bold'], 'text-blue-500')
      expect(result).toContain('text-sm')
      expect(result).toContain('font-bold')
      expect(result).toContain('text-blue-500')
    })

    it('devrait gérer les valeurs undefined et null', () => {
      const result = cn('base-class', undefined, null, 'other-class')
      expect(result).toContain('base-class')
      expect(result).toContain('other-class')
    })

    it('devrait retourner une chaîne vide pour aucun argument', () => {
      const result = cn()
      expect(result).toBe('')
    })
  })
})
