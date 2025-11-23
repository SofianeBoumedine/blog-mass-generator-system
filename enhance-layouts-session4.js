/**
 * SESSION 4: AMÉLIORATIONS ULTRA-AVANCÉES
 */

const fs = require('fs');
const path = require('path');

class Session4Enhancer {
    constructor() {
        this.stats = {
            total: 0,
            processed: 0,
            improvements: {
                videoOptimization: 0,
                exitIntent: 0,
                socialProof: 0,
                stickyCTA: 0,
                imageOptimization: 0,
                chatWidget: 0,
                newsletterInline: 0,
                parallaxEffects: 0,
                countdownTimers: 0,
                shareButtons: 0,
                backToTop: 0,
                readingProgress: 0
            }
        };
        this.layoutsDir = path.join(__dirname, 'templates', 'layouts');
        this.backupDir = path.join(__dirname, '.layouts-backup-session4');
    }

    async run() {
        console.log('🚀 SESSION 4: AMÉLIORATIONS ULTRA-AVANCÉES\n');

        await this.createBackup();

        const layoutFiles = fs.readdirSync(this.layoutsDir)
            .filter(file => file.startsWith('layout-') && file.endsWith('.html'));

        this.stats.total = layoutFiles.length;

        for (const file of layoutFiles) {
            await this.processLayout(file);
        }

        this.displaySummary();
    }

    async createBackup() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
        const files = fs.readdirSync(this.layoutsDir)
            .filter(file => file.startsWith('layout-') && file.endsWith('.html'));
        for (const file of files) {
            fs.copyFileSync(
                path.join(this.layoutsDir, file),
                path.join(this.backupDir, file)
            );
        }
        console.log(`✅ Backup: ${files.length} fichiers\n`);
    }

    async processLayout(filename) {
        const filePath = path.join(this.layoutsDir, filename);
        const fileStats = { file: filename, improvements: 0 };

        try {
            let content = fs.readFileSync(filePath, 'utf-8');
            const original = content;

            content = this.addVideoOptimization(content, fileStats);
            content = this.addExitIntent(content, fileStats);
            content = this.addSocialProof(content, fileStats);
            content = this.addStickyCTA(content, fileStats);
            content = this.addImageOptimization(content, fileStats);
            content = this.addChatWidgetReady(content, fileStats);
            content = this.addNewsletterInline(content, fileStats);
            content = this.addParallaxEffects(content, fileStats);
            content = this.addCountdownTimer(content, fileStats);
            content = this.addShareButtons(content, fileStats);
            content = this.addBackToTop(content, fileStats);
            content = this.addReadingProgress(content, fileStats);

            if (content !== original) {
                fs.writeFileSync(filePath, content, 'utf-8');
                this.stats.processed++;
            }

            console.log(`✅ ${filename} - ${fileStats.improvements} améliorations`);
        } catch (error) {
            console.error(`❌ ${filename} - ${error.message}`);
        }
    }

    addVideoOptimization(content, stats) {
        if (content.includes('video-optimization-script')) return content;

        const script = `
    <script id="video-optimization-script">
    // Video Lazy Loading & Optimization
    document.addEventListener('DOMContentLoaded', () => {
        const videos = document.querySelectorAll('video[data-src]');

        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        if (video.dataset.src) {
                            video.src = video.dataset.src;
                            video.load();
                            if (video.hasAttribute('autoplay')) {
                                video.play().catch(() => {});
                            }
                            videoObserver.unobserve(video);
                        }
                    }
                });
            }, { threshold: 0.25 });

            videos.forEach(video => videoObserver.observe(video));
        }

        // Pause video when not visible
        const allVideos = document.querySelectorAll('video');
        const pauseObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (!entry.isIntersecting) {
                    video.pause();
                } else if (video.hasAttribute('autoplay')) {
                    video.play().catch(() => {});
                }
            });
        }, { threshold: 0.5 });

        allVideos.forEach(video => pauseObserver.observe(video));
    });
    </script>`;

        const pos = content.indexOf('</body>');
        if (pos !== -1) {
            stats.improvements++;
            this.stats.improvements.videoOptimization++;
            return content.slice(0, pos) + script + content.slice(pos);
        }
        return content;
    }

    addExitIntent(content, stats) {
        if (content.includes('exit-intent-modal')) return content;

        const html = `
    <!-- Exit Intent Modal -->
    <div id="exit-intent-modal" class="exit-modal" style="display: none;">
        <div class="exit-modal-content">
            <button class="exit-modal-close" onclick="closeExitModal()">&times;</button>
            <h2>Attendez ! Ne partez pas !</h2>
            <p>Recevez nos meilleures offres directement dans votre boîte mail</p>
            <form class="exit-modal-form" onsubmit="handleExitForm(event)">
                <input type="email" placeholder="Votre email" required>
                <button type="submit">S'inscrire</button>
            </form>
        </div>
    </div>`;

        const script = `
    <script>
    let exitIntentShown = false;

    document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 0 && !exitIntentShown && !localStorage.getItem('exit-intent-dismissed')) {
            document.getElementById('exit-intent-modal').style.display = 'flex';
            exitIntentShown = true;
        }
    });

    function closeExitModal() {
        document.getElementById('exit-intent-modal').style.display = 'none';
        localStorage.setItem('exit-intent-dismissed', Date.now());
    }

    function handleExitForm(e) {
        e.preventDefault();
        showNotification('Merci pour votre inscription !', 'success');
        closeExitModal();
    }
    </script>`;

        const css = `
        .exit-modal {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s;
        }

        .exit-modal-content {
            background: white;
            padding: 3rem;
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
            position: relative;
            animation: slideDown 0.3s;
        }

        .exit-modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #999;
        }

        .exit-modal h2 {
            margin-bottom: 1rem;
            color: var(--primary, #007bff);
        }

        .exit-modal-form {
            display: flex;
            gap: 0.5rem;
            margin-top: 1.5rem;
        }

        .exit-modal-form input {
            flex: 1;
            padding: 0.75rem;
            border: 2px solid #ddd;
            border-radius: 8px;
        }

        .exit-modal-form button {
            padding: 0.75rem 2rem;
            background: var(--primary, #007bff);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }

        @keyframes slideDown {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
`;

        let modified = content;
        const stylePos = modified.lastIndexOf('</style>');
        if (stylePos !== -1) {
            modified = modified.slice(0, stylePos) + css + modified.slice(stylePos);
        }

        const bodyPos = modified.indexOf('</body>');
        if (bodyPos !== -1) {
            modified = modified.slice(0, bodyPos) + html + script + modified.slice(bodyPos);
            stats.improvements++;
            this.stats.improvements.exitIntent++;
        }

        return modified;
    }

    addSocialProof(content, stats) {
        if (content.includes('social-proof-notification')) return content;

        const html = `
    <!-- Social Proof Notifications -->
    <div id="social-proof-container"></div>`;

        const script = `
    <script>
    // Social Proof Notifications
    const socialProofMessages = [
        { name: 'Jean D.', action: 'vient de s\'inscrire', time: '2 min' },
        { name: 'Marie L.', action: 'a acheté un produit', time: '5 min' },
        { name: 'Thomas B.', action: 'a consulté cette page', time: '8 min' },
        { name: 'Sophie M.', action: 'a partagé cet article', time: '12 min' }
    ];

    function showSocialProof() {
        const container = document.getElementById('social-proof-container');
        if (!container) return;

        const message = socialProofMessages[Math.floor(Math.random() * socialProofMessages.length)];

        const notification = document.createElement('div');
        notification.className = 'social-proof-notification';
        notification.innerHTML = \`
            <div class="sp-avatar">👤</div>
            <div class="sp-content">
                <strong>\${message.name}</strong> \${message.action}
                <div class="sp-time">Il y a \${message.time}</div>
            </div>
        \`;

        container.appendChild(notification);

        setTimeout(() => notification.classList.add('sp-show'), 100);
        setTimeout(() => {
            notification.classList.remove('sp-show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    setInterval(showSocialProof, 15000);
    setTimeout(showSocialProof, 3000);
    </script>`;

        const css = `
        #social-proof-container {
            position: fixed;
            bottom: 2rem;
            left: 2rem;
            z-index: 9998;
        }

        .social-proof-notification {
            background: white;
            padding: 1rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
            display: flex;
            gap: 1rem;
            align-items: center;
            margin-top: 0.5rem;
            max-width: 300px;
            transform: translateX(-120%);
            opacity: 0;
            transition: all 0.3s ease;
        }

        .social-proof-notification.sp-show {
            transform: translateX(0);
            opacity: 1;
        }

        .sp-avatar {
            font-size: 2rem;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--primary, #007bff);
            color: white;
            border-radius: 50%;
        }

        .sp-content strong {
            color: var(--primary, #007bff);
        }

        .sp-time {
            font-size: 0.75rem;
            color: #999;
            margin-top: 0.25rem;
        }

        @media (max-width: 768px) {
            #social-proof-container {
                left: 1rem;
                right: 1rem;
            }
            .social-proof-notification {
                max-width: 100%;
            }
        }
`;

        let modified = content;
        const stylePos = modified.lastIndexOf('</style>');
        if (stylePos !== -1) {
            modified = modified.slice(0, stylePos) + css + modified.slice(stylePos);
        }

        const bodyPos = modified.indexOf('</body>');
        if (bodyPos !== -1) {
            modified = modified.slice(0, bodyPos) + html + script + modified.slice(bodyPos);
            stats.improvements++;
            this.stats.improvements.socialProof++;
        }

        return modified;
    }

    addStickyCTA(content, stats) {
        if (content.includes('sticky-cta-bar')) return content;

        const html = `
    <!-- Sticky CTA Bar -->
    <div id="sticky-cta-bar" class="sticky-cta" style="display: none;">
        <div class="sticky-cta-content">
            <div class="sticky-cta-text">
                <strong>Prêt à commencer ?</strong>
                <span>Rejoignez des milliers d'utilisateurs satisfaits</span>
            </div>
            <button class="sticky-cta-button" onclick="handleStickyCTA()">
                Commencer maintenant →
            </button>
        </div>
    </div>`;

        const script = `
    <script>
    window.addEventListener('scroll', () => {
        const stickyCTA = document.getElementById('sticky-cta-bar');
        if (window.scrollY > 800) {
            stickyCTA.style.display = 'block';
        } else {
            stickyCTA.style.display = 'none';
        }
    });

    function handleStickyCTA() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showNotification('Commençons ensemble !', 'info');
    }
    </script>`;

        const css = `
        .sticky-cta {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--primary, #007bff);
            color: white;
            padding: 1rem;
            box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
            z-index: 9997;
            animation: slideUp 0.3s ease;
        }

        .sticky-cta-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }

        .sticky-cta-text {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }

        .sticky-cta-text span {
            font-size: 0.875rem;
            opacity: 0.9;
        }

        .sticky-cta-button {
            padding: 0.75rem 2rem;
            background: white;
            color: var(--primary, #007bff);
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            white-space: nowrap;
            transition: transform 0.2s;
        }

        .sticky-cta-button:hover {
            transform: scale(1.05);
        }

        @media (max-width: 768px) {
            .sticky-cta-content {
                flex-direction: column;
                text-align: center;
            }
        }
`;

        let modified = content;
        const stylePos = modified.lastIndexOf('</style>');
        if (stylePos !== -1) {
            modified = modified.slice(0, stylePos) + css + modified.slice(stylePos);
        }

        const bodyPos = modified.indexOf('</body>');
        if (bodyPos !== -1) {
            modified = modified.slice(0, bodyPos) + html + script + modified.slice(bodyPos);
            stats.improvements++;
            this.stats.improvements.stickyCTA++;
        }

        return modified;
    }

    addImageOptimization(content, stats) {
        if (content.includes('image-optimization-script')) return content;

        const script = `
    <script id="image-optimization-script">
    // Image Optimization: srcset auto-generation
    document.addEventListener('DOMContentLoaded', () => {
        const images = document.querySelectorAll('img[src]:not([srcset])');

        images.forEach(img => {
            const src = img.src;
            if (src.includes('.jpg') || src.includes('.png')) {
                const baseSrc = src.replace(/\\.(jpg|png)$/, '');
                const ext = src.match(/\\.(jpg|png)$/)[0];

                img.srcset = \`
                    \${baseSrc}-small\${ext} 400w,
                    \${baseSrc}-medium\${ext} 800w,
                    \${baseSrc}-large\${ext} 1200w
                \`;
                img.sizes = '(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px';
            }
        });
    });
    </script>`;

        const pos = content.indexOf('</body>');
        if (pos !== -1) {
            stats.improvements++;
            this.stats.improvements.imageOptimization++;
            return content.slice(0, pos) + script + content.slice(pos);
        }
        return content;
    }

    addChatWidgetReady(content, stats) {
        if (content.includes('chat-widget-placeholder')) return content;

        const html = `
    <!-- Chat Widget Placeholder -->
    <div id="chat-widget-placeholder" class="chat-widget-btn" onclick="openChat()">
        💬
        <span class="chat-badge">1</span>
    </div>`;

        const script = `
    <script>
    function openChat() {
        showNotification('Chat widget: Installez votre solution de chat préférée', 'info');
        // Integration: Intercom, Crisp, Tawk.to, etc.
    }
    </script>`;

        const css = `
        .chat-widget-btn {
            position: fixed;
            bottom: 6rem;
            right: 2rem;
            width: 60px;
            height: 60px;
            background: var(--primary, #007bff);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: transform 0.3s;
            z-index: 9996;
        }

        .chat-widget-btn:hover {
            transform: scale(1.1);
        }

        .chat-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #dc3545;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: bold;
        }
`;

        let modified = content;
        const stylePos = modified.lastIndexOf('</style>');
        if (stylePos !== -1) {
            modified = modified.slice(0, stylePos) + css + modified.slice(stylePos);
        }

        const bodyPos = modified.indexOf('</body>');
        if (bodyPos !== -1) {
            modified = modified.slice(0, bodyPos) + html + script + modified.slice(bodyPos);
            stats.improvements++;
            this.stats.improvements.chatWidget++;
        }

        return modified;
    }

    addNewsletterInline(content, stats) {
        if (content.includes('newsletter-inline-section')) return content;

        const html = `
    <!-- Inline Newsletter -->
    <section class="newsletter-inline-section">
        <div class="newsletter-inline-content">
            <h3>📬 Restez informé</h3>
            <p>Recevez nos dernières actualités et offres exclusives</p>
            <form class="newsletter-inline-form" onsubmit="handleNewsletter(event)">
                <input type="email" placeholder="Votre email" required>
                <button type="submit">S'abonner</button>
            </form>
        </div>
    </section>`;

        const script = `
    <script>
    function handleNewsletter(e) {
        e.preventDefault();
        showNotification('Merci ! Vous êtes inscrit à notre newsletter', 'success');
        e.target.reset();
    }
    </script>`;

        const css = `
        .newsletter-inline-section {
            background: linear-gradient(135deg, var(--primary, #007bff), var(--secondary, #6610f2));
            color: white;
            padding: 4rem 2rem;
            margin: 4rem 0;
        }

        .newsletter-inline-content {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
        }

        .newsletter-inline-content h3 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .newsletter-inline-form {
            display: flex;
            gap: 0.5rem;
            margin-top: 2rem;
        }

        .newsletter-inline-form input {
            flex: 1;
            padding: 1rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
        }

        .newsletter-inline-form button {
            padding: 1rem 2rem;
            background: white;
            color: var(--primary, #007bff);
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .newsletter-inline-form button:hover {
            transform: scale(1.05);
        }
`;

        let modified = content;
        const stylePos = modified.lastIndexOf('</style>');
        if (stylePos !== -1) {
            modified = modified.slice(0, stylePos) + css + modified.slice(stylePos);
        }

        // Insert before closing body
        const bodyPos = modified.lastIndexOf('</body>');
        if (bodyPos !== -1) {
            modified = modified.slice(0, bodyPos) + html + script + modified.slice(bodyPos);
            stats.improvements++;
            this.stats.improvements.newsletterInline++;
        }

        return modified;
    }

    addParallaxEffects(content, stats) {
        if (content.includes('parallax-effect-script')) return content;

        const script = `
    <script id="parallax-effect-script">
    // Parallax Scroll Effects
    document.addEventListener('DOMContentLoaded', () => {
        const parallaxElements = document.querySelectorAll('[data-parallax]');

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(el => {
                const speed = el.dataset.parallax || 0.5;
                const offset = scrolled * speed;
                el.style.transform = \`translateY(\${offset}px)\`;
            });
        });
    });
    </script>`;

        const pos = content.indexOf('</body>');
        if (pos !== -1) {
            stats.improvements++;
            this.stats.improvements.parallaxEffects++;
            return content.slice(0, pos) + script + content.slice(pos);
        }
        return content;
    }

    addCountdownTimer(content, stats) {
        if (content.includes('countdown-timer-widget')) return content;

        const html = `
    <!-- Countdown Timer -->
    <div class="countdown-timer-widget" style="display: none;">
        <div class="countdown-content">
            <p>🔥 Offre limitée !</p>
            <div class="countdown-display">
                <div class="countdown-block">
                    <span class="countdown-value" id="cd-days">00</span>
                    <span class="countdown-label">Jours</span>
                </div>
                <div class="countdown-block">
                    <span class="countdown-value" id="cd-hours">00</span>
                    <span class="countdown-label">Heures</span>
                </div>
                <div class="countdown-block">
                    <span class="countdown-value" id="cd-mins">00</span>
                    <span class="countdown-label">Min</span>
                </div>
                <div class="countdown-block">
                    <span class="countdown-value" id="cd-secs">00</span>
                    <span class="countdown-label">Sec</span>
                </div>
            </div>
        </div>
    </div>`;

        const script = `
    <script>
    function initCountdown(endDate) {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endDate - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
            document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('cd-mins').textContent = String(minutes).padStart(2, '0');
            document.getElementById('cd-secs').textContent = String(seconds).padStart(2, '0');
        }, 1000);
    }

    // Example: countdown to 7 days from now
    // const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // initCountdown(futureDate);
    </script>`;

        const css = `
        .countdown-timer-widget {
            background: linear-gradient(135deg, #ff6b6b, #ff8787);
            color: white;
            padding: 2rem;
            text-align: center;
            margin: 2rem 0;
        }

        .countdown-display {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1rem;
        }

        .countdown-block {
            background: rgba(255,255,255,0.2);
            padding: 1rem;
            border-radius: 12px;
            min-width: 80px;
        }

        .countdown-value {
            display: block;
            font-size: 2rem;
            font-weight: bold;
        }

        .countdown-label {
            display: block;
            font-size: 0.75rem;
            opacity: 0.9;
            margin-top: 0.25rem;
        }
`;

        let modified = content;
        const stylePos = modified.lastIndexOf('</style>');
        if (stylePos !== -1) {
            modified = modified.slice(0, stylePos) + css + modified.slice(stylePos);
        }

        const bodyPos = modified.indexOf('</body>');
        if (bodyPos !== -1) {
            modified = modified.slice(0, bodyPos) + html + script + modified.slice(bodyPos);
            stats.improvements++;
            this.stats.improvements.countdownTimers++;
        }

        return modified;
    }

    addShareButtons(content, stats) {
        if (content.includes('social-share-buttons')) return content;

        const html = `
    <!-- Social Share Buttons -->
    <div class="social-share-buttons">
        <button class="share-btn share-facebook" onclick="shareOn('facebook')">
            📘 Facebook
        </button>
        <button class="share-btn share-twitter" onclick="shareOn('twitter')">
            🐦 Twitter
        </button>
        <button class="share-btn share-linkedin" onclick="shareOn('linkedin')">
            💼 LinkedIn
        </button>
        <button class="share-btn share-copy" onclick="copyLink()">
            🔗 Copier
        </button>
    </div>`;

        const script = `
    <script>
    function shareOn(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);

        const urls = {
            facebook: \`https://www.facebook.com/sharer/sharer.php?u=\${url}\`,
            twitter: \`https://twitter.com/intent/tweet?url=\${url}&text=\${title}\`,
            linkedin: \`https://www.linkedin.com/sharing/share-offsite/?url=\${url}\`
        };

        if (urls[platform]) {
            window.open(urls[platform], '_blank', 'width=600,height=400');
        }
    }

    function copyLink() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Lien copié !', 'success');
        });
    }
    </script>`;

        const css = `
        .social-share-buttons {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            margin: 2rem 0;
        }

        .share-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: transform 0.2s;
        }

        .share-btn:hover {
            transform: translateY(-2px);
        }

        .share-facebook {
            background: #1877f2;
            color: white;
        }

        .share-twitter {
            background: #1da1f2;
            color: white;
        }

        .share-linkedin {
            background: #0077b5;
            color: white;
        }

        .share-copy {
            background: #6c757d;
            color: white;
        }
`;

        let modified = content;
        const stylePos = modified.lastIndexOf('</style>');
        if (stylePos !== -1) {
            modified = modified.slice(0, stylePos) + css + modified.slice(stylePos);
        }

        const bodyPos = modified.indexOf('</body>');
        if (bodyPos !== -1) {
            modified = modified.slice(0, bodyPos) + html + script + modified.slice(bodyPos);
            stats.improvements++;
            this.stats.improvements.shareButtons++;
        }

        return modified;
    }

    addBackToTop(content, stats) {
        if (content.includes('back-to-top-btn')) return content;

        const html = `
    <!-- Back to Top Button -->
    <button id="back-to-top-btn" class="back-to-top" onclick="scrollToTop()" style="display: none;">
        ↑
    </button>`;

        const script = `
    <script>
    window.addEventListener('scroll', () => {
        const btn = document.getElementById('back-to-top-btn');
        if (window.scrollY > 300) {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 'none';
        }
    });

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    </script>`;

        const css = `
        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: var(--primary, #007bff);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: transform 0.3s;
            z-index: 9995;
        }

        .back-to-top:hover {
            transform: translateY(-5px);
        }
`;

        let modified = content;
        const stylePos = modified.lastIndexOf('</style>');
        if (stylePos !== -1) {
            modified = modified.slice(0, stylePos) + css + modified.slice(stylePos);
        }

        const bodyPos = modified.indexOf('</body>');
        if (bodyPos !== -1) {
            modified = modified.slice(0, bodyPos) + html + script + modified.slice(bodyPos);
            stats.improvements++;
            this.stats.improvements.backToTop++;
        }

        return modified;
    }

    addReadingProgress(content, stats) {
        if (content.includes('reading-progress-bar')) return content;

        const html = `
    <!-- Reading Progress Bar -->
    <div id="reading-progress-bar" class="reading-progress"></div>`;

        const script = `
    <script>
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('reading-progress-bar').style.width = scrolled + '%';
    });
    </script>`;

        const css = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 4px;
            background: var(--primary, #007bff);
            z-index: 10000;
            transition: width 0.1s ease;
        }
`;

        let modified = content;
        const stylePos = modified.lastIndexOf('</style>');
        if (stylePos !== -1) {
            modified = modified.slice(0, stylePos) + css + modified.slice(stylePos);
        }

        const bodyOpenPos = modified.indexOf('<body');
        if (bodyOpenPos !== -1) {
            const bodyContentStart = modified.indexOf('>', bodyOpenPos) + 1;
            modified = modified.slice(0, bodyContentStart) + '\n' + html + script + '\n' + modified.slice(bodyContentStart);
            stats.improvements++;
            this.stats.improvements.readingProgress++;
        }

        return modified;
    }

    displaySummary() {
        const total = Object.values(this.stats.improvements).reduce((a,b) => a+b, 0);
        console.log(`\n✅ Session 4 terminée: ${total} améliorations sur ${this.stats.processed} layouts\n`);
        Object.entries(this.stats.improvements).forEach(([key, value]) => {
            if (value > 0) console.log(`  • ${key}: ${value}`);
        });
    }
}

new Session4Enhancer().run();
