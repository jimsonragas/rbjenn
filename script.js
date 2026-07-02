// NAV: shadow on scroll and accessible mobile toggle
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 24);
});

const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open');
  navLinks?.setAttribute('aria-hidden', String(expanded));
});

// Close mobile menu when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.setAttribute('aria-hidden', 'true');
  });
});

// Close menu on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.focus();
    navLinks.setAttribute('aria-hidden', 'true');
  }
});

// SCROLL REVEAL
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, {
  threshold: 0.12
});

reveals.forEach(el => observer.observe(el));

// CONTACT FORM
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  if (!form || !statusEl) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot
    const hp = form.querySelector('input[name="website"]');

    if (hp && hp.value) {
      statusEl.textContent = '✓ Message sent';
      statusEl.className = 'form-status success';
      form.reset();
      return;
    }

    const fd = new FormData(form);

    const name = (fd.get('name') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const message = (fd.get('message') || '').toString().trim();

    if (!name || !email || !message) {
      statusEl.textContent = 'Please complete name, email and message.';
      statusEl.className = 'form-status error';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const prevLabel = submitBtn ? submitBtn.textContent : 'Send Message';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {

      const response = await fetch(form.action, {
        method: form.method || 'POST',
        body: fd,
        headers: {
          Accept: 'application/json'
        }
      });

      if (response.ok) {

        statusEl.textContent =
          '✓ Message sent — I will get back to you soon.';
        statusEl.className = 'form-status success';

        form.reset();

      } else {

        const data = await response.json().catch(() => null);

        statusEl.textContent =
          data?.error ||
          'Something went wrong. Please try again later.';

        statusEl.className = 'form-status error';
      }

    } catch (err) {

      statusEl.textContent =
        'Network error — please check your connection and try again.';

      statusEl.className = 'form-status error';

    } finally {

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = prevLabel;
      }
    }

  });

  // Copy email button
  const emailLink = document.querySelector(
    '.contact-detail a[href^="mailto:"]'
  );

  if (emailLink) {

    const emailText = emailLink
      .getAttribute('href')
      .replace('mailto:', '');

    const copyBtn = document.createElement('button');

    copyBtn.type = 'button';
    copyBtn.className = 'copy-email-btn';
    copyBtn.title = 'Copy email address';
    copyBtn.textContent = 'Copy';
    copyBtn.style.marginLeft = '8px';

    emailLink.parentElement.appendChild(copyBtn);

    copyBtn.addEventListener('click', async () => {

      try {

        await navigator.clipboard.writeText(emailText);

        copyBtn.textContent = 'Copied';

        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);

      } catch (err) {

        copyBtn.textContent = 'Copy';

      }

    });

  }

});
