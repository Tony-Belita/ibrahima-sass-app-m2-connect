"use client";
import { useState, useEffect } from "react";
import { IconX, IconPlus, IconTrash } from "@tabler/icons-react";
import Swal from 'sweetalert2';

interface Article {
  nom: string;
  prix: number;
  quantite: number;
}

interface Client {
  id: number;
  nom: string;
  email: string;
  adresse: string;
}

interface Facture {
  id: number;
  id_proprietaire: string;
  id_client: number;
  titre: string;
  articles: string;
  montant_total: string;
  cree_le: string;
  client: Client;
}

interface ModalFactureProps {
  isOpen: boolean;
  onClose: () => void;
  facture: Facture | null;
  onSave: () => void;
}

export const ModalFacture = ({ isOpen, onClose, facture, onSave }: ModalFactureProps) => {
  const [titre, setTitre] = useState("");
  const [clientSelectionne, setClientSelectionne] = useState<number>(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    if (isOpen) {
      chargerClients();
      if (facture) {
        setTitre(facture.titre);
        setClientSelectionne(facture.id_client);
        try {
          const articlesParses = JSON.parse(facture.articles);
          setArticles(articlesParses);
        } catch {
          setArticles([]);
        }
      }
    }
  }, [isOpen, facture]);

  const chargerClients = async () => {
    try {
      const response = await fetch('/api/clients?userID=user_123');
      const data = await response.json();
      if (response.ok) {
        setClients(data.clients);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
    }
  };

  const ajouterArticle = () => {
    setArticles([...articles, { nom: "", prix: 0, quantite: 1 }]);
  };

  const supprimerArticle = (index: number) => {
    setArticles(articles.filter((_, i) => i !== index));
  };

  const modifierArticle = (index: number, field: keyof Article, value: string | number) => {
    const nouveauxArticles = [...articles];
    nouveauxArticles[index] = { ...nouveauxArticles[index], [field]: value };
    setArticles(nouveauxArticles);
  };

  const calculerTotal = () => {
    return articles.reduce((total, article) => total + (article.prix * article.quantite), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChargement(true);

    try {
      const response = await fetch('/api/facture', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: facture?.id,
          customer: clientSelectionne,
          title: titre,
          items: articles,
          total: calculerTotal(),
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: 'Facture modifiée avec succès',
          showConfirmButton: false,
          timer: 1500
        });
        onSave();
        onClose();
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Erreur !',
          text: data.message || 'Erreur lors de la modification de la facture',
        });
      }
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'Erreur !',
        text: 'Erreur de connexion',
      });
    } finally {
      setChargement(false);
    }
  };

  const resetForm = () => {
    setTitre("");
    setClientSelectionne(0);
    setArticles([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Modifier la facture
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <IconX className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre et Client */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titre de la facture
                </label>
                <input
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Client
                </label>
                <select
                  value={clientSelectionne}
                  onChange={(e) => setClientSelectionne(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value={0}>Sélectionner un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Articles */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Articles
                </label>
                <button
                  type="button"
                  onClick={ajouterArticle}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <IconPlus className="h-4 w-4" />
                  <span>Ajouter</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {articles.map((article, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 border border-gray-200 dark:border-gray-600 rounded-md">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={article.nom}
                        onChange={(e) => modifierArticle(index, 'nom', e.target.value)}
                        placeholder="Nom de l'article"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={article.quantite}
                        onChange={(e) => modifierArticle(index, 'quantite', Number(e.target.value))}
                        placeholder="Qté"
                        min="1"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={article.prix}
                        onChange={(e) => modifierArticle(index, 'prix', Number(e.target.value))}
                        placeholder="Prix unitaire"
                        min="0"
                        step="0.01"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {(article.prix * article.quantite).toFixed(2)}€
                      </span>
                    </div>
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() => supprimerArticle(index)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-end">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  Total: {calculerTotal().toFixed(2)}€
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={chargement}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {chargement ? "Modification..." : "Modifier"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
