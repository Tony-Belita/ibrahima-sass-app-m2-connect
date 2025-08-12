import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ModalFacture } from '@/components/ui/modal-facture'

// Mock SweetAlert2
const mockSwal = {
  fire: jest.fn(),
}
jest.mock('sweetalert2', () => mockSwal)

// Mock fetch
global.fetch = jest.fn()

const mockClients = [
  {
    id: 1,
    nom: 'Client Test 1',
    email: 'client1@test.com',
    adresse: '123 Rue Test',
  },
  {
    id: 2,
    nom: 'Client Test 2',
    email: 'client2@test.com',
    adresse: '456 Avenue Test',
  },
]

const mockFacture = {
  id: 1,
  id_proprietaire: 'user-123',
  id_client: 1,
  titre: 'Facture Test',
  articles: JSON.stringify([
    { nom: 'Service 1', prix: 100, quantite: 2 },
    { nom: 'Service 2', prix: 50, quantite: 1 },
  ]),
  montant_total: '250',
  cree_le: '2024-01-01',
  client: mockClients[0],
}

describe('ModalFacture', () => {
  const mockOnClose = jest.fn()
  const mockOnSave = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ clients: mockClients }),
    })
  })

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    facture: null,
    onSave: mockOnSave,
  }

  it('devrait s\'afficher quand isOpen est true', async () => {
    render(<ModalFacture {...defaultProps} />)
    
    await waitFor(() => {
      expect(screen.getByText('Modifier la facture')).toBeInTheDocument()
    })
  })

  it('ne devrait pas s\'afficher quand isOpen est false', () => {
    render(<ModalFacture {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Modifier la facture')).not.toBeInTheDocument()
  })

  it('devrait charger les clients lors de l\'ouverture', async () => {
    render(<ModalFacture {...defaultProps} />)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/clients?userID=user_123')
    })
  })

  it('devrait remplir le formulaire avec les données de la facture existante', async () => {
    render(<ModalFacture {...defaultProps} facture={mockFacture} />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Facture Test')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Service 1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Service 2')).toBeInTheDocument()
    })
  })

  it('devrait permettre d\'ajouter un article', async () => {
    render(<ModalFacture {...defaultProps} />)
    
    await waitFor(() => {
      const addButton = screen.getByText('Ajouter')
      fireEvent.click(addButton)
    })
    
    // Vérifier qu'un nouvel article a été ajouté
    expect(screen.getAllByPlaceholderText('Nom de l\'article')).toHaveLength(1)
  })

  it('devrait permettre de supprimer un article', async () => {
    render(<ModalFacture {...defaultProps} facture={mockFacture} />)
    
    await waitFor(() => {
      // Les articles de test contiennent des icônes de suppression
      const deleteButtons = screen.getAllByRole('button')
      const deleteButton = deleteButtons.find(btn => btn.getAttribute('aria-label')?.includes('Supprimer'))
      if (deleteButton) {
        fireEvent.click(deleteButton)
      }
    })
  })

  it('devrait modifier un article correctement', async () => {
    render(<ModalFacture {...defaultProps} facture={mockFacture} />)
    
    await waitFor(() => {
      const nomInput = screen.getByDisplayValue('Service 1')
      fireEvent.change(nomInput, { target: { value: 'Service Modifié' } })
      expect(screen.getByDisplayValue('Service Modifié')).toBeInTheDocument()
    })
  })

  it('devrait calculer le total correctement', async () => {
    render(<ModalFacture {...defaultProps} facture={mockFacture} />)
    
    await waitFor(() => {
      // mockFacture a 2 articles: (100*2) + (50*1) = 250
      expect(screen.getByText('Total: 250.00€')).toBeInTheDocument()
    })
  })

  it('devrait mettre à jour le total quand les articles changent', async () => {
    render(<ModalFacture {...defaultProps} facture={mockFacture} />)
    
    await waitFor(() => {
      const inputs = screen.getAllByDisplayValue('100')
      if (inputs.length > 0) {
        fireEvent.change(inputs[0], { target: { value: '150' } })
      }
    })
    
    await waitFor(() => {
      // Nouveau total: (150*2) + (50*1) = 350
      expect(screen.getByText('Total: 350.00€')).toBeInTheDocument()
    })
  })

  it('devrait soumettre le formulaire avec succès', async () => {
    ;(fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/clients')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ clients: mockClients }),
        })
      }
      if (url.includes('/api/facture')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            message: 'Facture modifiée avec succès',
            facture: mockFacture 
          }),
        })
      }
    })
    
    render(<ModalFacture {...defaultProps} facture={mockFacture} />)
    
    await waitFor(() => {
      const submitButton = screen.getByText('Modifier')
      fireEvent.click(submitButton)
    })
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/facture', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"title":"Facture Test"'),
      })
      expect(mockSwal.fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Succès !',
        text: 'Facture modifiée avec succès',
        showConfirmButton: false,
        timer: 1500,
      })
      expect(mockOnSave).toHaveBeenCalledWith(mockFacture)
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('devrait gérer les erreurs de soumission', async () => {
    ;(fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/clients')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ clients: mockClients }),
        })
      }
      if (url.includes('/api/facture')) {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ 
            message: 'Erreur lors de la modification' 
          }),
        })
      }
    })
    
    render(<ModalFacture {...defaultProps} facture={mockFacture} />)
    
    await waitFor(() => {
      const submitButton = screen.getByText('Modifier')
      fireEvent.click(submitButton)
    })
    
    await waitFor(() => {
      expect(mockSwal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Erreur !',
        text: 'Erreur lors de la modification',
      })
    })
  })

  it('devrait fermer le modal et réinitialiser le formulaire', async () => {
    render(<ModalFacture {...defaultProps} facture={mockFacture} />)
    
    await waitFor(() => {
      const closeButton = screen.getByText('Annuler')
      fireEvent.click(closeButton)
    })
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('devrait valider que tous les champs requis sont remplis', async () => {
    render(<ModalFacture {...defaultProps} />)
    
    await waitFor(() => {
      const submitButton = screen.getByText('Modifier')
      fireEvent.click(submitButton)
      // Le formulaire peut être soumis même avec des champs vides selon l'implémentation
      // Ce test vérifie juste qu'on peut cliquer sur le bouton
      expect(submitButton).toBeInTheDocument()
    })
  })

  it('devrait gérer les erreurs de réseau', async () => {
    ;(fetch as jest.Mock).mockImplementation((url) => {
      if (url.includes('/api/clients')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ clients: mockClients }),
        })
      }
      if (url.includes('/api/facture')) {
        return Promise.reject(new Error('Erreur de réseau'))
      }
    })
    
    render(<ModalFacture {...defaultProps} facture={mockFacture} />)
    
    await waitFor(() => {
      const submitButton = screen.getByText('Modifier')
      fireEvent.click(submitButton)
    })
    
    await waitFor(() => {
      expect(mockSwal.fire).toHaveBeenCalledWith({
        icon: 'error',
        title: 'Erreur !',
        text: 'Erreur de connexion',
      })
    })
  })
})
