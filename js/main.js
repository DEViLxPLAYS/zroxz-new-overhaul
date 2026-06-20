/* ========================================================================
   ZROXZ INTERACTIVE SCRIPTS
   Scroll reveals, staggering, navbar shifts, mobile drawer, accordions.
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. INTERSECTION OBSERVER FOR SCROLL REVEALS
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.15 // trigger when 15% visible
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once only
      }
    });
  }, observerOptions);

  // Apply stagger delay to children of .stagger-parent
  document.querySelectorAll('.stagger-parent').forEach((parent) => {
    [...parent.children].forEach((child, i) => {
      // Limit delay to 400ms max to prevent user waiting too long
      child.style.transitionDelay = `${Math.min(i * 80, 400)}ms`;
      child.classList.add('reveal');
    });
  });

  // Observe all reveal elements
  document.querySelectorAll('.reveal').forEach((el) => {
    revealObserver.observe(el);
  });


  // 2. NAVBAR SCROLL EFFECT
  const handleNavScroll = () => {
    const nav = document.querySelector('nav');
    if (nav) {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', handleNavScroll);
  handleNavScroll(); // Run on load in case of refresh


  // 3. MOBILE MENU HAMBURGER & DRAWER
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');

      if (mobileMenu.classList.contains('open')) {
        // Disable body scroll when menu is open
        document.body.style.overflow = 'hidden';
        
        // Stagger animate links in
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
        mobileLinks.forEach((link, index) => {
          link.style.transitionDelay = `${index * 60}ms`;
        });
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  // 4. FAQ ACCORDION (FOR SERVICES)
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other FAQ items first
        document.querySelectorAll('.faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          // Set max height dynamically based on scrollHeight
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        }
      });
    }
  });


  // 5. BLOG CATEGORY FILTERS
  const filterButtons = document.querySelectorAll('.filter-btn');
  const blogArticles = document.querySelectorAll('.blog-post-grid article, .blog-grid article');

  if (filterButtons.length > 0 && blogArticles.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from other buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        blogArticles.forEach(article => {
          // Find the category pill in the article
          const pill = article.querySelector('.blog-card-meta .pill, .meta-category .pill');
          const articleCategory = pill ? pill.textContent.trim().toLowerCase() : '';
          const targetCategory = category.toLowerCase();

          if (targetCategory === 'all' || articleCategory.includes(targetCategory)) {
            article.style.display = '';
            // Re-trigger reveal check when visible
            article.classList.remove('visible');
            setTimeout(() => {
              article.classList.add('visible');
            }, 50);
          } else {
            article.style.display = 'none';
          }
        });
      });
    });
  // 6. COUNT UP ANIMATION FOR STATS
  const statsContainer = document.querySelector('.hero-stat');
  if (statsContainer) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const countUpElements = entry.target.querySelectorAll('.count-up');
          countUpElements.forEach((targetEl) => {
            const targetNum = parseInt(targetEl.getAttribute('data-target'), 10);
            if (isNaN(targetNum)) return;
            let currentNum = 0;
            const duration = 2000; // 2 seconds
            const stepTime = Math.abs(Math.floor(duration / (targetNum || 1)));
            
            const timer = setInterval(() => {
              currentNum += 1;
              targetEl.textContent = currentNum;
              if (currentNum >= targetNum) {
                targetEl.textContent = targetNum;
                clearInterval(timer);
              }
            }, stepTime);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    statsObserver.observe(statsContainer);
  }
});
