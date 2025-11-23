/**
 * Générateur de descriptions d'images pour le contenu
 */
class ImageDescriptor {
    constructor() {
        this.imageTypes = {
            hero: 'Image principale d\'en-tête',
            section: 'Illustration de section',
            infographic: 'Infographie',
            screenshot: 'Capture d\'écran',
            diagram: 'Schéma explicatif',
            photo: 'Photographie',
            icon: 'Icône'
        };
    }

    /**
     * Génère des descriptions pour toutes les images d'un article
     */
    generateArticleImages(article, keyword) {
        const images = [];

        // Image hero
        images.push(this.generateHeroImage(article.title, keyword));

        // Images pour chaque section
        article.sections.forEach((section, index) => {
            if (index < 5) { // Max 5 images de section
                images.push(this.generateSectionImage(section.title, keyword, index));
            }
        });

        // Infographie si article long
        if (article.wordCount > 1500) {
            images.push(this.generateInfographic(article.title, keyword));
        }

        return images;
    }

    generateHeroImage(title, keyword) {
        return {
            type: 'hero',
            filename: `hero-${this.slugify(keyword)}.jpg`,
            alt: `${title} - Guide complet`,
            title: title,
            description: `Image d'en-tête illustrant ${keyword}`,
            dimensions: '1200x630',
            placement: 'top',
            priority: 'high'
        };
    }

    generateSectionImage(sectionTitle, keyword, index) {
        return {
            type: 'section',
            filename: `section-${index + 1}-${this.slugify(sectionTitle)}.jpg`,
            alt: `${sectionTitle} - ${keyword}`,
            title: sectionTitle,
            description: `Illustration pour: ${sectionTitle}`,
            dimensions: '800x600',
            placement: `section-${index + 1}`,
            priority: 'medium'
        };
    }

    generateInfographic(title, keyword) {
        return {
            type: 'infographic',
            filename: `infographic-${this.slugify(keyword)}.png`,
            alt: `Infographie - ${title}`,
            title: `Infographie sur ${keyword}`,
            description: `Infographie résumant les points clés de ${keyword}`,
            dimensions: '800x1200',
            placement: 'middle',
            priority: 'high'
        };
    }

    slugify(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 40);
    }

    /**
     * Génère un manifest des images
     */
    generateImageManifest(images) {
        return {
            totalImages: images.length,
            byType: this.countByType(images),
            priorityOrder: images.sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }),
            suggestions: this.generateOptimizationSuggestions(images)
        };
    }

    countByType(images) {
        const counts = {};
        images.forEach(img => {
            counts[img.type] = (counts[img.type] || 0) + 1;
        });
        return counts;
    }

    generateOptimizationSuggestions(images) {
        const suggestions = [];

        if (images.length === 0) {
            suggestions.push('Ajouter au moins 1 image hero');
        }

        if (images.filter(i => i.type === 'hero').length === 0) {
            suggestions.push('Ajouter une image hero');
        }

        if (images.length < 3) {
            suggestions.push('Ajouter plus d\'images (min 3-5 recommandées)');
        }

        if (images.filter(i => i.type === 'infographic').length === 0 && images.length > 5) {
            suggestions.push('Considérer l\'ajout d\'une infographie');
        }

        return suggestions;
    }
}

module.exports = ImageDescriptor;
