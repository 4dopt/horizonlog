/**
 * Horizon Logistics London - Main Interactive Logic (Refined 2026)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer & Accordions
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawer = document.getElementById('closeDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function toggleDrawer(open) {
    if (!mobileDrawer) return;
    if (open) {
      mobileDrawer.classList.add('open');
      if (drawerOverlay) drawerOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('open');
      if (drawerOverlay) drawerOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', () => toggleDrawer(true));
  if (closeDrawer) closeDrawer.addEventListener('click', () => toggleDrawer(false));
  if (drawerOverlay) drawerOverlay.addEventListener('click', () => toggleDrawer(false));

  // Drawer Accordions
  const drawerAccordions = document.querySelectorAll('.drawer-accordion-btn');
  drawerAccordions.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const submenu = document.getElementById(targetId);
      const chevron = btn.querySelector('.drawer-chevron');
      if (submenu) {
        const isOpen = submenu.classList.contains('open');
        submenu.classList.toggle('open');
        if (chevron) {
          chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }
      }
    });
  });

  // Close drawer on link click
  const drawerLinks = document.querySelectorAll('.mobile-drawer a:not(.drawer-accordion-btn)');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // 2. Sticky Header on Scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(i => {
          i.classList.remove('active');
          const a = i.querySelector('.faq-answer');
          if (a) a.style.maxHeight = null;
        });
        // Open clicked if wasn't active
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  // 4. Coverage Search & Filter Tabs
  const coverageTabs = document.querySelectorAll('.coverage-tab');
  const coverageGroups = document.querySelectorAll('.coverage-group');
  const coverageSearch = document.getElementById('coverageSearch');
  const allBoroughChips = document.querySelectorAll('.borough-chip');

  if (coverageTabs.length) {
    coverageTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-target');
        coverageTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Clear search input on tab click
        if (coverageSearch) coverageSearch.value = '';
        allBoroughChips.forEach(chip => chip.style.display = '');

        coverageGroups.forEach(group => {
          if (target === 'all' || group.getAttribute('data-category') === target) {
            group.style.display = 'block';
          } else {
            group.style.display = 'none';
          }
        });
      });
    });
  }

  // Real-time search filter
  if (coverageSearch) {
    coverageSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      coverageGroups.forEach(g => g.style.display = 'block'); // Show all groups while searching

      allBoroughChips.forEach(chip => {
        const text = chip.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          chip.style.display = '';
        } else {
          chip.style.display = 'none';
        }
      });
    });
  }

  // 5. Temperature Range Selector Interactive Showcase & Gauge
  const tempPills = document.querySelectorAll('.temp-pill');
  const tempDisplay = document.getElementById('tempDisplay');
  const tempDesc = document.getElementById('tempDesc');
  const tempItems = document.getElementById('tempItems');
  const tempGaugeIndicator = document.getElementById('tempGaugeIndicator');

  const tempData = {
    frozen: {
      range: '-25°C to -18°C Deep Frozen',
      desc: 'Strictly monitored sub-zero transportation using dual-evaporator Thermo King & Carrier units. Ideal for frozen meat, seafood, ice cream, medical specimens & bio-materials.',
      cargo: 'Ice Cream, Frozen Meats, Seafood, Biological Plasma, Cryo-samples',
      gaugePos: '15%'
    },
    chilled: {
      range: '+2°C to +8°C Chilled & GDP Pharma',
      desc: 'Precision temperature maintenance for high-risk pharmaceuticals, fresh produce, meat, dairy and catered foods. Complete calibration certificates & onboard real-time telemetry.',
      cargo: 'Vaccines, Biologics, Fresh Dairy, Deli, Meat & Poultry, Floristry',
      gaugePos: '50%'
    },
    ambient: {
      range: '+15°C to +25°C Controlled Ambient',
      desc: 'Insulated and climate-controlled freight preventing temperature fluctuations during summer heatwaves or winter freezes.',
      cargo: 'Specialty Confectionery, Fine Wines, Luxury Cosmetics, Sensitive Electronics',
      gaugePos: '85%'
    }
  };

  tempPills.forEach(pill => {
    pill.addEventListener('click', () => {
      tempPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const key = pill.getAttribute('data-temp');
      if (tempData[key]) {
        if (tempDisplay) tempDisplay.textContent = tempData[key].range;
        if (tempDesc) tempDesc.textContent = tempData[key].desc;
        if (tempItems) tempItems.textContent = 'Standard Cargo: ' + tempData[key].cargo;
        if (tempGaugeIndicator) tempGaugeIndicator.style.left = tempData[key].gaugePos;
      }
    });
  });

  // 6. Interactive Instant Quote Estimator & WhatsApp Pre-fill
  const quoteForm = document.getElementById('instantQuoteForm');
  const quoteResult = document.getElementById('quoteResult');
  const quotePriceDisplay = document.getElementById('quotePriceDisplay');
  const quoteEtaDisplay = document.getElementById('quoteEtaDisplay');
  const quoteWhatsAppBtn = document.getElementById('quoteWhatsAppBtn');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pickup = document.getElementById('calcPickup').value.trim();
      const dropoff = document.getElementById('calcDropoff').value.trim();
      const service = document.getElementById('calcService').value;
      const vehicle = document.getElementById('calcVehicle').value;

      if (!pickup || !dropoff) {
        alert('Please enter both pickup and destination locations.');
        return;
      }

      let baseRate = 45;
      let eta = 'Within 60-90 Mins';

      if (service === 'temp-control') {
        baseRate += 35;
        eta = 'Immediate Dispatch (Pre-cooled vehicle)';
      } else if (service === 'same-day') {
        baseRate += 20;
        eta = 'Pickup within 30-45 mins';
      } else if (service === 'contract') {
        baseRate += 15;
        eta = 'Scheduled Slot Guaranteed';
      }

      if (vehicle === 'luton') {
        baseRate += 40;
      } else if (vehicle === 'lwb') {
        baseRate += 25;
      } else if (vehicle === 'hgv') {
        baseRate += 110;
        eta = 'Custom HGV Route Plan';
      }

      if (quotePriceDisplay) {
        quotePriceDisplay.textContent = 'From £' + baseRate + ' + VAT';
      }
      if (quoteEtaDisplay) {
        quoteEtaDisplay.textContent = eta;
      }
      if (quoteResult) {
        quoteResult.style.display = 'block';
        quoteResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      const msg = `Hello Horizon Logistics London! I would like to request an instant quote:%0A%0A` +
        `• Service: ${service}%0A` +
        `• Vehicle: ${vehicle}%0A` +
        `• Pickup: ${pickup}%0A` +
        `• Destination: ${dropoff}%0A` +
        `• Estimated Rate: From £${baseRate} + VAT%0A%0A` +
        `Please confirm vehicle availability.`;

      if (quoteWhatsAppBtn) {
        quoteWhatsAppBtn.href = `https://wa.me/447878569458?text=${msg}`;
      }
    });
  }

  // 7. Quote Modal Popups
  const modal = document.getElementById('quoteModal');
  const openModalBtns = document.querySelectorAll('.open-quote-modal');
  const closeModalBtn = document.getElementById('closeQuoteModal');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('open');
    });
  });

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => modal.classList.remove('open'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  // 8. Ajax Contact Forms
  const allAjaxForms = document.querySelectorAll('.ajax-contact-form');
  allAjaxForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending Request...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerText = 'Request Sent Successfully!';
          submitBtn.style.background = '#10b981';
        }
        alert('Thank you! Your quote request has been received by our 24/7 London dispatch team. A controller will contact you shortly.');
        form.reset();
        if (modal) modal.classList.remove('open');
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
            submitBtn.style.background = '';
          }
        }, 3000);
      }, 900);
    });
  });
});
