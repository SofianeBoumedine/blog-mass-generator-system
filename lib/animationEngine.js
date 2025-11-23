/**
 * Moteur d'animations optimisé
 * Génère et gère les animations CSS avec performance et accessibilité
 */

class AnimationEngine {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.performanceMode = this.detectPerformanceMode();
        this.prefersReducedMotion = this.checkReducedMotion();

        this.defaultEasing = {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
            smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        };

        this.init();
    }

    /**
     * Initialise le moteur d'animations
     */
    init() {
        this.createGlobalStyles();
        this.setupIntersectionObserver();
        this.setupResizeObserver();
        this.bindEvents();
    }

    /**
     * Détecte le mode de performance
     */
    detectPerformanceMode() {
        if (typeof navigator === 'undefined') return 'high';

        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        if (connection) {
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                return 'low';
            }
            if (connection.effectiveType === '3g') {
                return 'medium';
            }
        }

        // Test de performance basique
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        const deviceMemory = navigator.deviceMemory || 4;

        if (hardwareConcurrency < 4 || deviceMemory < 4) {
            return 'medium';
        }

        return 'high';
    }

    /**
     * Vérifie la préférence reduced motion
     */
    checkReducedMotion() {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Crée les styles globaux pour les animations
     */
    createGlobalStyles() {
        const styleId = 'animation-engine-styles';

        if (typeof document === 'undefined' || document.getElementById(styleId)) {
            return;
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = this.generateAnimationCSS();
        document.head.appendChild(style);
    }

    /**
     * Génère le CSS complet pour les animations
     */
    generateAnimationCSS() {
        const reducedMotion = this.prefersReducedMotion;
        const performance = this.performanceMode;

        let css = `
/* === MOTEUR D'ANIMATIONS OPTIMISÉ === */

/* Reset et base */
* {
    --animation-duration: ${reducedMotion ? '0.01ms' : '0.3s'};
    --animation-delay: ${reducedMotion ? '0ms' : '0s'};
}

/* Performance optimizations */
.animate-gpu {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
}

.animate-will-change {
    will-change: transform, opacity;
}

/* Core animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
    }
    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translate3d(0, -100%, 0);
    }
    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translate3d(-100%, 0, 0);
    }
    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translate3d(100%, 0, 0);
    }
    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3);
    }
    50% {
        opacity: 1;
    }
    to {
        opacity: 1;
        transform: scale3d(1, 1, 1);
    }
}

@keyframes scaleOut {
    from {
        opacity: 1;
        transform: scale3d(1, 1, 1);
    }
    to {
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3);
    }
}

@keyframes rotateIn {
    from {
        opacity: 0;
        transform: rotate3d(0, 0, 1, -200deg);
    }
    to {
        opacity: 1;
        transform: rotate3d(0, 0, 1, 0deg);
    }
}

@keyframes bounce {
    from,
    20%,
    53%,
    to {
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        transform: translate3d(0, 0, 0);
    }
    40%,
    43% {
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        transform: translate3d(0, -30px, 0) scaleY(1.1);
    }
    70% {
        animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
        transform: translate3d(0, -15px, 0) scaleY(1.05);
    }
    80% {
        transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        transform: translate3d(0, 0, 0) scaleY(0.95);
    }
    90% {
        transform: translate3d(0, -4px, 0) scaleY(1.02);
    }
}

@keyframes pulse {
    from {
        transform: scale3d(1, 1, 1);
    }
    50% {
        transform: scale3d(1.05, 1.05, 1.05);
    }
    to {
        transform: scale3d(1, 1, 1);
    }
}

@keyframes shake {
    from,
    to {
        transform: translate3d(0, 0, 0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translate3d(-10px, 0, 0);
    }
    20%,
    40%,
    60%,
    80% {
        transform: translate3d(10px, 0, 0);
    }
}

@keyframes wobble {
    from {
        transform: translate3d(0, 0, 0);
    }
    15% {
        transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);
    }
    30% {
        transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);
    }
    45% {
        transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);
    }
    60% {
        transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);
    }
    75% {
        transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);
    }
    to {
        transform: translate3d(0, 0, 0);
    }
}

@keyframes flipInX {
    from {
        transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
        animation-timing-function: ease-in;
        opacity: 0;
    }
    40% {
        transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
        animation-timing-function: ease-in;
    }
    60% {
        transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
        opacity: 1;
    }
    80% {
        transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
    }
    to {
        transform: perspective(400px);
    }
}

@keyframes zoomIn {
    from {
        opacity: 0;
        transform: scale3d(0.3, 0.3, 0.3);
    }
    50% {
        opacity: 1;
    }
}

/* Gradient animations */
@keyframes gradientShift {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

@keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}

/* Text animations */
@keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
}

@keyframes blink {
    from, to { border-color: transparent; }
    50% { border-color: currentColor; }
}

/* Utility classes */
.animate-fade-in {
    animation: fadeIn var(--animation-duration) ${this.defaultEasing.easeOut} forwards;
}

.animate-fade-out {
    animation: fadeOut var(--animation-duration) ${this.defaultEasing.easeOut} forwards;
}

.animate-slide-up {
    animation: slideInUp var(--animation-duration) ${this.defaultEasing.easeOut} forwards;
}

.animate-slide-down {
    animation: slideInDown var(--animation-duration) ${this.defaultEasing.easeOut} forwards;
}

.animate-slide-left {
    animation: slideInLeft var(--animation-duration) ${this.defaultEasing.easeOut} forwards;
}

.animate-slide-right {
    animation: slideInRight var(--animation-duration) ${this.defaultEasing.easeOut} forwards;
}

.animate-scale-in {
    animation: scaleIn var(--animation-duration) ${this.defaultEasing.bounce} forwards;
}

.animate-scale-out {
    animation: scaleOut var(--animation-duration) ${this.defaultEasing.easeIn} forwards;
}

.animate-rotate-in {
    animation: rotateIn var(--animation-duration) ${this.defaultEasing.easeOut} forwards;
}

.animate-bounce {
    animation: bounce 1s infinite;
}

.animate-pulse {
    animation: pulse 2s infinite;
}

.animate-shake {
    animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.animate-wobble {
    animation: wobble 1s both;
}

.animate-flip-in {
    animation: flipInX 0.75s both;
}

.animate-zoom-in {
    animation: zoomIn var(--animation-duration) ${this.defaultEasing.easeOut} both;
}

.animate-gradient {
    background-size: 400% 400%;
    animation: gradientShift 3s ease infinite;
}

.animate-rainbow {
    animation: rainbow 3s linear infinite;
}

/* Delay classes */
.animate-delay-75 { animation-delay: 75ms; }
.animate-delay-100 { animation-delay: 100ms; }
.animate-delay-150 { animation-delay: 150ms; }
.animate-delay-200 { animation-delay: 200ms; }
.animate-delay-300 { animation-delay: 300ms; }
.animate-delay-500 { animation-delay: 500ms; }
.animate-delay-700 { animation-delay: 700ms; }
.animate-delay-1000 { animation-delay: 1000ms; }

/* Duration classes */
.animate-duration-75 { animation-duration: 75ms; }
.animate-duration-100 { animation-duration: 100ms; }
.animate-duration-150 { animation-duration: 150ms; }
.animate-duration-200 { animation-duration: 200ms; }
.animate-duration-300 { animation-duration: 300ms; }
.animate-duration-500 { animation-duration: 500ms; }
.animate-duration-700 { animation-duration: 700ms; }
.animate-duration-1000 { animation-duration: 1000ms; }

/* Easing classes */
.animate-ease-linear { animation-timing-function: linear; }
.animate-ease-in { animation-timing-function: ${this.defaultEasing.easeIn}; }
.animate-ease-out { animation-timing-function: ${this.defaultEasing.easeOut}; }
.animate-ease-in-out { animation-timing-function: ${this.defaultEasing.easeInOut}; }
.animate-ease-bounce { animation-timing-function: ${this.defaultEasing.bounce}; }
.animate-ease-elastic { animation-timing-function: ${this.defaultEasing.elastic}; }

/* Performance modes */
${performance === 'low' ? `
.animate-complex,
.animate-3d,
.animate-heavy {
    animation: none !important;
    transform: none !important;
    transition: none !important;
}
` : ''}

/* Hover effects */
.hover-lift:hover {
    transform: translateY(-4px);
    transition: transform 0.2s ${this.defaultEasing.easeOut};
}

.hover-scale:hover {
    transform: scale(1.05);
    transition: transform 0.2s ${this.defaultEasing.easeOut};
}

.hover-glow:hover {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    transition: box-shadow 0.2s ${this.defaultEasing.easeOut};
}

.hover-rotate:hover {
    transform: rotate(5deg);
    transition: transform 0.2s ${this.defaultEasing.easeOut};
}

/* Loading animations */
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes ping {
    75%, 100% {
        transform: scale(2);
        opacity: 0;
    }
}

@keyframes loading-dots {
    0%, 80%, 100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

.animate-ping {
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.animate-loading-dots {
    animation: loading-dots 1.4s infinite ease-in-out both;
}

.animate-loading-dots:nth-child(1) { animation-delay: -0.32s; }
.animate-loading-dots:nth-child(2) { animation-delay: -0.16s; }

/* Scroll-triggered animations */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ${this.defaultEasing.easeOut};
}

.animate-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
}

/* Performance optimizations */
.animate-optimized {
    contain: layout;
    will-change: transform, opacity;
}

.animate-optimized::before,
.animate-optimized::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .animate-glow:hover {
        box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
    }
}
`;

        return css;
    }

    /**
     * Configure l'Intersection Observer pour les animations au scroll
     */
    setupIntersectionObserver() {
        if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
            return;
        }

        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        this.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerScrollAnimation(entry.target);
                }
            });
        }, options);

        // Observer les éléments existants
        this.observeScrollElements();
    }

    /**
     * Configure le ResizeObserver pour l'optimisation
     */
    setupResizeObserver() {
        if (typeof window === 'undefined' || !('ResizeObserver' in window)) {
            return;
        }

        this.resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                this.optimizeAnimationsForSize(entry.target, entry.contentRect);
            });
        });
    }

    /**
     * Observe les éléments pour les animations au scroll
     */
    observeScrollElements() {
        if (!this.scrollObserver) return;

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            this.scrollObserver.observe(el);
        });
    }

    /**
     * Déclenche une animation au scroll
     */
    triggerScrollAnimation(element) {
        element.classList.add('is-visible');

        // Ajouter des délais pour les éléments multiples
        const siblings = element.parentNode.querySelectorAll('.animate-on-scroll');
        const index = Array.from(siblings).indexOf(element);

        if (index > 0) {
            element.style.animationDelay = `${index * 100}ms`;
        }
    }

    /**
     * Optimise les animations selon la taille
     */
    optimizeAnimationsForSize(element, rect) {
        const isSmall = rect.width < 300 || rect.height < 200;

        if (isSmall) {
            element.classList.add('animate-simplified');
        } else {
            element.classList.remove('animate-simplified');
        }
    }

    /**
     * Ajoute une animation personnalisée
     */
    addAnimation(name, keyframes, options = {}) {
        const defaultOptions = {
            duration: '0.3s',
            easing: this.defaultEasing.easeOut,
            fillMode: 'forwards',
            iterations: 1
        };

        const animationOptions = { ...defaultOptions, ...options };

        this.animations.set(name, {
            keyframes,
            options: animationOptions
        });

        // Générer et injecter le CSS
        this.injectAnimationCSS(name, keyframes, animationOptions);
    }

    /**
     * Injecte le CSS d'une animation
     */
    injectAnimationCSS(name, keyframes, options) {
        if (typeof document === 'undefined') return;

        const styleId = `animation-${name}`;
        let style = document.getElementById(styleId);

        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }

        const keyframeCSS = `
@keyframes ${name} {
    ${keyframes}
}

.animate-${name} {
    animation: ${name} ${options.duration} ${options.easing} ${options.fillMode};
    animation-iteration-count: ${options.iterations};
}`;

        style.textContent = keyframeCSS;
    }

    /**
     * Anime un élément
     */
    animate(element, animationName, options = {}) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        if (!element) return Promise.reject('Element not found');

        return new Promise((resolve) => {
            const animation = this.animations.get(animationName);
            if (!animation) {
                resolve();
                return;
            }

            // Appliquer les options
            if (options.duration) {
                element.style.animationDuration = options.duration;
            }
            if (options.delay) {
                element.style.animationDelay = options.delay;
            }
            if (options.easing) {
                element.style.animationTimingFunction = options.easing;
            }

            // Ajouter la classe d'animation
            element.classList.add(`animate-${animationName}`);

            // Optimisations de performance
            element.classList.add('animate-gpu', 'animate-will-change');

            // Nettoyer après l'animation
            const cleanup = () => {
                element.classList.remove(`animate-${animationName}`, 'animate-gpu', 'animate-will-change');
                element.style.animationDuration = '';
                element.style.animationDelay = '';
                element.style.animationTimingFunction = '';
                resolve();
            };

            element.addEventListener('animationend', cleanup, { once: true });

            // Fallback pour les animations infinies
            if (animation.options.iterations === 'infinite') {
                setTimeout(cleanup, 100);
            }
        });
    }

    /**
     * Crée une séquence d'animations
     */
    sequence(animations) {
        return animations.reduce((promise, animation) => {
            return promise.then(() => {
                return this.animate(animation.element, animation.name, animation.options);
            });
        }, Promise.resolve());
    }

    /**
     * Anime plusieurs éléments en parallèle
     */
    parallel(animations) {
        const promises = animations.map(animation => {
            return this.animate(animation.element, animation.name, animation.options);
        });

        return Promise.all(promises);
    }

    /**
     * Anime une liste d'éléments avec un délai
     */
    stagger(elements, animationName, staggerDelay = 100, options = {}) {
        if (typeof elements === 'string') {
            elements = document.querySelectorAll(elements);
        }

        const promises = Array.from(elements).map((element, index) => {
            const delayedOptions = {
                ...options,
                delay: `${index * staggerDelay}ms`
            };

            return this.animate(element, animationName, delayedOptions);
        });

        return Promise.all(promises);
    }

    /**
     * Lie les événements
     */
    bindEvents() {
        if (typeof window === 'undefined') return;

        // Réobserver les éléments ajoutés dynamiquement
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && node.classList.contains('animate-on-scroll')) {
                            this.scrollObserver?.observe(node);
                        }

                        // Observer les enfants aussi
                        node.querySelectorAll?.('.animate-on-scroll').forEach(child => {
                            this.scrollObserver?.observe(child);
                        });
                    }
                });
            });
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Gérer les changements de préférence de mouvement
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addEventListener('change', (e) => {
            this.prefersReducedMotion = e.matches;
            this.updateAnimationSettings();
        });
    }

    /**
     * Met à jour les paramètres d'animation
     */
    updateAnimationSettings() {
        const root = document.documentElement;

        if (this.prefersReducedMotion) {
            root.style.setProperty('--animation-duration', '0.01ms');
            root.style.setProperty('--animation-delay', '0ms');
        } else {
            root.style.setProperty('--animation-duration', '0.3s');
            root.style.setProperty('--animation-delay', '0s');
        }
    }

    /**
     * Nettoie les ressources
     */
    destroy() {
        this.scrollObserver?.disconnect();
        this.resizeObserver?.disconnect();
        this.animations.clear();
        this.observers.clear();
    }

    /**
     * Optimise automatiquement les performances
     */
    optimizePerformance() {
        // Désactiver les animations complexes sur les appareils faibles
        if (this.performanceMode === 'low') {
            document.body.classList.add('performance-mode-low');
        }

        // Limiter le nombre d'animations simultanées
        this.limitConcurrentAnimations();
    }

    /**
     * Limite les animations concurrentes
     */
    limitConcurrentAnimations() {
        const maxConcurrent = this.performanceMode === 'low' ? 3 :
                            this.performanceMode === 'medium' ? 6 : 12;

        let activeAnimations = 0;
        const animationQueue = [];

        const originalAnimate = this.animate.bind(this);

        this.animate = (element, name, options) => {
            if (activeAnimations >= maxConcurrent) {
                return new Promise(resolve => {
                    animationQueue.push(() => originalAnimate(element, name, options).then(resolve));
                });
            }

            activeAnimations++;
            return originalAnimate(element, name, options).finally(() => {
                activeAnimations--;
                if (animationQueue.length > 0) {
                    const next = animationQueue.shift();
                    next();
                }
            });
        };
    }
}

module.exports = AnimationEngine;