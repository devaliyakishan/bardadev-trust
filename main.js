document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      const open = mobileMenu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  const normalizePath = function (path) {
    if (!path) return "/";
    let clean = path.replace(/\/+/g, "/");
    clean = clean.replace(/index\.html$/, "");
    if (clean.length > 1 && clean.endsWith("/")) clean = clean.slice(0, -1);
    return clean || "/";
  };

  const currentPath = normalizePath(window.location.pathname);
  const allNavLinks = document.querySelectorAll("[data-nav-link]");

  allNavLinks.forEach(function (link) {
    const href = link.getAttribute("href");
    if (!href) return;

    let linkPath;
    try {
      linkPath = normalizePath(new URL(href, window.location.origin).pathname);
    } catch (_error) {
      return;
    }

    if (linkPath === currentPath) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll("[data-dismiss-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const selector = btn.getAttribute("data-dismiss-target");
      if (!selector) return;
      const target = document.querySelector(selector);
      if (target) target.remove();
    });
  });

  const attachFormHandler = function (formId, statusId) {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form || !status) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const defaultLabel = submitBtn ? submitBtn.textContent : "મોકલો";

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      status.textContent = "માહિતી મોકલાઈ રહી છે...";
      status.classList.remove("error");

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "મોકલી રહ્યા છીએ...";
      }

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (!response.ok) throw new Error("અસફળ");

        form.reset();
        status.textContent = "આભાર! તમારી માહિતી સફળતાપૂર્વક નોંધાઈ ગઈ છે.";
      } catch (_error) {
        status.textContent = "હાલ મોકલી શકાયું નથી. કૃપા કરીને થોડા સમય પછી ફરી પ્રયાસ કરો.";
        status.classList.add("error");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultLabel;
        }
      }
    });
  };

  attachFormHandler("newsletter-form", "newsletter-status");
  attachFormHandler("contact-form", "contact-status");

  const yearNodes = document.querySelectorAll("[data-current-year]");
  if (yearNodes.length) {
    const year = new Date().getFullYear().toString();
    yearNodes.forEach(function (node) {
      node.textContent = year;
    });
  }
});
