"use client";

import React, { forwardRef, useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { motion } from "motion/react";
import { BackgroundGradient } from "@/components/ui/background-gradient";

// Interface pour les props du composant à imprimer
interface PropsImpression {
  id: string;
  client?: Client;
  facture?: Facture;
  infoBancaire?: InfoBancaire;
}

// Fonction utilitaire pour formater la date
const formaterDateString = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Composant table pour les articles de la facture
const TableauFacture = ({ listeArticles }: { listeArticles: Article[] }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Détails des articles</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left">Article</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Quantité</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Coût unitaire</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {listeArticles.map((article) => (
              <tr key={article.id}>
                <td className="border border-gray-300 px-4 py-2">{article.nom}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{article.quantite}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{article.coût.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">{article.prix.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant à imprimer
const ComposantAImprimer = forwardRef<HTMLDivElement, PropsImpression>((props, ref) => {
  const { id, client, facture, infoBancaire } = props as PropsImpression;

  return (
    <div className='w-full px-2 py-8' ref={ref}>
      <div className='lg:w-2/3 w-full mx-auto shadow-md border-[1px] rounded min-h-[75vh] p-5 bg-white'>
        <header className='w-full flex items-center space-x-4 justify-between'>
          <div className='w-4/5'>
            <h2 className='text-lg font-semibold mb-3'>FACTURE #0{id}</h2>
            <section className='mb-6'>
              <p className='opacity-60'>Nom de l'émetteur: {infoBancaire?.nom_compte}</p>
              <p className='opacity-60'>Date: {facture?.date_creation ? formaterDateString(facture.date_creation) : 'N/A'}</p>
            </section>
            <h2 className='text-lg font-semibold mb-2'>DESTINATAIRE:</h2>
            <section className='mb-6'>
              <p className='opacity-60'>Nom: {client?.nom}</p>
              <p className='opacity-60'>Adresse: {client?.adresse}</p>
              <p className='opacity-60'>Email: {client?.email}</p>
            </section>
          </div>

          <div className='w-1/5 flex flex-col'>
            <p className='font-extrabold text-2xl'>
              {`${infoBancaire?.devise || '€'}${Number(facture?.montant_total).toLocaleString()}`}
            </p>
            <p className='text-sm opacity-60'>Montant total</p>
          </div>
        </header>
        <div>
          <p className='opacity-60'>Sujet:</p>
          <h2 className='text-lg font-semibold'>{facture?.titre}</h2>
        </div>

        <TableauFacture listeArticles={facture?.articles ? JSON.parse(facture.articles) : []} />
      </div>
    </div>
  );
});

ComposantAImprimer.displayName = "ComposantAImprimer";

export default function PageFacture() {
  const { id } = useParams<{ id: string }>();
  // Référence au composant à imprimer
  const refComposant = useRef<HTMLDivElement>(null);

  // États pour les données
  const [client, setClient] = useState<Client>();
  const [infoBancaire, setInfoBancaire] = useState<InfoBancaire>();
  const [facture, setFacture] = useState<Facture>();
  const [chargement, setChargement] = useState(true);

  // Récupération des données de la facture
  useEffect(() => {
    const recupererDonneesFacture = async () => {
      try {
        // Récupérer la facture
        const reponseFacture = await fetch(`/api/facture/single?id=${id}`);
        const donneesFacture = await reponseFacture.json();
        setFacture(donneesFacture.facture[0]);

        // Récupérer les informations du client
        if (donneesFacture.facture[0]?.id_client) {
          const reponseClient = await fetch(`/api/clients/single?name=${donneesFacture.facture[0].id_client}`);
          const donneesClient = await reponseClient.json();
          setClient(donneesClient.client[0]);
        }

        // Récupérer les informations bancaires
        const reponseInfoBancaire = await fetch(`/api/bank-info?userID=${donneesFacture.facture[0]?.id_proprietaire}`);
        const donneesInfoBancaire = await reponseInfoBancaire.json();
        setInfoBancaire(donneesInfoBancaire.infosBancaires[0]);

        setChargement(false);
      } catch (erreur) {
        console.error('Erreur lors de la récupération des données:', erreur);
        setChargement(false);
      }
    };

    if (id) {
      recupererDonneesFacture();
    }
  }, [id]);

  // Fonction qui envoie la facture par email
  const gererEnvoiFacture = async () => {
    // TODO: Implémenter l'envoi par email
    console.log('Envoi de la facture par email...');
  };

  // Fonction qui imprime la facture
  const gererImpression = useReactToPrint({
    documentTitle: `Facture-${id}`,
    contentRef: refComposant,
  });

  if (chargement) {
    return (
      <main className='w-full min-h-screen flex items-center justify-center'>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la facture...</p>
        </div>
      </main>
    );
  }

  return (
    <main className='w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <motion.section 
        className='w-full flex p-4 items-center justify-center space-x-5 mb-3'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackgroundGradient className="rounded-md">
          <button
            className='px-6 py-3 text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors duration-200 font-medium shadow-lg'
            onClick={gererImpression}
          >
            📥 Télécharger
          </button>
        </BackgroundGradient>
        
        <BackgroundGradient className="rounded-md">
          <button
            className='px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors duration-200 font-medium shadow-lg'
            onClick={gererEnvoiFacture}
          >
            📧 Envoyer la facture
          </button>
        </BackgroundGradient>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ComposantAImprimer
          ref={refComposant}
          id={id}
          client={client}
          infoBancaire={infoBancaire}
          facture={facture}
        />
      </motion.div>
    </main>
  );
}