/* ZYOP Solution — site behaviour */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ------------------------------------------------------------------
       Header state
       ------------------------------------------------------------------ */
    var header = document.getElementById('site-header');

    function updateHeader() {
        if (!header) return;
        header.classList.toggle('is-scrolled', window.scrollY > 8);
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    /* ------------------------------------------------------------------
       Mobile navigation
       ------------------------------------------------------------------ */
    var navCollapse = document.getElementById('primaryNav');
    var navToggler = document.querySelector('.navbar-toggler');

    function closeMobileNav() {
        if (!navCollapse || !navCollapse.classList.contains('show')) return;
        if (window.bootstrap && window.bootstrap.Collapse) {
            var instance = window.bootstrap.Collapse.getInstance(navCollapse) || new window.bootstrap.Collapse(navCollapse, { toggle: false });
            instance.hide();
        }
        if (navToggler) navToggler.setAttribute('aria-expanded', 'false');
    }

    if (navCollapse) {
        navCollapse.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeMobileNav);
        });
    }

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeMobileNav();
            if (navToggler && navCollapse && navCollapse.classList.contains('show')) navToggler.focus();
        }
    });

    /* ------------------------------------------------------------------
       Service prefill from links
       ------------------------------------------------------------------ */
    var serviceSelect = document.getElementById('service-type');

    if (serviceSelect) {
        document.querySelectorAll('[data-service]').forEach(function (link) {
            link.addEventListener('click', function () {
                var wanted = link.getAttribute('data-service');
                var match = Array.prototype.find.call(serviceSelect.options, function (option) {
                    return option.value === wanted;
                });
                if (match) {
                    serviceSelect.value = wanted;
                    serviceSelect.classList.remove('is-invalid');
                }
            });
        });
    }

    /* ------------------------------------------------------------------
       Scroll reveal
       ------------------------------------------------------------------ */
    var revealItems = document.querySelectorAll('.reveal');

    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealItems.forEach(function (item) { item.classList.add('is-visible'); });
    } else {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

        revealItems.forEach(function (item) { revealObserver.observe(item); });
    }

    /* ------------------------------------------------------------------
       Active navigation link
       ------------------------------------------------------------------ */
    var sectionIds = ['services', 'work', 'about', 'process', 'faq', 'contact'];
    var navLinks = document.querySelectorAll('.navbar .nav-link');

    function setActiveLink(id) {
        navLinks.forEach(function (link) {
            var isActive = link.getAttribute('href') === '#' + id;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'location');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    if ('IntersectionObserver' in window) {
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) setActiveLink(entry.target.id);
            });
        }, { rootMargin: '-38% 0px -52% 0px', threshold: 0 });

        sectionIds.forEach(function (id) {
            var section = document.getElementById(id);
            if (section) sectionObserver.observe(section);
        });
    }

    /* ------------------------------------------------------------------
       Copy email
       ------------------------------------------------------------------ */
    var copyButton = document.getElementById('copy-email');
    var copyLabel = document.getElementById('copy-email-label');

    function legacyCopy(text) {
        var input = document.createElement('textarea');
        input.value = text;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }

    if (copyButton && copyLabel) {
        copyButton.addEventListener('click', function () {
            var email = copyButton.getAttribute('data-copy');
            var done = function () {
                copyLabel.textContent = 'Copied';
                copyButton.setAttribute('aria-label', 'Email address copied');
                window.setTimeout(function () {
                    copyLabel.textContent = 'Copy';
                    copyButton.setAttribute('aria-label', 'Copy email address');
                }, 2000);
            };

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(email).then(done).catch(function () {
                    legacyCopy(email);
                    done();
                });
            } else {
                legacyCopy(email);
                done();
            }
        });
    }

    /* ------------------------------------------------------------------
       Contact form -> email draft
       ------------------------------------------------------------------ */
    var form = document.getElementById('contact-form');
    var formStatus = document.getElementById('form-status');

    if (form) {
        var fields = form.querySelectorAll('.form-control, .form-select');

        fields.forEach(function (field) {
            field.addEventListener('input', function () {
                if (field.checkValidity()) field.removeAttribute('aria-invalid');
            });
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            var valid = form.checkValidity();
            form.classList.toggle('was-validated', !valid);

            fields.forEach(function (field) {
                if (field.checkValidity()) {
                    field.removeAttribute('aria-invalid');
                } else {
                    field.setAttribute('aria-invalid', 'true');
                }
            });

            if (!valid) {
                var firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var service = serviceSelect ? serviceSelect.value : 'Project inquiry';
            var message = document.getElementById('message').value.trim();

            var subject = 'Project inquiry: ' + service + ' — ' + name;
            var body = [
                'Name / company: ' + name,
                'Email: ' + email,
                'Service: ' + service,
                '',
                'Project details:',
                message
            ].join('\n');

            var mailto = 'mailto:azamayop@zyopsolution.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

            form.classList.remove('was-validated');

            if (formStatus) {
                formStatus.hidden = false;
                formStatus.className = 'form-status form-status--success';
                formStatus.textContent = 'Your email app should open with the details ready to send. If it does not, write to azamayop@zyopsolution.com directly.';
            }

            window.location.href = mailto;
        });
    }

    /* ------------------------------------------------------------------
       Footer year
       ------------------------------------------------------------------ */
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
})();
