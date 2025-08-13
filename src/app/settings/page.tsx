"use client";
import { ChangeEvent, useEffect, useState, useCallback } from "react";
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
  IconFileInvoice 
} from "@tabler/icons-react";

export default function Parametres() {
    const { user } = useUser();
    // État par défaut des informations bancaires
    const [infoBancaire, setInfoBancaire] = useState({
        nom_compte: "",
        numero_compte: "",
        nom_banque: "",
        devise: "",
    });

    // Informations bancaires du formulaire
    const [saisieInfoBancaire, setSaisieInfoBancaire] = useState({
        nomCompte: "",
        numeroCompte: "",
        nomBanque: "",
        devise: "",
    });

    // Fonction pour récupérer les informations bancaires
    const recupererInfosBancaires = useCallback(async () => {
        if (!user?.id) return;
        
        try {
            const response = await fetch(`/api/bank-info?userID=${user.id}`);
            const data = await response.json();
            
            if (response.ok && data.infosBancaires) {
                setInfoBancaire({
                    nom_compte: data.infosBancaires.nom_compte || "",
                    numero_compte: data.infosBancaires.numero_compte || "",
                    nom_banque: data.infosBancaires.nom_banque || "",
                    devise: data.infosBancaires.devise || "",
                });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des infos bancaires:", error);
        }
    }, [user?.id]);

    // Récupérer les informations bancaires au chargement de la page
    useEffect(() => {
        if (user?.id) {
            recupererInfosBancaires();
        }
    }, [user?.id, recupererInfosBancaires]);

    // Met à jour l'état du formulaire
    const gererMiseAJourInfoBancaire = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setSaisieInfoBancaire((etatPrecedent) => ({
            ...etatPrecedent,
            [name]: value,
        }));
    };

    // Gère la soumission du formulaire
    const gererSoumission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!user?.id) {
            console.error("Utilisateur non authentifié");
            return;
        }
        
        try {
            const response = await fetch('/api/bank-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: user.id,
                    accountName: saisieInfoBancaire.nomCompte,
                    accountNumber: saisieInfoBancaire.numeroCompte,
                    bankName: saisieInfoBancaire.nomBanque,
                    currency: saisieInfoBancaire.devise,
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                // Mettre à jour l'affichage avec les nouvelles informations
                setInfoBancaire({
                    nom_compte: saisieInfoBancaire.nomCompte,
                    numero_compte: saisieInfoBancaire.numeroCompte,
                    nom_banque: saisieInfoBancaire.nomBanque,
                    devise: saisieInfoBancaire.devise,
                });
                // Vider le formulaire
                setSaisieInfoBancaire({
                    nomCompte: "",
                    numeroCompte: "",
                    nomBanque: "",
                    devise: "",
                });
                // Optionnel: afficher un message de succès à l'utilisateur
            } else {
                console.error("Erreur lors de la mise à jour:", data.message);
            }
        } catch (error) {
            console.error("Erreur réseau:", error);
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
                    <h2 className="text-2xl font-bold">Informations bancaires</h2>
                    <p className="opacity-70 mb-4">
                        Mettez à jour les informations de votre compte bancaire
                    </p>

                    <div className="flex md:flex-row flex-col items-start justify-between w-full md:space-x-4">
                        {/* Section d'affichage des informations actuelles */}
                        <section className="md:w-1/3 w-full bg-blue-50 dark:bg-blue-900/20 h-full p-3 rounded-md space-y-3">
                            <p className="text-sm opacity-75">
                                Nom du compte : {infoBancaire.nom_compte || "Non défini"}
                            </p>
                            <p className="text-sm opacity-75">
                                Numéro de compte : {infoBancaire.numero_compte}
                            </p>
                            <p className="text-sm opacity-75">
                                Nom de la banque : {infoBancaire.nom_banque || "Non défini"}
                            </p>
                            <p className="text-sm opacity-75">
                                Devise : {infoBancaire.devise || "Non définie"}
                            </p>
                        </section>

                        {/* Formulaire de mise à jour */}
                        <form
                            className="md:w-2/3 w-full p-3 flex flex-col"
                            method="POST"
                            onSubmit={gererSoumission}
                        >
                            <label htmlFor="nomCompte" className="text-sm mb-1">
                                Nom du compte
                            </label>
                            <input
                                type="text"
                                name="nomCompte"
                                id="nomCompte"
                                className="border-[1px] border-gray-300 dark:border-gray-600 p-2 rounded mb-3 bg-white dark:bg-gray-800"
                                required
                                value={saisieInfoBancaire.nomCompte}
                                onChange={gererMiseAJourInfoBancaire}
                                placeholder="Entrez le nom du titulaire du compte"
                            />

                            <label htmlFor="numeroCompte" className="text-sm mb-1">
                                Numéro de compte
                            </label>
                            <input
                                type="text"
                                name="numeroCompte"
                                id="numeroCompte"
                                className="border-[1px] border-gray-300 dark:border-gray-600 p-2 rounded mb-3 bg-white dark:bg-gray-800"
                                required
                                value={saisieInfoBancaire.numeroCompte}
                                onChange={gererMiseAJourInfoBancaire}
                                placeholder="Entrez le numéro de compte"
                            />

                            <label htmlFor="nomBanque" className="text-sm mb-1">
                                Nom de la banque
                            </label>
                            <input
                                type="text"
                                name="nomBanque"
                                id="nomBanque"
                                className="border-[1px] border-gray-300 dark:border-gray-600 p-2 rounded mb-3 bg-white dark:bg-gray-800"
                                required
                                value={saisieInfoBancaire.nomBanque}
                                onChange={gererMiseAJourInfoBancaire}
                                placeholder="Entrez le nom de la banque"
                            />

                            <label htmlFor="devise" className="text-sm mb-1">
                                Devise
                            </label>
                            <select
                                name="devise"
                                id="devise"
                                className="border-[1px] border-gray-300 dark:border-gray-600 p-2 rounded mb-3 bg-white dark:bg-gray-800"
                                required
                                value={saisieInfoBancaire.devise}
                                onChange={gererMiseAJourInfoBancaire}
                            >
                                <option value="">Sélectionner</option>
                                <option value="$">USD - Dollar américain</option>
                                <option value="€">EUR - Euro</option>
                                <option value="£">GBP - Livre sterling</option>
                                <option value="₣">CHF - Franc suisse</option>
                                <option value="¥">JPY - Yen japonais</option>
                            </select>
                            
                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 w-[200px] rounded transition-colors duration-200"
                                >
                                    Mettre à jour
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
