/**
 * SESSION 5: AMÉLIORATIONS ULTRA-AVANCÉES V2
 */

const fs = require('fs');
const path = require('path');

class Session5Enhancer {
    constructor() {
        this.stats = {
            total: 0,
            processed: 0,
            improvements: {
                imageGalleryLightbox: 0,
                tabsAccordions: 0,
                stickyHeader: 0,
                lazyBackgrounds: 0,
                audioVideoPlaylists: 0,
                testimonialSlider: 0,
                pricingToggle: 0,
                faqToggle: 0,
                searchBar: 0,
                filterSort: 0,
                infiniteScroll: 0,
                viewCounter: 0,
                ratingStars: 0,
                progressSteps: 0,
                tooltipsPopovers: 0
            }
        };
        this.layoutsDir = path.join(__dirname, 'templates', 'layouts');
        this.backupDir = path.join(__dirname, '.layouts-backup-session5');
    }

    async run() {
        console.log('🚀 SESSION 5: AMÉLIORATIONS ULTRA-AVANCÉES V2\n');
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

            content = this.addImageGalleryLightbox(content, fileStats);
            content = this.addTabsAccordions(content, fileStats);
            content = this.addStickyHeader(content, fileStats);
            content = this.addLazyBackgrounds(content, fileStats);
            content = this.addAudioVideoPlaylists(content, fileStats);
            content = this.addTestimonialSlider(content, fileStats);
            content = this.addPricingToggle(content, fileStats);
            content = this.addFAQToggle(content, fileStats);
            content = this.addSearchBar(content, fileStats);
            content = this.addFilterSort(content, fileStats);
            content = this.addInfiniteScroll(content, fileStats);
            content = this.addViewCounter(content, fileStats);
            content = this.addRatingStars(content, fileStats);
            content = this.addProgressSteps(content, fileStats);
            content = this.addTooltipsPopovers(content, fileStats);

            if (content !== original) {
                fs.writeFileSync(filePath, content, 'utf-8');
                this.stats.processed++;
            }

            console.log(`✅ ${filename} - ${fileStats.improvements} améliorations`);
        } catch (error) {
            console.error(`❌ ${filename} - ${error.message}`);
        }
    }

    addImageGalleryLightbox(content, stats) {
        if (content.includes('lightbox-modal')) return content;

        const html = `
    <!-- Lightbox Modal -->
    <div id="lightbox-modal" class="lightbox-modal" onclick="closeLightbox()">
        <span class="lightbox-close">&times;</span>
        <img class="lightbox-content" id="lightbox-img">
        <div class="lightbox-caption" id="lightbox-caption"></div>
        <button class="lightbox-prev" onclick="event.stopPropagation(); changeLightboxImage(-1)">❮</button>
        <button class="lightbox-next" onclick="event.stopPropagation(); changeLightboxImage(1)">❯</button>
    </div>`;

        const script = `
    <script>
    let lightboxImages = [];
    let currentLightboxIndex = 0;

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('img[data-lightbox]').forEach((img, index) => {
            lightboxImages.push(img);
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => openLightbox(index));
        });
    });

    function openLightbox(index) {
        currentLightboxIndex = index;
        const modal = document.getElementById('lightbox-modal');
        const img = document.getElementById('lightbox-img');
        const caption = document.getElementById('lightbox-caption');

        img.src = lightboxImages[index].src;
        caption.textContent = lightboxImages[index].alt || '';
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        document.getElementById('lightbox-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function changeLightboxImage(direction) {
        currentLightboxIndex += direction;
        if (currentLightboxIndex < 0) currentLightboxIndex = lightboxImages.length - 1;
        if (currentLightboxIndex >= lightboxImages.length) currentLightboxIndex = 0;

        const img = document.getElementById('lightbox-img');
        const caption = document.getElementById('lightbox-caption');
        img.src = lightboxImages[currentLightboxIndex].src;
        caption.textContent = lightboxImages[currentLightboxIndex].alt || '';
    }

    document.addEventListener('keydown', (e) => {
        if (document.getElementById('lightbox-modal').style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') changeLightboxImage(-1);
            if (e.key === 'ArrowRight') changeLightboxImage(1);
        }
    });
    </script>`;

        const css = `
        .lightbox-modal {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.95);
            z-index: 10002;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s;
        }

        .lightbox-content {
            max-width: 90%;
            max-height: 90vh;
            object-fit: contain;
            animation: zoomIn 0.3s;
        }

        .lightbox-close {
            position: absolute;
            top: 2rem;
            right: 2rem;
            color: white;
            font-size: 3rem;
            cursor: pointer;
            z-index: 10003;
        }

        .lightbox-prev, .lightbox-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            font-size: 2rem;
            padding: 1rem;
            cursor: pointer;
            z-index: 10003;
            transition: background 0.3s;
        }

        .lightbox-prev:hover, .lightbox-next:hover {
            background: rgba(255,255,255,0.4);
        }

        .lightbox-prev { left: 2rem; }
        .lightbox-next { right: 2rem; }

        .lightbox-caption {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            background: rgba(0,0,0,0.7);
            padding: 1rem 2rem;
            border-radius: 8px;
        }

        @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
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
            this.stats.improvements.imageGalleryLightbox++;
        }

        return modified;
    }

    addTabsAccordions(content, stats) {
        if (content.includes('tabs-accordion-system')) return content;

        const html = `
    <!-- Tabs System Example -->
    <div class="tabs-container" style="display: none;">
        <div class="tabs-header">
            <button class="tab-btn active" onclick="switchTab(event, 'tab1')">Tab 1</button>
            <button class="tab-btn" onclick="switchTab(event, 'tab2')">Tab 2</button>
            <button class="tab-btn" onclick="switchTab(event, 'tab3')">Tab 3</button>
        </div>
        <div class="tabs-content">
            <div id="tab1" class="tab-panel active">Content 1</div>
            <div id="tab2" class="tab-panel">Content 2</div>
            <div id="tab3" class="tab-panel">Content 3</div>
        </div>
    </div>`;

        const script = `
    <script id="tabs-accordion-system">
    function switchTab(event, tabId) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

        event.target.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }

    // Accordion toggle
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const wasActive = item.classList.contains('active');

                document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

                if (!wasActive) {
                    item.classList.add('active');
                }
            });
        });
    });
    </script>`;

        const css = `
        .tabs-header {
            display: flex;
            gap: 0.5rem;
            border-bottom: 2px solid #ddd;
        }

        .tab-btn {
            padding: 1rem 2rem;
            border: none;
            background: none;
            cursor: pointer;
            position: relative;
            transition: all 0.3s;
        }

        .tab-btn.active {
            color: var(--primary, #007bff);
        }

        .tab-btn.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--primary, #007bff);
        }

        .tab-panel {
            display: none;
            padding: 2rem;
            animation: fadeIn 0.3s;
        }

        .tab-panel.active {
            display: block;
        }

        .accordion-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            overflow: hidden;
        }

        .accordion-header {
            padding: 1rem;
            background: #f8f9fa;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background 0.3s;
        }

        .accordion-header:hover {
            background: #e9ecef;
        }

        .accordion-header::after {
            content: '+';
            font-size: 1.5rem;
            transition: transform 0.3s;
        }

        .accordion-item.active .accordion-header::after {
            transform: rotate(45deg);
        }

        .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }

        .accordion-item.active .accordion-content {
            max-height: 500px;
            padding: 1rem;
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
            this.stats.improvements.tabsAccordions++;
        }

        return modified;
    }

    addStickyHeader(content, stats) {
        if (content.includes('sticky-header-script')) return content;

        const script = `
    <script id="sticky-header-script">
    let lastScroll = 0;
    const header = document.querySelector('header, nav');

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('sticky-active');

                if (currentScroll > lastScroll) {
                    header.classList.add('sticky-hidden');
                } else {
                    header.classList.remove('sticky-hidden');
                }
            } else {
                header.classList.remove('sticky-active', 'sticky-hidden');
            }

            lastScroll = currentScroll;
        });
    }
    </script>`;

        const css = `
        header.sticky-active, nav.sticky-active {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(255,255,255,0.98);
            box-shadow: 0 2px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            animation: slideDown 0.3s;
        }

        header.sticky-hidden, nav.sticky-hidden {
            transform: translateY(-100%);
        }

        @keyframes slideDown {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
        }
`;

        let modified = content;
        const stylePos = modified.lastIndexOf('</style>');
        if (stylePos !== -1) {
            modified = modified.slice(0, stylePos) + css + modified.slice(stylePos);
        }

        const bodyPos = modified.indexOf('</body>');
        if (bodyPos !== -1) {
            modified = modified.slice(0, bodyPos) + script + modified.slice(bodyPos);
            stats.improvements++;
            this.stats.improvements.stickyHeader++;
        }

        return modified;
    }

    addLazyBackgrounds(content, stats) {
        if (content.includes('lazy-background-script')) return content;

        const script = `
    <script id="lazy-background-script">
    document.addEventListener('DOMContentLoaded', () => {
        const lazyBgs = document.querySelectorAll('[data-bg]');

        if ('IntersectionObserver' in window) {
            const bgObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        el.style.backgroundImage = \`url(\${el.dataset.bg})\`;
                        el.removeAttribute('data-bg');
                        bgObserver.unobserve(el);
                    }
                });
            }, { rootMargin: '50px' });

            lazyBgs.forEach(bg => bgObserver.observe(bg));
        }
    });
    </script>`;

        const pos = content.indexOf('</body>');
        if (pos !== -1) {
            stats.improvements++;
            this.stats.improvements.lazyBackgrounds++;
            return content.slice(0, pos) + script + content.slice(pos);
        }
        return content;
    }

    addAudioVideoPlaylists(content, stats) {
        if (content.includes('playlist-system')) return content;

        const html = `
    <!-- Media Playlist System -->
    <div class="media-playlist" style="display: none;">
        <div class="playlist-player">
            <video id="playlist-video" controls></video>
        </div>
        <div class="playlist-items">
            <div class="playlist-item" data-src="video1.mp4">Video 1</div>
            <div class="playlist-item" data-src="video2.mp4">Video 2</div>
        </div>
    </div>`;

        const script = `
    <script id="playlist-system">
    document.addEventListener('DOMContentLoaded', () => {
        const video = document.getElementById('playlist-video');
        const items = document.querySelectorAll('.playlist-item');

        items.forEach(item => {
            item.addEventListener('click', () => {
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                video.src = item.dataset.src;
                video.play();
            });
        });

        if (video) {
            video.addEventListener('ended', () => {
                const current = document.querySelector('.playlist-item.active');
                const next = current?.nextElementSibling;
                if (next) next.click();
            });
        }
    });
    </script>`;

        const css = `
        .playlist-items {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .playlist-item {
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .playlist-item:hover {
            background: #e9ecef;
        }

        .playlist-item.active {
            background: var(--primary, #007bff);
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
            this.stats.improvements.audioVideoPlaylists++;
        }

        return modified;
    }

    addTestimonialSlider(content, stats) {
        if (content.includes('testimonial-slider-system')) return content;

        const html = `
    <!-- Testimonial Slider -->
    <div class="testimonial-slider" style="display: none;">
        <div class="testimonial-track" id="testimonial-track">
            <div class="testimonial-slide">
                <p>"Amazing service!"</p>
                <span>- Client 1</span>
            </div>
            <div class="testimonial-slide">
                <p>"Highly recommended!"</p>
                <span>- Client 2</span>
            </div>
        </div>
        <div class="testimonial-dots" id="testimonial-dots"></div>
    </div>`;

        const script = `
    <script id="testimonial-slider-system">
    let currentTestimonial = 0;

    function initTestimonialSlider() {
        const track = document.getElementById('testimonial-track');
        const dots = document.getElementById('testimonial-dots');
        if (!track) return;

        const slides = track.children;

        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('span');
            dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
            dot.onclick = () => goToTestimonial(i);
            dots.appendChild(dot);
        }

        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % slides.length;
            updateTestimonialSlider();
        }, 5000);
    }

    function goToTestimonial(index) {
        currentTestimonial = index;
        updateTestimonialSlider();
    }

    function updateTestimonialSlider() {
        const track = document.getElementById('testimonial-track');
        const dots = document.querySelectorAll('.testimonial-dot');

        track.style.transform = \`translateX(-\${currentTestimonial * 100}%)\`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentTestimonial);
        });
    }

    document.addEventListener('DOMContentLoaded', initTestimonialSlider);
    </script>`;

        const css = `
        .testimonial-slider {
            overflow: hidden;
            position: relative;
        }

        .testimonial-track {
            display: flex;
            transition: transform 0.5s ease;
        }

        .testimonial-slide {
            min-width: 100%;
            padding: 3rem;
            text-align: center;
        }

        .testimonial-dots {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1rem;
        }

        .testimonial-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ddd;
            cursor: pointer;
            transition: all 0.3s;
        }

        .testimonial-dot.active {
            background: var(--primary, #007bff);
            transform: scale(1.2);
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
            this.stats.improvements.testimonialSlider++;
        }

        return modified;
    }

    addPricingToggle(content, stats) {
        if (content.includes('pricing-toggle-script')) return content;

        const html = `
    <!-- Pricing Toggle -->
    <div class="pricing-toggle" style="display: none;">
        <button class="toggle-btn active" onclick="togglePricing('monthly')">Mensuel</button>
        <button class="toggle-btn" onclick="togglePricing('yearly')">Annuel <span class="badge">-20%</span></button>
    </div>`;

        const script = `
    <script id="pricing-toggle-script">
    function togglePricing(period) {
        document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
        event.target.closest('.toggle-btn').classList.add('active');

        document.querySelectorAll('[data-monthly]').forEach(el => {
            el.textContent = period === 'monthly' ? el.dataset.monthly : el.dataset.yearly;
        });
    }
    </script>`;

        const css = `
        .pricing-toggle {
            display: flex;
            gap: 0.5rem;
            justify-content: center;
            margin: 2rem 0;
        }

        .toggle-btn {
            padding: 0.75rem 2rem;
            border: 2px solid var(--primary, #007bff);
            background: white;
            color: var(--primary, #007bff);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .toggle-btn.active {
            background: var(--primary, #007bff);
            color: white;
        }

        .toggle-btn .badge {
            background: #28a745;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            margin-left: 0.5rem;
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
            this.stats.improvements.pricingToggle++;
        }

        return modified;
    }

    addFAQToggle(content, stats) {
        if (content.includes('faq-toggle-script')) return content;

        const script = `
    <script id="faq-toggle-script">
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faq = question.parentElement;
                const wasActive = faq.classList.contains('active');

                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });

                if (!wasActive) {
                    faq.classList.add('active');
                }
            });
        });
    });
    </script>`;

        const css = `
        .faq-item {
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 1rem;
            overflow: hidden;
        }

        .faq-question {
            padding: 1.5rem;
            background: #f8f9fa;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            transition: background 0.3s;
        }

        .faq-question:hover {
            background: #e9ecef;
        }

        .faq-question::after {
            content: '+';
            font-size: 1.5rem;
            transition: transform 0.3s;
        }

        .faq-item.active .faq-question::after {
            transform: rotate(45deg);
        }

        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
        }

        .faq-item.active .faq-answer {
            max-height: 500px;
            padding: 1.5rem;
        }
`;

        let modified = content;
        const stylePos = modified.lastIndexOf('</style>');
        if (stylePos !== -1) {
            modified = modified.slice(0, stylePos) + css + modified.slice(stylePos);
        }

        const bodyPos = modified.indexOf('</body>');
        if (bodyPos !== -1) {
            modified = modified.slice(0, bodyPos) + script + modified.slice(bodyPos);
            stats.improvements++;
            this.stats.improvements.faqToggle++;
        }

        return modified;
    }

    addSearchBar(content, stats) {
        if (content.includes('search-bar-system')) return content;

        const html = `
    <!-- Search Bar -->
    <div class="search-bar" style="display: none;">
        <input type="search" id="site-search" placeholder="Rechercher..." oninput="performSearch(this.value)">
        <div id="search-results" class="search-results"></div>
    </div>`;

        const script = `
    <script id="search-bar-system">
    let searchTimeout;

    function performSearch(query) {
        clearTimeout(searchTimeout);
        const results = document.getElementById('search-results');

        if (query.length < 2) {
            results.style.display = 'none';
            return;
        }

        searchTimeout = setTimeout(() => {
            results.innerHTML = '<div class="search-result">Recherche en cours...</div>';
            results.style.display = 'block';

            // Simuler recherche
            setTimeout(() => {
                results.innerHTML = \`
                    <div class="search-result">Résultat 1 pour "\${query}"</div>
                    <div class="search-result">Résultat 2 pour "\${query}"</div>
                \`;
            }, 500);
        }, 300);
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) {
            document.getElementById('search-results').style.display = 'none';
        }
    });
    </script>`;

        const css = `
        .search-bar {
            position: relative;
            max-width: 600px;
            margin: 0 auto;
        }

        .search-bar input {
            width: 100%;
            padding: 1rem 1.5rem;
            border: 2px solid #ddd;
            border-radius: 50px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        .search-bar input:focus {
            outline: none;
            border-color: var(--primary, #007bff);
        }

        .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-top: 0.5rem;
            max-height: 300px;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            display: none;
            z-index: 100;
        }

        .search-result {
            padding: 1rem;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            transition: background 0.3s;
        }

        .search-result:hover {
            background: #f8f9fa;
        }

        .search-result:last-child {
            border-bottom: none;
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
            this.stats.improvements.searchBar++;
        }

        return modified;
    }

    addFilterSort(content, stats) {
        if (content.includes('filter-sort-system')) return content;

        const script = `
    <script id="filter-sort-system">
    function filterItems(category) {
        const items = document.querySelectorAll('[data-category]');

        items.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.3s';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function sortItems(criteria) {
        const container = document.querySelector('[data-sortable]');
        if (!container) return;

        const items = Array.from(container.children);

        items.sort((a, b) => {
            const aVal = a.dataset[criteria];
            const bVal = b.dataset[criteria];
            return aVal > bVal ? 1 : -1;
        });

        items.forEach(item => container.appendChild(item));
    }
    </script>`;

        const bodyPos = content.indexOf('</body>');
        if (bodyPos !== -1) {
            stats.improvements++;
            this.stats.improvements.filterSort++;
            return content.slice(0, bodyPos) + script + content.slice(bodyPos);
        }
        return content;
    }

    addInfiniteScroll(content, stats) {
        if (content.includes('infinite-scroll-system')) return content;

        const script = `
    <script id="infinite-scroll-system">
    let page = 1;
    let loading = false;

    function initInfiniteScroll() {
        window.addEventListener('scroll', () => {
            if (loading) return;

            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;

            if (scrollPosition >= pageHeight - 200) {
                loadMoreContent();
            }
        });
    }

    function loadMoreContent() {
        loading = true;
        page++;

        // Simuler chargement
        const loader = document.createElement('div');
        loader.className = 'infinite-loader';
        loader.textContent = 'Chargement...';
        document.querySelector('[data-infinite-container]')?.appendChild(loader);

        setTimeout(() => {
            loader.remove();
            loading = false;
        }, 1000);
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('[data-infinite-scroll]')) {
            initInfiniteScroll();
        }
    });
    </script>`;

        const css = `
        .infinite-loader {
            text-align: center;
            padding: 2rem;
            color: #999;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
`;

        let modified = content;
        const stylePos = modified.lastIndexOf('</style>');
        if (stylePos !== -1) {
            modified = modified.slice(0, stylePos) + css + modified.slice(stylePos);
        }

        const bodyPos = modified.indexOf('</body>');
        if (bodyPos !== -1) {
            modified = modified.slice(0, bodyPos) + script + modified.slice(bodyPos);
            stats.improvements++;
            this.stats.improvements.infiniteScroll++;
        }

        return modified;
    }

    addViewCounter(content, stats) {
        if (content.includes('view-counter-system')) return content;

        const script = `
    <script id="view-counter-system">
    function incrementViewCount() {
        const pageKey = 'views_' + window.location.pathname;
        let views = parseInt(localStorage.getItem(pageKey) || '0');
        views++;
        localStorage.setItem(pageKey, views);

        const counter = document.getElementById('view-counter');
        if (counter) {
            counter.textContent = views.toLocaleString();
        }
    }

    document.addEventListener('DOMContentLoaded', incrementViewCount);
    </script>`;

        const html = `
    <div id="view-counter-display" style="display: none;">
        👁️ <span id="view-counter">0</span> vues
    </div>`;

        let modified = content;
        const bodyPos = modified.indexOf('</body>');
        if (bodyPos !== -1) {
            modified = modified.slice(0, bodyPos) + html + script + modified.slice(bodyPos);
            stats.improvements++;
            this.stats.improvements.viewCounter++;
        }

        return modified;
    }

    addRatingStars(content, stats) {
        if (content.includes('rating-stars-system')) return content;

        const html = `
    <!-- Rating Stars -->
    <div class="rating-stars" style="display: none;">
        <span class="star" data-rating="1" onclick="rate(1)">★</span>
        <span class="star" data-rating="2" onclick="rate(2)">★</span>
        <span class="star" data-rating="3" onclick="rate(3)">★</span>
        <span class="star" data-rating="4" onclick="rate(4)">★</span>
        <span class="star" data-rating="5" onclick="rate(5)">★</span>
    </div>`;

        const script = `
    <script id="rating-stars-system">
    function rate(rating) {
        document.querySelectorAll('.star').forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });
        showNotification(\`Vous avez donné \${rating} étoile\${rating > 1 ? 's' : ''}\`, 'success');
    }

    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('mouseenter', () => {
            const rating = star.dataset.rating;
            document.querySelectorAll('.star').forEach((s, i) => {
                s.classList.toggle('hover', i < rating);
            });
        });
    });

    document.querySelector('.rating-stars')?.addEventListener('mouseleave', () => {
        document.querySelectorAll('.star').forEach(s => s.classList.remove('hover'));
    });
    </script>`;

        const css = `
        .rating-stars {
            display: flex;
            gap: 0.25rem;
            font-size: 2rem;
        }

        .star {
            color: #ddd;
            cursor: pointer;
            transition: all 0.2s;
        }

        .star.active, .star.hover {
            color: #ffc107;
        }

        .star:hover {
            transform: scale(1.2);
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
            this.stats.improvements.ratingStars++;
        }

        return modified;
    }

    addProgressSteps(content, stats) {
        if (content.includes('progress-steps-system')) return content;

        const html = `
    <!-- Progress Steps -->
    <div class="progress-steps" style="display: none;">
        <div class="step active">
            <div class="step-number">1</div>
            <div class="step-label">Étape 1</div>
        </div>
        <div class="step">
            <div class="step-number">2</div>
            <div class="step-label">Étape 2</div>
        </div>
        <div class="step">
            <div class="step-number">3</div>
            <div class="step-label">Étape 3</div>
        </div>
    </div>`;

        const script = `
    <script id="progress-steps-system">
    function goToStep(stepNumber) {
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.toggle('active', index < stepNumber);
            step.classList.toggle('current', index === stepNumber - 1);
        });
    }
    </script>`;

        const css = `
        .progress-steps {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            margin: 2rem 0;
        }

        .progress-steps::before {
            content: '';
            position: absolute;
            top: 20px;
            left: 0;
            right: 0;
            height: 2px;
            background: #ddd;
            z-index: -1;
        }

        .step {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            background: white;
            padding: 0 1rem;
        }

        .step-number {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            transition: all 0.3s;
        }

        .step.active .step-number {
            background: var(--primary, #007bff);
            color: white;
        }

        .step.current .step-number {
            transform: scale(1.2);
            box-shadow: 0 0 0 4px rgba(var(--primary-rgb, 0, 123, 255), 0.2);
        }

        .step-label {
            font-size: 0.875rem;
            color: #999;
        }

        .step.active .step-label {
            color: var(--primary, #007bff);
            font-weight: 600;
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
            this.stats.improvements.progressSteps++;
        }

        return modified;
    }

    addTooltipsPopovers(content, stats) {
        if (content.includes('tooltips-popovers-system')) return content;

        const script = `
    <script id="tooltips-popovers-system">
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-tooltip]').forEach(el => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip-popup';
            tooltip.textContent = el.dataset.tooltip;
            el.appendChild(tooltip);

            el.addEventListener('mouseenter', () => {
                tooltip.classList.add('show');
            });

            el.addEventListener('mouseleave', () => {
                tooltip.classList.remove('show');
            });
        });

        document.querySelectorAll('[data-popover]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();

                document.querySelectorAll('.popover-popup').forEach(p => p.classList.remove('show'));

                let popover = el.querySelector('.popover-popup');
                if (!popover) {
                    popover = document.createElement('div');
                    popover.className = 'popover-popup';
                    popover.innerHTML = el.dataset.popover;
                    el.appendChild(popover);
                }

                popover.classList.toggle('show');
            });
        });

        document.addEventListener('click', () => {
            document.querySelectorAll('.popover-popup').forEach(p => p.classList.remove('show'));
        });
    });
    </script>`;

        const css = `
        [data-tooltip], [data-popover] {
            position: relative;
        }

        .tooltip-popup, .popover-popup {
            position: absolute;
            bottom: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s;
            z-index: 1000;
        }

        .tooltip-popup::after, .popover-popup::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 6px solid transparent;
            border-top-color: rgba(0,0,0,0.9);
        }

        .tooltip-popup.show, .popover-popup.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
            pointer-events: auto;
        }

        .popover-popup {
            white-space: normal;
            max-width: 300px;
        }

        .popover-popup.show {
            pointer-events: auto;
        }
`;

        let modified = content;
        const stylePos = modified.lastIndexOf('</style>');
        if (stylePos !== -1) {
            modified = modified.slice(0, stylePos) + css + modified.slice(stylePos);
        }

        const bodyPos = modified.indexOf('</body>');
        if (bodyPos !== -1) {
            modified = modified.slice(0, bodyPos) + script + modified.slice(bodyPos);
            stats.improvements++;
            this.stats.improvements.tooltipsPopovers++;
        }

        return modified;
    }

    displaySummary() {
        const total = Object.values(this.stats.improvements).reduce((a,b) => a+b, 0);
        console.log(`\n✅ Session 5 terminée: ${total} améliorations sur ${this.stats.processed} layouts\n`);
    }
}

new Session5Enhancer().run();
