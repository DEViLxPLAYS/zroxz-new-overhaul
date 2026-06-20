/* ========================================================================
   ZROXZ CONTACT FORM — JAVASCRIPT
   Wires the HTML contact form to POST /api/contact on the Render backend.
   ======================================================================== */

(function () {
  'use strict';

  // Automatically select local or production API URL based on hostname
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001'
    : 'https://zroxz-backend.onrender.com';

  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const successEl = document.getElementById('form-success');
      const errorEl = document.getElementById('form-error');

      // Reset state
      if (successEl) successEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';

      // Collect field values
      const data = {
        name: form.querySelector('[name="name"]')?.value?.trim() || '',
        email: form.querySelector('[name="email"]')?.value?.trim() || '',
        company: form.querySelector('[name="company"]')?.value?.trim() || '',
        service: form.querySelector('[name="service"]')?.value?.trim() || '',
        message: form.querySelector('[name="message"]')?.value?.trim() || '',
        budget: form.querySelector('[name="budget"]')?.value?.trim() || '',
        sourcePage: window.location.pathname,
      };

      // Basic client-side validation (backend also validates)
      if (!data.name || !data.email || !data.message) {
        if (errorEl) {
          errorEl.textContent = 'Please fill in your name, email, and message.';
          errorEl.style.display = 'block';
        }
        return;
      }

      // Loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending&hellip;';

      try {
        const res = await fetch(`${API_URL}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || 'Submission failed. Please try again.');
        }

        // Success
        form.reset();
        if (successEl) {
          successEl.style.display = 'block';
          successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = err.message;
          errorEl.style.display = 'block';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }
})();
