const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const actions = document.querySelector('.header-actions');
if (toggle) {
  toggle.addEventListener('click', () => {
    nav?.classList.toggle('open');
    actions?.classList.toggle('open');
  });
}

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    actions?.classList.remove('open');
  });
});

const phoneModalTemplate = `
  <div class="phone-modal" id="phone-modal" role="dialog" aria-modal="true" aria-labelledby="phone-modal-title" hidden>
    <div class="phone-modal-backdrop" data-phone-close></div>
    <div class="phone-modal-panel" tabindex="-1">
      <button class="phone-modal-x" type="button" data-phone-close aria-label="閉じる">×</button>
      <p class="section-label">電話相談</p>
      <h2 id="phone-modal-title">お気軽にお電話ください</h2>
      <a class="phone-modal-number" href="tel:09051822129" data-phone-call>090-5182-2129</a>
      <p class="phone-modal-hours">受付時間：9:00〜18:00（年中無休）</p>
      <p class="phone-modal-note">スマートフォンをご利用の場合は、電話番号をタップすると発信できます。</p>
      <div class="phone-modal-actions">
        <a class="btn btn-green phone-call-btn" href="tel:09051822129" data-phone-call>電話をかける</a>
        <button class="btn btn-light" type="button" data-phone-close>閉じる</button>
      </div>
    </div>
  </div>
`;

const lineFriendUrl = 'https://line.me/R/ti/p/@191wwmqs';
const lineModalTemplate = `
  <div class="phone-modal line-modal" id="line-modal" role="dialog" aria-modal="true" aria-labelledby="line-modal-title" hidden>
    <div class="phone-modal-backdrop" data-line-close></div>
    <div class="phone-modal-panel line-modal-panel" tabindex="-1">
      <button class="phone-modal-x" type="button" data-line-close aria-label="閉じる">×</button>
      <p class="section-label">LINE相談</p>
      <h2 id="line-modal-title">LINE公式アカウント</h2>
      <p class="line-modal-text">スマートフォンで下のQRコードを読み取り、友だち追加してからご相談ください。</p>
      <img class="line-qr" src="assets/line-qr.svg" alt="Leaf Japanese Antique LINE公式アカウントの友だち追加QRコード" />
      <p class="line-modal-id">LINE ID：@191wwmqs</p>
      <div class="phone-modal-actions">
        <a class="btn btn-green" href="${lineFriendUrl}" target="_blank" rel="noopener">LINEを開く</a>
        <button class="btn btn-light" type="button" data-line-close>閉じる</button>
      </div>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', phoneModalTemplate + lineModalTemplate);

const phoneModal = document.querySelector('#phone-modal');
const phoneModalPanel = phoneModal?.querySelector('.phone-modal-panel');
const phoneTriggers = document.querySelectorAll('[data-phone-modal]');
const phoneCallLinks = document.querySelectorAll('[data-phone-call]');
let lastPhoneTrigger = null;

const canPlacePhoneCall = () => window.matchMedia('(max-width: 820px)').matches;
const shouldOpenLineDirectly = () => window.matchMedia('(max-width: 820px)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const openPhoneModal = (trigger) => {
  if (!phoneModal) return;
  lastPhoneTrigger = trigger;
  phoneModal.hidden = false;
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => phoneModal.classList.add('is-open'));
  phoneModalPanel?.focus?.();
};

const closePhoneModal = () => {
  if (!phoneModal) return;
  phoneModal.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  window.setTimeout(() => {
    phoneModal.hidden = true;
    lastPhoneTrigger?.focus?.();
  }, 180);
};

const lineModal = document.querySelector('#line-modal');
const lineModalPanel = lineModal?.querySelector('.line-modal-panel');
const lineTriggers = document.querySelectorAll(`a[href="${lineFriendUrl}"]`);
let lastLineTrigger = null;

const openLineModal = (trigger) => {
  if (!lineModal) return;
  lastLineTrigger = trigger;
  lineModal.hidden = false;
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => lineModal.classList.add('is-open'));
  lineModalPanel?.focus?.();
};

const closeLineModal = () => {
  if (!lineModal) return;
  lineModal.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  window.setTimeout(() => {
    lineModal.hidden = true;
    lastLineTrigger?.focus?.();
  }, 180);
};

phoneTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openPhoneModal(trigger);
  });
});

lineTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    if (shouldOpenLineDirectly() || trigger.closest('.line-modal')) return;
    event.preventDefault();
    openLineModal(trigger);
  });
});

document.querySelectorAll('[data-phone-close]').forEach((closer) => {
  closer.addEventListener('click', closePhoneModal);
});

document.querySelectorAll('[data-line-close]').forEach((closer) => {
  closer.addEventListener('click', closeLineModal);
});

phoneCallLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (!canPlacePhoneCall()) event.preventDefault();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && phoneModal && !phoneModal.hidden) closePhoneModal();
  if (event.key === 'Escape' && lineModal && !lineModal.hidden) closeLineModal();
});

const heroSlider = document.querySelector('[data-hero-slider]');
if (heroSlider) {
  const slides = [...heroSlider.querySelectorAll('.hero-slide')];
  const dots = [...heroSlider.querySelectorAll('[data-hero-dot]')];
  const prev = heroSlider.querySelector('[data-hero-prev]');
  const next = heroSlider.querySelector('[data-hero-next]');
  let activeIndex = 0;
  let sliderTimer;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  };

  const restartSlider = () => {
    window.clearInterval(sliderTimer);
    sliderTimer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
  };

  prev?.addEventListener('click', () => {
    showSlide(activeIndex - 1);
    restartSlider();
  });

  next?.addEventListener('click', () => {
    showSlide(activeIndex + 1);
    restartSlider();
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.heroDot));
      restartSlider();
    });
  });

  restartSlider();
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.querySelectorAll('details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (detail.open) {
      document.querySelectorAll('details').forEach((other) => {
        if (other !== detail) other.open = false;
      });
    }
  });
});

document.querySelector('.top-btn')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const itemGrid = document.querySelector('.all-items');
if (itemGrid) {
  const itemArticles = [...itemGrid.querySelectorAll('article')];
  const note = document.createElement('p');
  note.className = 'item-filter-note';
  note.innerHTML = '<a href="items.html">すべての買取品目を見る</a>';
  itemGrid.before(note);

  const applyItemFilter = () => {
    const id = decodeURIComponent(window.location.hash.replace('#', ''));
    const target = id ? document.getElementById(id) : null;
    const shouldFilter = Boolean(target && itemGrid.contains(target));

    itemGrid.classList.toggle('is-filtered', shouldFilter);
    note.hidden = !shouldFilter;
    itemArticles.forEach((article) => {
      article.classList.toggle('is-active', article === target);
    });

    if (shouldFilter) {
      window.setTimeout(() => {
        target.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, 40);
    }
  };

  applyItemFilter();
  window.addEventListener('hashchange', applyItemFilter);
}
