// =================================================================
// ADARIO THE STUDIO — site script
// Handles: header scroll state, mobile nav toggle, smooth in-page
// anchors, scroll-reveal animation, portfolio category filter,
// and the footer year.
// =================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header: solid background after scrolling past hero ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 60);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close the mobile menu after tapping a link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Smooth scroll for in-page anchors only ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length < 2) return; // ignore bare "#"
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- Scroll-reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Portfolio category filter (Photography page) ---------- */
  const filterBar = document.querySelector('.filter-bar');
  const grid = document.getElementById('portfolioGrid');
  if (filterBar && grid) {
    const tiles = grid.querySelectorAll('.tile');
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.dataset.filter;
      tiles.forEach(tile => {
        const show = filter === 'all' || tile.dataset.category === filter;
        tile.hidden = !show;
      });
    });
  }

  /* ---------- Photo lightbox (Photography page) ---------- */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content" role="dialog" aria-modal="true" aria-label="Photo preview">
      <button class="lightbox-close" type="button" aria-label="Close">×</button>
      <img src="" alt="">
    </div>
  `;
  document.body.appendChild(lightbox);

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    const img = lightbox.querySelector('img');
    if (img) img.removeAttribute('src');
  };

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', (e) => {
      const img = tile.querySelector('img');
      if (!img) return;

      e.preventDefault();
      const lightboxImg = lightbox.querySelector('img');
      lightboxImg.src = img.getAttribute('src');
      lightboxImg.alt = img.getAttribute('alt') || '';
      lightbox.classList.add('is-open');
      document.body.classList.add('lightbox-open');
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('#year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});
