import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
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
  title: "Ynov-Sass-M2-Connect - Créez vos factures facilement",
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
          <nav className="flex justify-between items-center h-[10vh] px-8 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            {/* Logo de l'application */}
            <Link 
              href="/" 
              className="text-xl font-extrabold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
            >
              Ynov-Sass-Facturation-M2_Connect
            </Link>
            
            {/* Menu de navigation et authentification */}
            <div className="flex items-center gap-5">
              {/* Si l'utilisateur n'est pas connecté */}
              <SignedOut>
                <SignInButton 
                  mode="modal"
                  signUpForceRedirectUrl="/dashboard"
                  forceRedirectUrl="/dashboard"
                >
                  <button className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      S'inscrire
                    </span>
                  </button>
                </SignInButton>
              </SignedOut>
              
              {/* Si l'utilisateur est connecté */}
              <SignedIn>
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  Tableau de bord
                </Link>
                <Link 
                  href="/clients" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  Clients
                </Link>
                <Link 
                  href="/history" 
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  Historique
                </Link>
                <UserButton 
                  showName
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8",
                      userButtonPopoverCard: "dark:bg-gray-800",
                      userButtonPopoverActionButton: "dark:hover:bg-gray-700",
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
