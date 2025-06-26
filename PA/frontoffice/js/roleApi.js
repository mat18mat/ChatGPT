// Service pour gérer les appels API liés aux rôles
class RoleService {
    // Récupérer tous les rôles d'un utilisateur
    static async getUserRoles(userId) {
        try {
            const roles = [];
            const token = localStorage.getItem('token');
            
            if (!token) {
                return ['client']; // Rôle par défaut
            }

            // Vérifier chaque type de rôle
            const endpoints = [
                { url: '/livreur', role: 'livreur' },
                { url: '/commercant', role: 'commercant' },
                { url: '/prestataire', role: 'prestataire' }
            ];

            const results = await Promise.all(endpoints.map(endpoint =>
                ApiService.get(endpoint.url)
                    .then(data => ({
                        role: endpoint.role,
                        hasRole: Array.isArray(data) && data.some(r => r.IdUtilisateur === userId)
                    }))
                    .catch(() => ({ role: endpoint.role, hasRole: false }))
            ));

            // Ajouter les rôles trouvés
            results.forEach(result => {
                if (result.hasRole) {
                    roles.push(result.role);
                }
            });

            // Toujours ajouter le rôle client par défaut
            roles.push('client');

            return roles;
        } catch (error) {
            console.error('Erreur lors de la récupération des rôles:', error);
            return ['client']; // En cas d'erreur, retourner le rôle client par défaut
        }
    }

    // Récupérer les données spécifiques à un rôle
    static async getRoleData(role, userId) {
        try {
            const endpoints = {
                client: [
                    { url: `/statistique/user/${userId}`, key: 'stats' },
                    { url: `/course/user/${userId}`, key: 'courses' },
                    { url: `/notifications/user/${userId}`, key: 'notifications' }
                ],
                prestataire: [
                    { url: `/prestataire/${userId}/stats`, key: 'stats' },
                    { url: `/prestataire/${userId}/services`, key: 'services' },
                    { url: `/prestataire/${userId}/reviews`, key: 'reviews' }
                ],
                commercant: [
                    { url: `/commercant/${userId}/stats`, key: 'stats' },
                    { url: `/commercant/${userId}/orders`, key: 'orders' },
                    { url: `/commercant/${userId}/inventory`, key: 'inventory' }
                ],
                livreur: [
                    { url: `/livreur/${userId}/stats`, key: 'stats' },
                    { url: `/livreur/${userId}/deliveries`, key: 'deliveries' },
                    { url: `/livreur/${userId}/performance`, key: 'performance' }
                ]
            };

            const roleEndpoints = endpoints[role] || [];
            const data = {};

            await Promise.all(roleEndpoints.map(async endpoint => {
                try {
                    const response = await ApiService.get(endpoint.url);
                    data[endpoint.key] = response;
                } catch (error) {
                    console.error(`Erreur lors de la récupération des données pour ${endpoint.url}:`, error);
                    data[endpoint.key] = null;
                }
            }));

            return data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données du rôle:', error);
            throw error;
        }
    }

    // Vérifier si un utilisateur a un rôle spécifique
    static async hasRole(userId, role) {
        try {
            const roles = await this.getUserRoles(userId);
            return roles.includes(role);
        } catch (error) {
            console.error('Erreur lors de la vérification du rôle:', error);
            return role === 'client'; // Par défaut, seul le rôle client est autorisé
        }
    }
} 