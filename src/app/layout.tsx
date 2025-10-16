import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
// @ts-expect-error: side-effect CSS import - add a global .d.ts (declare module '*.css') if you prefer a proper type declaration
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ynov-SaaS-M2-Connect - Créez vos factures facilement",
  description: "Application de facturation moderne pour gérer vos clients et créer des factures professionnelles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* Barre de navigation principale */}
          <nav className="flex justify-between items-center h-[10vh] px-8 bg-slate-900 border-b border-slate-700 shadow-lg relative overflow-hidden">
            {/* Background boxes pour la navbar */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-slate-900" />
              <div 
                className="absolute inset-0 bg-gradient-to-r from-slate-800/50 via-slate-700/30 to-slate-800/50"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                    linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
            </div>
            
            {/* Logo de l'application */}
            <Link 
              href="/" 
              className="text-xl font-extrabold text-white hover:text-blue-400 transition-colors duration-200 relative z-10"
            >
              Ynov-SaaS-Facturation
            </Link>
            
            {/* Menu de navigation et authentification */}
            <div className="flex items-center gap-5 relative z-10">
              {/* Si l'utilisateur n'est pas connecté */}
              <SignedOut>
                <div className="flex items-center gap-3">
                  {/* Bouton de connexion */}
                  <SignInButton 
                    mode="modal"
                    forceRedirectUrl="/how-it-works"
                  >
                    <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all duration-200">
                      Se connecter
                    </button>
                  </SignInButton>
                  
                  {/* Bouton d'inscription avec style spécial */}
                  <SignUpButton 
                    mode="modal"
                    forceRedirectUrl="/how-it-works"
                  >
                    <button className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900">
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl hover:bg-slate-800 transition-colors">
                        S&apos;inscrire
                      </span>
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>
              
              {/* Si l'utilisateur est connecté */}
              <SignedIn>
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                >
                  Tableau de bord
                </Link>
                <Link 
                  href="/clients" 
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                >
                  Clients
                </Link>
                <Link 
                  href="/history" 
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
                >
                  Historique
                </Link>
                <UserButton 
                  showName
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-slate-800 border-slate-700",
                      userButtonPopoverActionButton: "hover:bg-slate-700 text-white",
                      userButtonPopoverText: "text-white",
                    }
                  }}
                />
              </SignedIn>
            </div>
          </nav>

          {/* Contenu principal de l'application */}
          <main className="min-h-[90vh]">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
