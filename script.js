// ============================================
// CONFIGURATION — UPDATE THIS AFTER DEPLOYING
// YOUR GOOGLE APPS SCRIPT WEB APP
// ============================================
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzohhBCFcylgJLdh-J4kPj6_m45Z8KxLgO3nEjQ7DaToUzj_qEe6ErOC8iONGEC8szUdA/exec';

// ============================================
// HEADER SCROLL EFFECT
// ============================================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ============================================
// MOBILE MENU
// ============================================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburgerBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
});

function closeMobileMenu() {
  menuOpen = false;
  mobileMenu.classList.remove('open');
}

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (menuOpen && !hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
    closeMobileMenu();
  }
});

// ============================================
// CONDITIONAL FORM FIELDS
// ============================================
const serviceSelect = document.getElementById('f_service');
const fieldScrap    = document.getElementById('field_scrap');
const fieldCapacity = document.getElementById('field_capacity');

serviceSelect.addEventListener('change', () => {
  const val = serviceSelect.value;
  // Reset conditional fields
  fieldScrap.classList.remove('visible');
  fieldCapacity.classList.remove('visible');
  document.getElementById('f_scrap_type').value = '';
  document.getElementById('f_capacity').value = '';

  if (val === 'Scrap Pickup') {
    fieldScrap.classList.add('visible');
  } else if (val === 'Hydra Crane' || val === 'Hydraulic Crane') {
    fieldCapacity.classList.add('visible');
  }
});

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================
const form         = document.getElementById('enquiryForm');
const submitBtn    = document.getElementById('submitBtn');
const submitText   = document.getElementById('submitText');
const submitIcon   = document.getElementById('submitIcon');
const submitSpinner = document.getElementById('submitSpinner');
const formSuccess  = document.getElementById('formSuccess');
const formContent  = document.getElementById('formContent');
const formErrorMsg = document.getElementById('formErrorMsg');

function showFieldError(id, show) {
  document.getElementById(id).style.display = show ? 'block' : 'none';
}

function validateForm() {
  let valid = true;

  const name = document.getElementById('f_name').value.trim();
  showFieldError('err_name', !name);
  if (!name) valid = false;

  const phone = document.getElementById('f_phone').value.trim().replace(/\D/g, '');
  const phoneValid = phone.length >= 10 && phone.length <= 13;
  showFieldError('err_phone', !phoneValid);
  if (!phoneValid) valid = false;

  const service = serviceSelect.value;
  showFieldError('err_service', !service);
  if (!service) valid = false;

  if (service === 'Scrap Pickup') {
    const scrap = document.getElementById('f_scrap_type').value;
    showFieldError('err_scrap', !scrap);
    if (!scrap) valid = false;
  }

  if (service === 'Hydra Crane' || service === 'Hydraulic Crane') {
    const cap = document.getElementById('f_capacity').value;
    showFieldError('err_capacity', !cap);
    if (!cap) valid = false;
  }

  const location = document.getElementById('f_location').value.trim();
  showFieldError('err_location', !location);
  if (!location) valid = false;

  return valid;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // UI: Loading state
  submitBtn.disabled = true;
  submitIcon.style.display = 'none';
  submitSpinner.style.display = 'block';
  submitText.textContent = 'Sending…';
  formErrorMsg.style.display = 'none';

  // Collect form data
  const payload = {
    timestamp : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    name      : document.getElementById('f_name').value.trim(),
    phone     : document.getElementById('f_phone').value.trim(),
    service   : serviceSelect.value,
    scrapType : document.getElementById('f_scrap_type').value || '',
    capacity  : document.getElementById('f_capacity').value || '',
    location  : document.getElementById('f_location').value.trim(),
    message   : document.getElementById('f_message').value.trim(),
    source    : 'Website'
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method : 'POST',
      mode   : 'no-cors',     // Required for Apps Script
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(payload)
    });

    // no-cors means we can't read the response — assume success if no error thrown
    showSuccess();

  } catch (err) {
    console.error('Form submission error:', err);
    formErrorMsg.style.display = 'block';
    submitBtn.disabled = false;
    submitIcon.style.display = 'block';
    submitSpinner.style.display = 'none';
    submitText.textContent = 'Send Enquiry';
  }
});

function showSuccess() {
  formContent.style.display = 'none';
  formSuccess.style.display = 'block';
}

// ============================================
// INTERSECTION OBSERVER — FADE IN ON SCROLL
// ============================================
const observerOpts = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll(
  '.service-card, .testimonial-card, .why-item, .about-feature, .gallery-item, .contact-item'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
