
"use strict";
(() => {
  const WHATSAPP_NUMBER = "51939017959";
  const whatsappUrl = (product = "") => {
    const cleanProduct = String(product).replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 120);
    const message = cleanProduct
      ? `Hola, Importadora de Repuestos La Roca. Quisiera consultar por ${cleanProduct}.`
      : "Hola, Importadora de Repuestos La Roca. Quisiera información sobre sus productos.";
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      const url = whatsappUrl(el.dataset.product || "");
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (!opened) window.location.href = url;
    });
  });

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (toggle && nav) {
    const closeMenu = () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰ Menú";
    };
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "✕ Cerrar" : "☰ Menú";
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (nav.classList.contains("open") && !nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  const backTop = document.querySelector(".back-top");
  const updateBackTop = () => backTop?.classList.toggle("show", window.scrollY > 450);
  window.addEventListener("scroll", updateBackTop, { passive: true });
  updateBackTop();
  backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const search = document.querySelector("#catalog-search");
  const category = document.querySelector("#catalog-category");
  const cards = [...document.querySelectorAll("[data-product-card]")];
  function filterCatalog() {
    if (!cards.length) return;
    const query = (search?.value || "").toLocaleLowerCase("es").trim();
    const selectedCategory = category?.value || "all";
    let count = 0;
    cards.forEach((card) => {
      const text = (card.dataset.search || card.textContent || "").toLocaleLowerCase("es");
      const visible = text.includes(query) && (selectedCategory === "all" || card.dataset.category === selectedCategory);
      card.hidden = !visible;
      if (visible) count += 1;
    });
    const counter = document.querySelector("#catalog-count");
    if (counter) counter.textContent = `${count} ${count === 1 ? "producto encontrado" : "productos encontrados"}`;
    const empty = document.querySelector("#catalog-empty");
    if (empty) empty.hidden = count !== 0;
  }
  search?.addEventListener("input", filterCatalog);
  category?.addEventListener("change", filterCatalog);
  filterCatalog();

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  // External links should not receive a reference to the originating page.
  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = "noopener noreferrer";
  });
})();
