"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Sidebar, 
  SidebarBody, 
  SidebarLink 
} from "@/components/ui/sidebar";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { 
  IconDashboard, 
  IconSettings, 
  IconUsers, 
  IconHistory,
  IconFileInvoice,
  IconPlus
} from "@tabler/icons-react";

// Types
interface Client {
  id: number;
  nom: string;
  email: string;
  adresse: string;
}

// Composant temporaire pour le tableau des factures
const TableauFactures = ({ listeArticles }: { listeArticles: Article[] }) => {
  const obtenirMontantTotal = () => {
    return listeArticles.reduce((total, article) => {
      // Gérer les différents formats d'articles
      const prixTotal = article.prix || (article.coût ? article.coût * article.quantite : 0) || 0;
      return total + prixTotal;
    }, 0);
  };

  return (
    <div className="w-full mt-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Aperçu de la facture
          </h3>
        </div>
        
        {listeArticles.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Aucun article ajouté pour le moment
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Coût unitaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Prix total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {listeArticles.map((article, index) => {
                  // Gérer les différents formats d'articles (coût vs prix unitaire)
                  const coutUnitaire = article.coût || (article.prix ? article.prix / article.quantite : 0) || 0;
                  const prixTotal = article.prix || (article.coût ? article.coût * article.quantite : 0) || 0;
                  const articleId = article.id || `article-${index}`;
                  
                  return (
                    <tr key={articleId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {article.nom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {coutUnitaire.toLocaleString("fr-FR")} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {article.quantite}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {prixTotal.toLocaleString("fr-FR")} €
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white text-right">
                    Total général :
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-600 dark:text-blue-400">
                    {obtenirMontantTotal().toLocaleString("fr-FR")} €
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default function TableauDeBord() {
  const [listeArticles, setListeArticles] = useState<Article[]>([]);
  const [client, setClient] = useState<string>("");
  const [titreFacture, setTitreFacture] = useState<string>("");
  const [coutArticle, setCoutArticle] = useState<string>("");
  const [quantiteArticle, setQuantiteArticle] = useState<string>("1");
  const [nomArticle, setNomArticle] = useState<string>("");
  const [clients, setClients] = useState([]);
  const router = useRouter();

  // Fonction pour récupérer la liste des clients
  const recupererClients = useCallback(async () => {
    try {
      const response = await fetch('/api/clients?userID=user_123');
      const data = await response.json();
      
      if (response.ok) {
        setClients(data.clients || []);
      } else {
        console.error("Erreur lors de la récupération des clients:", data.message);
      }
    } catch (error) {
      console.error("Erreur réseau lors de la récupération des clients:", error);
    }
  }, []);

  // Récupérer les clients au chargement de la page
  useEffect(() => {
    recupererClients();
  }, [recupererClients]);

  // Fonction pour ajouter un article à la liste
  const gererAjoutArticle = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nomArticle.trim() && parseFloat(coutArticle) > 0 && parseInt(quantiteArticle) >= 1) {
      const nouvelArticle: Article = {
        id: Math.random().toString(36).substring(2, 9),
        nom: nomArticle,
        coût: parseFloat(coutArticle),
        quantite: parseInt(quantiteArticle),
        prix: parseFloat(coutArticle) * parseInt(quantiteArticle),
      };
      
      setListeArticles([...listeArticles, nouvelArticle]);
      
      // Réinitialiser les champs
      setNomArticle("");
      setCoutArticle("");
      setQuantiteArticle("1");
    }
  };

  // Fonction pour calculer le montant total
  const obtenirMontantTotal = () => {
    return listeArticles.reduce((total, article) => {
      // Gérer les différents formats d'articles
      const prixTotal = article.prix || (article.coût ? article.coût * article.quantite : 0) || 0;
      return total + prixTotal;
    }, 0);
  };

  // Fonction pour soumettre le formulaire de facture
  const gererSoumissionFormulaire = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (listeArticles.length === 0) {
      alert("Veuillez ajouter au moins un article à la facture");
      return;
    }

    if (!client || !titreFacture) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      console.log("Création de la facture...");
      
      const factureData = {
        customer: parseInt(client), // ID du client sélectionné
        title: titreFacture,
        items: listeArticles,
        total: obtenirMontantTotal(),
        ownerID: 'user_123' // Remplacez par l'ID utilisateur réel
      };

      const response = await fetch('/api/facture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(factureData),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("Facture créée avec succès:", data);
        
        // Rediriger vers la page de prévisualisation de la facture
        if (data.facture && data.facture.id) {
          router.push(`/facture/${data.facture.id}`);
        } else {
          alert("Facture créée avec succès !");
          // Réinitialiser le formulaire
          setListeArticles([]);
          setClient("");
          setTitreFacture("");
        }
      } else {
        console.error("Erreur lors de la création:", data.message);
        alert("Erreur lors de la création de la facture: " + data.message);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      alert("Erreur de connexion lors de la création de la facture");
    }
  };

  // Configuration des liens de navigation
  const liens = [
    {
      label: "Tableau de bord",
      href: "/dashboard",
      icon: <IconDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Clients",
      href: "/clients",
      icon: <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Historique",
      href: "/history",
      icon: <IconHistory className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Factures",
      href: "/facture",
      icon: <IconFileInvoice className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Paramètres",
      href: "/settings",
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  return (
    <div className="w-full">
      <main className="min-h-screen flex bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        {/* Sidebar de navigation */}
        <Sidebar>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <div className="mt-8 flex flex-col gap-2">
                {liens.map((lien, idx) => (
                  <SidebarLink key={idx} link={lien} />
                ))}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Contenu principal */}
        <div className="flex-1 h-full p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-bold text-3xl mb-6 text-gray-900 dark:text-white">
              Créer une nouvelle facture
            </h2>

            <form className="w-full flex flex-col space-y-6" onSubmit={gererSoumissionFormulaire}>
              {/* Section client et titre */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="client" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sélectionner un client
                  </label>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                  >
                    <option value="">Choisir un client</option>
                    {clients.map((clientItem: Client) => (
                      <option key={clientItem.id} value={clientItem.id}>
                        {clientItem.nom} - {clientItem.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="titre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Titre de la facture
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    value={titreFacture}
                    onChange={(e) => setTitreFacture(e.target.value)}
                    placeholder="Ex: Facture de services web"
                  />
                </div>
              </div>

              {/* Section ajout d'articles */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                  Ajouter des articles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label htmlFor="nomArticle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nom de l&apos;article
                    </label>
                    <input
                      type="text"
                      name="nomArticle"
                      placeholder="Ex: Développement site web"
                      className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={nomArticle}
                      onChange={(e) => setNomArticle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="coutArticle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Coût unitaire (€)
                    </label>
                    <input
                      type="number"
                      name="coutArticle"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={coutArticle}
                      onChange={(e) => setCoutArticle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="quantiteArticle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Quantité
                    </label>
                    <input
                      type="number"
                      name="quantiteArticle"
                      placeholder="1"
                      min="1"
                      className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={quantiteArticle}
                      onChange={(e) => setQuantiteArticle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prix total
                    </label>
                    <div className="w-full py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-600 dark:to-gray-700 border border-blue-200 dark:border-gray-600 rounded-lg text-blue-800 dark:text-blue-200 font-semibold">
                      {(parseFloat(coutArticle || "0") * parseInt(quantiteArticle || "1")).toLocaleString("fr-FR")} €
                    </div>
                  </div>
                </div>

                {/* Bouton d'ajout avec BackgroundGradient */}
                <BackgroundGradient className="rounded-lg w-fit">
                  <button
                    type="button"
                    className="bg-white dark:bg-gray-900 text-black dark:text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                    onClick={gererAjoutArticle}
                  >
                    <IconPlus className="h-4 w-4" />
                    Ajouter l&apos;article
                  </button>
                </BackgroundGradient>
              </div>

              {/* Tableau des articles */}
              <TableauFactures listeArticles={listeArticles} />

              {/* Bouton de sauvegarde avec BackgroundGradient */}
              <BackgroundGradient className="rounded-xl w-full">
                <button
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-full p-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                  type="submit"
                >
                  SAUVEGARDER ET PRÉVISUALISER LA FACTURE
                </button>
              </BackgroundGradient>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}