import { NextRequest } from 'next/server'
import { POST, GET, DELETE, PUT } from '@/app/api/facture/route'
import * as actions from '@/lib/actions'

// Mock les actions
jest.mock('@/lib/actions', () => ({
  creerFacture: jest.fn(),
  getFacturesUtilisateur: jest.fn(),
  supprimerFacture: jest.fn(),
  modifierFacture: jest.fn(),
}))

// Helper pour créer une requête mock
const createMockRequest = (
  method: string,
  body?: any,
  searchParams?: Record<string, string>
) => {
  const url = new URL('http://localhost:3000/api/facture')
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  return new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

describe('/api/facture', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/facture', () => {
    it('devrait créer une nouvelle facture avec succès', async () => {
      const factureData = {
        customer: 1,
        title: 'Facture Test',
        items: [
          { nom: 'Service 1', prix: 100, quantite: 1 },
          { nom: 'Service 2', prix: 150, quantite: 2 },
        ],
        total: 400,
        ownerID: 'user-123',
      }

      const mockFacture = {
        id: 1,
        id_proprietaire: 'user-123',
        id_client: 1,
        titre: 'Facture Test',
        articles: JSON.stringify(factureData.items),
        montant_total: 400,
        cree_le: new Date(),
      }

      ;(actions.creerFacture as jest.Mock).mockResolvedValue(mockFacture)

      const request = createMockRequest('POST', factureData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(actions.creerFacture).toHaveBeenCalledWith({
        user_id: factureData.ownerID,
        customer_id: factureData.customer,
        title: factureData.title,
        total_amount: factureData.total,
        items: JSON.stringify(factureData.items),
      })
      expect(response.status).toBe(201)
      expect(responseData.message).toBe('Nouvelle facture créée !')
      expect(responseData.facture).toEqual(mockFacture)
    })

    it('devrait retourner une erreur 400 en cas d\'échec', async () => {
      const factureData = {
        customer: 1,
        title: 'Facture Test',
        items: [],
        total: 0,
        ownerID: 'user-123',
      }

      ;(actions.creerFacture as jest.Mock).mockRejectedValue(
        new Error('Erreur de création de facture')
      )

      const request = createMockRequest('POST', factureData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.message).toBe('Une erreur s\'est produite')
    })

    it('devrait gérer les données de facture invalides', async () => {
      const invalidData = {
        // customer manquant
        title: 'Facture Invalide',
        items: [],
        total: -100, // montant négatif
        ownerID: 'user-123',
      }

      ;(actions.creerFacture as jest.Mock).mockRejectedValue(
        new Error('Données invalides')
      )

      const request = createMockRequest('POST', invalidData)
      const response = await POST(request)

      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/facture', () => {
    it('devrait récupérer toutes les factures de l\'utilisateur', async () => {
      const mockFactures = [
        {
          id: 1,
          titre: 'Facture 1',
          montant_total: 100,
          client: { nom: 'Client 1' },
          cree_le: new Date(),
        },
        {
          id: 2,
          titre: 'Facture 2',
          montant_total: 200,
          client: { nom: 'Client 2' },
          cree_le: new Date(),
        },
      ]

      ;(actions.getFacturesUtilisateur as jest.Mock).mockResolvedValue(mockFactures)

      const request = createMockRequest('GET', undefined, { userID: 'user-123' })
      const response = await GET(request)
      const responseData = await response.json()

      expect(actions.getFacturesUtilisateur).toHaveBeenCalledWith('user-123')
      expect(response.status).toBe(200)
      expect(responseData.message).toBe('Factures récupérées avec succès !')
      expect(responseData.factures).toEqual(mockFactures)
    })

    it('devrait retourner une erreur 400 en cas d\'échec', async () => {
      ;(actions.getFacturesUtilisateur as jest.Mock).mockRejectedValue(
        new Error('Erreur de base de données')
      )

      const request = createMockRequest('GET', undefined, { userID: 'user-123' })
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.message).toBe('Une erreur s\'est produite')
    })

    it('devrait gérer un userID manquant', async () => {
      const request = createMockRequest('GET')
      const response = await GET(request)

      expect(response.status).toBe(400)
    })
  })

  describe('DELETE /api/facture', () => {
    it('devrait supprimer une facture avec succès', async () => {
      ;(actions.supprimerFacture as jest.Mock).mockResolvedValue({
        id: 1,
        titre: 'Facture supprimée',
      })

      const request = createMockRequest('DELETE', undefined, { id: '1' })
      const response = await DELETE(request)
      const responseData = await response.json()

      expect(actions.supprimerFacture).toHaveBeenCalledWith(1)
      expect(response.status).toBe(200)
      expect(responseData.message).toBe('Facture supprimée !')
    })

    it('devrait retourner une erreur 400 en cas d\'échec', async () => {
      ;(actions.supprimerFacture as jest.Mock).mockRejectedValue(
        new Error('Facture non trouvée')
      )

      const request = createMockRequest('DELETE', undefined, { id: '999' })
      const response = await DELETE(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.message).toBe('Une erreur s\'est produite')
    })

    it('devrait gérer un ID de facture invalide', async () => {
      ;(actions.supprimerFacture as jest.Mock).mockRejectedValue(
        new Error('ID invalide')
      )

      const request = createMockRequest('DELETE', undefined, { id: 'invalid' })
      const response = await DELETE(request)

      expect(response.status).toBe(400)
    })
  })
})
