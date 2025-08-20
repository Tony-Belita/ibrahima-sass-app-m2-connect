"use client";
import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
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
  IconEdit,
  IconTrash,
  IconQuestionMark
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "motion/react";
import Swal from 'sweetalert2';
import { ModalFacture } from "@/components/ui/modal-facture";

// Interface pour les factures
interface Facture {
  id: number;
  id_proprietaire: string;
  id_client: number;
  titre: string;
  articles: string;
  montant_total: string;
  cree_le: string;
  client: {
    id: number;
    nom: string;
    email: string;
    adresse: string;
  };
}

// Fonction utilitaire pour formater la date
const formaterDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Composant pour le tableau des factures
const TableauFactures = ({ 
  factures, 
  onSupprimer, 
  onModifier 
}: { 
  factures: Facture[];
  onSupprimer: (id: number) => void;
  onModifier: (facture: Facture) => void;
}) => {
  if (factures.length === 0) {
    return (
      <div className="w-full mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <IconFileInvoice className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Aucune facture trouvée
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Créez votre première facture depuis le tableau de bord.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Liste des factures ({factures.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Facture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {factures.map((facture) => (
                <motion.tr 
                  key={facture.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Facture #{facture.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {facture.titre}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {facture.client?.nom || 'Client supprimé'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {facture.client?.email || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {Number(facture.montant_total).toLocaleString()} €
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formaterDate(facture.cree_le)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/facture/${facture.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        title="Voir la facture"
                      >
                        <IconEye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => onModifier(facture)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                        title="Modifier la facture"
                      >
                        <IconEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onSupprimer(facture.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title="Supprimer la facture"
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function PageFactures() {
  const { user } = useUser();
  const [factures, setFactures] = useState<Facture[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [factureEnModification, setFactureEnModification] = useState<Facture | null>(null);

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
      label: "Comment ça marche",
      href: "/how-it-works",
      icon: <IconQuestionMark className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Paramètres",
      href: "/settings",
      icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  const recupererFactures = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/facture?userID=${user.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setFactures(data.factures || []);
      } else {
        setErreur(data.message || "Erreur lors de la récupération des factures");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error);
      setErreur("Erreur de connexion");
    } finally {
      setChargement(false);
    }
  }, [user?.id]);

  // Récupération des factures au chargement
  useEffect(() => {
    if (user?.id) {
      recupererFactures();
    }
  }, [user?.id, recupererFactures]);

  const gererSuppressionFacture = async (id: number) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action ne peut pas être annulée !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/facture?id=${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        
        if (response.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Supprimée !',
            text: 'La facture a été supprimée avec succès',
            showConfirmButton: false,
            timer: 1500
          });
          // Recharger la liste des factures
          setFactures(factures.filter(facture => facture.id !== id));
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Erreur !',
            text: data.message || 'Erreur lors de la suppression de la facture',
          });
        }
      } catch {
        await Swal.fire({
          icon: 'error',
          title: 'Erreur !',
          text: 'Erreur de connexion',
        });
      }
    }
  };

  const gererModificationFacture = async (facture: Facture) => {
    setFactureEnModification(facture);
    setModalOuvert(true);
  };

  const handleSaveFacture = () => {
    // Recharger les factures après modification
    recupererFactures();
  };

  const fermerModal = () => {
    setModalOuvert(false);
    setFactureEnModification(null);
  };

  if (chargement) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des factures...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="w-full">
      <main className="min-h-screen flex">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Mes Factures
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Gérez et consultez toutes vos factures
                </p>
              </div>
              
              <Link 
                href="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <IconFileInvoice className="h-4 w-4" />
                <span>Créer une facture</span>
              </Link>
            </div>

            {erreur && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{erreur}</p>
              </div>
            )}

            <TableauFactures 
              factures={factures} 
              onSupprimer={gererSuppressionFacture}
              onModifier={gererModificationFacture}
            />
          </motion.div>
        </div>
      </main>

      {/* Modal de modification */}
      <ModalFacture
        isOpen={modalOuvert}
        onClose={fermerModal}
        facture={factureEnModification}
        onSave={handleSaveFacture}
      />
    </div>
  );
}
