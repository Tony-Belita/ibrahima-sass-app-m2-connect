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
  IconEdit,
  IconTrash,
  IconX,
  IconQuestionMark
} from "@tabler/icons-react";
import Swal from 'sweetalert2';

// Type pour les clients
interface Client {
  id: number;
  nom: string;
  email: string;
  adresse: string;
  cree_le: string;
}

// Composant pour le tableau des clients
const TableauClients = ({ 
  clients, 
  onSupprimer, 
  onModifier 
}: { 
  clients: Client[]; 
  onSupprimer: (id: number) => void;
  onModifier: (client: Client) => void;
}) => {
  return (
    <div className="w-full mt-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Liste des clients ({clients.length})
          </h3>
        </div>
        {clients.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Aucun client enregistré pour le moment
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Adresse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {clients.map((client, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {client.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {client.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {client.adresse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onModifier(client)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="Modifier le client"
                        >
                          <IconEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onSupprimer(client.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Supprimer le client"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Clients() {
  const { user } = useUser();
  const [nomClient, setNomClient] = useState<string>("");
  const [emailClient, setEmailClient] = useState<string>("");
  const [adresseClient, setAdresseClient] = useState<string>("");
  const [chargement, setChargement] = useState<boolean>(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientEnModification, setClientEnModification] = useState<Client | null>(null);

  const chargerClients = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`/api/clients?userID=${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setClients(data.clients);
      }
    } catch {
      console.error('Erreur lors du chargement des clients');
    }
  }, [user?.id]);

  // Charger les clients au montage du composant
  useEffect(() => {
    if (user?.id) {
      chargerClients();
    }
  }, [user?.id, chargerClients]);

  const gererAjoutClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user?.id) {
      await Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Utilisateur non authentifié',
      });
      return;
    }
    
    setChargement(true);
    
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: user.id,
          customerName: nomClient,
          customerEmail: emailClient,
          customerAddress: adresseClient,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: 'Client ajouté avec succès',
          showConfirmButton: false,
          timer: 1500
        });
        // Réinitialiser le formulaire
        setNomClient("");
        setEmailClient("");
        setAdresseClient("");
        // Recharger la liste des clients
        await chargerClients();
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Erreur !',
          text: data.message || 'Erreur lors de l\'ajout du client',
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

  const gererModificationClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!clientEnModification || !user?.id) return;
    
    setChargement(true);
    
    try {
      const response = await fetch('/api/clients', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: clientEnModification.id,
          userID: user.id,
          customerName: nomClient,
          customerEmail: emailClient,
          customerAddress: adresseClient,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: 'Succès !',
          text: 'Client modifié avec succès',
          showConfirmButton: false,
          timer: 1500
        });
        // Réinitialiser le formulaire
        setNomClient("");
        setEmailClient("");
        setAdresseClient("");
        setClientEnModification(null);
        // Recharger la liste des clients
        await chargerClients();
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Erreur !',
          text: data.message || 'Erreur lors de la modification du client',
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

  const gererSuppressionClient = async (id: number) => {
    if (!user?.id) return;
    
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
        const response = await fetch(`/api/clients?id=${id}&userID=${user.id}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        
        if (response.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Supprimé !',
            text: 'Le client a été supprimé avec succès',
            showConfirmButton: false,
            timer: 1500
          });
          // Recharger la liste des clients
          await chargerClients();
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Erreur !',
            text: data.message || 'Erreur lors de la suppression du client',
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

  const commencerModification = (client: Client) => {
    setClientEnModification(client);
    setNomClient(client.nom);
    setEmailClient(client.email);
    setAdresseClient(client.adresse);
  };

  const annulerModification = () => {
    setClientEnModification(null);
    setNomClient("");
    setEmailClient("");
    setAdresseClient("");
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestion des clients
          </h2>
          <p className="opacity-70 mb-6 text-gray-600 dark:text-gray-300">
            Créez et consultez tous vos clients
          </p>

          {/* Formulaire d'ajout/modification de client */}
          <form className="w-full" onSubmit={clientEnModification ? gererModificationClient : gererAjoutClient} method="POST">
            {clientEnModification && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">
                    Modification du client: {clientEnModification.nom}
                  </h3>
                  <button
                    type="button"
                    onClick={annulerModification}
                    className="text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    <IconX className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
            
            <div className="w-full flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0 mb-4">
              <section className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom du client
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={nomClient}
                  required
                  onChange={(e) => setNomClient(e.target.value)}
                  placeholder="Entrez le nom du client"
                />
              </section>

              <section className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Adresse email
                </label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={emailClient}
                  onChange={(e) => setEmailClient(e.target.value)}
                  required
                  placeholder="exemple@email.com"
                />
              </section>
            </div>

            <div className="mb-6">
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Adresse de facturation
              </label>
              <textarea
                name="adresse"
                id="adresse"
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={adresseClient}
                onChange={(e) => setAdresseClient(e.target.value)}
                required
                placeholder="Entrez l'adresse complète du client"
              />
            </div>

            {/* Boutons avec style Border Magic */}
            <div className="flex space-x-4 mb-6">
              <button 
                type="submit"
                className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                disabled={chargement}
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  {chargement ? 
                    (clientEnModification ? "Modification en cours..." : "Ajout en cours...") : 
                    (clientEnModification ? "Modifier le client" : "Ajouter le client")
                  }
                </span>
              </button>
              
              {clientEnModification && (
                <button 
                  type="button"
                  onClick={annulerModification}
                  className="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>

          {/* Tableau des clients */}
          <TableauClients 
            clients={clients} 
            onSupprimer={gererSuppressionClient}
            onModifier={commencerModification}
          />
        </div>
      </main>
    </div>
  );
}
