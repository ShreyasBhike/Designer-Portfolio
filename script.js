const DATA_URL = "test/test-data.json";

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

async function loadPortfolioData() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Could not load ${DATA_URL}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    showToast("Could not load portfolio data. Use a local server to run this site.");
    throw error;
  }
}

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value ?? "";
}

function renderNavigation(data) {
  setText("#logo", data.navigation.logo);
  const desktop = $("#desktop-nav");
  const mobile = $("#mobile-nav");

  desktop.innerHTML = data.navigation.links.map(link =>
    `<a href="${link.href}">${link.label}</a>`
  ).join("");

  mobile.innerHTML = data.navigation.links.map(link =>
    `<a href="${link.href}">${link.label}</a>`
  ).join("");

  $("#menu-toggle").addEventListener("click", () => {
    const button = $("#menu-toggle");
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    mobile.hidden = isOpen;
  });

  $$("#mobile-nav a").forEach(link => {
    link.addEventListener("click", () => {
      mobile.hidden = true;
      $("#menu-toggle").setAttribute("aria-expanded", "false");
      $("#menu-toggle").setAttribute("aria-label", "Open menu");
    });
  });
}

function renderHero(data) {
  setText("#hero-eyebrow", data.hero.eyebrow);
  setText("#hero-headline", data.hero.headline);
  setText("#hero-description", data.hero.description);
  setText("#availability", data.designer.availability);
  setText("#browser-label", data.hero.browserLabel);
  setText("#browser-message", data.hero.browserMessage);

  const primary = $("#hero-primary");
  primary.textContent = data.hero.primaryCta.label;
  primary.href = data.hero.primaryCta.href;

  const secondary = $("#hero-secondary");
  secondary.textContent = data.hero.secondaryCta.label;
  secondary.href = data.hero.secondaryCta.href;
}

function renderTools(data) {
  const track = $("#tools-track");
  const tools = [...data.tools, ...data.tools];
  track.innerHTML = tools.map(tool => `<span class="tool">${tool}</span>`).join("");
}

function renderServices(data) {
  setText("#services-eyebrow", data.servicesIntro.eyebrow);
  setText("#services-heading", data.servicesIntro.heading);
  setText("#services-note", data.servicesIntro.note);

  $("#stats").innerHTML = data.stats.map(stat => `
    <div class="stat">
      <span class="stat-value">${stat.value}</span>
      <span class="stat-label">${stat.label}</span>
    </div>
  `).join("");

  $("#services-grid").innerHTML = data.services.map(service => `
    <article class="service-card" data-id="${service.id}" role="button" tabindex="0" aria-expanded="false">
      <div>
        <div class="service-icon" style="background:${service.color}" aria-hidden="true">${service.icon}</div>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
      </div>
      <span class="service-link">Learn more ↗</span>
    </article>
  `).join("");

  setupServicesGallery(data.services);
}

function setupServicesGallery(services) {
  const grid = $("#services-grid");
  const gallery = $("#services-gallery");
  let openId = null;

  function closeGallery() {
    openId = null;
    gallery.hidden = true;
    gallery.innerHTML = "";
    $$(".service-card", grid).forEach(card => {
      card.classList.remove("active");
      card.setAttribute("aria-expanded", "false");
    });
  }

  function openGallery(service, card) {
    openId = service.id;
    $$(".service-card", grid).forEach(c => {
      c.classList.toggle("active", c === card);
      c.setAttribute("aria-expanded", String(c === card));
    });
    gallery.innerHTML = `
      <div class="gallery-heading">
        <h4>${service.title} — Recent work</h4>
      </div>
      <div class="gallery-grid">
        ${service.gallery.map(src => `<img src="${src}" alt="${service.title} sample" loading="lazy">`).join("")}
      </div>
    `;
    gallery.hidden = false;
  }

  function toggle(card) {
    const service = services.find(s => s.id === card.dataset.id);
    if (!service || !service.gallery) return;
    if (openId === service.id) {
      closeGallery();
    } else {
      openGallery(service, card);
    }
  }

  grid.addEventListener("click", event => {
    const card = event.target.closest(".service-card");
    if (card) toggle(card);
  });

  grid.addEventListener("keydown", event => {
    const card = event.target.closest(".service-card");
    if (card && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      toggle(card);
    }
  });
}

function renderPortfolio(data) {
  setText("#portfolio-eyebrow", data.portfolioIntro.eyebrow);
  setText("#portfolio-heading", data.portfolioIntro.heading);
  setText("#portfolio-description", data.portfolioIntro.description);

  $("#portfolio-grid").innerHTML = data.portfolio.map(project => `
    <article class="project-card reveal" style="transform:rotate(${project.rotation}deg)">
      <div class="project-image-wrap">
        <img class="project-image" src="${project.image}" alt="${project.imageAlt}" loading="lazy">
      </div>
      <div class="project-info">
        <div class="project-top">
          <div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-meta">${project.category} · ${project.year} · ${project.client}</p>
          </div>
          <span class="project-arrow" aria-hidden="true">↗</span>
        </div>
        <p class="project-desc">${project.description}</p>
        <div class="tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
    </article>
  `).join("");
}

function renderTestimonials(data) {
  setText("#testimonials-eyebrow", data.testimonialsIntro.eyebrow);
  setText("#testimonials-heading", data.testimonialsIntro.heading);
  setText("#testimonials-note", data.testimonialsIntro.note);

  $("#testimonial-grid").innerHTML = data.testimonials.map(item => `
    <article class="testimonial-card reveal">
      <div class="quote-mark">“</div>
      <p class="quote">${item.quote}</p>
      <div class="client">
        <img class="client-avatar" src="${item.avatar}" alt="" loading="lazy">
        <div>
          <div class="client-name">${item.clientName}</div>
          <div class="client-role">${item.clientRole}, ${item.company}</div>
        </div>
      </div>
    </article>
  `).join("");
}

function renderCTA(data) {
  setText("#cta-eyebrow", data.cta.eyebrow);
  setText("#cta-heading", data.cta.heading);
  setText("#cta-description", data.cta.description);
  setText("#cta-small", data.cta.smallText);

  const button = $("#cta-button");
  button.textContent = data.cta.buttonText;
  button.href = `mailto:${data.cta.email}?subject=${encodeURIComponent("Project enquiry for Darshana")}`;
}

function renderFooter(data) {
  setText("#footer-brand", data.footer.brand);
  setText("#copyright", data.footer.copyright);
  setText("#location", data.footer.location);

  $("#socials").innerHTML = data.footer.socials.map(social =>
    `<a href="${social.url}" target="_blank" rel="noopener noreferrer" aria-label="${social.label}">${social.short}</a>`
  ).join("");
}

function makeDecoration(item) {
  const element = document.createElement("span");
  element.className = `decoration ${item.type}`;
  element.setAttribute("aria-hidden", "true");

  element.style.left = item.x;
  element.style.top = item.y;
  element.style.width = `${item.size}px`;
  element.style.height = `${item.size}px`;
  element.style.color = item.color;
  element.style.transform = `rotate(${item.rotation || 0}deg)`;

  return element;
}

function renderDecorations(data) {
  Object.entries(data.decorations).forEach(([section, decorations]) => {
    const layer = document.querySelector(`[data-decorations="${section}"]`);
    if (!layer) return;
    decorations.forEach(item => layer.appendChild(makeDecoration(item)));
  });
}

function setupRevealAnimations() {
  const elements = $$(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

function setupSmoothAnchorClicks() {
  document.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

async function init() {
  const data = await loadPortfolioData();

  document.title = data.site.title;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = data.site.description;

  renderNavigation(data);
  renderHero(data);
  renderTools(data);
  renderServices(data);
  renderPortfolio(data);
  renderTestimonials(data);
  renderCTA(data);
  renderFooter(data);
  renderDecorations(data);
  setupRevealAnimations();
  setupSmoothAnchorClicks();
}

init();
