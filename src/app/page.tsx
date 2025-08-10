import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Accueil() {
  return (
    <main className='w-full relative'>
      {/* Composant de background avec des rayons animés */}
      <BackgroundBeams />
      
      {/* Contenu principal de la page d'accueil */}
      <section className='relative z-10 p-8 h-[90vh] md:w-2/3 mx-auto text-center w-full flex flex-col items-center justify-center'>
        <h2 className='text-3xl font-bold mb-4 md:text-4xl text-gray-900 dark:text-white'>
          Créez des factures pour vos clients
        </h2>
        <p className='opacity-70 mb-8 text-sm md:text-base leading-loose max-w-2xl text-gray-700 dark:text-gray-300'>
          Ynov-Billing est un logiciel de facturation en ligne qui vous aide à créer et 
          imprimer des factures professionnelles pour vos clients gratuitement ! 
          Gérez votre entreprise et vos clients avec un seul logiciel de facturation.
        </p>
        
        {/* Bouton de connexion avec style Aceternity UI */}
        <Link href='/dashboard'>
          <button className="p-[3px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-8 py-3 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
              Se connecter
            </div>
          </button>
        </Link>
      </section>
    </main>
  );
}
