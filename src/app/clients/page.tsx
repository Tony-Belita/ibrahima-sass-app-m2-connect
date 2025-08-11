"use client";
import { useCallback, useEffect, useState } from "react";
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
  IconFileInvoice 
} from "@tabler/icons-react";

// Composant pour le tableau des clients
const TableauClients = ({ clients }: { clients: any[] }) => {
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
  const [nomClient, setNomClient] = useState<string>("");
  const [emailClient, setEmailClient] = useState<string>("");
  const [adresseClient, setAdresseClient] = useState<string>("");
  const [chargement, setChargement] = useState<boolean>(false);
  const [clients, setClients] = useState([]);

  // Charger les clients au montage du composant
  useEffect(() => {
    chargerClients();
  }, []);

  const chargerClients = async () => {
    try {
      // Remplacez "user_123" par l'ID utilisateur réel (à récupérer depuis Clerk)
      const response = await fetch('/api/clients?userID=user_123');
      const data = await response.json();
      if (response.ok) {
        setClients(data.clients);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
    }
  };

  const gererAjoutClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChargement(true);
    
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: 'user_123', // Remplacez par l'ID utilisateur réel
          customerName: nomClient,
          customerEmail: emailClient,
          customerAddress: adresseClient,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("Client ajouté avec succès:", data.message);
        // Réinitialiser le formulaire
        setNomClient("");
        setEmailClient("");
        setAdresseClient("");
        // Recharger la liste des clients
        await chargerClients();
      } else {
        console.error("Erreur lors de l'ajout:", data.message);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    } finally {
      setChargement(false);
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

          {/* Formulaire d'ajout de client */}
          <form className="w-full" onSubmit={gererAjoutClient} method="POST">
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

            {/* Bouton avec style Border Magic */}
            <button 
              type="submit"
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 mb-6"
              disabled={chargement}
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                {chargement ? "Ajout en cours..." : "Ajouter le client"}
              </span>
            </button>
          </form>

          {/* Tableau des clients */}
          <TableauClients clients={clients} />
        </div>
      </main>
    </div>
  );
}
