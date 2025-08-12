import { NextRequest } from 'next/server'
import { POST, GET, DELETE, PUT } from '@/app/api/clients/route'
import * as actions from '@/lib/actions'

// Mock les actions
jest.mock('@/lib/actions', () => ({
  ajouterClient: jest.fn(),
  getClients: jest.fn(),
  supprimerClient: jest.fn(),
  modifierClient: jest.fn(),
}))

// Helper pour créer une requête mock
const createMockRequest = (
  method: string,
  body?: any,
  searchParams?: Record<string, string>
) => {
  const url = new URL('http://localhost:3000/api/clients')
  
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

describe('/api/clients', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/clients', () => {
    it('devrait créer un nouveau client avec succès', async () => {
      const clientData = {
        userID: 'user-123',
        customerName: 'Test Client',
        customerEmail: 'test@example.com',
        customerAddress: '123 Test Street',
      }

      ;(actions.ajouterClient as jest.Mock).mockResolvedValue({
        id: 1,
        ...clientData,
      })

      const request = createMockRequest('POST', clientData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(actions.ajouterClient).toHaveBeenCalledWith({
        user_id: clientData.userID,
        name: clientData.customerName,
        email: clientData.customerEmail,
        address: clientData.customerAddress,
      })
      expect(response.status).toBe(201)
      expect(responseData.message).toBe('Nouveau client créé !')
    })

    it('devrait retourner une erreur 400 en cas d\'échec', async () => {
      const clientData = {
        userID: 'user-123',
        customerName: 'Test Client',
        customerEmail: 'test@example.com',
        customerAddress: '123 Test Street',
      }

      ;(actions.ajouterClient as jest.Mock).mockRejectedValue(
        new Error('Erreur de base de données')
      )

      const request = createMockRequest('POST', clientData)
      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.message).toBe('Une erreur s\'est produite')
    })

    it('devrait gérer les données manquantes', async () => {
      const incompleteData = {
        userID: 'user-123',
        // customerName manquant
        customerEmail: 'test@example.com',
        customerAddress: '123 Test Street',
      }

      ;(actions.ajouterClient as jest.Mock).mockRejectedValue(
        new Error('Données requises manquantes')
      )

      const request = createMockRequest('POST', incompleteData)
      const response = await POST(request)

      expect(response.status).toBe(400)
    })
  })

  describe('GET /api/clients', () => {
    it('devrait récupérer tous les clients de l\'utilisateur', async () => {
      const mockClients = [
        {
          id: 1,
          nom: 'Client 1',
          email: 'client1@example.com',
          adresse: '123 Rue 1',
        },
        {
          id: 2,
          nom: 'Client 2',
          email: 'client2@example.com',
          adresse: '456 Rue 2',
        },
      ]

      ;(actions.getClients as jest.Mock).mockResolvedValue(mockClients)

      const request = createMockRequest('GET', undefined, { userID: 'user-123' })
      const response = await GET(request)
      const responseData = await response.json()

      expect(actions.getClients).toHaveBeenCalledWith('user-123')
      expect(response.status).toBe(200)
      expect(responseData.message).toBe('Clients récupérés avec succès !')
      expect(responseData.clients).toEqual(mockClients)
    })

    it('devrait retourner une erreur 400 en cas d\'échec', async () => {
      ;(actions.getClients as jest.Mock).mockRejectedValue(
        new Error('Erreur de base de données')
      )

      const request = createMockRequest('GET', undefined, { userID: 'user-123' })
      const response = await GET(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.message).toBe('Une erreur s\'est produite')
    })
  })

  describe('DELETE /api/clients', () => {
    it('devrait supprimer un client avec succès', async () => {
      ;(actions.supprimerClient as jest.Mock).mockResolvedValue({
        id: 1,
        nom: 'Client supprimé',
      })

      const request = createMockRequest('DELETE', undefined, { id: '1' })
      const response = await DELETE(request)
      const responseData = await response.json()

      expect(actions.supprimerClient).toHaveBeenCalledWith(1)
      expect(response.status).toBe(200)
      expect(responseData.message).toBe('Client supprimé !')
    })

    it('devrait retourner une erreur 400 en cas d\'échec', async () => {
      ;(actions.supprimerClient as jest.Mock).mockRejectedValue(
        new Error('Client non trouvé')
      )

      const request = createMockRequest('DELETE', undefined, { id: '999' })
      const response = await DELETE(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.message).toBe('Une erreur s\'est produite')
    })

    it('devrait gérer un ID invalide', async () => {
      ;(actions.supprimerClient as jest.Mock).mockRejectedValue(
        new Error('ID invalide')
      )

      const request = createMockRequest('DELETE', undefined, { id: 'invalid' })
      const response = await DELETE(request)

      expect(response.status).toBe(400)
    })
  })

  describe('PUT /api/clients', () => {
    it('devrait modifier un client avec succès', async () => {
      const updateData = {
        id: 1,
        customerName: 'Client Modifié',
        customerEmail: 'modifie@example.com',
        customerAddress: '789 Rue Modifiée',
      }

      const mockUpdatedClient = {
        id: 1,
        nom: 'Client Modifié',
        email: 'modifie@example.com',
        adresse: '789 Rue Modifiée',
      }

      ;(actions.modifierClient as jest.Mock).mockResolvedValue(mockUpdatedClient)

      const request = createMockRequest('PUT', updateData)
      const response = await PUT(request)
      const responseData = await response.json()

      expect(actions.modifierClient).toHaveBeenCalledWith(1, {
        name: updateData.customerName,
        email: updateData.customerEmail,
        address: updateData.customerAddress,
      })
      expect(response.status).toBe(200)
      expect(responseData.message).toBe('Client modifié avec succès !')
      expect(responseData.client).toEqual(mockUpdatedClient)
    })

    it('devrait retourner une erreur 400 en cas d\'échec de modification', async () => {
      const updateData = {
        id: 999,
        customerName: 'Client Inexistant',
        customerEmail: 'inexistant@example.com',
        customerAddress: 'Adresse inexistante',
      }

      ;(actions.modifierClient as jest.Mock).mockRejectedValue(
        new Error('Client non trouvé')
      )

      const request = createMockRequest('PUT', updateData)
      const response = await PUT(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.message).toBe('Une erreur s\'est produite')
    })
  })
})
