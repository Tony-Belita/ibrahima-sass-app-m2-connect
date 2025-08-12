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
            {listeArticles.map((article, index) => {
              // Gérer les différents formats d'articles (coût vs prix unitaire)
              const coutUnitaire = article.coût || (article.prix ? article.prix / article.quantite : 0) || 0;
              const prixTotal = article.prix || (article.coût ? article.coût * article.quantite : 0) || 0;
              const articleId = article.id || `article-${index}`;
              
              return (
                <tr key={articleId}>
                  <td className="border border-gray-300 px-4 py-2">{article.nom}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{article.quantite}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{coutUnitaire.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{prixTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant à imprimer
const ComposantAImprimer = forwardRef<HTMLDivElement, PropsImpression>((props, ref) => {
  const { id, client, facture, infoBancaire } = props as PropsImpression;

  // Debug pour voir les données reçues
  console.log("🖨️ Données reçues dans ComposantAImprimer:", {
    id,
    client,
    facture,
    infoBancaire
  });

  return (
    <div className='w-full px-2 py-8' ref={ref}>
      <div className='lg:w-2/3 w-full mx-auto shadow-md border-[1px] rounded min-h-[75vh] p-5 bg-white'>
        <header className='w-full flex items-center space-x-4 justify-between'>
          <div className='w-4/5'>
            <h2 className='text-lg font-semibold mb-3'>FACTURE #0{id}</h2>
            <section className='mb-6'>
              <p className='opacity-60'>Nom de l&apos;émetteur: {infoBancaire?.nom_compte}</p>
              <p className='opacity-60'>Date: {facture?.cree_le ? formaterDateString(facture.cree_le) : 'N/A'}</p>
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
              {`${infoBancaire?.devise || '€'}${facture?.montant_total ? parseFloat(facture.montant_total).toLocaleString('fr-FR') : '0'}`}
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
        console.log("🔍 Récupération des données pour la facture ID:", id);
        
        // Récupérer la facture avec les informations du client (via relation Prisma)
        const reponseFacture = await fetch(`/api/facture/single?id=${id}`);
        const donneesFacture = await reponseFacture.json();
        
        console.log("📄 Réponse API facture:", donneesFacture);
        
        if (donneesFacture.facture) {
          const factureData = donneesFacture.facture; // C'est un objet, pas un tableau
          console.log("✅ Données facture:", factureData);
          setFacture(factureData);
          
          // Le client est déjà inclus dans la réponse grâce à la relation Prisma
          if (factureData.client) {
            console.log("👤 Données client:", factureData.client);
            setClient(factureData.client);
          }

          // Récupérer les informations bancaires
          const reponseInfoBancaire = await fetch(`/api/bank-info?userID=${factureData.id_proprietaire}`);
          const donneesInfoBancaire = await reponseInfoBancaire.json();
          console.log("🏦 Réponse API infos bancaires:", donneesInfoBancaire);
          setInfoBancaire(donneesInfoBancaire.infosBancaires);
        } else {
          console.error(" Aucune facture trouvée pour l'ID:", id);
        }

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
    if (!facture || !client || !infoBancaire) {
      alert("Impossible d'envoyer l'email : données manquantes");
      return;
    }

    try {
      console.log("📧 Préparation de l'envoi d'email...");
      
      const donneesEmail = {
        factureID: facture.id,
        articles: facture.articles, // Déjà en format JSON string
        titreFacture: facture.titre,
        montant: facture.montant_total,
        emailClient: client.email,
        nomClient: client.nom,
        nomEmetteur: infoBancaire.nom_compte, // Utiliser le nom du compte bancaire
        numeroCompte: infoBancaire.numero_compte,
        devise: infoBancaire.devise, // Utiliser la devise des infos bancaires
        dateCreation: new Date(facture.cree_le).toLocaleDateString('fr-FR'), // Utiliser cree_le
      };

      console.log("📤 Envoi avec les données:", donneesEmail);

      const response = await fetch('/api/facture/envoi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donneesEmail),
      });

      const data = await response.json();
      console.log("📧 Réponse complète de l'API:", data);
      console.log("📊 Status de la réponse:", response.status);
      
      if (response.ok) {
        alert("✅ Email envoyé avec succès !");
        console.log("Email envoyé:", data);
      } else {
        console.error("❌ Erreur API:", {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        alert(`❌ Erreur lors de l'envoi : ${data.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      console.error(" Erreur réseau:", error);
      alert("Erreur de connexion lors de l'envoi de l'email");
    }
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