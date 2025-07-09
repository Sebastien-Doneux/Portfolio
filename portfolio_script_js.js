// ===== PORTFOLIO JAVASCRIPT - SÉBASTIEN DONEUX =====

// Gestion du changement de langue
function setLanguage(lang) {
    // Masquer toutes les versions de contenu
    document.querySelectorAll('.lang-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Retirer la classe active de tous les boutons de langue
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Afficher la version de langue sélectionnée
    const targetContent = document.getElementById('lang-' + lang);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    // Activer le bouton de langue correspondant
    event.target.classList.add('active');
    
    // Changer l'attribut lang du document pour l'accessibilité
    document.documentElement.lang = lang;
    
    // Sauvegarder la préférence de langue dans localStorage
    try {
        localStorage.setItem('preferredLanguage', lang);
    } catch (e) {
        // Ignore si localStorage n'est pas disponible
        console.log('localStorage not available');
    }
    
    // Mettre à jour les attributs ARIA
    updateARIAAttributes(lang);
    
    // Réinitialiser les animations pour la nouvelle langue
    resetAnimations();
}

// Charger la langue préférée au démarrage
function loadPreferredLanguage() {
    try {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && ['fr', 'en', 'es'].includes(savedLang)) {
            // Simuler un clic sur le bouton de langue approprié
            const targetBtn = document.querySelector(`[onclick="setLanguage('${savedLang}')"]`);
            if (targetBtn) {
                // Retirer active de tous les boutons
                document.querySelectorAll('.lang-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                // Masquer tout le contenu
                document.querySelectorAll('.lang-content').forEach(content => {
                    content.classList.remove('active');
                });
                // Activer la langue sauvegardée
                targetBtn.classList.add('active');
                document.getElementById('lang-' + savedLang).classList.add('active');
                document.documentElement.lang = savedLang;
                updateARIAAttributes(savedLang);
            }
        }
    } catch (e) {
        // Utiliser le français par défaut si erreur
        console.log('Error loading preferred language, using default');
    }
}

// Réinitialiser les animations lors du changement de langue
function resetAnimations() {
    // Retirer la classe visible de tous les éléments fade-in
    document.querySelectorAll('.fade-in.visible').forEach(element => {
        element.classList.remove('visible');
    });
    
    // Réappliquer les animations après un délai
    setTimeout(() => {
        observeElements();
    }, 100);
}

// Observer pour les animations au scroll
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observer tous les éléments fade-in de la langue active
    const activeContent = document.querySelector('.lang-content.active');
    if (activeContent) {
        activeContent.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }
}

// Effet de parallaxe léger
function setupParallax() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const sections = document.querySelectorAll('.section');
        
        sections.forEach((section) => {
            const rate = scrolled * -0.05;
            section.style.transform = `translateY(${rate}px)`;
        });
        
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
}

// Animation d'entrée progressive
function startInitialAnimations() {
    setTimeout(() => {
        const firstElement = document.querySelector('.lang-content.active .fade-in');
        if (firstElement) {
            firstElement.classList.add('visible');
        }
    }, 200);
}

// Gestion du menu mobile pour le sélecteur de langue
function setupMobileMenu() {
    const languageSelector = document.querySelector('.language-selector');
    
    function adjustMobileLayout() {
        if (window.innerWidth <= 768) {
            languageSelector.style.flexDirection = 'column';
        } else {
            languageSelector.style.flexDirection = 'row';
        }
    }
    
    // Ajuster au chargement
    adjustMobileLayout();
    
    // Écouter les changements de taille d'écran
    window.addEventListener('resize', adjustMobileLayout);
}

// Amélioration de l'accessibilité
function setupAccessibility() {
    // Ajouter la navigation au clavier pour les boutons de langue
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
        
        // Ajouter un attribut role pour l'accessibilité
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
    });
    
    // Ajouter des attributs ARIA pour le contenu multilingue
    document.querySelectorAll('.lang-content').forEach(content => {
        content.setAttribute('role', 'main');
        content.setAttribute('aria-hidden', !content.classList.contains('active'));
    });
}

// Fonction pour mettre à jour les attributs ARIA lors du changement de langue
function updateARIAAttributes(activeLang) {
    document.querySelectorAll('.lang-content').forEach(content => {
        const isActive = content.id === `lang-${activeLang}`;
        content.setAttribute('aria-hidden', !isActive);
    });
}

// Gestion des liens de contact
function setupContactLinks() {
    // Ajouter des attributs pour améliorer l'accessibilité
    const contactLinks = document.querySelectorAll('.contact-item');
    contactLinks.forEach(link => {
        if (link.href.startsWith('mailto:')) {
            link.setAttribute('aria-label', 'Envoyer un email');
        } else if (link.href.startsWith('tel:')) {
            link.setAttribute('aria-label', 'Appeler par téléphone');
        } else if (link.href.includes('linkedin')) {
            link.setAttribute('aria-label', 'Voir le profil LinkedIn');
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

// Optimisation des performances
function optimizePerformance() {
    // Lazy loading pour les images (si ajoutées plus tard)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Préchargement des ressources critiques
    const preloadLinks = [
        { href: 'styles.css', as: 'style' }
    ];
    
    preloadLinks.forEach(link => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'preload';
        linkElement.href = link.href;
        linkElement.as = link.as;
        document.head.appendChild(linkElement);
    });
}

// Gestion des erreurs
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('Erreur détectée:', e.error);
        // Optionnel: envoyer l'erreur à un service de monitoring
    });
    
    // Gestion des erreurs pour les promesses non attrapées
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Promesse rejetée non gérée:', e.reason);
        e.preventDefault();
    });
}

// Fonctions utilitaires
const utils = {
    // Débounce pour optimiser les événements
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Vérifier si un élément est visible
    isElementVisible: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Smooth scroll vers un élément
    smoothScrollTo: function(element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

// Analytics simples (optionnel)
function trackPageView(lang) {
    // Placeholder pour tracking analytics
    console.log(`Page vue - Langue: ${lang}`);
    
    // Exemple d'intégration Google Analytics (à décommenter si nécessaire)
    /*
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: 'Portfolio Sébastien DONEUX',
            page_language: lang
        });
    }
    */
}

// Initialisation principale
function initPortfolio() {
    // Charger la langue préférée
    loadPreferredLanguage();
    
    // Configurer l'accessibilité
    setupAccessibility();
    
    // Configurer le menu mobile
    setupMobileMenu();
    
    // Configurer les liens de contact
    setupContactLinks();
    
    // Démarrer les observations pour les animations
    observeElements();
    
    // Configurer l'effet parallaxe
    setupParallax();
    
    // Démarrer les animations initiales
    startInitialAnimations();
    
    // Optimiser les performances
    optimizePerformance();
    
    // Configurer la gestion d'erreurs
    setupErrorHandling();
    
    console.log('Portfolio initialisé avec succès!');
}

// Démarrer l'application quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}