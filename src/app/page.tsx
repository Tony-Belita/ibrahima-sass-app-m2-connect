import Link from "next/link";
import { Boxes } from "@/components/ui/background-boxes";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default async function Accueil() {
  // Mots pour l'effet Typewriter
  const mots = [
    {
      text: "Créez",
      className: "text-white"
    },
    {
      text: "des",
      className: "text-white"
    },
    {
      text: "factures",
      className: "text-blue-500 dark:text-blue-400"
    },
    {
      text: "professionnelles",
      className: "text-purple-500 dark:text-purple-400"
    },
    {
      text: "facilement",
      className: "text-white"
    },
  ];

  return (
    <main className='w-full relative bg-slate-900 overflow-hidden'>
      {/* Composant de background avec des boîtes animées */}
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-0 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      
      {/* Contenu principal de la page d'accueil */}
      <section className='relative z-20 p-8 h-[90vh] md:w-2/3 mx-auto text-center w-full flex flex-col items-center justify-center'>
        {/* Titre avec effet Typewriter */}
        <div className="mb-8">
          <TypewriterEffectSmooth 
            words={mots} 
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
            cursorClassName="bg-blue-500"
          />
        </div>
        
        <p className='opacity-70 mb-8 text-sm md:text-base leading-loose max-w-2xl text-gray-300 relative'>
          Ynov-SaaS-M2-Connect est un logiciel de facturation en ligne qui vous aide à créer et 
          imprimer des factures professionnelles pour vos clients gratuitement ! 
          Gérez votre entreprise et vos clients avec un seul logiciel de facturation.
        </p>
        
        {/* Boutons conditionnels selon l'état d'authentification */}
        <div className="relative z-30">
          <SignedOut>
            {/* Bouton de connexion avec modal Clerk */}
            <SignInButton 
              mode="modal"
              signUpForceRedirectUrl="/dashboard"
              forceRedirectUrl="/dashboard"
            >
              <button className="p-[3px] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                <div className="px-8 py-3 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                  Se connecter
                </div>
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            {/* Bouton vers le dashboard pour les utilisateurs connectés */}
            <Link href='/dashboard'>
              <button className="p-[3px] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg" />
                <div className="px-8 py-3 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
                  Accéder au tableau de bord
                </div>
              </button>
            </Link>
          </SignedIn>
        </div>
      </section>
    </main>
  );
}
