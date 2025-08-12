import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// La fonction createRouteMatcher accepte un tableau de routes à protéger
const routesProtegees = createRouteMatcher([
    "/clients",        // Page de gestion des clients
    "/settings",       // Page des paramètres (informations bancaires)
    "/dashboard",      // Tableau de bord principal
    "/history",        // Historique des factures
    "/facture(.*)",    // Pages de factures (toutes les sous-routes)
    "/api/clients(.*)", // API clients
    "/api/facture(.*)", // API factures
    "/api/bank-info(.*)" // API informations bancaires
]);

// Routes publiques (accessibles sans authentification)
const routesPubliques = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/public(.*)"
]);

// Fonction pour valider et sécuriser les headers de requête
function validateRequest(req: NextRequest): boolean {
    // Vérifier la taille du body (protection contre les attaques DoS)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB max
        return false;
    }

    // Vérifier les headers suspects
    const userAgent = req.headers.get('user-agent');
    if (!userAgent || userAgent.length < 10) {
        return false;
    }

    // Bloquer les tentatives d'injection dans les headers
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /vbscript:/i,
        /on\w+=/i
    ];

    const headersToCheck = ['referer', 'origin', 'user-agent'];
    for (const headerName of headersToCheck) {
        const headerValue = req.headers.get(headerName);
        if (headerValue) {
            for (const pattern of suspiciousPatterns) {
                if (pattern.test(headerValue)) {
                    return false;
                }
            }
        }
    }

    return true;
}

// Fonction pour ajouter des headers de sécurité
function addSecurityHeaders(response: NextResponse): NextResponse {
    // Headers de sécurité supplémentaires
    response.headers.set('X-Request-ID', crypto.randomUUID());
    response.headers.set('X-Timestamp', new Date().toISOString());
    
    // Rate limiting headers (informatifs)
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', '99');
    
    return response;
}

// Middleware Clerk pour protéger les routes
export default clerkMiddleware(async (auth, req) => {
    // Validation de base de la requête
    if (!validateRequest(req)) {
        return new NextResponse("Bad Request", { status: 400 });
    }

    // Vérifier si la route est publique
    if (routesPubliques(req)) {
        const response = NextResponse.next();
        return addSecurityHeaders(response);
    }

    // Vérifier si la route actuelle fait partie des routes protégées
    if (routesProtegees(req)) {
        try {
            // Obtenir les informations d'authentification
            const authObject = await auth();
            
            // Si l'utilisateur n'est pas connecté, Clerk le redirigera automatiquement
            if (!authObject.userId) {
                return new NextResponse("Unauthorized", { 
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }

            // Vérifications supplémentaires pour les API routes
            if (req.nextUrl.pathname.startsWith('/api/')) {
                // Vérifier le Content-Type pour les requêtes POST/PUT
                if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
                    const contentType = req.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                        return new NextResponse("Invalid Content-Type", { status: 400 });
                    }
                }

                // Vérifier l'origine pour les requêtes API (protection CSRF basique)
                const origin = req.headers.get('origin');
                const host = req.headers.get('host');
                if (origin && host) {
                    const originUrl = new URL(origin);
                    if (originUrl.host !== host && !origin.includes('localhost')) {
                        return new NextResponse("Forbidden", { status: 403 });
                    }
                }
            }

            // Log des accès pour audit (en production, utilisez un service de logging approprié)
            if (process.env.NODE_ENV === 'development') {
                console.log(`[AUDIT] User ${authObject.userId} accessed ${req.nextUrl.pathname} at ${new Date().toISOString()}`);
            }

        } catch (error) {
            console.error('[MIDDLEWARE ERROR]', error);
            return new NextResponse("Internal Server Error", { status: 500 });
        }
    }

    // Continuer avec la requête et ajouter les headers de sécurité
    const response = NextResponse.next();
    return addSecurityHeaders(response);
});

// Configuration du matcher pour définir quelles routes doivent être traitées par le middleware
export const config = {
    // Matcher qui exclut les fichiers statiques et _next, mais inclut toutes les autres routes
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!.*\\..*|_next).*)", 
        "/", 
        "/(api|trpc)(.*)"
    ],
};
