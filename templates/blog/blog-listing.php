<?php
// Fonction pour parser les meta tags d'un fichier HTML
function parseArticle($filepath) {
    $content = file_get_contents($filepath);
    if (!$content) return null;

    $article = [];

    // Extraire le titre
    if (preg_match('/<title>(.*?)<\/title>/i', $content, $matches)) {
        $article['title'] = str_replace(' - Terroir Sublime Blog', '', $matches[1]);
    }

    // Extraire la description
    if (preg_match('/<meta\s+name="description"\s+content="(.*?)"/i', $content, $matches)) {
        $article['description'] = substr($matches[1], 0, 150) . '...';
    }

    // Extraire la date
    if (preg_match('/<time>(.*?)<\/time>/i', $content, $matches)) {
        $article['date'] = $matches[1];
    } else {
        // Si pas de date dans l'article, utiliser la date de modification du fichier
        $article['date'] = date('d F Y', filemtime($filepath));
    }

    // URL de l'article
    $article['url'] = 'blog/' . basename($filepath);
    $article['slug'] = str_replace('.html', '', basename($filepath));

    return $article;
}

// Scanner le dossier blog pour récupérer tous les articles
$articles = [];
$blogDir = __DIR__ . '/blog/';

if (is_dir($blogDir)) {
    $files = glob($blogDir . '*.html');

    foreach ($files as $file) {
        // Ignorer index.html
        if (basename($file) === 'index.html') continue;

        $article = parseArticle($file);
        if ($article) {
            $articles[] = $article;
        }
    }

    // Trier les articles par date (plus récent en premier)
    usort($articles, function($a, $b) {
        return strtotime($b['date']) - strtotime($a['date']);
    });
}

// Pagination
$articlesPerPage = 12;
$currentPage = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$totalArticles = count($articles);
$totalPages = ceil($totalArticles / $articlesPerPage);
$offset = ($currentPage - 1) * $articlesPerPage;
$articlesToShow = array_slice($articles, $offset, $articlesPerPage);
?>
<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Terroir Sublime - Articles SEO, Netlinking et Backlinks</title>
    <meta name="description" content="Découvrez nos articles sur le netlinking, le SEO et les backlinks. Conseils d'experts pour améliorer votre référencement avec Terroir Sublime.">
    <meta name="keywords" content="blog SEO, articles netlinking, conseils backlinks, Terroir Sublime, référencement naturel">
    <link rel="canonical" href="https://lemmilink.com/blog">

    <!-- Favicon -->
    <link rel="icon" type="image/gif" href="assets/images/common/Terroir Sublime.gif">
    <link rel="shortcut icon" type="image/gif" href="assets/images/common/Terroir Sublime.gif">
    <meta name="theme-color" content="#178d72">

    <!-- preload head styles -->
    <link rel="preload" href="../assets/css/fonts.css" as="style">
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" as="style">
    <link rel="preload" href="../assets/css/swiper-bundle.min.css" as="style">
    <link rel="preload" href="../assets/css/magic-cursor.min.css" as="style">

    <!-- app head for bootstrap core -->
    <script src="../assets/js/app-head-bs.js"></script>

    <!-- include uni-core components -->
    <link rel="stylesheet" href="../assets/js/uni-core/css/uni-core.min.css">

    <!-- include styles -->
    <link rel="stylesheet" href="../assets/css/fonts.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="../assets/css/swiper-bundle.min.css">
    <link rel="stylesheet" href="../assets/css/prettify.min.css">
    <link rel="stylesheet" href="../assets/css/magic-cursor.min.css">

    <!-- include main style -->
    <link rel="stylesheet" href="../assets/css/theme/main.min.css">
    <link rel="stylesheet" href="../assets/css/theme/theme-two.min.css">

    <!-- Mobile responsive fixes -->
    <link rel="stylesheet" href="../assets/css/mobile-fixes.css">

    <!-- include scripts -->
    <script src="../assets/js/uni-core/js/uni-core-bundle.min.js"></script>

    <style>
        /* Header background fix */
        .uc-navbar-container {
            background: rgba(26, 26, 26, 0.95) !important;
            backdrop-filter: blur(10px);
        }
        .uc-navbar-sticky .uc-navbar-container {
            background: rgba(255, 255, 255, 0.98) !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .blog-hero {
            background: linear-gradient(to bottom, #1a1a1a 0%, #2d2d2d 100%);
            padding: 120px 0 60px;
        }
        .article-card {
            transition: transform 0.3s, box-shadow 0.3s;
        }
        .article-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }
        .article-card img {
            height: 200px;
            object-fit: cover;
        }
        .pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 3rem;
        }
        .pagination a, .pagination span {
            padding: 10px 15px;
            border-radius: 5px;
            text-decoration: none;
            color: #333;
            border: 1px solid #ddd;
        }
        .pagination .active {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }
    </style>
<link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css">
</head>

<body class="uni-body panel bg-white text-gray-900 dark:bg-gray-900 dark:text-white overflow-x-hidden">

    <!-- Header start -->
    <header class="uc-header header-six uc-navbar-sticky-wrap z-999" data-uc-sticky="start: 1200px; animation: uc-animation-slide-top; sel-target: .uc-navbar-container; cls-active: uc-navbar-sticky; cls-inactive: uc-navbar-transparent; end: !*;">
        <nav class="uc-navbar-container lg:mt-3 rounded-0 lg:rounded-pill uc-navbar-float ft-tertiary z-1" data-anime="translateY: [-40, 0]; opacity: [0, 1]; easing: easeOutExpo; duration: 750; delay: 0;">
            <div class="uc-navbar-main" style="--uc-nav-height: 80px">
                <div class="container max-w-lg lg:max-w-950px xl:max-w-xl">
                    <div class="uc-navbar min-h-64px lg:min-h-80px px-2 lg:px-0 text-gray-900 dark:text-white" data-uc-navbar="mode: click; animation: uc-animation-slide-top-small; duration: 150;">
                        <div class="uc-navbar-left">
                            <div class="uc-logo">
                                <a class="panel text-none" href="index.html" style="margin-left: 40px;">
                                    <img src="assets/images/common/Terroir Sublime.gif" alt="Terroir Sublime" style="height: 55px; width: auto; border-radius: 25px;">
                                </a>
                            </div>
                        </div>
                        <div class="uc-navbar-center">
                            <ul class="uc-navbar-nav gap-2 xl:gap-3 d-none lg:d-flex fs-6 fw-medium" data-uc-scrollspy-nav="closest: li; offset: 40; scroll: true">
                                <li><a href="annonceur.html">Annonceurs</a></li>
                                <li><a href="editeur.html">Éditeurs</a></li>
                                <li><a href="agence.html">Agence</a></li>
                                <li><a href="tpe-pme.html">TPE/PME</a></li>
                                <li><a href="ninjalinking.html">NinjaLinking</a></li>
                                <li><a href="blog.php" class="text-primary">Blog</a></li>
                            </ul>
                        </div>
                        <div class="uc-navbar-right">
                            <a href="https://app.lemmilink.fr/" target="_blank" class="btn btn-sm btn-outline-primary px-2 d-none lg:d-inline-flex me-2">
                                <span>Se connecter</span>
                            </a>
                            <a href="https://app.lemmilink.fr/register" target="_blank" class="btn btn-sm btn-primary px-2 d-none lg:d-inline-flex">
                                <span>Inscription</span>
                            </a>
                            <a class="d-block lg:d-none" href="#uc-menu-panel" data-uc-navbar-toggle-icon data-uc-toggle></a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    </header>
    <!-- Header end -->

    <!-- Wrapper start -->
    <div id="wrapper" class="wrap">

        <!-- Hero Section -->
        <div class="blog-hero">
            <div class="container xl:max-w-xl">
                <div class="text-center text-white">
                    <h1 class="h2 lg:h1 xl:display-6">Blog Terroir Sublime</h1>
                    <p class="fs-5 mt-3 opacity-90">Découvrez nos conseils d'experts en netlinking et SEO</p>
                    <div class="mt-4">
                        <span class="badge bg-primary px-3 py-2">
                            <i class="fas fa-newspaper me-2"></i><?php echo $totalArticles; ?> articles disponibles
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Blog Articles -->
        <div class="section panel py-6 lg:py-8">
            <div class="container xl:max-w-xl">
                <div class="row child-cols-6 lg:child-cols-4 g-4">
                    <?php foreach ($articlesToShow as $article): ?>
                    <div>
                        <article class="article-card post type-post panel vstack gap-3 rounded-2 overflow-hidden bg-white h-100">
                            <figure class="featured-image m-0 ratio ratio-16x9 overflow-hidden">
                                <img class="media-cover image" src="https://picsum.photos/400/250?random=<?php echo substr(md5($article['slug']), 0, 10); ?>" alt="<?php echo htmlspecialchars($article['title']); ?>">
                            </figure>
                            <div class="p-3 vstack gap-2 flex-grow-1">
                                <header class="vstack gap-1">
                                    <h3 class="h6 m-0">
                                        <a class="text-none text-dark" href="<?php echo htmlspecialchars($article['url']); ?>">
                                            <?php echo htmlspecialchars($article['title']); ?>
                                        </a>
                                    </h3>
                                    <div class="post-date fs-7 opacity-60">
                                        <i class="fas fa-calendar-alt me-1"></i>
                                        <span><?php echo htmlspecialchars($article['date']); ?></span>
                                    </div>
                                </header>
                                <p class="fs-7 opacity-80 flex-grow-1">
                                    <?php echo htmlspecialchars($article['description']); ?>
                                </p>
                                <a href="<?php echo htmlspecialchars($article['url']); ?>" class="btn btn-sm btn-outline-primary">
                                    Lire l'article <i class="fas fa-arrow-right ms-1"></i>
                                </a>
                            </div>
                        </article>
                    </div>
                    <?php endforeach; ?>
                </div>

                <?php if ($totalPages > 1): ?>
                <div class="pagination mt-5">
                    <?php if ($currentPage > 1): ?>
                        <a href="?page=1">«</a>
                        <a href="?page=<?php echo $currentPage - 1; ?>">‹</a>
                    <?php endif; ?>

                    <?php for ($i = max(1, $currentPage - 2); $i <= min($totalPages, $currentPage + 2); $i++): ?>
                        <?php if ($i == $currentPage): ?>
                            <span class="active"><?php echo $i; ?></span>
                        <?php else: ?>
                            <a href="?page=<?php echo $i; ?>"><?php echo $i; ?></a>
                        <?php endif; ?>
                    <?php endfor; ?>

                    <?php if ($currentPage < $totalPages): ?>
                        <a href="?page=<?php echo $currentPage + 1; ?>">›</a>
                        <a href="?page=<?php echo $totalPages; ?>">»</a>
                    <?php endif; ?>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <!-- Wrapper end -->

    <!-- Footer start -->
    <footer id="uc-footer" class="uc-footer panel overflow-hidden uc-dark">
        <div class="footer-outer pb-4 lg:pb-6 dark:bg-gray-800 dark:text-white m-2 rounded-2 lg:rounded-3">
            <div class="uc-footer-content pt-6 lg:pt-8">
                <div class="container xl:max-w-xl">
                    <div class="uc-footer-inner vstack gap-4 lg:gap-6 xl:gap-8">
                        <div class="uc-footer-widgets panel">
                            <div class="row child-cols-6 md:child-cols col-match g-4">
                                <div class="col-12 lg:col-6">
                                    <div class="panel vstack items-start gap-3 xl:gap-4 lg:max-w-1/2">
                                        <div>
                                            <a href="index.html" style="width: 140px">
                                                <img src="assets/images/common/Terroir Sublime.gif" alt="Terroir Sublime" style="height: 60px; width: auto; border-radius: 8px;">
                                            </a>
                                            <p class="mt-2">Plateforme de netlinking pour booster votre SEO avec des backlinks de qualité. Éditeurs, annonceurs, agences et TPE/PME.</p>
                                            <p class="fs-6 fw-medium mt-2">
                                                <i class="fas fa-envelope icon icon-1"></i>
                                                <a href="mailto:contact@lemmilink.com" class="text-primary">contact@lemmilink.com</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <ul class="nav-y gap-2 fw-medium">
                                        <li class="fs-7 text-uppercase dark:text-gray-300">Services</li>
                                        <li><a href="annonceur.html">Annonceurs</a></li>
                                        <li><a href="editeur.html">Éditeurs</a></li>
                                        <li><a href="agence.html">Agences SEO</a></li>
                                        <li><a href="tpe-pme.html">TPE/PME</a></li>
                                        <li><a href="ninjalinking.html">NinjaLinking</a></li>
                                        <li><a href="index.html#pricing">Tarifs</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <ul class="nav-y gap-2 fw-medium">
                                        <li class="fs-7 text-uppercase dark:text-gray-300">Informations</li>
                                        <li><a href="index.html#faq">FAQ</a></li>
                                        <li><a href="blog.php">Blog</a></li>
                                        <li><a href="https://calendly.com/contact-e16a/30min">Contact</a></li>
                                        <li><a href="mailto:contact@lemmilink.com">Support</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="uc-footer-bottom panel vstack lg:hstack gap-4 justify-between text-center pt-4 lg:pt-6 border-top dark:text-white">
                            <div class="vstack gap-2 lg:items-start">
                                <p class="opacity-60">© 2025 Terroir Sublime. Tous droits réservés par Terroir Sublime</p>
                            </div>
                            <ul class="nav-x justify-center gap-2 text-gray-300">
                                <li><a href="https://www.linkedin.com/company/lemmilink" target="_blank"><i class="fab fa-linkedin-in icon icon-2"></i></a></li>
                                <li><a href="https://www.facebook.com/lemmilink" target="_blank"><i class="fab fa-facebook-f icon icon-2"></i></a></li>
                                <li><a href="https://twitter.com/lemmilink" target="_blank"><i class="fab fa-x-twitter icon icon-2"></i></a></li>
                                <li><a href="https://www.youtube.com/@lemmilink" target="_blank"><i class="fab fa-youtube icon icon-2"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <!-- Footer end -->

    <!-- include jquery & bootstrap js -->
    <script defer src="../assets/js/libs/jquery.min.js"></script>
    <script defer src="../assets/js/libs/scrollmagic.min.js"></script>
    <script defer src="../assets/js/libs/swiper-bundle.min.js"></script>
    <script defer src="../assets/js/libs/anime.min.js"></script>
    <script defer src="../assets/js/core/magic-cursor.js"></script>
    <script defer src="../assets/js/helpers/data-attr-helper.js"></script>
    <script defer src="../assets/js/helpers/swiper-helper.js"></script>
    <script defer src="../assets/js/helpers/anime-helper.js"></script>
    <script defer src="../assets/js/uikit-components-bs.js"></script>
    <script defer src="../assets/js/app.js"></script>
</body>
</html>