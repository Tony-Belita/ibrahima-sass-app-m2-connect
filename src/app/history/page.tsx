"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  Sidebar, 
  SidebarBody, 
  SidebarLink 
} from "@/components/ui/sidebar";
import { 
  IconDashboard, 
  IconSettings, 
  IconUsers, 
  IconHistory,
  IconFileInvoice,
  IconEye,
  IconCalendar,
  IconCurrencyEuro
} from "@tabler/icons-react";

export default function Historique() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [chargement, setChargement] = useState<boolean>(true);

  // Simulation de données de factures pour démonstration
  useEffect(() => {
    // Simulation du chargement des factures depuis l'API
    setTimeout(() => {
      const facturesSimulees: Facture[] = [
        {
          id: "001",
          date_creation: "2025-01-15T10:30:00Z",
          id_utilisateur: "user123",
          id_client: 1,
          titre: "Services de développement web",
          articles: JSON.stringify([
            { nom: "Développement site vitrine", coût: 1500, quantite: 1 },
            { nom: "Formation CMS", coût: 500, quantite: 2 }
          ]),
          montant_total: 2500
        },
        {
          id: "002",
          date_creation: "2025-01-10T14:45:00Z",
          id_utilisateur: "user123",
          id_client: 2,
          titre: "Maintenance mensuelle",
          articles: JSON.stringify([
            { nom: "Maintenance serveur", coût: 200, quantite: 1 },
            { nom: "Mise à jour sécurité", coût: 150, quantite: 1 }
          ]),
          montant_total: 350
        },
        {
          id: "003",
          date_creation: "2025-01-05T09:15:00Z",
          id_utilisateur: "user123",
          id_client: 3,
          titre: "Consultation stratégique",
          articles: JSON.stringify([
            { nom: "Audit SEO", coût: 800, quantite: 1 },
            { nom: "Recommandations", coût: 400, quantite: 1 }
          ]),
          montant_total: 1200
        }
      ];
      setFactures(facturesSimulees);
      setChargement(false);
    }, 1000);
  }, []);

  // Fonction pour formater la date en français
  const formaterDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  // Fonction pour obtenir le nom du client (simulation)
  const obtenirNomClient = (idClient: number) => {
    const clients = {
      1: "Entreprise ABC",
      2: "Société XYZ",
      3: "Start-up Innovation"
    };
    return clients[idClient as keyof typeof clients] || `Client #${idClient}`;
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
      href: "/invoice",
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
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Historique des factures
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Consultez toutes vos factures et leur statut
              </p>
            </div>

            {/* État de chargement */}
            {chargement ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-300">
                  Chargement des factures...
                </span>
              </div>
            ) : (
              <>
                {/* Statistiques rapides */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <IconFileInvoice className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Total des factures
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {factures.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <IconCurrencyEuro className="h-8 w-8 text-green-600 dark:text-green-400" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Chiffre d'affaires total
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {factures.reduce((total, facture) => total + facture.montant_total, 0).toLocaleString("fr-FR")} €
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <IconCalendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Ce mois-ci
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {factures.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Liste des factures */}
                <div className="space-y-4">
                  {factures.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                      <IconFileInvoice className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Aucune facture trouvée
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Vous n'avez pas encore créé de factures.
                      </p>
                    </div>
                  ) : (
                    factures.map((facture) => (
                      <div
                        className="bg-white dark:bg-gray-800 w-full rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
                        key={facture.id}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full">
                                Facture #{facture.id}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formaterDate(facture.date_creation!)}
                              </span>
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                              {facture.titre}
                            </h3>
                            
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              Émise pour{" "}
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {obtenirNomClient(facture.id_client)}
                              </span>
                            </p>
                            
                            <div className="flex items-center gap-2">
                              <IconCurrencyEuro className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                {facture.montant_total.toLocaleString("fr-FR")} €
                              </span>
                            </div>
                          </div>

                          {/* Bouton avec style "Brutal" */}
                          <Link
                            href={{
                              pathname: `/invoice/${facture.id}`,
                              query: { client: facture.id_client },
                            }}
                          >
                            <button className="px-8 py-3 border-2 border-black dark:border-white uppercase bg-white dark:bg-gray-900 text-black dark:text-white transition duration-200 text-sm font-bold shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)] hover:shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:hover:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)] active:shadow-none active:translate-x-1 active:translate-y-1">
                              <IconEye className="inline h-4 w-4 mr-2" />
                              Prévisualiser
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
