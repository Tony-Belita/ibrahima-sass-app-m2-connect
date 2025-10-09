"use client";
import { useState } from "react";
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
  IconQuestionMark,
  IconCheck,
  IconChevronRight,
  IconCashBanknote,
  IconUserPlus,
  IconFilePlus,
  IconMail,
  IconInfoCircle
} from "@tabler/icons-react";
import { motion } from "motion/react";

export default function CommentCaMarche() {
  const [etapeActive, setEtapeActive] = useState<number | null>(null);

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

  // Étapes du processus
  const etapes = [
    {
      id: 1,
      titre: "Configurer vos informations bancaires",
      description: "Commencez par renseigner vos informations bancaires pour qu'elles apparaissent sur vos factures",
      icon: <IconCashBanknote className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
      lien: "/settings",
      couleur: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      details: [
        "Nom de votre banque",
        "Numéro de compte (IBAN/RIB)",
        "Nom du titulaire du compte",
        "Devise (EUR, USD, etc.)"
      ]
    },
    {
      id: 2,
      titre: "Créer vos clients",
      description: "Ajoutez les entreprises ou personnes à qui vous allez envoyer des factures",
      icon: <IconUserPlus className="h-8 w-8 text-green-600 dark:text-green-400" />,
      lien: "/clients",
      couleur: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      details: [
        "Nom de l&apos;entreprise ou du client",
        "Adresse email de contact",
        "Adresse complète",
        "Gestion et modification ultérieure"
      ]
    },
    {
      id: 3,
      titre: "Créer vos factures",
      description: "Rédigez vos factures avec articles, quantités et prix depuis le tableau de bord",
      icon: <IconFilePlus className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
      lien: "/dashboard",
      couleur: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
      details: [
        "Sélectionner un client existant",
        "Ajouter un titre à la facture",
        "Lister les articles avec prix et quantités",
        "Calcul automatique du total"
      ]
    },
    {
      id: 4,
      titre: "Envoyer par email",
      description: "Générez un PDF professionnel et envoyez-le directement par email à vos clients",
      icon: <IconMail className="h-8 w-8 text-orange-600 dark:text-orange-400" />,
      lien: "/facture",
      couleur: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
      details: [
        "Prévisualisation PDF automatique",
        "Impression ou téléchargement",
        "Envoi par email en un clic",
        "Template professionnel inclus"
      ]
    }
  ];

  const toggleEtape = (id: number) => {
    setEtapeActive(etapeActive === id ? null : id);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Sidebar */}
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
      <div className="flex flex-1 overflow-auto">
        <div className="p-4 md:p-8 w-full">
          <div className="max-w-4xl mx-auto">
            {/* En-tête */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <IconQuestionMark className="h-12 w-12 text-blue-600 dark:text-blue-400 mr-4" />
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Comment ça marche ?
                  </h1>
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Créez et envoyez vos factures professionnelles en 4 étapes simples
                </p>
              </motion.div>
            </div>

            {/* Étapes */}
            <div className="space-y-6">
              {etapes.map((etape, index) => (
                <motion.div
                  key={etape.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`border-2 rounded-2xl p-6 transition-all duration-300 ${etape.couleur} hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Numéro d'étape */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border-2 border-gray-200 dark:border-gray-700">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {etape.id}
                          </span>
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          {etape.icon}
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {etape.titre}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {etape.description}
                        </p>

                        {/* Détails (accordéon) */}
                        {etapeActive === etape.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-4"
                          >
                            <ul className="space-y-2">
                              {etape.details.map((detail, idx) => (
                                <li key={idx} className="flex items-center space-x-2">
                                  <IconCheck className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                  <span className="text-gray-700 dark:text-gray-200">
                                    {detail}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                          <Link
                            href={etape.lien}
                            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                          >
                            Aller à cette étape
                            <IconChevronRight className="h-4 w-4 ml-2" />
                          </Link>
                          
                          <button
                            onClick={() => toggleEtape(etape.id)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                          >
                            {etapeActive === etape.id ? "Masquer les détails" : "Voir les détails"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Section conseils */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6"
            >
              <div className="flex items-start space-x-4">
                <IconInfoCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Conseils pour bien commencer
                  </h3>
                  <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span>Configurez d'abord vos informations bancaires pour qu'elles apparaissent automatiquement sur toutes vos factures</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span>Créez tous vos clients récurrents en une seule fois pour gagner du temps</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span>Utilisez des titres de facture descriptifs pour faciliter le suivi</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span>Vérifiez toujours le PDF généré avant l'envoi par email</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Bouton d'action principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 text-center"
            >
              <Link
                href="/settings"
                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <IconCashBanknote className="h-6 w-6 mr-3" />
                Commencer par configurer mes informations bancaires
                <IconChevronRight className="h-5 w-5 ml-3" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
