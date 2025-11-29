/**
 * Semantic Entity Engine - Moteur d'Entités Sémantiques
 * Génère du contenu 100% cohérent avec la thématique
 *
 * Ce moteur analyse le thème et génère:
 * - Des entités nommées cohérentes
 * - Du vocabulaire sémantiquement lié
 * - Des expressions idiomatiques du domaine
 * - Des métriques et chiffres réalistes
 * - Des témoignages crédibles
 */

class SemanticEntityEngine {
    constructor() {
        this.initializeThemeDatabase();
        this.initializeEntityPatterns();
        this.initializeSemanticFields();
    }

    /**
     * Base de données des thèmes avec entités sémantiques complètes
     */
    initializeThemeDatabase() {
        this.themes = {
            // ═══════════════════════════════════════════════════════════════════
            // ANIMAUX / PETS
            // ═══════════════════════════════════════════════════════════════════
            'pets': {
                keywords: ['chien', 'chat', 'animal', 'animaux', 'compagnon', 'pet', 'chiot', 'chaton', 'vétérinaire', 'croquettes', 'alimentation animale', 'dressage', 'éducation canine'],
                navigation: ['Accueil', 'Nos Conseils', 'Races', 'Alimentation', 'Santé', 'Blog'],
                heroTitles: [
                    'Prenez soin de votre compagnon comme il le mérite',
                    'Le bien-être de votre animal, notre priorité',
                    'Des conseils d\'experts pour des animaux heureux',
                    'Votre partenaire pour une vie harmonieuse avec vos animaux'
                ],
                heroSubtitles: [
                    'Guides pratiques, conseils vétérinaires et astuces pour le quotidien de votre animal de compagnie',
                    'Alimentation, santé, éducation : tout pour rendre votre compagnon heureux',
                    'Rejoignez une communauté de passionnés qui chouchoutent leurs animaux'
                ],
                services: [
                    { name: 'Conseils Nutrition', icon: '🍖', description: 'Guides complets sur l\'alimentation adaptée à chaque espèce et race' },
                    { name: 'Santé & Bien-être', icon: '💊', description: 'Prévention, soins courants et conseils vétérinaires' },
                    { name: 'Éducation & Dressage', icon: '🎓', description: 'Techniques positives pour une relation harmonieuse' },
                    { name: 'Équipements', icon: '🏠', description: 'Comparatifs et guides d\'achat pour le confort de votre animal' }
                ],
                features: [
                    { title: 'Conseils de vétérinaires', description: 'Nos articles sont validés par des professionnels de santé animale' },
                    { title: 'Guides par race', description: 'Informations spécifiques pour chaque race et espèce' },
                    { title: 'Communauté active', description: 'Partagez avec d\'autres propriétaires passionnés' }
                ],
                testimonials: [
                    { text: 'Grâce à leurs conseils nutrition, mon labrador a retrouvé sa forme ! Il a perdu 3kg et déborde d\'énergie.', author: 'Marie L.', role: 'Propriétaire de Max, 5 ans' },
                    { text: 'Les guides de dressage sont clairs et efficaces. Mon chiot a appris le rappel en 2 semaines.', author: 'Thomas B.', role: 'Maître de Luna' },
                    { text: 'Enfin un site qui parle aussi des NAC ! Les conseils pour mon furet sont précieux.', author: 'Sophie M.', role: 'Passionnée de NAC' }
                ],
                stats: [
                    { number: '15K+', label: 'Animaux heureux' },
                    { number: '250+', label: 'Articles experts' },
                    { number: '98%', label: 'Propriétaires satisfaits' },
                    { number: '50+', label: 'Races couvertes' }
                ],
                vocabulary: {
                    actions: ['découvrir', 'prendre soin', 'chouchouter', 'accompagner', 'conseiller'],
                    descriptors: ['adorable', 'fidèle', 'affectueux', 'joueur', 'câlin', 'espiègle'],
                    benefits: ['santé', 'bonheur', 'vitalité', 'complicité', 'épanouissement']
                },
                ctas: ['Découvrir nos conseils', 'Trouver la bonne alimentation', 'Lire nos guides'],
                aboutContent: 'Passionnés par les animaux depuis toujours, nous avons créé ce site pour partager notre expertise et aider chaque propriétaire à offrir le meilleur à son compagnon. Notre équipe de rédacteurs travaille avec des vétérinaires et des comportementalistes pour vous proposer des contenus fiables et pratiques.',
                footerTagline: 'Pour des animaux heureux et en bonne santé'
            },

            // ═══════════════════════════════════════════════════════════════════
            // TECHNOLOGIE / SAAS
            // ═══════════════════════════════════════════════════════════════════
            'tech': {
                keywords: ['logiciel', 'saas', 'application', 'digital', 'tech', 'startup', 'cloud', 'api', 'automatisation', 'IA', 'intelligence artificielle', 'développement', 'code', 'programmation'],
                navigation: ['Accueil', 'Fonctionnalités', 'Tarifs', 'API', 'Documentation', 'Blog'],
                heroTitles: [
                    'La technologie au service de votre croissance',
                    'Automatisez, optimisez, accélérez',
                    'Des outils puissants pour des équipes ambitieuses',
                    'Transformez vos données en décisions'
                ],
                heroSubtitles: [
                    'Une plateforme complète pour moderniser vos processus et booster votre productivité',
                    'Rejoignez plus de 2000 entreprises qui ont digitalisé leurs opérations',
                    'De l\'idée au déploiement, nous accélérons votre transformation digitale'
                ],
                services: [
                    { name: 'Automatisation', icon: '⚡', description: 'Automatisez vos tâches répétitives et libérez du temps pour l\'essentiel' },
                    { name: 'Analytics', icon: '📊', description: 'Tableaux de bord temps réel et insights actionables' },
                    { name: 'Intégrations', icon: '🔗', description: 'Connectez vos outils favoris via notre API REST' },
                    { name: 'Sécurité', icon: '🔒', description: 'Chiffrement de bout en bout et conformité RGPD' }
                ],
                features: [
                    { title: 'Déploiement rapide', description: 'Opérationnel en moins de 24h avec notre onboarding guidé' },
                    { title: 'Scalabilité infinie', description: 'Infrastructure cloud qui s\'adapte à votre croissance' },
                    { title: 'Support technique 24/7', description: 'Une équipe d\'experts toujours disponible' }
                ],
                testimonials: [
                    { text: 'Nous avons réduit notre temps de traitement de 60% en 3 mois. Le ROI est indéniable.', author: 'Marc D.', role: 'CTO, TechScale' },
                    { text: 'L\'API est parfaitement documentée. L\'intégration avec notre SI a été fluide.', author: 'Julie R.', role: 'Lead Developer, StartupX' },
                    { text: 'Enfin une solution qui comprend les enjeux des PME tech. Simple mais puissant.', author: 'Pierre L.', role: 'CEO, InnovateCorp' }
                ],
                stats: [
                    { number: '2500+', label: 'Entreprises clientes' },
                    { number: '99.9%', label: 'Uptime garanti' },
                    { number: '45%', label: 'Gain de productivité moyen' },
                    { number: '<2h', label: 'Temps de réponse support' }
                ],
                vocabulary: {
                    actions: ['automatiser', 'optimiser', 'déployer', 'intégrer', 'scaler'],
                    descriptors: ['performant', 'scalable', 'intuitif', 'sécurisé', 'fiable'],
                    benefits: ['productivité', 'efficacité', 'croissance', 'innovation', 'agilité']
                },
                ctas: ['Essayer gratuitement', 'Voir la démo', 'Consulter la documentation'],
                aboutContent: 'Fondée par des ingénieurs passionnés, notre mission est de démocratiser les technologies avancées pour toutes les entreprises. Nous croyons que la transformation digitale ne devrait pas être réservée aux grands groupes.',
                footerTagline: 'La technologie accessible à tous'
            },

            // ═══════════════════════════════════════════════════════════════════
            // BUSINESS / CONSULTING
            // ═══════════════════════════════════════════════════════════════════
            'business': {
                keywords: ['entreprise', 'business', 'consulting', 'conseil', 'stratégie', 'management', 'gestion', 'croissance', 'PME', 'TPE', 'entrepreneur'],
                navigation: ['Accueil', 'Nos Services', 'Expertises', 'Cas Clients', 'Ressources', 'Blog'],
                heroTitles: [
                    'Accélérez la croissance de votre entreprise',
                    'Des solutions stratégiques pour vos ambitions',
                    'Votre partenaire pour réussir durablement',
                    'Transformez vos défis en opportunités'
                ],
                heroSubtitles: [
                    'Accompagnement sur-mesure pour dirigeants et entrepreneurs ambitieux',
                    'Stratégie, organisation, performance : une approche globale pour votre succès',
                    '15 ans d\'expertise au service de votre développement'
                ],
                services: [
                    { name: 'Conseil Stratégique', icon: '🎯', description: 'Définissez votre vision et votre roadmap avec nos experts' },
                    { name: 'Optimisation Performance', icon: '📈', description: 'Améliorez vos process et boostez votre rentabilité' },
                    { name: 'Transformation Digitale', icon: '💻', description: 'Modernisez vos outils et vos méthodes de travail' },
                    { name: 'Accompagnement Dirigeants', icon: '👔', description: 'Coaching et sparring-partner pour leaders' }
                ],
                features: [
                    { title: 'Approche pragmatique', description: 'Des solutions concrètes, pas de la théorie' },
                    { title: 'Résultats mesurables', description: 'KPIs clairs et suivi de performance' },
                    { title: 'Expertise sectorielle', description: 'Connaissance approfondie de votre marché' }
                ],
                testimonials: [
                    { text: 'Leur accompagnement nous a permis de doubler notre CA en 18 mois. Une équipe à l\'écoute et pragmatique.', author: 'François M.', role: 'PDG, IndustrieMax' },
                    { text: 'La restructuration de nos process a généré 30% d\'économies. Un investissement rentabilisé en 6 mois.', author: 'Anne-Sophie L.', role: 'DG, ServicesPro' },
                    { text: 'Un vrai sparring-partner qui challenge positivement. Indispensable pour un dirigeant.', author: 'Jean-Pierre D.', role: 'Fondateur, StartupSuccess' }
                ],
                stats: [
                    { number: '200+', label: 'Entreprises accompagnées' },
                    { number: '15 ans', label: 'D\'expertise' },
                    { number: '+35%', label: 'Croissance moyenne clients' },
                    { number: '95%', label: 'Taux de recommandation' }
                ],
                vocabulary: {
                    actions: ['accompagner', 'transformer', 'développer', 'optimiser', 'structurer'],
                    descriptors: ['stratégique', 'performant', 'durable', 'pragmatique', 'ambitieux'],
                    benefits: ['croissance', 'rentabilité', 'compétitivité', 'leadership', 'pérennité']
                },
                ctas: ['Demander un diagnostic', 'Réserver un entretien', 'Télécharger notre guide'],
                aboutContent: 'Cabinet de conseil fondé par des dirigeants pour des dirigeants, nous combinons expérience terrain et méthodologies éprouvées. Notre mission : vous aider à révéler le plein potentiel de votre entreprise.',
                footerTagline: 'Votre succès est notre métier'
            },

            // ═══════════════════════════════════════════════════════════════════
            // E-COMMERCE / VENTE
            // ═══════════════════════════════════════════════════════════════════
            'ecommerce': {
                keywords: ['boutique', 'shop', 'vente', 'produits', 'achat', 'commerce', 'e-commerce', 'marketplace', 'livraison', 'catalogue'],
                navigation: ['Accueil', 'Boutique', 'Nouveautés', 'Promotions', 'Mon Compte', 'Blog'],
                heroTitles: [
                    'Des produits de qualité livrés chez vous',
                    'Découvrez notre sélection exclusive',
                    'Faites-vous plaisir, vous le méritez',
                    'La qualité accessible à tous les budgets'
                ],
                heroSubtitles: [
                    'Livraison gratuite dès 49€ d\'achat - Retours sous 30 jours',
                    'Plus de 5000 références sélectionnées avec soin pour vous',
                    'Paiement sécurisé et service client réactif'
                ],
                services: [
                    { name: 'Livraison Express', icon: '🚚', description: 'Recevez votre commande en 24-48h' },
                    { name: 'Retours Gratuits', icon: '↩️', description: '30 jours pour changer d\'avis' },
                    { name: 'Paiement Sécurisé', icon: '🔐', description: 'Vos données sont protégées' },
                    { name: 'Service Client', icon: '💬', description: 'Une équipe disponible 7j/7' }
                ],
                features: [
                    { title: 'Qualité garantie', description: 'Produits sélectionnés et testés par notre équipe' },
                    { title: 'Prix transparents', description: 'Pas de frais cachés, tout est inclus' },
                    { title: 'Fidélité récompensée', description: 'Gagnez des points à chaque achat' }
                ],
                testimonials: [
                    { text: 'Commande reçue en 24h, emballage soigné et produit conforme. Je recommande !', author: 'Claire B.', role: 'Cliente fidèle' },
                    { text: 'J\'ai eu un souci et le SAV a réglé ça en 1h. Top !', author: 'Nicolas T.', role: 'Acheteur régulier' },
                    { text: 'Les promotions sont vraies, pas du marketing. J\'ai économisé 40% sur ma commande.', author: 'Martine G.', role: 'Nouvelle cliente' }
                ],
                stats: [
                    { number: '50K+', label: 'Clients satisfaits' },
                    { number: '5000+', label: 'Produits' },
                    { number: '4.8/5', label: 'Note moyenne' },
                    { number: '24h', label: 'Livraison express' }
                ],
                vocabulary: {
                    actions: ['découvrir', 'acheter', 'commander', 'offrir', 'profiter'],
                    descriptors: ['tendance', 'qualité', 'exclusif', 'accessible', 'authentique'],
                    benefits: ['économies', 'confort', 'style', 'satisfaction', 'tranquillité']
                },
                ctas: ['Voir la boutique', 'Profiter des promos', 'Commander maintenant'],
                aboutContent: 'Depuis 2015, nous sélectionnons avec passion les meilleurs produits pour vous. Notre équipe teste chaque référence avant de l\'ajouter à notre catalogue. Votre satisfaction est notre priorité absolue.',
                footerTagline: 'Shopping en toute confiance'
            },

            // ═══════════════════════════════════════════════════════════════════
            // CRÉATIF / DESIGN / AGENCE
            // ═══════════════════════════════════════════════════════════════════
            'creative': {
                keywords: ['design', 'création', 'graphisme', 'branding', 'agence', 'créatif', 'identité visuelle', 'logo', 'web design', 'UI', 'UX'],
                navigation: ['Accueil', 'Portfolio', 'Services', 'L\'Agence', 'Inspirations', 'Blog'],
                heroTitles: [
                    'Des créations qui marquent les esprits',
                    'Donnez vie à votre vision',
                    'L\'art au service de votre image',
                    'Créons ensemble votre univers visuel'
                ],
                heroSubtitles: [
                    'Agence créative spécialisée en branding, design digital et direction artistique',
                    'Chaque projet est une nouvelle histoire à raconter visuellement',
                    'De l\'idée à la réalisation, nous transformons vos ambitions en créations mémorables'
                ],
                services: [
                    { name: 'Branding & Identité', icon: '🎨', description: 'Logo, charte graphique, univers de marque complet' },
                    { name: 'Design Digital', icon: '🖥️', description: 'Sites web, applications, interfaces utilisateur' },
                    { name: 'Direction Artistique', icon: '✨', description: 'Campagnes visuelles, photoshoots, vidéos' },
                    { name: 'Print & Édition', icon: '📚', description: 'Supports imprimés, packaging, signalétique' }
                ],
                features: [
                    { title: 'Approche sur-mesure', description: 'Chaque projet est unique, notre créativité aussi' },
                    { title: 'Process collaboratif', description: 'Vous êtes acteur de la création à chaque étape' },
                    { title: 'Excellence créative', description: 'Des créations primées et reconnues' }
                ],
                testimonials: [
                    { text: 'Ils ont su capter l\'essence de notre marque et la sublimer. Notre nouveau branding nous ressemble enfin.', author: 'Léa M.', role: 'Fondatrice, MaisonBelle' },
                    { text: 'Créatifs, réactifs et à l\'écoute. Le site qu\'ils ont conçu dépasse nos attentes.', author: 'Romain K.', role: 'CEO, FoodTech' },
                    { text: 'Travailler avec eux, c\'est un vrai partenariat créatif. Ils challengent nos idées pour les améliorer.', author: 'Camille P.', role: 'Directrice Marketing, LuxeBrand' }
                ],
                stats: [
                    { number: '150+', label: 'Projets réalisés' },
                    { number: '8 ans', label: 'D\'expérience' },
                    { number: '12', label: 'Awards créatifs' },
                    { number: '100%', label: 'Clients satisfaits' }
                ],
                vocabulary: {
                    actions: ['créer', 'concevoir', 'imaginer', 'transformer', 'sublimer'],
                    descriptors: ['créatif', 'audacieux', 'unique', 'inspirant', 'raffiné'],
                    benefits: ['impact', 'différenciation', 'mémorabilité', 'cohérence', 'émotion']
                },
                ctas: ['Voir nos créations', 'Discuter de votre projet', 'Demander un devis'],
                aboutContent: 'Collectif de créatifs passionnés, nous croyons au pouvoir du design pour transformer les marques. Notre approche mêle stratégie et créativité pour des résultats qui font la différence.',
                footerTagline: 'Design with purpose'
            },

            // ═══════════════════════════════════════════════════════════════════
            // SANTÉ / MÉDICAL / BIEN-ÊTRE
            // ═══════════════════════════════════════════════════════════════════
            'health': {
                keywords: ['santé', 'médical', 'bien-être', 'wellness', 'soins', 'médecin', 'thérapie', 'prévention', 'nutrition', 'forme'],
                navigation: ['Accueil', 'Nos Soins', 'L\'Équipe', 'Prendre RDV', 'Conseils Santé', 'Blog'],
                heroTitles: [
                    'Votre santé, notre engagement',
                    'Prenez soin de vous, on s\'occupe du reste',
                    'Une approche globale de votre bien-être',
                    'Des soins personnalisés pour chaque patient'
                ],
                heroSubtitles: [
                    'Équipe médicale qualifiée, technologies de pointe et accompagnement humain',
                    'De la prévention aux soins spécialisés, nous vous accompagnons à chaque étape',
                    'Prenez rendez-vous en ligne en quelques clics'
                ],
                services: [
                    { name: 'Consultations', icon: '👨‍⚕️', description: 'Médecins généralistes et spécialistes à votre écoute' },
                    { name: 'Prévention', icon: '🩺', description: 'Bilans de santé, dépistages et conseils personnalisés' },
                    { name: 'Soins Spécialisés', icon: '💉', description: 'Traitements adaptés à vos besoins spécifiques' },
                    { name: 'Bien-être', icon: '🧘', description: 'Approche holistique pour un équilibre corps-esprit' }
                ],
                features: [
                    { title: 'Équipe pluridisciplinaire', description: 'Médecins, spécialistes et thérapeutes travaillent ensemble' },
                    { title: 'Prise en charge rapide', description: 'RDV disponibles sous 48h en moyenne' },
                    { title: 'Suivi personnalisé', description: 'Un parcours de soins adapté à votre situation' }
                ],
                testimonials: [
                    { text: 'Une prise en charge humaine et professionnelle. Je me suis sentie écoutée et comprise.', author: 'Catherine R.', role: 'Patiente' },
                    { text: 'Le suivi post-consultation est remarquable. Ils prennent vraiment soin de leurs patients.', author: 'Michel B.', role: 'Patient régulier' },
                    { text: 'Enfin un centre qui prend le temps ! Fini les consultations expédiées en 5 minutes.', author: 'Sylvie D.', role: 'Nouvelle patiente' }
                ],
                stats: [
                    { number: '10K+', label: 'Patients suivis' },
                    { number: '20+', label: 'Praticiens' },
                    { number: '98%', label: 'Satisfaction' },
                    { number: '48h', label: 'Délai RDV moyen' }
                ],
                vocabulary: {
                    actions: ['soigner', 'accompagner', 'prévenir', 'écouter', 'guérir'],
                    descriptors: ['bienveillant', 'professionnel', 'attentif', 'qualifié', 'humain'],
                    benefits: ['santé', 'bien-être', 'sérénité', 'confiance', 'vitalité']
                },
                ctas: ['Prendre rendez-vous', 'Découvrir nos soins', 'Nous contacter'],
                aboutContent: 'Centre de santé fondé sur des valeurs d\'écoute et de bienveillance, nous plaçons le patient au cœur de notre approche. Notre équipe pluridisciplinaire travaille en synergie pour vous offrir des soins de qualité.',
                footerTagline: 'Votre santé entre de bonnes mains'
            },

            // ═══════════════════════════════════════════════════════════════════
            // IMMOBILIER
            // ═══════════════════════════════════════════════════════════════════
            'realestate': {
                keywords: ['immobilier', 'appartement', 'maison', 'achat', 'vente', 'location', 'investissement', 'bien', 'propriété', 'logement'],
                navigation: ['Accueil', 'Nos Biens', 'Acheter', 'Vendre', 'Estimation', 'Blog'],
                heroTitles: [
                    'Trouvez le bien de vos rêves',
                    'L\'immobilier à votre portée',
                    'Votre projet immobilier mérite le meilleur accompagnement',
                    'Achat, vente, investissement : on gère tout'
                ],
                heroSubtitles: [
                    'Plus de 500 biens disponibles dans votre région - Estimation gratuite sous 24h',
                    'Des conseillers experts à vos côtés pour chaque étape de votre projet',
                    'De la recherche à la signature, nous simplifions votre parcours immobilier'
                ],
                services: [
                    { name: 'Achat Immobilier', icon: '🏠', description: 'Trouvez le bien idéal parmi notre sélection' },
                    { name: 'Vente', icon: '🔑', description: 'Vendez au meilleur prix avec notre accompagnement' },
                    { name: 'Estimation', icon: '📊', description: 'Connaissez la valeur de votre bien gratuitement' },
                    { name: 'Investissement', icon: '💰', description: 'Conseils pour optimiser votre patrimoine' }
                ],
                features: [
                    { title: 'Connaissance locale', description: 'Experts de votre secteur depuis 20 ans' },
                    { title: 'Accompagnement complet', description: 'De la visite au notaire, on gère tout' },
                    { title: 'Honoraires transparents', description: 'Pas de surprise, tout est clair dès le départ' }
                ],
                testimonials: [
                    { text: 'Grâce à eux, nous avons trouvé notre maison en 3 semaines. Réactifs et à l\'écoute de nos critères.', author: 'Famille Durand', role: 'Acheteurs' },
                    { text: 'Vente conclue au prix demandé en 2 mois. Leur estimation était juste et leur stratégie efficace.', author: 'Henri M.', role: 'Vendeur' },
                    { text: 'Un vrai partenaire pour mes investissements locatifs. 3 biens achetés avec eux !', author: 'Laurent P.', role: 'Investisseur' }
                ],
                stats: [
                    { number: '500+', label: 'Biens à vendre' },
                    { number: '20 ans', label: 'D\'expérience' },
                    { number: '95%', label: 'Ventes réussies' },
                    { number: '60 jours', label: 'Délai vente moyen' }
                ],
                vocabulary: {
                    actions: ['trouver', 'vendre', 'investir', 'accompagner', 'estimer'],
                    descriptors: ['idéal', 'lumineux', 'spacieux', 'rénové', 'bien situé'],
                    benefits: ['sérénité', 'confiance', 'rapidité', 'transparence', 'expertise']
                },
                ctas: ['Voir nos biens', 'Estimer mon bien', 'Être rappelé'],
                aboutContent: 'Agence immobilière familiale ancrée dans notre territoire depuis 20 ans, nous mettons notre connaissance du marché local au service de vos projets. Achat, vente ou investissement : votre satisfaction est notre priorité.',
                footerTagline: 'L\'immobilier en toute confiance'
            },

            // ═══════════════════════════════════════════════════════════════════
            // FORMATION / ÉDUCATION
            // ═══════════════════════════════════════════════════════════════════
            'education': {
                keywords: ['formation', 'cours', 'apprentissage', 'éducation', 'e-learning', 'tutoriel', 'certification', 'compétences', 'école', 'diplôme'],
                navigation: ['Accueil', 'Nos Formations', 'Parcours', 'Certifications', 'Ressources', 'Blog'],
                heroTitles: [
                    'Développez vos compétences, boostez votre carrière',
                    'Apprenez à votre rythme, progressez vraiment',
                    'Des formations qui ouvrent des portes',
                    'Votre potentiel n\'attend que vous'
                ],
                heroSubtitles: [
                    'Plus de 100 formations certifiantes accessibles en ligne 24/7',
                    'Des formateurs experts et un accompagnement personnalisé pour réussir',
                    'Financement CPF possible - Certification reconnue'
                ],
                services: [
                    { name: 'Formations en ligne', icon: '💻', description: 'Apprenez où vous voulez, quand vous voulez' },
                    { name: 'Certifications', icon: '🎓', description: 'Validez vos acquis avec des diplômes reconnus' },
                    { name: 'Accompagnement', icon: '👨‍🏫', description: 'Tuteurs disponibles pour répondre à vos questions' },
                    { name: 'Parcours sur-mesure', icon: '🛤️', description: 'Des programmes adaptés à vos objectifs' }
                ],
                features: [
                    { title: 'Formateurs experts', description: 'Professionnels en activité qui partagent leur expérience' },
                    { title: 'Rythme flexible', description: 'Avancez à votre vitesse, revisionnez autant que nécessaire' },
                    { title: 'Communauté active', description: 'Échangez avec les autres apprenants et créez votre réseau' }
                ],
                testimonials: [
                    { text: 'J\'ai changé de métier grâce à leur formation. En 6 mois, j\'avais un nouveau job dans le digital.', author: 'Pauline L.', role: 'Reconversion réussie' },
                    { text: 'Le format en ligne est parfait pour concilier formation et travail. Les contenus sont de grande qualité.', author: 'Antoine R.', role: 'En poste et en formation' },
                    { text: 'L\'accompagnement fait vraiment la différence. Les tuteurs sont réactifs et bienveillants.', author: 'Samira K.', role: 'Étudiante certifiée' }
                ],
                stats: [
                    { number: '10K+', label: 'Apprenants formés' },
                    { number: '100+', label: 'Formations' },
                    { number: '92%', label: 'Taux de réussite' },
                    { number: '85%', label: 'Insertion professionnelle' }
                ],
                vocabulary: {
                    actions: ['apprendre', 'progresser', 'certifier', 'développer', 'maîtriser'],
                    descriptors: ['pratique', 'accessible', 'reconnu', 'complet', 'flexible'],
                    benefits: ['compétences', 'évolution', 'employabilité', 'confiance', 'expertise']
                },
                ctas: ['Découvrir nos formations', 'Tester gratuitement', 'Parler à un conseiller'],
                aboutContent: 'Organisme de formation certifié Qualiopi, nous croyons que l\'apprentissage est le meilleur investissement. Nos formations sont conçues par des experts et pensées pour être applicables immédiatement.',
                footerTagline: 'Apprenez aujourd\'hui, réussissez demain'
            },

            // ═══════════════════════════════════════════════════════════════════
            // RESTAURATION / FOOD
            // ═══════════════════════════════════════════════════════════════════
            'food': {
                keywords: ['restaurant', 'cuisine', 'gastronomie', 'chef', 'menu', 'repas', 'food', 'traiteur', 'recette', 'saveur'],
                navigation: ['Accueil', 'La Carte', 'Notre Chef', 'Réserver', 'Événements', 'Blog'],
                heroTitles: [
                    'Une cuisine qui éveille vos sens',
                    'Le goût de l\'excellence à chaque bouchée',
                    'Des saveurs qui racontent une histoire',
                    'L\'art culinaire au cœur de votre assiette'
                ],
                heroSubtitles: [
                    'Produits frais et locaux, recettes créatives et accueil chaleureux',
                    'Du producteur à votre assiette, le meilleur de la gastronomie française',
                    'Réservez votre table et laissez-vous surprendre'
                ],
                services: [
                    { name: 'Restaurant', icon: '🍽️', description: 'Une carte qui change au fil des saisons' },
                    { name: 'Traiteur', icon: '👨‍🍳', description: 'Sublimez vos événements privés et professionnels' },
                    { name: 'Privatisation', icon: '🎉', description: 'Un cadre d\'exception pour vos célébrations' },
                    { name: 'Click & Collect', icon: '📦', description: 'Savourez notre cuisine chez vous' }
                ],
                features: [
                    { title: 'Produits locaux', description: 'Partenariats avec des producteurs de notre région' },
                    { title: 'Carte évolutive', description: 'Des créations renouvelées au fil des saisons' },
                    { title: 'Accueil soigné', description: 'Une équipe attentive pour un moment parfait' }
                ],
                testimonials: [
                    { text: 'Une explosion de saveurs ! Le menu dégustation est une vraie aventure culinaire.', author: 'Isabelle F.', role: 'Cliente habitée' },
                    { text: 'Cadre magnifique, service impeccable et cuisine divine. Notre adresse préférée.', author: 'Couple Martin', role: 'Clients fidèles' },
                    { text: 'Le chef a su créer un menu sur-mesure pour notre mariage. Nos invités en parlent encore !', author: 'Marie et Thomas', role: 'Mariés 2024' }
                ],
                stats: [
                    { number: '4.9/5', label: 'Note Google' },
                    { number: '15 ans', label: 'D\'expérience' },
                    { number: '100%', label: 'Frais et local' },
                    { number: '1 ⭐', label: 'Michelin' }
                ],
                vocabulary: {
                    actions: ['savourer', 'déguster', 'découvrir', 'partager', 'célébrer'],
                    descriptors: ['savoureux', 'raffiné', 'authentique', 'créatif', 'généreux'],
                    benefits: ['plaisir', 'convivialité', 'découverte', 'évasion', 'partage']
                },
                ctas: ['Réserver une table', 'Voir la carte', 'Commander en ligne'],
                aboutContent: 'Chef passionné depuis 15 ans, je vous accueille dans mon restaurant pour un voyage gustatif. Ma cuisine célèbre les produits de nos terroirs avec créativité et respect des saisons.',
                footerTagline: 'Le goût du fait maison'
            },

            // ═══════════════════════════════════════════════════════════════════
            // JURIDIQUE / DROIT
            // ═══════════════════════════════════════════════════════════════════
            'legal': {
                keywords: ['avocat', 'juridique', 'droit', 'justice', 'cabinet', 'contentieux', 'conseil juridique', 'litige', 'contrat', 'défense'],
                navigation: ['Accueil', 'Nos Expertises', 'Le Cabinet', 'Honoraires', 'Actualités', 'Blog'],
                heroTitles: [
                    'Votre droit, notre combat',
                    'Des solutions juridiques sur-mesure',
                    'Défendre vos intérêts avec détermination',
                    'Le droit au service de vos projets'
                ],
                heroSubtitles: [
                    'Cabinet d\'avocats expérimenté en droit des affaires, droit du travail et droit de la famille',
                    'Conseil, négociation et contentieux : une expertise complète à vos côtés',
                    'Premier rendez-vous gratuit - Honoraires transparents'
                ],
                services: [
                    { name: 'Droit des Affaires', icon: '💼', description: 'Création, contrats, litiges commerciaux' },
                    { name: 'Droit du Travail', icon: '👔', description: 'Licenciements, prud\'hommes, négociations' },
                    { name: 'Droit de la Famille', icon: '👨‍👩‍👧', description: 'Divorce, succession, protection des mineurs' },
                    { name: 'Droit Pénal', icon: '⚖️', description: 'Défense pénale, victimes, infractions' }
                ],
                features: [
                    { title: 'Réactivité', description: 'Réponse sous 24h et disponibilité en cas d\'urgence' },
                    { title: 'Transparence', description: 'Honoraires clairs et convention dès le premier RDV' },
                    { title: 'Expérience', description: '20 ans de pratique et des centaines de dossiers gagnés' }
                ],
                testimonials: [
                    { text: 'Maître X a défendu mes intérêts avec pugnacité. J\'ai obtenu gain de cause aux prud\'hommes.', author: 'Jean-Marc L.', role: 'Client satisfait' },
                    { text: 'Un cabinet à taille humaine où l\'on se sent écouté. Mes questions n\'ont jamais été sans réponse.', author: 'Caroline D.', role: 'Cliente' },
                    { text: 'Accompagnement exemplaire pour la cession de mon entreprise. Tout a été anticipé.', author: 'Philippe R.', role: 'Chef d\'entreprise' }
                ],
                stats: [
                    { number: '500+', label: 'Dossiers traités' },
                    { number: '20 ans', label: 'D\'expérience' },
                    { number: '85%', label: 'Taux de succès' },
                    { number: '24h', label: 'Délai de réponse' }
                ],
                vocabulary: {
                    actions: ['défendre', 'conseiller', 'négocier', 'protéger', 'accompagner'],
                    descriptors: ['rigoureux', 'combatif', 'à l\'écoute', 'expérimenté', 'réactif'],
                    benefits: ['justice', 'sérénité', 'protection', 'expertise', 'confiance']
                },
                ctas: ['Prendre rendez-vous', 'Nous appeler', 'Poser une question'],
                aboutContent: 'Cabinet fondé il y a 20 ans, nous défendons particuliers et entreprises avec la même détermination. Notre approche combine expertise juridique et sens de l\'humain pour des solutions adaptées à chaque situation.',
                footerTagline: 'Le droit à vos côtés'
            },

            // ═══════════════════════════════════════════════════════════════════
            // SPORT / FITNESS
            // ═══════════════════════════════════════════════════════════════════
            'fitness': {
                keywords: ['sport', 'fitness', 'musculation', 'coach', 'entraînement', 'gym', 'remise en forme', 'cardio', 'bien-être', 'santé'],
                navigation: ['Accueil', 'Nos Cours', 'Coaching', 'Planning', 'Abonnements', 'Blog'],
                heroTitles: [
                    'Révélez le meilleur de vous-même',
                    'Votre transformation commence ici',
                    'Du sport, des résultats, du plaisir',
                    'Dépassez vos limites avec nous'
                ],
                heroSubtitles: [
                    'Coaching personnalisé, cours collectifs et équipements premium',
                    'Rejoignez une communauté motivée et atteignez vos objectifs',
                    '7j/7 de 6h à 23h - Premier cours d\'essai offert'
                ],
                services: [
                    { name: 'Coaching Personnel', icon: '💪', description: 'Un programme sur-mesure avec votre coach dédié' },
                    { name: 'Cours Collectifs', icon: '👥', description: 'Plus de 50 cours par semaine pour tous niveaux' },
                    { name: 'Espace Musculation', icon: '🏋️', description: 'Équipements haut de gamme et espace cardio' },
                    { name: 'Nutrition', icon: '🥗', description: 'Conseils alimentaires pour optimiser vos résultats' }
                ],
                features: [
                    { title: 'Coachs certifiés', description: 'Des professionnels diplômés et passionnés' },
                    { title: 'Suivi personnalisé', description: 'Application de suivi et bilans réguliers' },
                    { title: 'Ambiance motivante', description: 'Une communauté bienveillante qui vous tire vers le haut' }
                ],
                testimonials: [
                    { text: 'J\'ai perdu 15kg en 6 mois grâce à leur accompagnement. Je me sens transformé !', author: 'Maxime T.', role: 'Membre depuis 1 an' },
                    { text: 'Les cours de HIIT sont addictifs ! L\'ambiance est top et les coachs super motivants.', author: 'Laura M.', role: 'Adepte du collectif' },
                    { text: 'Enfin une salle où je ne me sens pas jugé. Parfait pour reprendre le sport en douceur.', author: 'Christophe B.', role: 'Nouveau sportif' }
                ],
                stats: [
                    { number: '2000+', label: 'Membres actifs' },
                    { number: '50+', label: 'Cours par semaine' },
                    { number: '15', label: 'Coachs certifiés' },
                    { number: '7j/7', label: 'Ouvert' }
                ],
                vocabulary: {
                    actions: ['s\'entraîner', 'progresser', 'se dépasser', 'transformer', 'performer'],
                    descriptors: ['motivant', 'intense', 'accessible', 'efficace', 'fun'],
                    benefits: ['forme', 'énergie', 'confiance', 'résultats', 'bien-être']
                },
                ctas: ['Essayer gratuitement', 'Voir le planning', 'S\'inscrire'],
                aboutContent: 'Plus qu\'une salle de sport, c\'est une communauté. Nos coachs passionnés vous accompagnent vers vos objectifs dans une ambiance bienveillante et motivante. Ici, tout le monde est le bienvenu.',
                footerTagline: 'Votre meilleure version vous attend'
            },

            // ═══════════════════════════════════════════════════════════════════
            // FINANCE / ASSURANCE
            // ═══════════════════════════════════════════════════════════════════
            'finance': {
                keywords: ['finance', 'assurance', 'investissement', 'épargne', 'banque', 'crédit', 'patrimoine', 'retraite', 'fiscalité', 'placement'],
                navigation: ['Accueil', 'Nos Solutions', 'Simulateurs', 'Nos Conseillers', 'Actualités', 'Blog'],
                heroTitles: [
                    'Construisez votre avenir financier',
                    'Des solutions adaptées à votre vie',
                    'Protégez ce qui compte vraiment',
                    'Votre patrimoine mérite le meilleur conseil'
                ],
                heroSubtitles: [
                    'Épargne, investissement, assurance : un accompagnement personnalisé pour chaque étape de vie',
                    'Des conseillers experts à votre écoute pour optimiser votre situation financière',
                    'Simulation gratuite et sans engagement'
                ],
                services: [
                    { name: 'Gestion de Patrimoine', icon: '💎', description: 'Optimisez et faites fructifier votre capital' },
                    { name: 'Assurance Vie', icon: '🛡️', description: 'Protégez vos proches et préparez l\'avenir' },
                    { name: 'Crédit Immobilier', icon: '🏡', description: 'Financez vos projets aux meilleures conditions' },
                    { name: 'Retraite', icon: '🌴', description: 'Anticipez sereinement votre fin de carrière' }
                ],
                features: [
                    { title: 'Conseils indépendants', description: 'Nous travaillons dans votre intérêt, pas celui des banques' },
                    { title: 'Approche globale', description: 'Fiscalité, succession, protection : une vision à 360°' },
                    { title: 'Suivi dans la durée', description: 'Vos situations évoluent, nos conseils s\'adaptent' }
                ],
                testimonials: [
                    { text: 'Grâce à leurs conseils, j\'ai optimisé ma fiscalité et économisé 8000€ cette année.', author: 'Bernard L.', role: 'Chef d\'entreprise' },
                    { text: 'Ils ont trouvé le crédit idéal pour notre maison. 0.3% de moins que notre banque !', author: 'Famille Petit', role: 'Primo-accédants' },
                    { text: 'Un vrai partenaire pour préparer ma retraite sereinement. Enfin des conseils clairs !', author: 'Martine G.', role: 'Future retraitée' }
                ],
                stats: [
                    { number: '500M€', label: 'Patrimoine géré' },
                    { number: '25 ans', label: 'D\'expertise' },
                    { number: '3000+', label: 'Clients accompagnés' },
                    { number: '97%', label: 'Satisfaction' }
                ],
                vocabulary: {
                    actions: ['optimiser', 'protéger', 'investir', 'épargner', 'anticiper'],
                    descriptors: ['sécurisé', 'rentable', 'personnalisé', 'transparent', 'pérenne'],
                    benefits: ['sérénité', 'rendement', 'protection', 'optimisation', 'transmission']
                },
                ctas: ['Simuler mon projet', 'Prendre rendez-vous', 'Demander un bilan'],
                aboutContent: 'Cabinet de conseil en gestion de patrimoine indépendant, nous mettons notre expertise au service de vos projets de vie. Notre indépendance garantit des conseils objectifs, dans votre seul intérêt.',
                footerTagline: 'Votre avenir, notre expertise'
            },

            // ═══════════════════════════════════════════════════════════════════
            // DEFAULT / GÉNÉRAL
            // ═══════════════════════════════════════════════════════════════════
            'general': {
                keywords: [],
                navigation: ['Accueil', 'Services', 'À Propos', 'Ressources', 'Contact', 'Blog'],
                heroTitles: [
                    'Bienvenue sur notre plateforme',
                    'Des solutions adaptées à vos besoins',
                    'Votre partenaire de confiance',
                    'L\'excellence à votre service'
                ],
                heroSubtitles: [
                    'Découvrez notre expertise et nos services personnalisés',
                    'Une équipe dédiée pour vous accompagner dans vos projets',
                    'Qualité, réactivité et satisfaction client'
                ],
                services: [
                    { name: 'Conseil', icon: '💡', description: 'Un accompagnement personnalisé pour vos projets' },
                    { name: 'Solutions', icon: '🎯', description: 'Des réponses adaptées à vos besoins spécifiques' },
                    { name: 'Support', icon: '🤝', description: 'Une équipe disponible et à l\'écoute' },
                    { name: 'Expertise', icon: '⭐', description: 'Des années d\'expérience à votre service' }
                ],
                features: [
                    { title: 'Qualité', description: 'Des standards élevés pour chaque prestation' },
                    { title: 'Réactivité', description: 'Des réponses rapides à vos demandes' },
                    { title: 'Proximité', description: 'Une relation de confiance sur le long terme' }
                ],
                testimonials: [
                    { text: 'Service impeccable et équipe très professionnelle. Je recommande vivement.', author: 'Client satisfait', role: '' },
                    { text: 'Une collaboration efficace qui a dépassé nos attentes. Merci !', author: 'Partenaire', role: '' },
                    { text: 'Réactifs, compétents et à l\'écoute. Tout ce qu\'on attend d\'un bon partenaire.', author: 'Client fidèle', role: '' }
                ],
                stats: [
                    { number: '100+', label: 'Clients satisfaits' },
                    { number: '10 ans', label: 'D\'expérience' },
                    { number: '98%', label: 'Satisfaction' },
                    { number: '24h', label: 'Réponse moyenne' }
                ],
                vocabulary: {
                    actions: ['découvrir', 'accompagner', 'réaliser', 'optimiser', 'transformer'],
                    descriptors: ['professionnel', 'fiable', 'innovant', 'accessible', 'expert'],
                    benefits: ['qualité', 'efficacité', 'confiance', 'résultats', 'satisfaction']
                },
                ctas: ['En savoir plus', 'Nous contacter', 'Découvrir'],
                aboutContent: 'Entreprise engagée dans la satisfaction de nos clients, nous mettons notre expertise et notre passion au service de vos projets. Notre équipe vous accompagne avec professionnalisme et bienveillance.',
                footerTagline: 'À votre service'
            }
        };
    }

    /**
     * Patterns d'entités pour enrichissement sémantique
     */
    initializeEntityPatterns() {
        this.entityPatterns = {
            // Prénoms français courants pour témoignages
            firstNames: {
                male: ['Thomas', 'Nicolas', 'Pierre', 'Jean', 'François', 'Michel', 'Laurent', 'Philippe', 'Marc', 'Christophe', 'Antoine', 'Maxime', 'Julien', 'Romain', 'Alexandre'],
                female: ['Marie', 'Sophie', 'Claire', 'Anne', 'Isabelle', 'Catherine', 'Nathalie', 'Valérie', 'Sylvie', 'Caroline', 'Émilie', 'Laura', 'Camille', 'Pauline', 'Julie']
            },
            // Noms de famille
            lastNames: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia'],
            // Villes françaises
            cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Bordeaux', 'Lille', 'Strasbourg', 'Rennes', 'Montpellier', 'Grenoble', 'Dijon', 'Angers', 'Tours'],
            // Rôles professionnels
            roles: {
                business: ['PDG', 'Directeur Général', 'Directrice Marketing', 'Responsable Commercial', 'Chef d\'entreprise', 'Fondateur', 'DRH'],
                tech: ['CTO', 'Lead Developer', 'Product Manager', 'DevOps Engineer', 'Data Scientist', 'UX Designer'],
                general: ['Client', 'Utilisateur', 'Membre', 'Partenaire', 'Abonné']
            }
        };
    }

    /**
     * Champs sémantiques pour cohérence lexicale
     */
    initializeSemanticFields() {
        this.semanticFields = {
            quality: ['excellence', 'qualité', 'fiabilité', 'performance', 'expertise'],
            trust: ['confiance', 'sérieux', 'professionnalisme', 'engagement', 'transparence'],
            innovation: ['innovation', 'modernité', 'créativité', 'avant-garde', 'évolution'],
            human: ['proximité', 'écoute', 'accompagnement', 'bienveillance', 'disponibilité'],
            results: ['résultats', 'efficacité', 'succès', 'performance', 'impact']
        };
    }

    /**
     * Détecte le thème à partir des keywords
     */
    detectTheme(keywords) {
        if (!keywords || keywords.length === 0) {
            return 'general';
        }

        const keywordsLower = keywords.map(k => k.toLowerCase()).join(' ');

        // Scoring par thème
        const scores = {};

        for (const [theme, data] of Object.entries(this.themes)) {
            if (theme === 'general') continue;

            let score = 0;
            for (const keyword of data.keywords) {
                if (keywordsLower.includes(keyword.toLowerCase())) {
                    score += keyword.length; // Mots plus longs = plus de poids
                }
            }
            scores[theme] = score;
        }

        // Trouver le meilleur score
        let bestTheme = 'general';
        let bestScore = 0;

        for (const [theme, score] of Object.entries(scores)) {
            if (score > bestScore) {
                bestScore = score;
                bestTheme = theme;
            }
        }

        return bestTheme;
    }

    /**
     * Génère le contenu complet pour une onepage
     */
    generateOnepageContent(detectedTheme, branding = {}) {
        const theme = this.themes[detectedTheme] || this.themes['general'];

        // Sélection aléatoire parmi les options
        const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

        return {
            // Navigation
            navigation: theme.navigation,
            navItems: theme.navigation.map((item, index) => ({
                text: item,
                href: index === 0 ? '#hero' :
                      item === 'Blog' ? '/blog/' :
                      `#${item.toLowerCase().replace(/[^a-z]/g, '')}`
            })),

            // Hero Section
            hero: {
                title: branding.heroTitle || randomChoice(theme.heroTitles),
                subtitle: branding.heroSubtitle || randomChoice(theme.heroSubtitles),
                cta: randomChoice(theme.ctas),
                secondaryCta: theme.ctas[1] || 'En savoir plus'
            },

            // Services
            services: {
                title: this.getServicesTitle(detectedTheme),
                items: theme.services
            },

            // Features
            features: {
                title: this.getFeaturesTitle(detectedTheme),
                items: theme.features
            },

            // Stats
            stats: {
                title: 'Nos chiffres parlent',
                items: theme.stats
            },

            // Testimonials
            testimonials: {
                title: 'Ils nous font confiance',
                items: theme.testimonials.map(t => ({
                    ...t,
                    avatar: this.generateInitials(t.author)
                }))
            },

            // About
            about: {
                title: 'Notre histoire',
                content: branding.aboutContent || theme.aboutContent
            },

            // CTA Final
            ctaFinal: {
                title: this.getCtaTitle(detectedTheme),
                subtitle: this.getCtaSubtitle(detectedTheme),
                button: randomChoice(theme.ctas)
            },

            // Footer
            footer: {
                tagline: theme.footerTagline,
                links: theme.navigation
            },

            // Vocabulaire pour enrichissement
            vocabulary: theme.vocabulary,

            // Metadata pour templates
            meta: {
                theme: detectedTheme,
                tone: this.getTone(detectedTheme),
                colorSuggestion: this.getColorSuggestion(detectedTheme)
            }
        };
    }

    /**
     * Génère un titre de section Services adapté
     */
    getServicesTitle(theme) {
        const titles = {
            pets: 'Ce que nous proposons pour vos compagnons',
            tech: 'Nos solutions technologiques',
            business: 'Nos expertises à votre service',
            ecommerce: 'Nos engagements',
            creative: 'Nos univers créatifs',
            health: 'Nos soins et services',
            realestate: 'Notre accompagnement immobilier',
            education: 'Nos parcours de formation',
            food: 'Nos services gourmands',
            legal: 'Nos domaines d\'expertise',
            fitness: 'Nos offres sportives',
            finance: 'Nos solutions financières',
            general: 'Nos services'
        };
        return titles[theme] || titles.general;
    }

    /**
     * Génère un titre de section Features adapté
     */
    getFeaturesTitle(theme) {
        const titles = {
            pets: 'Pourquoi nous choisir pour votre animal',
            tech: 'Ce qui nous différencie',
            business: 'Notre valeur ajoutée',
            ecommerce: 'Vos avantages client',
            creative: 'Notre approche unique',
            health: 'Notre engagement qualité',
            realestate: 'Les plus de notre agence',
            education: 'L\'avantage de nos formations',
            food: 'Notre signature culinaire',
            legal: 'Notre engagement envers vous',
            fitness: 'L\'expérience qui fait la différence',
            finance: 'Notre philosophie de conseil',
            general: 'Pourquoi nous choisir'
        };
        return titles[theme] || titles.general;
    }

    /**
     * Génère un titre CTA adapté
     */
    getCtaTitle(theme) {
        const titles = {
            pets: 'Prêt à chouchouter votre compagnon ?',
            tech: 'Prêt à transformer votre business ?',
            business: 'Prêt à passer à l\'action ?',
            ecommerce: 'Envie de vous faire plaisir ?',
            creative: 'Un projet créatif en tête ?',
            health: 'Prenez soin de vous maintenant',
            realestate: 'Votre projet immobilier n\'attend plus',
            education: 'Prêt à booster votre carrière ?',
            food: 'Réservez votre expérience',
            legal: 'Besoin d\'un conseil juridique ?',
            fitness: 'Prêt à vous transformer ?',
            finance: 'Optimisons votre situation ensemble',
            general: 'Prêt à commencer ?'
        };
        return titles[theme] || titles.general;
    }

    /**
     * Génère un sous-titre CTA adapté
     */
    getCtaSubtitle(theme) {
        const subtitles = {
            pets: 'Rejoignez notre communauté de propriétaires passionnés',
            tech: 'Essai gratuit pendant 14 jours, sans engagement',
            business: 'Premier entretien offert pour analyser votre situation',
            ecommerce: 'Livraison gratuite dès 49€ d\'achat',
            creative: 'Discutons de votre vision autour d\'un café',
            health: 'Prenez rendez-vous en ligne en quelques clics',
            realestate: 'Estimation gratuite et sans engagement',
            education: 'Éligible au financement CPF',
            food: 'Tables disponibles ce soir',
            legal: 'Première consultation offerte',
            fitness: 'Premier cours d\'essai gratuit',
            finance: 'Bilan patrimonial offert',
            general: 'Contactez-nous pour en savoir plus'
        };
        return subtitles[theme] || subtitles.general;
    }

    /**
     * Retourne le ton approprié
     */
    getTone(theme) {
        const tones = {
            pets: 'friendly',
            tech: 'professional',
            business: 'corporate',
            ecommerce: 'engaging',
            creative: 'artistic',
            health: 'caring',
            realestate: 'trustworthy',
            education: 'inspiring',
            food: 'passionate',
            legal: 'authoritative',
            fitness: 'motivating',
            finance: 'reassuring',
            general: 'professional'
        };
        return tones[theme] || tones.general;
    }

    /**
     * Suggère une palette de couleurs
     */
    getColorSuggestion(theme) {
        const colors = {
            pets: { primary: '#FF6B6B', secondary: '#4ECDC4', accent: '#FFE66D' },
            tech: { primary: '#6366F1', secondary: '#22D3EE', accent: '#F472B6' },
            business: { primary: '#1E40AF', secondary: '#3B82F6', accent: '#F59E0B' },
            ecommerce: { primary: '#059669', secondary: '#34D399', accent: '#FBBF24' },
            creative: { primary: '#8B5CF6', secondary: '#EC4899', accent: '#06B6D4' },
            health: { primary: '#10B981', secondary: '#6EE7B7', accent: '#3B82F6' },
            realestate: { primary: '#0891B2', secondary: '#06B6D4', accent: '#F59E0B' },
            education: { primary: '#7C3AED', secondary: '#A78BFA', accent: '#10B981' },
            food: { primary: '#DC2626', secondary: '#F97316', accent: '#FBBF24' },
            legal: { primary: '#1F2937', secondary: '#4B5563', accent: '#B91C1C' },
            fitness: { primary: '#EF4444', secondary: '#F97316', accent: '#FBBF24' },
            finance: { primary: '#0D9488', secondary: '#14B8A6', accent: '#F59E0B' },
            general: { primary: '#3B82F6', secondary: '#60A5FA', accent: '#10B981' }
        };
        return colors[theme] || colors.general;
    }

    /**
     * Génère des initiales pour avatar
     */
    generateInitials(name) {
        if (!name) return 'XX';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return parts[0][0] + parts[parts.length - 1][0];
        }
        return name.substring(0, 2).toUpperCase();
    }

    /**
     * Génère un témoignage crédible pour le thème
     */
    generateTestimonial(theme, index = 0) {
        const themeData = this.themes[theme] || this.themes['general'];

        if (themeData.testimonials && themeData.testimonials[index]) {
            return themeData.testimonials[index];
        }

        // Génération fallback
        const isMale = Math.random() > 0.5;
        const firstName = this.entityPatterns.firstNames[isMale ? 'male' : 'female'][
            Math.floor(Math.random() * 15)
        ];
        const lastName = this.entityPatterns.lastNames[
            Math.floor(Math.random() * 15)
        ][0];

        return {
            text: 'Service excellent et équipe professionnelle. Je recommande vivement !',
            author: `${firstName} ${lastName}.`,
            role: 'Client satisfait'
        };
    }

    /**
     * Enrichit un texte avec le vocabulaire du thème
     */
    enrichText(text, theme) {
        const themeData = this.themes[theme] || this.themes['general'];
        const vocabulary = themeData.vocabulary;

        // Remplace les placeholders génériques par du vocabulaire thématique
        let enriched = text;

        // Remplacer {action} par une action du thème
        if (enriched.includes('{action}')) {
            const action = vocabulary.actions[Math.floor(Math.random() * vocabulary.actions.length)];
            enriched = enriched.replace(/{action}/g, action);
        }

        // Remplacer {descriptor} par un descripteur du thème
        if (enriched.includes('{descriptor}')) {
            const descriptor = vocabulary.descriptors[Math.floor(Math.random() * vocabulary.descriptors.length)];
            enriched = enriched.replace(/{descriptor}/g, descriptor);
        }

        // Remplacer {benefit} par un bénéfice du thème
        if (enriched.includes('{benefit}')) {
            const benefit = vocabulary.benefits[Math.floor(Math.random() * vocabulary.benefits.length)];
            enriched = enriched.replace(/{benefit}/g, benefit);
        }

        return enriched;
    }

    /**
     * Valide la cohérence sémantique d'un contenu
     */
    validateSemanticCoherence(content, theme) {
        const themeData = this.themes[theme] || this.themes['general'];
        const issues = [];

        // Vérifier que le vocabulaire utilisé est cohérent
        const contentLower = JSON.stringify(content).toLowerCase();

        // Vérifier la présence de termes incohérents
        const incongruentTerms = {
            pets: ['corporate', 'enterprise', 'B2B', 'scalable'],
            tech: ['adorable', 'mignon', 'câlin', 'gourmand'],
            business: ['mignon', 'savoureux', 'câlin', 'adopter'],
            food: ['scalable', 'API', 'deployment', 'infrastructure']
        };

        if (incongruentTerms[theme]) {
            for (const term of incongruentTerms[theme]) {
                if (contentLower.includes(term.toLowerCase())) {
                    issues.push(`Terme incongru détecté: "${term}"`);
                }
            }
        }

        return {
            valid: issues.length === 0,
            issues
        };
    }
}

module.exports = SemanticEntityEngine;
