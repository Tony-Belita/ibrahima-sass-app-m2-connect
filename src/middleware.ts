import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// La fonction createRouteMatcher accepte un tableau de routes à protéger
const routesProtegees = createRouteMatcher([
    "/clients",        // Page de gestion des clients
    "/settings",       // Page des paramètres (informations bancaires)
    "/dashboard",      // Tableau de bord principal
    "/history",        // Historique des factures
    "/invoice(.*)",    // Pages de factures (toutes les sous-routes)
]);

// Middleware Clerk pour protéger les routes
export default clerkMiddleware(async (auth, req) => {
    // Vérifier si la route actuelle fait partie des routes protégées
    if (routesProtegees(req)) {
        // Obtenir les informations d'authentification
        const authObject = await auth();
        
        // Si l'utilisateur n'est pas connecté, Clerk le redirigera automatiquement
        // vers la page de connexion configurée dans l'interface Clerk
        if (!authObject.userId) {
            // Clerk gère automatiquement la redirection
            return new Response("Unauthorized", { status: 401 });
        }
    }
});

// Configuration du matcher pour définir quelles routes doivent être traitées par le middleware
export const config = {
    // Matcher qui exclut les fichiers statiques et _next, mais inclut toutes les autres routes
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
