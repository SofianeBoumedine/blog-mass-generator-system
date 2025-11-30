/**
 * ════════════════════════════════════════════════════════════════════════════
 * THEMATIC CONTENT LIBRARY - Bibliothèque de Contenu Thématique
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Contenu ultra-spécifique par thème pour garantir une cohérence totale :
 * - Vocabulaire sectoriel
 * - Expressions idiomatiques
 * - Entités nommées (noms, entreprises, lieux)
 * - Métriques réalistes
 * - Textes hero/about/CTA adaptés
 * - Grammaire et ton appropriés
 *
 * ════════════════════════════════════════════════════════════════════════════
 */

class ThematicContentLibrary {
    constructor() {
        this.themes = this.initializeThemes();
        this.commonExpressions = this.initializeCommonExpressions();
    }

    /**
     * Base de données complète par thème
     */
    initializeThemes() {
        return {
            // ══════════════════════════════════════════════════════════════════
            // ANIMAUX / PETS
            // ══════════════════════════════════════════════════════════════════
            pets: {
                // Identité du thème
                identity: {
                    sector: 'Animaux de compagnie',
                    subSectors: ['Chiens', 'Chats', 'NAC', 'Oiseaux', 'Aquariophilie'],
                    audience: 'Propriétaires d\'animaux passionnés',
                    tone: 'Chaleureux, bienveillant, expert mais accessible'
                },

                // Vocabulaire spécifique
                vocabulary: {
                    nouns: ['compagnon', 'animal', 'maître', 'propriétaire', 'vétérinaire', 'éleveur', 'toiletteur', 'comportementaliste', 'éducateur canin', 'refuge', 'adoption', 'race', 'pedigree', 'vaccination', 'vermifuge', 'stérilisation', 'alimentation', 'croquettes', 'pâtée', 'friandises', 'jouet', 'gamelle', 'laisse', 'collier', 'harnais', 'niche', 'panier', 'griffoir', 'litière'],
                    verbs: ['adopter', 'élever', 'dresser', 'éduquer', 'soigner', 'nourrir', 'promener', 'toiletter', 'vacciner', 'vermifuger', 'stériliser', 'chouchouter', 'câliner', 'jouer', 'récompenser'],
                    adjectives: ['adorable', 'affectueux', 'fidèle', 'joueur', 'câlin', 'espiègle', 'docile', 'obéissant', 'sociable', 'énergique', 'calme', 'protecteur', 'attachant', 'mignon', 'doux'],
                    expressions: [
                        'le meilleur ami de l\'homme',
                        'un amour inconditionnel',
                        'un membre de la famille à part entière',
                        'une boule de poils',
                        'pattes de velours',
                        'queue qui frétille',
                        'ronronnement apaisant',
                        'regard attendrissant'
                    ]
                },

                // Entités nommées cohérentes
                entities: {
                    brands: ['Royal Canin', 'Hill\'s', 'Purina Pro Plan', 'Orijen', 'Acana', 'Virbac', 'Frontline', 'Advantix'],
                    places: ['clinique vétérinaire', 'refuge SPA', 'parc canin', 'pension animale', 'salon de toilettage', 'animalerie'],
                    certifications: ['diplômé en comportement animal', 'certifié ACACED', 'membre de la SCC', 'partenaire SPA'],
                    experts: [
                        { name: 'Dr. Sophie Martin', title: 'Vétérinaire comportementaliste' },
                        { name: 'Marie Dubois', title: 'Éducatrice canine certifiée' },
                        { name: 'Pierre Lambert', title: 'Nutritionniste animalier' }
                    ]
                },

                // Métriques réalistes
                metrics: {
                    clients: ['5 000+', '10 000+', '15 000+'],
                    satisfaction: ['97%', '98%', '99%'],
                    experience: ['8 ans', '10 ans', '15 ans'],
                    articles: ['200+', '350+', '500+'],
                    races: ['150+', '200+', '300+'],
                    specific: [
                        { number: '50+', label: 'races de chiens couvertes' },
                        { number: '30+', label: 'guides nutrition' },
                        { number: '100%', label: 'conseils validés par des vétérinaires' }
                    ]
                },

                // Textes Hero
                heroContent: {
                    titles: [
                        'Le bien-être de votre compagnon, notre priorité absolue',
                        'Des conseils d\'experts pour des animaux heureux et en pleine santé',
                        'Accompagnez votre animal à chaque étape de sa vie',
                        'Parce que votre compagnon mérite le meilleur'
                    ],
                    subtitles: [
                        'Guides pratiques, conseils vétérinaires et astuces quotidiennes pour prendre soin de votre animal de compagnie comme un pro.',
                        'Rejoignez une communauté de propriétaires passionnés et offrez à votre compagnon la vie qu\'il mérite.',
                        'De l\'alimentation à l\'éducation, découvrez tout ce qu\'il faut savoir pour le bonheur de votre animal.'
                    ],
                    badges: ['🐾 Pour les amoureux des animaux', '❤️ Conseils de passionnés', '✨ Bien-être animal']
                },

                // Textes About
                aboutContent: {
                    stories: [
                        'Passionnés par les animaux depuis l\'enfance, nous avons créé ce site pour partager notre amour et notre expertise. Chaque jour, nous aidons des milliers de propriétaires à mieux comprendre et accompagner leurs compagnons à quatre pattes.',
                        'Notre aventure a commencé il y a 10 ans, quand nous avons adopté notre premier chien. Face au manque d\'informations fiables, nous avons décidé de créer la ressource que nous aurions aimé trouver. Aujourd\'hui, notre équipe de passionnés et de professionnels vous accompagne au quotidien.'
                    ],
                    missions: [
                        'Aider chaque propriétaire à offrir la meilleure vie possible à son animal',
                        'Partager des conseils fiables, validés par des professionnels de santé animale',
                        'Créer une communauté bienveillante de passionnés d\'animaux'
                    ],
                    values: ['Bienveillance', 'Expertise', 'Passion', 'Accessibilité', 'Respect du vivant']
                },

                // Services spécifiques
                services: [
                    {
                        icon: '🍖',
                        name: 'Guides Nutrition',
                        description: 'Conseils alimentaires personnalisés selon la race, l\'âge et les besoins spécifiques de votre compagnon. Comparatifs de croquettes et recettes maison.'
                    },
                    {
                        icon: '🏥',
                        name: 'Santé & Prévention',
                        description: 'Calendrier vaccinal, prévention parasitaire, signes d\'alerte à surveiller. Des informations validées par des vétérinaires.'
                    },
                    {
                        icon: '🎓',
                        name: 'Éducation & Comportement',
                        description: 'Techniques d\'éducation positive, résolution des problèmes comportementaux, socialisation. Apprenez à communiquer avec votre animal.'
                    },
                    {
                        icon: '🛍️',
                        name: 'Guides d\'Achat',
                        description: 'Comparatifs objectifs d\'accessoires, jouets, couchages et équipements. Trouvez le meilleur rapport qualité-prix.'
                    }
                ],

                // Témoignages thématiques
                testimonials: [
                    {
                        text: 'Grâce à leurs conseils sur l\'alimentation, mon labrador a retrouvé un poids santé et une énergie incroyable ! Les guides sont clairs et faciles à suivre.',
                        author: 'Marie L.',
                        role: 'Propriétaire de Max, labrador de 5 ans',
                        avatar: 'ML'
                    },
                    {
                        text: 'Mon chaton était très craintif à son arrivée. Les articles sur la socialisation m\'ont permis de l\'aider à prendre confiance. Aujourd\'hui, c\'est un chat épanoui !',
                        author: 'Thomas B.',
                        role: 'Papa adoptif de Luna',
                        avatar: 'TB'
                    },
                    {
                        text: 'Le comparatif des croquettes m\'a fait économiser 30€/mois tout en offrant une meilleure qualité à mes deux chiens. Merci pour ce travail de fond !',
                        author: 'Sophie M.',
                        role: 'Famille multi-animaux',
                        avatar: 'SM'
                    }
                ],

                // CTAs spécifiques
                ctas: {
                    primary: ['Découvrir nos conseils', 'Trouver la bonne alimentation', 'Lire nos guides experts'],
                    secondary: ['Rejoindre la communauté', 'Poser une question', 'Voir les témoignages'],
                    newsletter: 'Recevez nos meilleurs conseils pour votre compagnon chaque semaine'
                },

                // FAQ thématique
                faq: [
                    { q: 'Comment choisir les bonnes croquettes pour mon chien ?', a: 'Le choix dépend de la race, de l\'âge, du poids et des éventuelles sensibilités. Consultez notre guide complet pour trouver l\'alimentation idéale.' },
                    { q: 'À quelle fréquence dois-je emmener mon chat chez le vétérinaire ?', a: 'Un bilan annuel est recommandé pour un chat adulte en bonne santé. Les chatons et seniors nécessitent des visites plus fréquentes.' },
                    { q: 'Comment éduquer mon chiot sans le stresser ?', a: 'L\'éducation positive, basée sur la récompense, est la méthode la plus efficace et respectueuse. Découvrez nos techniques étape par étape.' }
                ],

                // Couleurs recommandées
                colors: {
                    primary: '#FF6B6B',    // Corail chaleureux
                    secondary: '#4ECDC4',  // Turquoise vivant
                    accent: '#FFE66D',     // Jaune joyeux
                    gradients: ['#FF6B6B, #FF8E53', '#4ECDC4, #44A08D']
                },

                // Mots à éviter (incohérents avec le thème)
                avoid: ['corporate', 'B2B', 'ROI', 'KPI', 'scalable', 'disruptif', 'synergie', 'benchmark', 'pipeline']
            },

            // ══════════════════════════════════════════════════════════════════
            // TECHNOLOGIE / SAAS
            // ══════════════════════════════════════════════════════════════════
            tech: {
                identity: {
                    sector: 'Technologie & SaaS',
                    subSectors: ['Logiciels', 'Cloud', 'IA', 'Automatisation', 'DevOps'],
                    audience: 'Entreprises et professionnels tech',
                    tone: 'Professionnel, moderne, orienté résultats'
                },

                vocabulary: {
                    nouns: ['plateforme', 'solution', 'API', 'dashboard', 'workflow', 'intégration', 'automatisation', 'analytics', 'infrastructure', 'scalabilité', 'déploiement', 'microservices', 'cloud', 'SaaS', 'stack', 'pipeline', 'sprint', 'backlog', 'roadmap'],
                    verbs: ['automatiser', 'optimiser', 'déployer', 'intégrer', 'scaler', 'monitorer', 'itérer', 'synchroniser', 'centraliser', 'streamliner', 'digitaliser', 'transformer'],
                    adjectives: ['scalable', 'performant', 'intuitif', 'robuste', 'agile', 'modulaire', 'sécurisé', 'fiable', 'innovant', 'cutting-edge', 'data-driven', 'cloud-native'],
                    expressions: [
                        'time-to-market réduit',
                        'gain de productivité',
                        'retour sur investissement',
                        'transformation digitale',
                        'expérience utilisateur fluide',
                        'architecture moderne',
                        'déploiement continu',
                        'données en temps réel'
                    ]
                },

                entities: {
                    brands: ['AWS', 'Google Cloud', 'Azure', 'Stripe', 'Slack', 'Notion', 'GitHub', 'Datadog', 'Segment'],
                    places: ['Silicon Valley', 'Station F', 'Tech Hub', 'incubateur', 'accélérateur'],
                    certifications: ['ISO 27001', 'SOC 2', 'RGPD compliant', 'AWS Partner', 'Google Partner'],
                    experts: [
                        { name: 'Marc Dupont', title: 'CTO & Co-fondateur' },
                        { name: 'Julie Chen', title: 'VP Engineering' },
                        { name: 'Alexandre Martin', title: 'Lead Architect' }
                    ]
                },

                metrics: {
                    clients: ['500+', '1 000+', '2 500+'],
                    satisfaction: ['98%', '99%', '99.5%'],
                    uptime: ['99.9%', '99.95%', '99.99%'],
                    specific: [
                        { number: '45%', label: 'gain de productivité moyen' },
                        { number: '<2h', label: 'temps de réponse support' },
                        { number: '10M+', label: 'requêtes API par jour' }
                    ]
                },

                heroContent: {
                    titles: [
                        'La technologie qui propulse votre croissance',
                        'Automatisez, optimisez, accélérez votre business',
                        'Des outils puissants pour des équipes ambitieuses',
                        'Transformez vos données en décisions stratégiques'
                    ],
                    subtitles: [
                        'Une plateforme tout-en-un pour automatiser vos processus et libérer le potentiel de votre équipe.',
                        'Rejoignez les 2 000+ entreprises qui ont boosté leur productivité de 45% en moyenne.',
                        'De l\'idée au déploiement, nous accélérons votre transformation digitale.'
                    ],
                    badges: ['⚡ Nouvelle version 3.0', '🚀 Essai gratuit 14 jours', '🔒 Sécurisé & RGPD']
                },

                aboutContent: {
                    stories: [
                        'Fondée par des ingénieurs passionnés, notre mission est de démocratiser les technologies avancées. Nous croyons que chaque entreprise, quelle que soit sa taille, mérite des outils performants pour réussir dans l\'économie numérique.',
                        'Après 10 ans dans les plus grandes entreprises tech, notre équipe fondatrice a décidé de créer la solution qu\'elle aurait voulu utiliser. Aujourd\'hui, nous aidons plus de 2 000 entreprises à transformer leurs opérations.'
                    ],
                    missions: [
                        'Rendre la technologie accessible à toutes les entreprises',
                        'Libérer les équipes des tâches répétitives grâce à l\'automatisation',
                        'Fournir des outils qui s\'adaptent à vos besoins, pas l\'inverse'
                    ],
                    values: ['Innovation', 'Performance', 'Simplicité', 'Sécurité', 'Agilité']
                },

                services: [
                    {
                        icon: '⚡',
                        name: 'Automatisation',
                        description: 'Créez des workflows automatisés en quelques clics. Connectez vos outils et laissez la plateforme travailler pour vous 24/7.'
                    },
                    {
                        icon: '📊',
                        name: 'Analytics & Reporting',
                        description: 'Tableaux de bord en temps réel, rapports personnalisés et insights actionables pour piloter votre activité.'
                    },
                    {
                        icon: '🔗',
                        name: 'Intégrations',
                        description: '200+ intégrations natives avec vos outils favoris. API REST documentée pour des connexions sur-mesure.'
                    },
                    {
                        icon: '🔒',
                        name: 'Sécurité Enterprise',
                        description: 'Chiffrement de bout en bout, SSO, audit logs. Conformité RGPD, SOC 2 et ISO 27001.'
                    }
                ],

                testimonials: [
                    {
                        text: 'Nous avons réduit notre temps de traitement de 60% en 3 mois. L\'équipe support est incroyablement réactive et l\'outil s\'intègre parfaitement avec notre stack existante.',
                        author: 'Marc D.',
                        role: 'CTO, ScaleUp Tech',
                        avatar: 'MD'
                    },
                    {
                        text: 'L\'API est parfaitement documentée, l\'intégration avec notre SI a pris 2 jours au lieu des 2 semaines prévues. Un vrai game-changer pour notre équipe dev.',
                        author: 'Julie R.',
                        role: 'Lead Developer, StartupX',
                        avatar: 'JR'
                    },
                    {
                        text: 'Enfin une solution qui comprend les enjeux des PME tech. Simple à prendre en main mais suffisamment puissante pour nos besoins complexes.',
                        author: 'Pierre L.',
                        role: 'CEO, InnovateCorp',
                        avatar: 'PL'
                    }
                ],

                ctas: {
                    primary: ['Démarrer gratuitement', 'Voir la démo', 'Essayer 14 jours gratuit'],
                    secondary: ['Documentation API', 'Voir les intégrations', 'Comparer les plans'],
                    newsletter: 'Recevez nos tips tech et mises à jour produit'
                },

                faq: [
                    { q: 'Combien de temps prend l\'intégration ?', a: 'La plupart de nos clients sont opérationnels en moins de 24h grâce à notre onboarding guidé et nos intégrations natives.' },
                    { q: 'Mes données sont-elles sécurisées ?', a: 'Absolument. Chiffrement AES-256, hébergement en Europe, conformité RGPD et certifications SOC 2 / ISO 27001.' },
                    { q: 'Puis-je connecter mes outils existants ?', a: 'Oui ! Nous proposons 200+ intégrations natives et une API REST complète pour les connexions personnalisées.' }
                ],

                colors: {
                    primary: '#6366F1',    // Indigo moderne
                    secondary: '#22D3EE',  // Cyan tech
                    accent: '#F472B6',     // Pink accent
                    gradients: ['#6366F1, #8B5CF6', '#22D3EE, #06B6D4']
                },

                avoid: ['adorable', 'mignon', 'câlin', 'chouchouter', 'gourmand', 'savoureux', 'cocooning']
            },

            // ══════════════════════════════════════════════════════════════════
            // IMMOBILIER / REAL ESTATE
            // ══════════════════════════════════════════════════════════════════
            realestate: {
                identity: {
                    sector: 'Immobilier',
                    subSectors: ['Résidentiel', 'Commercial', 'Investissement', 'Location', 'Neuf'],
                    audience: 'Acheteurs, vendeurs et investisseurs immobiliers',
                    tone: 'Professionnel, rassurant, expert du marché local'
                },

                vocabulary: {
                    nouns: ['bien', 'appartement', 'maison', 'studio', 'loft', 'duplex', 'villa', 'terrain', 'surface', 'pièce', 'étage', 'balcon', 'terrasse', 'cave', 'parking', 'copropriété', 'charges', 'DPE', 'compromis', 'acte', 'notaire', 'mandat', 'estimation', 'visite', 'offre', 'négociation'],
                    verbs: ['acheter', 'vendre', 'louer', 'estimer', 'visiter', 'négocier', 'signer', 'investir', 'rénover', 'emménager', 'financer'],
                    adjectives: ['lumineux', 'spacieux', 'rénové', 'calme', 'traversant', 'fonctionnel', 'moderne', 'charme', 'atypique', 'idéalement situé', 'coup de cœur', 'rare', 'exclusif'],
                    expressions: [
                        'coup de cœur assuré',
                        'emplacement premium',
                        'sans vis-à-vis',
                        'proche commodités',
                        'idéal premier achat',
                        'fort potentiel locatif',
                        'travaux à prévoir',
                        'prêt à emménager'
                    ]
                },

                entities: {
                    brands: ['SeLoger', 'LeBonCoin', 'Century 21', 'Orpi', 'Laforêt', 'Guy Hoquet', 'MeilleursAgents'],
                    places: ['Paris', 'Lyon', 'Bordeaux', 'Nantes', 'Toulouse', 'Marseille', 'quartier prisé', 'centre-ville'],
                    certifications: ['Carte professionnelle', 'Garantie financière', 'Assurance RCP', 'FNAIM', 'UNIS'],
                    experts: [
                        { name: 'Catherine Blanc', title: 'Directrice d\'agence, 20 ans d\'expérience' },
                        { name: 'Jean-Marc Petit', title: 'Expert en investissement locatif' },
                        { name: 'Sophie Durand', title: 'Négociatrice senior' }
                    ]
                },

                metrics: {
                    clients: ['500+', '1 000+', '2 000+'],
                    satisfaction: ['95%', '97%', '98%'],
                    experience: ['15 ans', '20 ans', '25 ans'],
                    specific: [
                        { number: '60 jours', label: 'délai de vente moyen' },
                        { number: '98%', label: 'prix de vente / estimation' },
                        { number: '500+', label: 'biens vendus cette année' }
                    ]
                },

                heroContent: {
                    titles: [
                        'Trouvez le bien de vos rêves',
                        'Votre projet immobilier entre de bonnes mains',
                        'L\'expertise locale au service de votre investissement',
                        'Achat, vente, location : on s\'occupe de tout'
                    ],
                    subtitles: [
                        'Plus de 500 biens disponibles dans votre région. Estimation gratuite en 24h.',
                        'Une équipe d\'experts du marché local vous accompagne de A à Z.',
                        '20 ans d\'expérience, des milliers de familles satisfaites, votre prochain chez-vous.'
                    ],
                    badges: ['🏠 Estimation gratuite', '📍 Expert local', '⭐ 98% de clients satisfaits']
                },

                aboutContent: {
                    stories: [
                        'Implantés dans notre quartier depuis 20 ans, nous connaissons chaque rue, chaque immeuble, chaque opportunité. Cette expertise locale, combinée à notre passion pour l\'immobilier, fait la différence pour nos clients.',
                        'L\'immobilier, c\'est avant tout une histoire de confiance. Depuis notre création, nous avons accompagné plus de 2 000 familles dans leurs projets. Acheter, vendre, investir : chaque client bénéficie d\'un accompagnement personnalisé.'
                    ],
                    missions: [
                        'Accompagner chaque client vers son projet immobilier idéal',
                        'Apporter une expertise locale et une transparence totale',
                        'Simplifier chaque étape, de la recherche à la signature'
                    ],
                    values: ['Proximité', 'Transparence', 'Expertise', 'Réactivité', 'Écoute']
                },

                services: [
                    {
                        icon: '🔍',
                        name: 'Recherche personnalisée',
                        description: 'Définissez vos critères, nous trouvons les biens qui correspondent. Alertes en temps réel pour les nouvelles opportunités.'
                    },
                    {
                        icon: '📊',
                        name: 'Estimation gratuite',
                        description: 'Connaissez la valeur de votre bien en 24h. Analyse comparative du marché et conseils pour optimiser votre vente.'
                    },
                    {
                        icon: '📝',
                        name: 'Accompagnement complet',
                        description: 'De la première visite à la signature chez le notaire, nous gérons toutes les étapes de votre transaction.'
                    },
                    {
                        icon: '💰',
                        name: 'Conseil investissement',
                        description: 'Rentabilité locative, défiscalisation, gestion locative. Optimisez votre patrimoine immobilier.'
                    }
                ],

                testimonials: [
                    {
                        text: 'Nous cherchions depuis 6 mois sans succès. L\'agence nous a trouvé notre appartement idéal en 2 semaines, grâce à leur connaissance du quartier et leur réseau.',
                        author: 'Famille Martin',
                        role: 'Acheteurs, Paris 11e',
                        avatar: 'FM'
                    },
                    {
                        text: 'Vente conclue au prix affiché en 45 jours. Leur estimation était juste, leur stratégie de commercialisation efficace. Je recommande vivement.',
                        author: 'Henri D.',
                        role: 'Vendeur, Lyon 6e',
                        avatar: 'HD'
                    },
                    {
                        text: 'Investisseur depuis 5 ans avec eux. 3 biens acquis, tous rentables dès le premier mois. Leur expertise en investissement locatif est précieuse.',
                        author: 'Laurent P.',
                        role: 'Investisseur',
                        avatar: 'LP'
                    }
                ],

                ctas: {
                    primary: ['Voir nos biens', 'Estimer mon bien', 'Être contacté'],
                    secondary: ['Recherche avancée', 'Guide de l\'acheteur', 'Simuler mon prêt'],
                    newsletter: 'Recevez les nouvelles opportunités en avant-première'
                },

                colors: {
                    primary: '#0891B2',    // Cyan confiance
                    secondary: '#06B6D4',  // Turquoise
                    accent: '#F59E0B',     // Ambre chaleureux
                    gradients: ['#0891B2, #0E7490', '#F59E0B, #D97706']
                },

                avoid: ['scalable', 'API', 'workflow', 'sprint', 'itérer', 'roadmap', 'mignon', 'câlin']
            },

            // ══════════════════════════════════════════════════════════════════
            // RESTAURATION / FOOD
            // ══════════════════════════════════════════════════════════════════
            food: {
                identity: {
                    sector: 'Restauration & Gastronomie',
                    subSectors: ['Restaurant', 'Traiteur', 'Chef à domicile', 'Cours de cuisine'],
                    audience: 'Gourmets, familles, événements',
                    tone: 'Passionné, gourmand, authentique'
                },

                vocabulary: {
                    nouns: ['chef', 'cuisine', 'plat', 'recette', 'menu', 'carte', 'saveur', 'produit', 'terroir', 'saison', 'assiette', 'dégustation', 'accord', 'vin', 'dessert', 'entrée', 'plat principal', 'amuse-bouche', 'service', 'réservation'],
                    verbs: ['savourer', 'déguster', 'cuisiner', 'mijoter', 'préparer', 'assaisonner', 'dresser', 'sublimer', 'marier', 'réserver', 'régaler'],
                    adjectives: ['savoureux', 'gourmand', 'raffiné', 'authentique', 'généreux', 'croustillant', 'fondant', 'parfumé', 'maison', 'frais', 'local', 'de saison', 'artisanal'],
                    expressions: [
                        'fait maison avec amour',
                        'du producteur à l\'assiette',
                        'cuisine du marché',
                        'accords mets et vins',
                        'explosion de saveurs',
                        'moment de partage',
                        'voyage gustatif',
                        'tradition revisitée'
                    ]
                },

                entities: {
                    brands: ['Guide Michelin', 'Gault & Millau', 'TripAdvisor', 'La Fourchette', 'Relais & Châteaux'],
                    places: ['terroir français', 'marché local', 'potager', 'cave', 'salle privatisable'],
                    certifications: ['Maître Restaurateur', 'Fait Maison', 'Producteur local', 'Bio', 'Label Rouge'],
                    experts: [
                        { name: 'Chef Antoine Martin', title: 'Chef exécutif, 15 ans d\'expérience' },
                        { name: 'Marie Lecomte', title: 'Cheffe pâtissière, MOF 2019' },
                        { name: 'Pierre Blanc', title: 'Sommelier conseil' }
                    ]
                },

                metrics: {
                    clients: ['10 000+', '20 000+', '50 000+'],
                    satisfaction: ['4.8/5', '4.9/5', '5/5'],
                    experience: ['10 ans', '15 ans', '20 ans'],
                    specific: [
                        { number: '100%', label: 'produits frais et locaux' },
                        { number: '1 ⭐', label: 'au Guide Michelin' },
                        { number: '95%', label: 'clients qui reviennent' }
                    ]
                },

                heroContent: {
                    titles: [
                        'Une cuisine qui éveille vos sens',
                        'Le goût de l\'excellence à chaque bouchée',
                        'Des saveurs qui racontent une histoire',
                        'L\'art culinaire au service de vos papilles'
                    ],
                    subtitles: [
                        'Produits frais du marché, recettes créatives et accueil chaleureux. Une expérience gastronomique unique.',
                        'Du terroir à votre assiette, le chef sublime les produits de saison pour créer des plats inoubliables.',
                        'Réservez votre table et laissez-vous transporter par un voyage gustatif.'
                    ],
                    badges: ['🌟 Étoilé Michelin', '🥗 Produits locaux', '👨‍🍳 Chef passionné']
                },

                aboutContent: {
                    stories: [
                        'Cuisinier depuis l\'âge de 16 ans, j\'ai parcouru les plus grandes maisons avant d\'ouvrir mon propre restaurant. Ma philosophie : sublimer les produits de nos terroirs avec créativité et respect. Chaque assiette raconte une histoire, la mienne et celle de nos producteurs.',
                        'Notre aventure a commencé il y a 15 ans, quand nous avons repris ce restaurant familial. Depuis, nous cultivons la même passion : proposer une cuisine généreuse, faite maison, avec des produits de saison. Le secret ? L\'amour du métier et des bons produits.'
                    ],
                    missions: [
                        'Offrir une expérience gastronomique mémorable à chaque client',
                        'Valoriser les producteurs locaux et les produits de saison',
                        'Transmettre notre passion à travers chaque assiette'
                    ],
                    values: ['Passion', 'Authenticité', 'Générosité', 'Qualité', 'Partage']
                },

                services: [
                    {
                        icon: '🍽️',
                        name: 'Restaurant',
                        description: 'Découvrez notre carte qui évolue au fil des saisons. Midi et soir, laissez-vous guider par le menu du chef.'
                    },
                    {
                        icon: '🥂',
                        name: 'Privatisation',
                        description: 'Pour vos événements privés ou professionnels, privatisez notre salle et profitez d\'un menu sur-mesure.'
                    },
                    {
                        icon: '👨‍🍳',
                        name: 'Chef à domicile',
                        description: 'Le chef se déplace chez vous pour créer un moment gastronomique unique. Parfait pour vos réceptions.'
                    },
                    {
                        icon: '📦',
                        name: 'Traiteur',
                        description: 'Cocktails, buffets, repas assis : notre équipe traiteur prend en charge vos événements de A à Z.'
                    }
                ],

                testimonials: [
                    {
                        text: 'Une explosion de saveurs ! Le menu dégustation est un vrai voyage culinaire. Le chef prend le temps d\'expliquer chaque plat, on sent la passion.',
                        author: 'Isabelle F.',
                        role: 'Amoureuse de bonne cuisine',
                        avatar: 'IF'
                    },
                    {
                        text: 'Nous avons privatisé le restaurant pour notre mariage. Le service était impeccable, les plats divins. Nos invités en parlent encore 6 mois après !',
                        author: 'Marie & Thomas',
                        role: 'Jeunes mariés',
                        avatar: 'MT'
                    },
                    {
                        text: 'Notre cantine du midi quand on veut se faire plaisir. Rapport qualité-prix excellent, produits ultra-frais et accueil toujours au top.',
                        author: 'Pierre D.',
                        role: 'Client fidèle depuis 5 ans',
                        avatar: 'PD'
                    }
                ],

                ctas: {
                    primary: ['Réserver une table', 'Voir la carte', 'Nous contacter'],
                    secondary: ['Menu du jour', 'Privatiser le restaurant', 'Offrir un bon cadeau'],
                    newsletter: 'Recevez nos actualités gourmandes et offres exclusives'
                },

                colors: {
                    primary: '#DC2626',    // Rouge passion
                    secondary: '#F97316',  // Orange gourmand
                    accent: '#FBBF24',     // Doré chaleureux
                    gradients: ['#DC2626, #B91C1C', '#F97316, #EA580C']
                },

                avoid: ['scalable', 'API', 'workflow', 'ROI', 'KPI', 'benchmark', 'pipeline', 'sprint']
            },

            // ══════════════════════════════════════════════════════════════════
            // FITNESS / SPORT
            // ══════════════════════════════════════════════════════════════════
            fitness: {
                identity: {
                    sector: 'Sport & Fitness',
                    subSectors: ['Salle de sport', 'Coaching personnel', 'Nutrition sportive', 'Cours collectifs'],
                    audience: 'Sportifs débutants à confirmés',
                    tone: 'Motivant, énergique, bienveillant'
                },

                vocabulary: {
                    nouns: ['entraînement', 'séance', 'exercice', 'répétition', 'série', 'récupération', 'performance', 'endurance', 'force', 'souplesse', 'cardio', 'musculation', 'coach', 'objectif', 'programme', 'nutrition', 'protéine', 'hydratation', 'résultat', 'transformation'],
                    verbs: ['s\'entraîner', 'progresser', 'se dépasser', 'performer', 'récupérer', 'sculpter', 'tonifier', 'renforcer', 'transpirer', 'motiver', 'coacher', 'atteindre'],
                    adjectives: ['intense', 'efficace', 'motivant', 'progressif', 'personnalisé', 'adapté', 'challenging', 'fun', 'énergisant', 'complet', 'accessible'],
                    expressions: [
                        'no pain no gain',
                        'dépasser ses limites',
                        'objectif atteint',
                        'transformation physique',
                        'bien dans son corps',
                        'mode de vie sain',
                        'résultats visibles',
                        'motivation au quotidien'
                    ]
                },

                entities: {
                    brands: ['Nike', 'Adidas', 'Garmin', 'Fitbit', 'MyFitnessPal', 'Prozis', 'Decathlon'],
                    places: ['salle de sport', 'studio', 'espace cardio', 'zone musculation', 'vestiaires premium'],
                    certifications: ['Coach certifié BPJEPS', 'Diplômé STAPS', 'Nutritionniste sportif', 'Préparateur physique'],
                    experts: [
                        { name: 'Kevin Morel', title: 'Coach sportif certifié, ex-athlète' },
                        { name: 'Laura Petit', title: 'Spécialiste nutrition sportive' },
                        { name: 'Thomas Blanc', title: 'Préparateur physique professionnel' }
                    ]
                },

                metrics: {
                    clients: ['500+', '1 000+', '2 000+'],
                    satisfaction: ['96%', '97%', '98%'],
                    experience: ['8 ans', '10 ans', '15 ans'],
                    specific: [
                        { number: '-8kg', label: 'perte moyenne en 3 mois' },
                        { number: '50+', label: 'cours par semaine' },
                        { number: '15', label: 'coachs certifiés' }
                    ]
                },

                heroContent: {
                    titles: [
                        'Révélez le meilleur de vous-même',
                        'Votre transformation commence aujourd\'hui',
                        'Du sport, des résultats, du plaisir',
                        'Dépassez vos limites avec nous'
                    ],
                    subtitles: [
                        'Coaching personnalisé, cours collectifs dynamiques et équipements premium. Atteignez vos objectifs avec nous.',
                        'Rejoignez une communauté motivée et bienveillante. Premier cours d\'essai offert !',
                        'Que vous soyez débutant ou confirmé, nos coachs vous accompagnent vers votre meilleure version.'
                    ],
                    badges: ['💪 1er cours offert', '🏆 Coachs certifiés', '⚡ Résultats garantis']
                },

                aboutContent: {
                    stories: [
                        'Ancien athlète de haut niveau, j\'ai fondé ce club avec une conviction : le sport doit être accessible, fun et efficace pour tous. Notre équipe de passionnés vous accompagne avec bienveillance vers vos objectifs, quels qu\'ils soient.',
                        'Plus qu\'une salle de sport, c\'est une communauté. Ici, on se motive, on progresse ensemble, on célèbre chaque victoire. Que vous visiez la perte de poids, la prise de muscle ou simplement le bien-être, vous êtes au bon endroit.'
                    ],
                    missions: [
                        'Rendre le sport accessible et agréable pour tous',
                        'Accompagner chaque membre vers ses objectifs personnels',
                        'Créer une communauté bienveillante et motivante'
                    ],
                    values: ['Dépassement', 'Bienveillance', 'Résultats', 'Plaisir', 'Communauté']
                },

                services: [
                    {
                        icon: '💪',
                        name: 'Coaching personnel',
                        description: 'Un coach dédié, un programme sur-mesure. Atteignez vos objectifs 2x plus vite avec un accompagnement individualisé.'
                    },
                    {
                        icon: '👥',
                        name: 'Cours collectifs',
                        description: '50+ cours par semaine : HIIT, yoga, cycling, boxing, Pilates... Il y en a pour tous les goûts et tous les niveaux.'
                    },
                    {
                        icon: '🏋️',
                        name: 'Espace musculation',
                        description: 'Équipements Technogym dernière génération, espace libre poids complet, machines guidées.'
                    },
                    {
                        icon: '🥗',
                        name: 'Suivi nutrition',
                        description: 'Un nutritionniste sportif vous accompagne pour optimiser votre alimentation et vos performances.'
                    }
                ],

                testimonials: [
                    {
                        text: 'J\'ai perdu 15kg en 6 mois grâce à leur programme et le suivi du coach. Je ne me suis jamais senti aussi bien dans mon corps !',
                        author: 'Maxime T.',
                        role: 'Membre depuis 1 an',
                        avatar: 'MT'
                    },
                    {
                        text: 'Les cours de HIIT sont addictifs ! L\'ambiance est incroyable, les coachs motivants. J\'y vais 4 fois par semaine avec plaisir.',
                        author: 'Laura M.',
                        role: 'Adepte des cours collectifs',
                        avatar: 'LM'
                    },
                    {
                        text: 'Enfin une salle où je ne me sens pas jugé. L\'équipe est bienveillante, les conseils pertinents. Parfait pour reprendre le sport en douceur.',
                        author: 'Christophe B.',
                        role: 'Nouveau sportif',
                        avatar: 'CB'
                    }
                ],

                ctas: {
                    primary: ['Essayer gratuitement', 'Voir les cours', 'S\'inscrire maintenant'],
                    secondary: ['Calculer mon IMC', 'Voir le planning', 'Prendre RDV avec un coach'],
                    newsletter: 'Recevez nos conseils fitness et offres exclusives'
                },

                colors: {
                    primary: '#EF4444',    // Rouge énergie
                    secondary: '#F97316',  // Orange dynamique
                    accent: '#FBBF24',     // Jaune motivation
                    gradients: ['#EF4444, #DC2626', '#F97316, #EA580C']
                },

                avoid: ['B2B', 'enterprise', 'scalable', 'ROI', 'KPI', 'pipeline', 'adorable', 'mignon']
            },

            // ══════════════════════════════════════════════════════════════════
            // BUSINESS / CONSULTING
            // ══════════════════════════════════════════════════════════════════
            business: {
                identity: {
                    sector: 'Conseil & Services aux entreprises',
                    subSectors: ['Conseil stratégique', 'Consulting', 'Formation', 'Coaching dirigeants'],
                    audience: 'Dirigeants, managers, entrepreneurs',
                    tone: 'Professionnel, expert, orienté résultats'
                },

                vocabulary: {
                    nouns: ['stratégie', 'performance', 'croissance', 'rentabilité', 'organisation', 'management', 'leadership', 'équipe', 'objectif', 'résultat', 'projet', 'diagnostic', 'accompagnement', 'transformation', 'optimisation', 'process', 'indicateur', 'KPI'],
                    verbs: ['accompagner', 'transformer', 'optimiser', 'développer', 'structurer', 'piloter', 'manager', 'coacher', 'diagnostiquer', 'recommander', 'implémenter'],
                    adjectives: ['stratégique', 'opérationnel', 'pragmatique', 'mesurable', 'durable', 'performant', 'agile', 'innovant', 'structuré', 'efficient'],
                    expressions: [
                        'création de valeur',
                        'excellence opérationnelle',
                        'conduite du changement',
                        'retour sur investissement',
                        'avantage compétitif',
                        'plan d\'action concret',
                        'résultats mesurables',
                        'accompagnement sur-mesure'
                    ]
                },

                entities: {
                    brands: ['McKinsey', 'BCG', 'Bain', 'Deloitte', 'PwC', 'EY', 'KPMG', 'Accenture'],
                    places: ['siège social', 'comité de direction', 'séminaire', 'workshop', 'business center'],
                    certifications: ['HEC', 'ESSEC', 'Polytechnique', 'MBA', 'Coach certifié ICF', 'Six Sigma'],
                    experts: [
                        { name: 'François Martin', title: 'Associé fondateur, ex-McKinsey' },
                        { name: 'Anne-Sophie Blanc', title: 'Directrice Stratégie, 20 ans d\'expérience' },
                        { name: 'Jean-Pierre Durand', title: 'Expert transformation digitale' }
                    ]
                },

                metrics: {
                    clients: ['100+', '200+', '300+'],
                    satisfaction: ['95%', '97%', '98%'],
                    experience: ['15 ans', '20 ans', '25 ans'],
                    specific: [
                        { number: '+35%', label: 'croissance moyenne clients' },
                        { number: '95%', label: 'taux de recommandation' },
                        { number: '200+', label: 'missions réalisées' }
                    ]
                },

                heroContent: {
                    titles: [
                        'Accélérez la croissance de votre entreprise',
                        'Des solutions stratégiques pour vos ambitions',
                        'Transformez vos défis en opportunités',
                        'Votre partenaire pour réussir durablement'
                    ],
                    subtitles: [
                        'Accompagnement stratégique et opérationnel pour dirigeants et managers. Des résultats concrets et mesurables.',
                        '15 ans d\'expertise au service de votre développement. De l\'analyse à la mise en œuvre.',
                        'Conseil, formation, coaching : une approche globale pour transformer votre organisation.'
                    ],
                    badges: ['🎯 Résultats garantis', '📈 +35% croissance moyenne', '🤝 200+ entreprises accompagnées']
                },

                aboutContent: {
                    stories: [
                        'Après 15 ans dans les plus grands cabinets internationaux, nous avons fondé notre structure avec une conviction : le conseil doit être pragmatique, actionnable et orienté résultats. Pas de slides interminables, mais des plans d\'action concrets et un accompagnement jusqu\'à la mise en œuvre.',
                        'Notre équipe combine expérience opérationnelle et expertise sectorielle. Chaque consultant a dirigé des équipes, piloté des transformations, vécu la réalité du terrain. C\'est cette expérience qui fait la différence.'
                    ],
                    missions: [
                        'Accompagner les dirigeants dans leurs décisions stratégiques',
                        'Transformer durablement les organisations',
                        'Livrer des résultats concrets et mesurables'
                    ],
                    values: ['Excellence', 'Pragmatisme', 'Engagement', 'Intégrité', 'Résultats']
                },

                services: [
                    {
                        icon: '🎯',
                        name: 'Conseil stratégique',
                        description: 'Vision, positionnement, plan de développement. Nous vous aidons à définir votre cap et à construire votre roadmap.'
                    },
                    {
                        icon: '📈',
                        name: 'Performance opérationnelle',
                        description: 'Optimisation des process, amélioration de la productivité, réduction des coûts. Des gains rapides et durables.'
                    },
                    {
                        icon: '💼',
                        name: 'Transformation',
                        description: 'Conduite du changement, transformation digitale, restructuration. Nous vous accompagnons dans vos projets majeurs.'
                    },
                    {
                        icon: '👔',
                        name: 'Coaching dirigeants',
                        description: 'Sparring-partner, développement du leadership, préparation aux enjeux clés. Un accompagnement individuel pour performer.'
                    }
                ],

                testimonials: [
                    {
                        text: 'Leur accompagnement nous a permis de doubler notre CA en 18 mois. Une équipe pragmatique qui va droit au but, pas de blabla consultant.',
                        author: 'François M.',
                        role: 'PDG, ETI industrielle',
                        avatar: 'FM'
                    },
                    {
                        text: 'La restructuration de nos process a généré 30% d\'économies. Investissement rentabilisé en 6 mois. Résultat au-delà de nos attentes.',
                        author: 'Anne-Sophie L.',
                        role: 'DG, Groupe Services',
                        avatar: 'AL'
                    },
                    {
                        text: 'Un vrai sparring-partner pour ma prise de poste. Le coaching m\'a permis de réussir mes 100 premiers jours et de fédérer mon équipe.',
                        author: 'Jean-Pierre D.',
                        role: 'DG fraîchement nommé',
                        avatar: 'JD'
                    }
                ],

                ctas: {
                    primary: ['Demander un diagnostic', 'Prendre rendez-vous', 'Discuter de votre projet'],
                    secondary: ['Voir nos cas clients', 'Télécharger notre approche', 'Découvrir l\'équipe'],
                    newsletter: 'Recevez nos analyses et insights business'
                },

                colors: {
                    primary: '#1E40AF',    // Bleu corporate
                    secondary: '#3B82F6',  // Bleu confiance
                    accent: '#F59E0B',     // Or prestige
                    gradients: ['#1E40AF, #1D4ED8', '#3B82F6, #2563EB']
                },

                avoid: ['adorable', 'mignon', 'câlin', 'gourmand', 'savoureux', 'croustillant', 'ronronnement']
            },

            // ══════════════════════════════════════════════════════════════════
            // CREATIVE / DESIGN
            // ══════════════════════════════════════════════════════════════════
            creative: {
                identity: {
                    sector: 'Création & Design',
                    subSectors: ['Design graphique', 'Branding', 'Web design', 'Motion design', 'Photographie'],
                    audience: 'Entreprises et marques',
                    tone: 'Créatif, inspirant, professionnel'
                },

                vocabulary: {
                    nouns: ['création', 'design', 'identité', 'visuel', 'logo', 'branding', 'charte graphique', 'maquette', 'concept', 'direction artistique', 'portfolio', 'projet', 'brief', 'livrable', 'mockup'],
                    verbs: ['créer', 'concevoir', 'designer', 'imaginer', 'transformer', 'sublimer', 'révéler', 'incarner', 'matérialiser'],
                    adjectives: ['créatif', 'original', 'unique', 'moderne', 'élégant', 'audacieux', 'minimaliste', 'impactant', 'mémorable', 'cohérent'],
                    expressions: [
                        'une identité qui vous ressemble',
                        'design sur-mesure',
                        'de l\'idée à la création',
                        'marquer les esprits',
                        'vision créative',
                        'signature visuelle'
                    ]
                },

                entities: {
                    brands: ['Adobe', 'Figma', 'Sketch', 'Canva', 'Behance', 'Dribbble'],
                    places: ['studio créatif', 'agence design', 'atelier'],
                    certifications: ['Adobe Certified', 'Diplômé arts graphiques', 'Directeur artistique'],
                    experts: [
                        { name: 'Claire Dumont', title: 'Directrice artistique, 12 ans d\'expérience' },
                        { name: 'Lucas Bernard', title: 'Designer UI/UX senior' },
                        { name: 'Emma Petit', title: 'Brand strategist' }
                    ]
                },

                metrics: {
                    clients: ['200+', '350+', '500+'],
                    satisfaction: ['98%', '99%', '100%'],
                    experience: ['8 ans', '12 ans', '15 ans'],
                    specific: [
                        { number: '500+', label: 'projets réalisés' },
                        { number: '100%', label: 'clients satisfaits' },
                        { number: '15', label: 'awards créatifs' }
                    ]
                },

                heroContent: {
                    titles: [
                        'Donnez vie à votre vision créative',
                        'Des créations qui marquent les esprits',
                        'L\'art au service de votre marque',
                        'Design with purpose'
                    ],
                    subtitles: [
                        'Studio créatif spécialisé en identité visuelle, branding et design digital. Des projets uniques qui reflètent votre personnalité.',
                        'De la stratégie à l\'exécution, nous transformons vos idées en créations mémorables.',
                        'Chaque projet est une nouvelle histoire à raconter. Écrivons la vôtre ensemble.'
                    ],
                    badges: ['🎨 Portfolio 2024', '✨ Créations uniques', '🏆 Studio primé']
                },

                aboutContent: {
                    stories: [
                        'Designer depuis 15 ans, j\'ai fondé ce studio avec une conviction : le design n\'est pas qu\'esthétique, c\'est stratégique. Chaque création doit servir un objectif, raconter une histoire, créer une connexion. Notre équipe pluridisciplinaire accompagne les marques dans leur expression visuelle.',
                        'Notre studio est né de la rencontre entre direction artistique et stratégie de marque. Nous croyons que le design transforme les entreprises. Du logo à l\'expérience digitale complète, nous créons des identités qui durent.'
                    ],
                    missions: [
                        'Créer des identités visuelles uniques et mémorables',
                        'Accompagner les marques dans leur expression',
                        'Transformer les idées en créations impactantes'
                    ],
                    values: ['Créativité', 'Excellence', 'Écoute', 'Audace', 'Cohérence']
                },

                services: [
                    {
                        icon: '🎨',
                        name: 'Identité visuelle',
                        description: 'Logo, charte graphique, déclinaisons. Une identité unique qui reflète votre ADN de marque.'
                    },
                    {
                        icon: '🌐',
                        name: 'Design digital',
                        description: 'Sites web, applications, interfaces. Des expériences digitales intuitives et esthétiques.'
                    },
                    {
                        icon: '📸',
                        name: 'Direction artistique',
                        description: 'Shootings photo, vidéos, contenus visuels. Une direction créative cohérente pour tous vos supports.'
                    },
                    {
                        icon: '📦',
                        name: 'Branding complet',
                        description: 'Stratégie de marque, positionnement, univers visuel. Construisez une marque forte et différenciante.'
                    }
                ],

                testimonials: [
                    {
                        text: 'Notre nouvelle identité a transformé la perception de notre marque. Le studio a parfaitement capté notre ADN et l\'a traduit en visuels percutants.',
                        author: 'Nathalie R.',
                        role: 'Fondatrice, StartupX',
                        avatar: 'NR'
                    },
                    {
                        text: 'Un accompagnement créatif exceptionnel. De la stratégie au déploiement, chaque étape a été soignée. Notre site génère enfin l\'effet wow qu\'on recherchait.',
                        author: 'Thomas M.',
                        role: 'Directeur marketing, GroupeY',
                        avatar: 'TM'
                    },
                    {
                        text: 'Créatifs, à l\'écoute, réactifs. Le rebranding de notre enseigne a été un succès. Nos clients nous reconnaissent enfin au premier coup d\'œil.',
                        author: 'Claire B.',
                        role: 'CEO, Retail Brand',
                        avatar: 'CB'
                    }
                ],

                ctas: {
                    primary: ['Voir le portfolio', 'Discuter de votre projet', 'Demander un devis'],
                    secondary: ['Nos réalisations', 'Notre processus', 'L\'équipe créative'],
                    newsletter: 'Inspirations créatives et tendances design'
                },

                colors: {
                    primary: '#8B5CF6',    // Violet créatif
                    secondary: '#EC4899',  // Rose audacieux
                    accent: '#F59E0B',     // Ambre accent
                    gradients: ['#8B5CF6, #6366F1', '#EC4899, #F472B6']
                },

                avoid: ['B2B', 'KPI', 'ROI', 'scalable', 'process', 'croquettes', 'vétérinaire']
            },

            // ══════════════════════════════════════════════════════════════════
            // HEALTH / SANTÉ
            // ══════════════════════════════════════════════════════════════════
            health: {
                identity: {
                    sector: 'Santé & Bien-être',
                    subSectors: ['Médecine', 'Paramédical', 'Bien-être', 'Thérapies alternatives', 'Soins'],
                    audience: 'Patients et personnes en quête de bien-être',
                    tone: 'Bienveillant, rassurant, professionnel'
                },

                vocabulary: {
                    nouns: ['santé', 'bien-être', 'soin', 'patient', 'consultation', 'traitement', 'thérapie', 'prévention', 'diagnostic', 'accompagnement', 'écoute', 'guérison', 'rééducation', 'séance'],
                    verbs: ['soigner', 'accompagner', 'soulager', 'prévenir', 'diagnostiquer', 'traiter', 'écouter', 'conseiller', 'rééduquer'],
                    adjectives: ['bienveillant', 'professionnel', 'attentif', 'qualifié', 'à l\'écoute', 'doux', 'efficace', 'personnalisé', 'holistique'],
                    expressions: [
                        'prendre soin de vous',
                        'votre santé en priorité',
                        'accompagnement personnalisé',
                        'approche globale',
                        'en toute confiance',
                        'parcours de soins'
                    ]
                },

                entities: {
                    brands: ['Doctolib', 'Ordre des médecins', 'ARS', 'Ameli', 'HAS'],
                    places: ['cabinet', 'clinique', 'centre de soins', 'maison de santé'],
                    certifications: ['Diplôme d\'État', 'Ordre des médecins', 'Conventionné', 'ARS agréé'],
                    experts: [
                        { name: 'Dr. Marie Lecomte', title: 'Médecin généraliste, 20 ans d\'expérience' },
                        { name: 'Sophie Martin', title: 'Kinésithérapeute diplômée' },
                        { name: 'Jean Dupont', title: 'Ostéopathe D.O.' }
                    ]
                },

                metrics: {
                    clients: ['5 000+', '10 000+', '20 000+'],
                    satisfaction: ['97%', '98%', '99%'],
                    experience: ['15 ans', '20 ans', '25 ans'],
                    specific: [
                        { number: '4.9/5', label: 'note patient moyenne' },
                        { number: '<48h', label: 'délai de rendez-vous' },
                        { number: '100%', label: 'remboursement sécu' }
                    ]
                },

                heroContent: {
                    titles: [
                        'Votre santé, notre priorité',
                        'Prenez soin de vous en toute confiance',
                        'Un accompagnement bienveillant pour votre bien-être',
                        'Des soins personnalisés pour chaque patient'
                    ],
                    subtitles: [
                        'Cabinet médical à votre écoute. Consultations sur rendez-vous, urgences acceptées, téléconsultation disponible.',
                        'Une équipe de professionnels qualifiés vous accompagne dans votre parcours de santé avec bienveillance.',
                        'Prévention, diagnostic, traitement : une prise en charge globale et personnalisée.'
                    ],
                    badges: ['🏥 Conventionné secteur 1', '📱 Téléconsultation', '⏰ RDV sous 48h']
                },

                aboutContent: {
                    stories: [
                        'Médecin depuis 25 ans, j\'ai fondé ce cabinet avec une conviction : la médecine doit être humaine avant tout. Prendre le temps d\'écouter, d\'expliquer, d\'accompagner. Chaque patient est unique et mérite une attention personnalisée.',
                        'Notre équipe pluridisciplinaire travaille en synergie pour votre bien-être. Du diagnostic au suivi, nous vous accompagnons à chaque étape avec bienveillance et professionnalisme.'
                    ],
                    missions: [
                        'Offrir des soins de qualité accessibles à tous',
                        'Accompagner chaque patient avec bienveillance',
                        'Privilégier la prévention et l\'éducation à la santé'
                    ],
                    values: ['Bienveillance', 'Expertise', 'Écoute', 'Confidentialité', 'Humanité']
                },

                services: [
                    {
                        icon: '🩺',
                        name: 'Consultations',
                        description: 'Médecine générale, suivi régulier, bilans de santé. Prise en charge de toute la famille.'
                    },
                    {
                        icon: '💉',
                        name: 'Soins & Prévention',
                        description: 'Vaccinations, dépistages, conseils santé. Prévenir plutôt que guérir.'
                    },
                    {
                        icon: '📱',
                        name: 'Téléconsultation',
                        description: 'Consultez depuis chez vous en toute simplicité. Ordonnances et certificats dématérialisés.'
                    },
                    {
                        icon: '🤝',
                        name: 'Suivi personnalisé',
                        description: 'Accompagnement des maladies chroniques, coordination avec les spécialistes, éducation thérapeutique.'
                    }
                ],

                testimonials: [
                    {
                        text: 'Un médecin à l\'écoute qui prend le temps. Rare de nos jours. Je me sens vraiment prise en charge en tant que personne, pas juste un numéro.',
                        author: 'Marie L.',
                        role: 'Patiente depuis 5 ans',
                        avatar: 'ML'
                    },
                    {
                        text: 'Toute la famille est suivie ici. Les enfants adorent le Dr Martin, ce qui n\'est pas rien ! Professionnalisme et bienveillance au rendez-vous.',
                        author: 'Famille Dubois',
                        role: 'Patients fidèles',
                        avatar: 'FD'
                    },
                    {
                        text: 'La téléconsultation m\'a changé la vie. Plus besoin de poser une demi-journée pour un renouvellement. Pratique et efficace.',
                        author: 'Pierre T.',
                        role: 'Actif débordé',
                        avatar: 'PT'
                    }
                ],

                ctas: {
                    primary: ['Prendre rendez-vous', 'Nous contacter', 'Téléconsulter'],
                    secondary: ['Nos horaires', 'L\'équipe médicale', 'Accès et parking'],
                    newsletter: 'Conseils santé et actualités du cabinet'
                },

                colors: {
                    primary: '#10B981',    // Vert santé
                    secondary: '#3B82F6',  // Bleu confiance
                    accent: '#6EE7B7',     // Vert clair apaisant
                    gradients: ['#10B981, #059669', '#3B82F6, #2563EB']
                },

                avoid: ['scalable', 'ROI', 'KPI', 'workflow', 'gourmand', 'savoureux', 'croquettes']
            },

            // ══════════════════════════════════════════════════════════════════
            // EDUCATION / FORMATION
            // ══════════════════════════════════════════════════════════════════
            education: {
                identity: {
                    sector: 'Formation & Éducation',
                    subSectors: ['Formation professionnelle', 'E-learning', 'Coaching', 'Reconversion'],
                    audience: 'Professionnels en formation et reconversion',
                    tone: 'Motivant, pédagogue, accessible'
                },

                vocabulary: {
                    nouns: ['formation', 'apprentissage', 'compétence', 'certification', 'module', 'parcours', 'formateur', 'apprenant', 'diplôme', 'CPF', 'reconversion', 'carrière', 'expertise'],
                    verbs: ['apprendre', 'former', 'certifier', 'accompagner', 'progresser', 'maîtriser', 'développer', 'transmettre'],
                    adjectives: ['certifiante', 'qualifiante', 'intensive', 'pratique', 'accessible', 'personnalisée', 'reconnue', 'opérationnelle'],
                    expressions: [
                        'montée en compétences',
                        'éligible CPF',
                        'certification reconnue',
                        'formation à distance',
                        'parcours personnalisé',
                        'taux de réussite'
                    ]
                },

                entities: {
                    brands: ['Qualiopi', 'CPF', 'Pôle Emploi', 'OPCO', 'France Compétences', 'LinkedIn Learning'],
                    places: ['centre de formation', 'campus', 'plateforme e-learning', 'salle de cours'],
                    certifications: ['Qualiopi', 'RNCP', 'RS', 'CPF éligible', 'Datadocké'],
                    experts: [
                        { name: 'Stéphane Bernard', title: 'Directeur pédagogique' },
                        { name: 'Anne-Claire Martin', title: 'Responsable des formations' },
                        { name: 'David Leroy', title: 'Expert digital et formateur' }
                    ]
                },

                metrics: {
                    clients: ['2 000+', '5 000+', '10 000+'],
                    satisfaction: ['95%', '97%', '98%'],
                    experience: ['10 ans', '15 ans', '20 ans'],
                    specific: [
                        { number: '93%', label: 'taux de réussite aux examens' },
                        { number: '87%', label: 'insertion professionnelle' },
                        { number: '100%', label: 'éligible CPF' }
                    ]
                },

                heroContent: {
                    titles: [
                        'Développez vos compétences, transformez votre carrière',
                        'Des formations qui ouvrent des portes',
                        'Apprenez aujourd\'hui, réussissez demain',
                        'Votre potentiel n\'attend que vous'
                    ],
                    subtitles: [
                        'Formations certifiantes éligibles CPF. Présentiel ou à distance, à votre rythme, avec un accompagnement personnalisé.',
                        'Reconversion, montée en compétences ou spécialisation : trouvez la formation qui vous correspond.',
                        'Des formateurs experts, des méthodes innovantes, des résultats concrets. Investissez dans votre avenir.'
                    ],
                    badges: ['🎓 Qualiopi', '💳 100% CPF', '🏆 93% réussite']
                },

                aboutContent: {
                    stories: [
                        'Formateur depuis 15 ans, j\'ai créé cet organisme avec une mission : rendre la formation accessible et efficace. Fini les cours théoriques interminables, place à la pratique, aux cas concrets, à l\'opérationnalité. Nos apprenants sont prêts à performer dès le lendemain.',
                        'Notre équipe de 20 formateurs experts allie expérience terrain et pédagogie innovante. Chaque parcours est personnalisé, chaque apprenant est accompagné vers sa réussite.'
                    ],
                    missions: [
                        'Rendre la formation professionnelle accessible à tous',
                        'Accompagner chaque apprenant vers la réussite',
                        'Proposer des formations opérationnelles et reconnues'
                    ],
                    values: ['Excellence', 'Accessibilité', 'Accompagnement', 'Innovation', 'Résultats']
                },

                services: [
                    {
                        icon: '🎓',
                        name: 'Formations certifiantes',
                        description: 'Diplômes reconnus RNCP, certifications métiers. Boostez votre CV avec des compétences validées.'
                    },
                    {
                        icon: '💻',
                        name: 'E-learning',
                        description: 'Apprenez où vous voulez, quand vous voulez. Plateforme intuitive, contenus interactifs.'
                    },
                    {
                        icon: '👥',
                        name: 'Formation en entreprise',
                        description: 'Formations sur-mesure pour vos équipes. Sur site ou à distance, adaptées à vos enjeux.'
                    },
                    {
                        icon: '🔄',
                        name: 'Accompagnement reconversion',
                        description: 'Bilan de compétences, orientation, formation complète. Changez de vie professionnelle sereinement.'
                    }
                ],

                testimonials: [
                    {
                        text: 'Reconversion réussie ! En 6 mois, j\'ai obtenu ma certification et décroché un CDI dans mon nouveau métier. L\'accompagnement a fait toute la différence.',
                        author: 'Charlotte D.',
                        role: 'Ex-comptable, maintenant UX Designer',
                        avatar: 'CD'
                    },
                    {
                        text: 'Formation 100% financée par mon CPF. Qualité des cours excellente, formateurs disponibles, et surtout : des compétences directement applicables au travail.',
                        author: 'Michel P.',
                        role: 'Manager en montée de compétences',
                        avatar: 'MP'
                    },
                    {
                        text: 'Le format e-learning m\'a permis de me former tout en travaillant. Flexible, bien construit, et le support est ultra-réactif.',
                        author: 'Julie M.',
                        role: 'Salariée en formation continue',
                        avatar: 'JM'
                    }
                ],

                ctas: {
                    primary: ['Voir les formations', 'Tester mon éligibilité CPF', 'Être rappelé'],
                    secondary: ['Catalogue PDF', 'Financement', 'Témoignages'],
                    newsletter: 'Actualités formation et conseils carrière'
                },

                colors: {
                    primary: '#6366F1',    // Indigo savoir
                    secondary: '#8B5CF6',  // Violet ambition
                    accent: '#FBBF24',     // Jaune réussite
                    gradients: ['#6366F1, #4F46E5', '#8B5CF6, #7C3AED']
                },

                avoid: ['gourmand', 'savoureux', 'câlin', 'mignon', 'gastronomique', 'croquettes']
            },

            // ══════════════════════════════════════════════════════════════════
            // LEGAL / JURIDIQUE
            // ══════════════════════════════════════════════════════════════════
            legal: {
                identity: {
                    sector: 'Services Juridiques',
                    subSectors: ['Droit des affaires', 'Droit de la famille', 'Droit du travail', 'Droit immobilier'],
                    audience: 'Particuliers et entreprises',
                    tone: 'Professionnel, rassurant, expert'
                },

                vocabulary: {
                    nouns: ['avocat', 'droit', 'conseil', 'litige', 'procédure', 'défense', 'contrat', 'juridiction', 'tribunal', 'médiation', 'négociation', 'contentieux', 'assignation', 'jugement'],
                    verbs: ['défendre', 'conseiller', 'accompagner', 'négocier', 'plaider', 'rédiger', 'protéger', 'représenter'],
                    adjectives: ['juridique', 'confidentiel', 'rigoureux', 'expert', 'réactif', 'stratégique', 'déterminé', 'compétent'],
                    expressions: [
                        'défendre vos intérêts',
                        'solution amiable',
                        'droit à vos côtés',
                        'expertise juridique',
                        'accompagnement sur-mesure',
                        'confidentialité garantie'
                    ]
                },

                entities: {
                    brands: ['Barreau de Paris', 'Ordre des avocats', 'CNB', 'Carpa'],
                    places: ['cabinet', 'tribunal', 'cour d\'appel', 'juridiction', 'palais de justice'],
                    certifications: ['Avocat au Barreau', 'Spécialiste en droit', 'Médiateur agréé', 'Docteur en droit'],
                    experts: [
                        { name: 'Maître Claire Fontaine', title: 'Avocate associée, 20 ans d\'expérience' },
                        { name: 'Maître Philippe Blanc', title: 'Spécialiste droit des affaires' },
                        { name: 'Maître Sophie Mercier', title: 'Experte droit de la famille' }
                    ]
                },

                metrics: {
                    clients: ['500+', '1 000+', '2 000+'],
                    satisfaction: ['95%', '97%', '98%'],
                    experience: ['15 ans', '20 ans', '30 ans'],
                    specific: [
                        { number: '85%', label: 'dossiers gagnés' },
                        { number: '72h', label: 'délai de réponse max' },
                        { number: '100%', label: 'confidentialité' }
                    ]
                },

                heroContent: {
                    titles: [
                        'Votre droit, notre combat',
                        'Défendre vos intérêts avec détermination',
                        'Le droit à vos côtés, la justice en ligne de mire',
                        'Conseil et défense : une expertise à votre service'
                    ],
                    subtitles: [
                        'Cabinet d\'avocats expérimenté. Contentieux, conseil, accompagnement : une équipe déterminée pour défendre vos droits.',
                        'Du conseil préventif à la plaidoirie, nous vous accompagnons avec rigueur et réactivité.',
                        'Particuliers et entreprises : des solutions juridiques sur-mesure pour chaque situation.'
                    ],
                    badges: ['⚖️ Premier RDV offert', '🏛️ 20 ans d\'expérience', '📋 Honoraires transparents']
                },

                aboutContent: {
                    stories: [
                        'Avocat depuis 25 ans, j\'ai fondé ce cabinet avec une conviction : le droit doit être accessible et humain. Derrière chaque dossier, il y a une personne, une entreprise, une vie. Nous défendons vos intérêts avec la même détermination que s\'il s\'agissait des nôtres.',
                        'Notre équipe de 5 avocats couvre les principaux domaines du droit. Complémentarité des expertises, rigueur du travail, réactivité : votre dossier est entre de bonnes mains.'
                    ],
                    missions: [
                        'Défendre les droits de nos clients avec détermination',
                        'Rendre le droit accessible et compréhensible',
                        'Privilégier les solutions amiables quand c\'est possible'
                    ],
                    values: ['Intégrité', 'Rigueur', 'Confidentialité', 'Détermination', 'Humanité']
                },

                services: [
                    {
                        icon: '⚖️',
                        name: 'Contentieux',
                        description: 'Représentation devant les tribunaux, plaidoirie, défense de vos intérêts. Nous nous battons pour vous.'
                    },
                    {
                        icon: '📝',
                        name: 'Conseil juridique',
                        description: 'Rédaction de contrats, audit juridique, prévention des risques. Anticipez plutôt que subir.'
                    },
                    {
                        icon: '🤝',
                        name: 'Médiation',
                        description: 'Résolution amiable des conflits, négociation, accords transactionnels. Économisez temps et argent.'
                    },
                    {
                        icon: '🏢',
                        name: 'Droit des affaires',
                        description: 'Création d\'entreprise, contrats commerciaux, litiges inter-entreprises. Votre partenaire juridique business.'
                    }
                ],

                testimonials: [
                    {
                        text: 'Face à mon employeur, je me sentais démuni. Maître Fontaine a repris le dossier et obtenu une indemnisation bien au-delà de mes espérances. Un grand merci.',
                        author: 'Laurent M.',
                        role: 'Salarié licencié',
                        avatar: 'LM'
                    },
                    {
                        text: 'Pour notre divorce, l\'approche apaisée du cabinet a permis de trouver un accord à l\'amiable. Les enfants ont été préservés, c\'était notre priorité.',
                        author: 'Anne & Marc',
                        role: 'Procédure de divorce',
                        avatar: 'AM'
                    },
                    {
                        text: 'Ils accompagnent notre PME depuis 10 ans. Contrats, litiges commerciaux, conseil : une réactivité et une expertise remarquables.',
                        author: 'Pierre D.',
                        role: 'Dirigeant PME',
                        avatar: 'PD'
                    }
                ],

                ctas: {
                    primary: ['Prendre rendez-vous', 'Nous exposer votre cas', 'Premier contact gratuit'],
                    secondary: ['Nos domaines', 'Honoraires', 'L\'équipe'],
                    newsletter: 'Actualités juridiques et conseils pratiques'
                },

                colors: {
                    primary: '#1E3A5F',    // Bleu nuit justice
                    secondary: '#C7A962',  // Or prestige
                    accent: '#0EA5E9',     // Bleu clair
                    gradients: ['#1E3A5F, #0F172A', '#C7A962, #B8860B']
                },

                avoid: ['mignon', 'adorable', 'câlin', 'gourmand', 'savoureux', 'croquettes', 'fitness']
            },

            // ══════════════════════════════════════════════════════════════════
            // FINANCE / PATRIMOINE
            // ══════════════════════════════════════════════════════════════════
            finance: {
                identity: {
                    sector: 'Conseil Financier & Patrimoine',
                    subSectors: ['Gestion de patrimoine', 'Investissement', 'Assurance', 'Fiscalité'],
                    audience: 'Particuliers et chefs d\'entreprise',
                    tone: 'Expert, rassurant, personnalisé'
                },

                vocabulary: {
                    nouns: ['patrimoine', 'investissement', 'épargne', 'placement', 'rendement', 'fiscalité', 'succession', 'assurance-vie', 'immobilier', 'retraite', 'défiscalisation', 'diversification'],
                    verbs: ['investir', 'optimiser', 'conseiller', 'protéger', 'transmettre', 'épargner', 'défiscaliser', 'diversifier'],
                    adjectives: ['patrimonial', 'financier', 'fiscal', 'stratégique', 'personnalisé', 'indépendant', 'objectif', 'long terme'],
                    expressions: [
                        'gestion sur-mesure',
                        'optimisation fiscale',
                        'allocation d\'actifs',
                        'horizon de placement',
                        'rendement ajusté au risque',
                        'transmission de patrimoine'
                    ]
                },

                entities: {
                    brands: ['AMF', 'ORIAS', 'ANACOFI', 'CIF', 'Assurance-vie'],
                    places: ['cabinet de gestion', 'bureau conseil', 'espace client'],
                    certifications: ['CIF (Conseiller en Investissements Financiers)', 'ORIAS', 'Carte T', 'Assurance'],
                    experts: [
                        { name: 'Olivier Marchand', title: 'CGP, 25 ans d\'expérience' },
                        { name: 'Nathalie Rousseau', title: 'Experte fiscalité' },
                        { name: 'Antoine Dubois', title: 'Spécialiste immobilier patrimonial' }
                    ]
                },

                metrics: {
                    clients: ['300+', '500+', '800+'],
                    satisfaction: ['96%', '97%', '98%'],
                    experience: ['15 ans', '20 ans', '25 ans'],
                    specific: [
                        { number: '200M€', label: 'd\'actifs sous gestion' },
                        { number: '7.2%', label: 'rendement moyen (2023)' },
                        { number: '100%', label: 'indépendant' }
                    ]
                },

                heroContent: {
                    titles: [
                        'Construisez votre avenir financier en toute sérénité',
                        'Votre patrimoine mérite le meilleur conseil',
                        'Des solutions patrimoniales sur-mesure',
                        'Investir, optimiser, transmettre : nous vous guidons'
                    ],
                    subtitles: [
                        'Cabinet de gestion de patrimoine indépendant. Bilan gratuit, conseils objectifs, accompagnement personnalisé.',
                        'Épargne, investissement, fiscalité, succession : une vision globale de votre patrimoine pour des décisions éclairées.',
                        '25 ans d\'expertise au service de votre patrimoine. Des conseils adaptés à chaque étape de votre vie.'
                    ],
                    badges: ['💰 Bilan patrimonial offert', '📊 Conseiller indépendant', '🔒 Confidentialité totale']
                },

                aboutContent: {
                    stories: [
                        'Conseiller en gestion de patrimoine depuis 25 ans, j\'ai fondé ce cabinet avec une conviction : l\'indépendance est la clé d\'un conseil objectif. Pas de produits maison à placer, juste les meilleures solutions du marché pour votre situation.',
                        'Notre équipe de 4 experts couvre tous les aspects patrimoniaux : investissements, immobilier, fiscalité, succession. Une vision globale pour des décisions cohérentes et optimisées.'
                    ],
                    missions: [
                        'Accompagner chaque client dans ses choix patrimoniaux',
                        'Proposer des solutions objectives et personnalisées',
                        'Construire des stratégies pérennes et adaptées'
                    ],
                    values: ['Indépendance', 'Expertise', 'Confidentialité', 'Long terme', 'Transparence']
                },

                services: [
                    {
                        icon: '📊',
                        name: 'Bilan patrimonial',
                        description: 'Analyse complète de votre situation. Épargne, investissements, fiscalité, succession. Le point de départ de toute stratégie.'
                    },
                    {
                        icon: '💰',
                        name: 'Investissement',
                        description: 'Assurance-vie, PEA, SCPI, private equity. Une allocation sur-mesure adaptée à votre profil et vos objectifs.'
                    },
                    {
                        icon: '🏠',
                        name: 'Immobilier patrimonial',
                        description: 'LMNP, Pinel, déficit foncier, SCI. Investir dans la pierre intelligemment.'
                    },
                    {
                        icon: '📜',
                        name: 'Succession & Transmission',
                        description: 'Anticipez, optimisez, transmettez. Protégez vos proches et réduisez les droits de succession.'
                    }
                ],

                testimonials: [
                    {
                        text: 'Grâce à leur accompagnement, j\'ai économisé 15 000€ d\'impôts par an tout en préparant ma retraite. Un conseiller à l\'écoute qui explique clairement les options.',
                        author: 'François T.',
                        role: 'Chef d\'entreprise, 52 ans',
                        avatar: 'FT'
                    },
                    {
                        text: 'Ils gèrent notre patrimoine familial depuis 10 ans. Disponibilité, expertise, et surtout : des résultats réguliers. La confiance est totale.',
                        author: 'Famille Moreau',
                        role: 'Clients historiques',
                        avatar: 'FM'
                    },
                    {
                        text: 'J\'avais besoin de structurer mon épargne après une vente d\'entreprise. Stratégie claire, diversification pertinente, et un suivi irréprochable.',
                        author: 'Marc-Antoine D.',
                        role: 'Ex-entrepreneur',
                        avatar: 'MD'
                    }
                ],

                ctas: {
                    primary: ['Bilan gratuit', 'Prendre rendez-vous', 'Nous contacter'],
                    secondary: ['Nos solutions', 'Simulateurs', 'Cas clients'],
                    newsletter: 'Analyses marchés et conseils patrimoniaux'
                },

                colors: {
                    primary: '#0F766E',    // Vert confiance
                    secondary: '#14B8A6',  // Teal croissance
                    accent: '#F59E0B',     // Or investissement
                    gradients: ['#0F766E, #115E59', '#14B8A6, #0D9488']
                },

                avoid: ['adorable', 'mignon', 'câlin', 'gourmand', 'savoureux', 'croquettes', 'chiot']
            },

            // ══════════════════════════════════════════════════════════════════
            // E-COMMERCE
            // ══════════════════════════════════════════════════════════════════
            ecommerce: {
                identity: {
                    sector: 'E-commerce & Boutique en ligne',
                    subSectors: ['Mode', 'High-tech', 'Maison', 'Beauté', 'Sport'],
                    audience: 'Consommateurs en ligne',
                    tone: 'Dynamique, attractif, rassurant'
                },

                vocabulary: {
                    nouns: ['produit', 'article', 'commande', 'livraison', 'panier', 'promotion', 'collection', 'nouveauté', 'tendance', 'qualité', 'garantie', 'retour', 'avis', 'sélection'],
                    verbs: ['commander', 'acheter', 'découvrir', 'profiter', 'économiser', 'livrer', 'retourner', 'craquer'],
                    adjectives: ['premium', 'exclusif', 'tendance', 'qualitatif', 'garanti', 'rapide', 'gratuit', 'fiable'],
                    expressions: [
                        'livraison offerte',
                        'satisfait ou remboursé',
                        'meilleur rapport qualité-prix',
                        'sélection rigoureuse',
                        'coup de cœur',
                        'offre limitée'
                    ]
                },

                entities: {
                    brands: ['Colissimo', 'Chronopost', 'Mondial Relay', 'PayPal', 'Stripe', 'Visa', 'Mastercard'],
                    places: ['entrepôt France', 'service client', 'showroom'],
                    certifications: ['Avis Vérifiés', 'Trusted Shops', 'Fevad', 'PCI DSS'],
                    experts: [
                        { name: 'Emma Laurent', title: 'Fondatrice & Curatrice' },
                        { name: 'Lucas Martin', title: 'Responsable sourcing' },
                        { name: 'Sarah Cohen', title: 'Directrice expérience client' }
                    ]
                },

                metrics: {
                    clients: ['10 000+', '50 000+', '100 000+'],
                    satisfaction: ['4.7/5', '4.8/5', '4.9/5'],
                    experience: ['5 ans', '8 ans', '10 ans'],
                    specific: [
                        { number: '48h', label: 'livraison express' },
                        { number: '30 jours', label: 'retour gratuit' },
                        { number: '100%', label: 'paiement sécurisé' }
                    ]
                },

                heroContent: {
                    titles: [
                        'Des produits de qualité, livrés chez vous',
                        'La sélection qui fait la différence',
                        'Shopping en toute confiance',
                        'Faites-vous plaisir, vous le méritez'
                    ],
                    subtitles: [
                        'Découvrez notre sélection rigoureuse de produits tendance. Livraison rapide, retours gratuits, satisfaction garantie.',
                        'Plus de 10 000 clients nous font confiance. Rejoignez-les et découvrez pourquoi.',
                        'Qualité premium, prix justes, service impeccable. Le shopping comme vous l\'aimez.'
                    ],
                    badges: ['🚚 Livraison offerte dès 49€', '↩️ Retour 30 jours', '⭐ 4.8/5 sur 10 000 avis']
                },

                aboutContent: {
                    stories: [
                        'Passionnés par notre domaine, nous avons créé cette boutique pour proposer une sélection rigoureuse de produits que nous utilisons nous-mêmes. Chaque article est testé, validé, approuvé. Pas de compromis sur la qualité.',
                        'Notre mission : vous faire découvrir des produits qui allient qualité, design et prix juste. Une équipe dédiée répond à vos questions et assure un suivi personnalisé de chaque commande.'
                    ],
                    missions: [
                        'Proposer une sélection de produits de qualité',
                        'Offrir une expérience d\'achat simple et sécurisée',
                        'Assurer un service client réactif et humain'
                    ],
                    values: ['Qualité', 'Confiance', 'Service', 'Authenticité', 'Accessibilité']
                },

                services: [
                    {
                        icon: '🎁',
                        name: 'Sélection premium',
                        description: 'Chaque produit est rigoureusement sélectionné pour sa qualité, son design et son rapport qualité-prix.'
                    },
                    {
                        icon: '🚚',
                        name: 'Livraison rapide',
                        description: 'Expédition sous 24h, livraison en 48-72h. Offerte dès 49€ d\'achat.'
                    },
                    {
                        icon: '↩️',
                        name: 'Retours simplifiés',
                        description: '30 jours pour changer d\'avis. Retour gratuit, remboursement rapide.'
                    },
                    {
                        icon: '💬',
                        name: 'Service client réactif',
                        description: 'Une question ? Notre équipe répond en moins de 2h. Par chat, email ou téléphone.'
                    }
                ],

                testimonials: [
                    {
                        text: 'Commande reçue en 48h, produit conforme à la description, emballage soigné. Je recommande les yeux fermés !',
                        author: 'Marie P.',
                        role: 'Cliente vérifiée',
                        avatar: 'MP'
                    },
                    {
                        text: 'Super rapport qualité-prix. J\'ai eu un souci sur ma première commande, le service client a été impeccable. Cliente fidèle désormais.',
                        author: 'Sophie L.',
                        role: '15 commandes',
                        avatar: 'SL'
                    },
                    {
                        text: 'Enfin une boutique qui tient ses promesses. Produits de qualité, livraison rapide, et un SAV au top. Rare de nos jours !',
                        author: 'Thomas R.',
                        role: 'Client depuis 2 ans',
                        avatar: 'TR'
                    }
                ],

                ctas: {
                    primary: ['Découvrir la boutique', 'Voir les nouveautés', 'Profiter des promos'],
                    secondary: ['Meilleures ventes', 'Livraison', 'Avis clients'],
                    newsletter: 'Offres exclusives et nouveautés en avant-première'
                },

                colors: {
                    primary: '#F43F5E',    // Rose shopping
                    secondary: '#EC4899',  // Pink tendance
                    accent: '#FBBF24',     // Jaune promo
                    gradients: ['#F43F5E, #E11D48', '#EC4899, #DB2777']
                },

                avoid: ['B2B', 'enterprise', 'scalable', 'workflow', 'vétérinaire', 'tribunal', 'plaidoirie']
            }
        };
    }

    /**
     * Expressions communes adaptables
     */
    initializeCommonExpressions() {
        return {
            trust: [
                'Ils nous font confiance',
                'Nos clients témoignent',
                'Ce que disent nos clients',
                'Avis vérifiés'
            ],
            quality: [
                'Notre engagement qualité',
                'L\'excellence au quotidien',
                'Un savoir-faire reconnu',
                'La qualité avant tout'
            ],
            cta: [
                'Prêt à commencer ?',
                'Passez à l\'action',
                'C\'est le moment',
                'Lancez-vous'
            ]
        };
    }

    /**
     * Récupère le contenu complet pour un thème
     */
    getThemeContent(themeName) {
        return this.themes[themeName] || this.themes.business;
    }

    /**
     * Génère un contenu hero cohérent
     */
    generateHeroContent(themeName) {
        const theme = this.getThemeContent(themeName);
        const hero = theme.heroContent;

        return {
            title: this.randomChoice(hero.titles),
            subtitle: this.randomChoice(hero.subtitles),
            badge: this.randomChoice(hero.badges)
        };
    }

    /**
     * Génère un contenu about cohérent
     */
    generateAboutContent(themeName) {
        const theme = this.getThemeContent(themeName);
        const about = theme.aboutContent;

        return {
            story: this.randomChoice(about.stories),
            mission: about.missions[0],
            values: about.values.slice(0, 4)
        };
    }

    /**
     * Génère des services cohérents
     */
    generateServices(themeName) {
        const theme = this.getThemeContent(themeName);
        return theme.services;
    }

    /**
     * Génère des témoignages cohérents
     */
    generateTestimonials(themeName) {
        const theme = this.getThemeContent(themeName);
        return theme.testimonials;
    }

    /**
     * Génère des stats cohérentes
     */
    generateStats(themeName) {
        const theme = this.getThemeContent(themeName);
        const metrics = theme.metrics;

        return [
            { number: this.randomChoice(metrics.clients), label: 'Clients satisfaits' },
            { number: this.randomChoice(metrics.satisfaction), label: 'Taux de satisfaction' },
            { number: this.randomChoice(metrics.experience), label: 'D\'expérience' },
            ...metrics.specific.slice(0, 1)
        ];
    }

    /**
     * Génère des CTAs cohérents
     */
    generateCTAs(themeName) {
        const theme = this.getThemeContent(themeName);
        return theme.ctas;
    }

    /**
     * Récupère les couleurs du thème
     */
    getThemeColors(themeName) {
        const theme = this.getThemeContent(themeName);
        return theme.colors;
    }

    /**
     * Vérifie la cohérence d'un texte avec le thème
     */
    validateCoherence(text, themeName) {
        const theme = this.getThemeContent(themeName);
        const avoid = theme.avoid || [];
        const issues = [];

        const textLower = text.toLowerCase();

        for (const word of avoid) {
            if (textLower.includes(word.toLowerCase())) {
                issues.push(`Mot incohérent détecté: "${word}"`);
            }
        }

        return {
            isValid: issues.length === 0,
            issues
        };
    }

    /**
     * Enrichit un texte avec le vocabulaire du thème
     */
    enrichText(text, themeName) {
        const theme = this.getThemeContent(themeName);
        const vocab = theme.vocabulary;

        // Remplacer les placeholders génériques
        let enriched = text;

        if (text.includes('{action}')) {
            enriched = enriched.replace(/{action}/g, this.randomChoice(vocab.verbs));
        }
        if (text.includes('{adjective}')) {
            enriched = enriched.replace(/{adjective}/g, this.randomChoice(vocab.adjectives));
        }
        if (text.includes('{noun}')) {
            enriched = enriched.replace(/{noun}/g, this.randomChoice(vocab.nouns));
        }
        if (text.includes('{expression}')) {
            enriched = enriched.replace(/{expression}/g, this.randomChoice(vocab.expressions));
        }

        return enriched;
    }

    /**
     * Génère un nom d'expert cohérent
     */
    generateExpertName(themeName) {
        const theme = this.getThemeContent(themeName);
        return this.randomChoice(theme.entities.experts);
    }

    /**
     * Utilitaire : choix aléatoire
     */
    randomChoice(array) {
        if (!array || array.length === 0) return '';
        return array[Math.floor(Math.random() * array.length)];
    }
}

module.exports = ThematicContentLibrary;
