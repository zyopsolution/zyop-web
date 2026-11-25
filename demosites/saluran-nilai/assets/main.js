document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Dropdown toggle for mobile & keyboard accessibility
  const dropdownParents = document.querySelectorAll('.has-dropdown');
  dropdownParents.forEach((parent) => {
    const triggerBtn = parent.querySelector('.dropdown-toggle-btn');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = parent.classList.toggle('open');
        triggerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  });

  document.addEventListener('click', (e) => {
    dropdownParents.forEach((parent) => {
      if (!parent.contains(e.target)) {
        parent.classList.remove('open');
        const btn = parent.querySelector('.dropdown-toggle-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Filter buttons (for Career & Projects pages)
  const filterButtons = document.querySelectorAll('[data-filter-target]');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.getAttribute('data-filter-group');
      const value = btn.getAttribute('data-filter-value');

      document.querySelectorAll(`[data-filter-group="${group}"]`).forEach((b) => {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      document.querySelectorAll(`[data-filter-item="${group}"]`).forEach((item) => {
        const cats = (item.getAttribute('data-category') || '').split(',');
        if (value === 'all' || cats.includes(value)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Pre-fill position when clicking "Mohon Jawatan Ini"
  const applyButtons = document.querySelectorAll('[data-select-role]');
  const positionSelect = document.getElementById('jawatan-dipohon');
  applyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-select-role');
      if (positionSelect && role) {
        positionSelect.value = role;
      }
      const formSection = document.getElementById('borang-permohonan');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Mockup form handler
  const forms = document.querySelectorAll('.js-mockup-form');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const statusBox = form.querySelector('.form-status');
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
});