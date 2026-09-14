/**
 * AUROVA HANDMADE â€” Interactions Script
 * Features: Scroll Progress Bar, Sticky Header, Product Image Lightbox with Zoom/Swipe,
 * 3D Flip Cards (Custom Orders), 2-Line Letter-by-Letter Footer Animation,
 * Mobile Drawer, and Scroll Reveal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar & Sticky Header
  const progressBar = document.querySelector('.scroll-progress-bar');
  const siteHeader = document.querySelector('.site-header');

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (siteHeader) {
      if (scrollTop > 20) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 2. Mobile Drawer Navigation
  const navToggle = document.querySelector('.nav-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  const openNav = () => {
    if (!navToggle || !mobileDrawer || !mobileBackdrop) return;
    navToggle.classList.add('is-active');
    navToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-open');
    mobileBackdrop.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  };

  const closeNav = () => {
    if (!navToggle || !mobileDrawer || !mobileBackdrop) return;
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-open');
    mobileBackdrop.classList.remove('is-visible');
    document.body.style.overflow = '';
  };

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (mobileDrawer.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeNav);
  mobileLinks.forEach(link => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      closeNav();
    }
  });

  // 3. Scroll Reveal via IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-revealed'));
  }

  // 4. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.site-nav .nav-link');

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // 5. Back to Top Smooth Scroll
  const topBtn = document.querySelector('.back-to-top-btn');
  if (topBtn) {
    topBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 6. Interactive 3D Flip Cards for Custom Orders
  const flipCards = document.querySelectorAll('.custom-flip-card');
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  flipCards.forEach(card => {
    const flipPillBadge = card.querySelector('.flip-pill-badge');
    const flipBackBtn = card.querySelector('.flip-back-btn');
    const frontFace = card.querySelector('.flip-card-front');
    const backFace = card.querySelector('.flip-card-back');

    const flipToBack = () => {
      card.classList.add('is-flipped');
      delete card.dataset.manualUnflipped;
    };

    const flipToFront = () => {
      card.classList.remove('is-flipped');
      card.dataset.manualUnflipped = 'true';
    };

    // Desktop hover auto-flip (only for mouse pointer devices)
    if (hasFinePointer) {
      card.addEventListener('mouseenter', () => {
        if (card.dataset.manualUnflipped !== 'true') {
          card.classList.add('is-flipped');
        }
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-flipped');
        delete card.dataset.manualUnflipped;
      });
    }

    // Clicking front face or front "Flip" pill button flips to back
    if (frontFace) {
      frontFace.addEventListener('click', () => {
        flipToBack();
      });
    }

    // Clicking "Tap to flip back" button explicitly flips to front
    if (flipBackBtn) {
      flipBackBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        flipToFront();
      });
    }

    // Clicking anywhere on the back face also flips back
    if (backFace) {
      backFace.addEventListener('click', () => {
        flipToFront();
      });
    }

    // Keyboard accessibility: Enter or Space on the card
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.tagName === 'BUTTON') return;
        e.preventDefault();
        if (card.classList.contains('is-flipped')) {
          flipToFront();
        } else {
          flipToBack();
        }
      }
    });
  });

  // 7. Interactive Letter-by-Letter 2-Line Footer Animation
  const footerLetters = document.querySelectorAll('.footer-letter');
  
  footerLetters.forEach(letter => {
    const color = letter.getAttribute('data-color') || '#FF5252';
    letter.style.setProperty('--letter-color', color);

    let activeTimeout;
    const activate = () => {
      letter.classList.add('is-active-color');
      clearTimeout(activeTimeout);
      activeTimeout = setTimeout(() => {
        letter.classList.remove('is-active-color');
      }, 700);
    };

    letter.addEventListener('mouseenter', activate);
    letter.addEventListener('mouseleave', () => {
      letter.classList.remove('is-active-color');
      clearTimeout(activeTimeout);
    });

    letter.addEventListener('touchstart', activate, { passive: true });
  });

  // Smooth pointer sweep across footer lines
  const footerDisplay = document.querySelector('.giant-footer-display');
  if (footerDisplay) {
    footerDisplay.addEventListener('pointermove', (e) => {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (target && target.classList.contains('footer-letter')) {
        target.classList.add('is-active-color');
        setTimeout(() => {
          target.classList.remove('is-active-color');
        }, 700);
      }
    });
  }

  // =========================================================================
  // 8. PRODUCT IMAGE LIGHTBOX (CLICK-TO-ENLARGE EFFECT)
  // =========================================================================
  const productCards = document.querySelectorAll('.product-card-square');
  const lightbox = document.getElementById('product-lightbox');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxWaBtn = document.getElementById('lightbox-wa-btn');
  const lightboxDialog = document.querySelector('.lightbox-dialog');

  // Product metadata
  const products = [
    {
      name: "Crochet bags",
      src: "product-bags.jpg",
      fallbackSrc: "assets/images/product-bags.jpg",
      alt: "Handmade chunky lavender crochet tote bag"
    },
    {
      name: "Crochet Flower Bouquets",
      src: "product-bouquets.jpg",
      fallbackSrc: "assets/images/product-bouquets.jpg",
      alt: "Everlasting handcrafted botanical crochet flower bouquet"
    },
    {
      name: "Crochet toys",
      src: "product-toys.jpg",
      fallbackSrc: "assets/images/product-toys.jpg",
      alt: "Handmade amigurumi crochet toys and plushie companions"
    },
    {
      name: "Keychains & charms",
      src: "product-keychains.jpg",
      fallbackSrc: "assets/images/product-keychains.jpg",
      alt: "Handcrafted crochet keychains and bag charms"
    },
    {
      name: "Custom pieces",
      src: "product-custom.jpg",
      fallbackSrc: "assets/images/product-custom.jpg",
      alt: "Personalized bespoke handmade crochet keepsake piece"
    }
  ];

  let currentProductIndex = 0;

  const updateLightboxContent = (index) => {
    if (index < 0) index = products.length - 1;
    if (index >= products.length) index = 0;
    currentProductIndex = index;

    const prod = products[currentProductIndex];

    // Quick image cross-fade
    lightboxImage.style.opacity = '0.3';
    lightboxImage.src = prod.src;
    lightboxImage.onerror = () => {
      if (prod.fallbackSrc && lightboxImage.src !== prod.fallbackSrc) {
        lightboxImage.src = prod.fallbackSrc;
      }
    };
    lightboxImage.alt = prod.alt;
    
    lightboxImage.onload = () => {
      lightboxImage.style.opacity = '1';
    };

    if (lightboxTitle) lightboxTitle.textContent = prod.name;
    if (lightboxCounter) lightboxCounter.textContent = `${currentProductIndex + 1} / ${products.length}`;
    if (lightboxWaBtn) {
      const msg = encodeURIComponent(`Hi Aurova Handmade, I'm interested in the ${prod.name}!`);
      lightboxWaBtn.href = `https://wa.me/918980536677?text=${msg}`;
    }
  };

  const openLightbox = (index) => {
    if (!lightbox) return;
    updateLightboxContent(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showNext = () => {
    updateLightboxContent(currentProductIndex + 1);
  };

  const showPrev = () => {
    updateLightboxContent(currentProductIndex - 1);
  };

  // Attach card click handlers
  productCards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(idx);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx);
      }
    });
  });

  // Modal controls
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Touch Swipe for mobile devices
  if (lightboxDialog) {
    let touchStartX = 0;
    let touchEndX = 0;

    lightboxDialog.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxDialog.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          showNext();
        } else {
          showPrev();
        }
      }
    }, { passive: true });
  }
});