import { 
  creerFacture,
  getFacturesUtilisateur,
  getFactureUnique,
  supprimerFacture,
  modifierFacture,
  getClients,
  getClientUnique,
  ajouterClient,
  supprimerClient,
  modifierClient,
  getInfosBancairesUtilisateur,
  mettreAJourInfosBancaires
} from '@/lib/actions'
import { prisma } from '@/lib/prisma'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    facture: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    client: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    infosBancaires: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  },
}))

describe('Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ===== TESTS POUR LES FACTURES =====
  describe('Actions Factures', () => {
    const mockFactureData = {
      user_id: 'user-123',
      customer_id: 1,
      title: 'Facture Test',
      items: JSON.stringify([{ nom: 'Service', prix: 100, quantite: 1 }]),
      total_amount: 100,
    }

    const mockFacture = {
      id: 1,
      id_proprietaire: 'user-123',
      id_client: 1,
      titre: 'Facture Test',
      articles: JSON.stringify([{ nom: 'Service', prix: 100, quantite: 1 }]),
      montant_total: '100',
      cree_le: new Date(),
      client: {
        id: 1,
        nom: 'Client Test',
        email: 'client@test.com',
        adresse: '123 Rue Test',
      },
    }

    describe('creerFacture', () => {
      it('devrait créer une nouvelle facture avec succès', async () => {
        (prisma.facture.create as jest.Mock).mockResolvedValue(mockFacture)

        const result = await creerFacture(mockFactureData)

        expect(prisma.facture.create).toHaveBeenCalledWith({
          data: {
            id_proprietaire: mockFactureData.user_id,
            id_client: mockFactureData.customer_id,
            titre: mockFactureData.title,
            articles: mockFactureData.items,
            montant_total: mockFactureData.total_amount.toString(),
          },
        })
        expect(result).toEqual(mockFacture)
      })

      it('devrait gérer les erreurs lors de la création', async () => {
        const error = new Error('Erreur de création')
        ;(prisma.facture.create as jest.Mock).mockRejectedValue(error)

        await expect(creerFacture(mockFactureData)).rejects.toThrow('Erreur de création')
      })
    })

    describe('getFacturesUtilisateur', () => {
      it('devrait récupérer toutes les factures de l\'utilisateur', async () => {
        const mockFactures = [mockFacture]
        ;(prisma.facture.findMany as jest.Mock).mockResolvedValue(mockFactures)

        const result = await getFacturesUtilisateur('user-123')

        expect(prisma.facture.findMany).toHaveBeenCalledWith({
          where: { id_proprietaire: 'user-123' },
          include: { client: true },
          orderBy: { cree_le: 'desc' },
        })
        expect(result).toEqual(mockFactures)
      })
    })

    describe('getFactureUnique', () => {
      it('devrait récupérer une facture spécifique', async () => {
        (prisma.facture.findUnique as jest.Mock).mockResolvedValue(mockFacture)

        const result = await getFactureUnique(1)

        expect(prisma.facture.findUnique).toHaveBeenCalledWith({
          where: { id: 1 },
          include: { client: true },
        })
        expect(result).toEqual(mockFacture)
      })
    })

    describe('supprimerFacture', () => {
      it('devrait supprimer une facture', async () => {
        (prisma.facture.delete as jest.Mock).mockResolvedValue(mockFacture)

        const result = await supprimerFacture(1)

        expect(prisma.facture.delete).toHaveBeenCalledWith({
          where: { id: 1 },
        })
        expect(result).toEqual(mockFacture)
      })
    })

    describe('modifierFacture', () => {
      it('devrait modifier une facture existante', async () => {
        const updateData = {
          customer_id: 2,
          title: 'Facture Modifiée',
          items: JSON.stringify([{ nom: 'Service Modifié', prix: 150, quantite: 1 }]),
          total_amount: 150,
        }
        const updatedFacture = { ...mockFacture, ...updateData }
        ;(prisma.facture.update as jest.Mock).mockResolvedValue(updatedFacture)

        const result = await modifierFacture(1, updateData)

        expect(prisma.facture.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: {
            id_client: updateData.customer_id,
            titre: updateData.title,
            articles: updateData.items,
            montant_total: updateData.total_amount.toString(),
          },
        })
        expect(result).toEqual(updatedFacture)
      })
    })
  })

  // ===== TESTS POUR LES CLIENTS =====
  describe('Actions Clients', () => {
    const mockClient = {
      id: 1,
      id_proprietaire: 'user-123',
      nom: 'Client Test',
      email: 'client@test.com',
      adresse: '123 Rue Test',
      cree_le: new Date(),
    }

    describe('getClients', () => {
      it('devrait récupérer tous les clients de l\'utilisateur', async () => {
        const mockClients = [mockClient]
        ;(prisma.client.findMany as jest.Mock).mockResolvedValue(mockClients)

        const result = await getClients('user-123')

        expect(prisma.client.findMany).toHaveBeenCalledWith({
          where: { id_proprietaire: 'user-123' },
          orderBy: { cree_le: 'desc' },
        })
        expect(result).toEqual(mockClients)
      })
    })

    describe('getClientUnique', () => {
      it('devrait récupérer un client par nom', async () => {
        (prisma.client.findFirst as jest.Mock).mockResolvedValue(mockClient)

        const result = await getClientUnique('Client Test')

        expect(prisma.client.findFirst).toHaveBeenCalledWith({
          where: { nom: 'Client Test' },
        })
        expect(result).toEqual(mockClient)
      })
    })

    describe('ajouterClient', () => {
      it('devrait ajouter un nouveau client', async () => {
        const newClientData = {
          user_id: 'user-123',
          name: 'Nouveau Client',
          email: 'nouveau@test.com',
          address: '456 Nouvelle Rue',
        }
        ;(prisma.client.create as jest.Mock).mockResolvedValue(mockClient)

        const result = await ajouterClient(newClientData)

        expect(prisma.client.create).toHaveBeenCalledWith({
          data: {
            id_proprietaire: newClientData.user_id,
            nom: newClientData.name,
            email: newClientData.email,
            adresse: newClientData.address,
          },
        })
        expect(result).toEqual(mockClient)
      })
    })

    describe('supprimerClient', () => {
      it('devrait supprimer un client', async () => {
        (prisma.client.delete as jest.Mock).mockResolvedValue(mockClient)

        const result = await supprimerClient(1)

        expect(prisma.client.delete).toHaveBeenCalledWith({
          where: { id: 1 },
        })
        expect(result).toEqual(mockClient)
      })
    })

    describe('modifierClient', () => {
      it('devrait modifier un client existant', async () => {
        const updateData = {
          name: 'Client Modifié',
          email: 'modifie@test.com',
          address: '789 Rue Modifiée',
        }
        ;(prisma.client.update as jest.Mock).mockResolvedValue(mockClient)

        const result = await modifierClient(1, updateData)

        expect(prisma.client.update).toHaveBeenCalledWith({
          where: { id: 1 },
          data: {
            nom: updateData.name,
            email: updateData.email,
            adresse: updateData.address,
          },
        })
        expect(result).toEqual(mockClient)
      })
    })
  })

  // ===== TESTS POUR LES INFORMATIONS BANCAIRES =====
  describe('Actions Informations Bancaires', () => {
    const mockInfosBancaires = {
      id: 1,
      id_proprietaire: 'user-123',
      nom_banque: 'Banque Test',
      numero_compte: '123456789',
      nom_compte: 'Compte Test',
      devise: 'EUR',
    }

    describe('getInfosBancairesUtilisateur', () => {
      it('devrait récupérer les informations bancaires de l\'utilisateur', async () => {
        (prisma.infosBancaires.findUnique as jest.Mock).mockResolvedValue(mockInfosBancaires)

        const result = await getInfosBancairesUtilisateur('user-123')

        expect(prisma.infosBancaires.findUnique).toHaveBeenCalledWith({
          where: { id_proprietaire: 'user-123' },
        })
        expect(result).toEqual(mockInfosBancaires)
      })
    })

    describe('mettreAJourInfosBancaires', () => {
      it('devrait mettre à jour les informations bancaires existantes', async () => {
        const updateData = {
          user_id: 'user-123',
          bank_name: 'Nouvelle Banque',
          account_number: '987654321',
          account_name: 'Nouveau Compte',
          currency: 'USD',
        }
        ;(prisma.infosBancaires.upsert as jest.Mock).mockResolvedValue(mockInfosBancaires)

        const result = await mettreAJourInfosBancaires(updateData)

        expect(prisma.infosBancaires.upsert).toHaveBeenCalledWith({
          where: { id_proprietaire: updateData.user_id },
          update: {
            nom_banque: updateData.bank_name,
            numero_compte: updateData.account_number,
            nom_compte: updateData.account_name,
            devise: updateData.currency,
          },
          create: {
            id_proprietaire: updateData.user_id,
            nom_banque: updateData.bank_name,
            numero_compte: updateData.account_number,
            nom_compte: updateData.account_name,
            devise: updateData.currency,
          },
        })
        expect(result).toEqual(mockInfosBancaires)
      })

      it('devrait gérer les erreurs lors de la mise à jour', async () => {
        const updateData = {
          user_id: 'user-123',
          bank_name: 'Banque',
          account_number: '123',
          account_name: 'Compte',
          currency: 'EUR',
        }
        const error = new Error('Erreur de mise à jour')
        ;(prisma.infosBancaires.upsert as jest.Mock).mockRejectedValue(error)

        await expect(mettreAJourInfosBancaires(updateData)).rejects.toThrow('Erreur de mise à jour')
      })
    })
  })
})
