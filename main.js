let pageFlip;
let flipLock = false;

document.addEventListener("DOMContentLoaded", function () {
  // Swiper Hero Slider
  if (typeof Swiper !== "undefined" && document.querySelector(".heroSwiper")) {
    new Swiper(".heroSwiper", {
      loop: true,
      effect: "fade",
      autoplay: { delay: 4000, disableOnInteraction: false },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        type: "bullets",
      },
    });
  }

  // Animate On Scroll
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 1000, once: true, offset: 100 });
  }

  // Mobile menu toggle
  (function () {
    const btn = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");
    if (!btn || !menu) return;
    const bars = btn.querySelectorAll(".menu-bar");
    if (bars.length < 3) return;

    function openMenu() {
      menu.classList.remove("hidden");
      bars[0].style.transform = "translateY(7px) rotate(45deg)";
      bars[1].style.opacity = "0";
      bars[2].style.transform = "translateY(-7px) rotate(-45deg)";
    }

    function closeMenu() {
      menu.classList.add("hidden");
      bars[0].style.transform = "";
      bars[1].style.opacity = "1";
      bars[2].style.transform = "";
    }

    btn.addEventListener("click", function () {
      menu.classList.contains("hidden") ? openMenu() : closeMenu();
    });

    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  })();

  // Header active link state
  (function () {
    const navLinks = Array.from(
      document.querySelectorAll(".home-desktop-link, .site-mobile-link"),
    );
    if (!navLinks.length) return;

    const normalizePath = function (pathname) {
      if (!pathname) return "/";
      let path = pathname.replace(/\/+/g, "/");
      if (path === "/index.html") return "/";
      if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
      return path || "/";
    };

    const currentPath = normalizePath(window.location.pathname);

    const linkMeta = navLinks
      .map(function (link) {
        const href = link.getAttribute("href");
        if (!href) return null;

        let url;
        try {
          url = new URL(href, window.location.origin);
        } catch (err) {
          return null;
        }

        const path = normalizePath(url.pathname);
        const hash = url.hash || "";
        const sectionId = hash ? hash.slice(1) : "";
        const section = sectionId ? document.getElementById(sectionId) : null;

        return { link, path, hash, section };
      })
      .filter(Boolean);

    const samePathLinks = linkMeta.filter(function (item) {
      return item.path === currentPath;
    });

    const sectionLinks = samePathLinks.filter(function (item) {
      return item.hash && item.section;
    });

    const defaultLink =
      samePathLinks.find(function (item) {
        return !item.hash;
      }) || null;

    const setActive = function (targetLink) {
      navLinks.forEach(function (link) {
        link.classList.remove("active-link");
        link.removeAttribute("aria-current");
      });

      if (!targetLink) return;
      targetLink.classList.add("active-link");
      targetLink.setAttribute("aria-current", "page");
    };

    const selectByHash = function () {
      const currentHash = (window.location.hash || "").toLowerCase();
      if (!currentHash) return null;

      return (
        samePathLinks.find(function (item) {
          return item.hash.toLowerCase() === currentHash;
        }) || null
      );
    };

    const selectByScroll = function () {
      if (!sectionLinks.length) return null;

      const header = document.querySelector(".site-header");
      const headerOffset = header ? header.offsetHeight + 20 : 120;
      const scrollLine = window.scrollY + headerOffset;

      let candidate = null;
      sectionLinks.forEach(function (item) {
        if (item.section.offsetTop <= scrollLine) {
          candidate = item;
        }
      });

      return candidate;
    };

    const updateActiveLink = function () {
      const hashMatch = selectByHash();
      if (hashMatch) {
        setActive(hashMatch.link);
        return;
      }

      const scrollMatch = selectByScroll();
      if (scrollMatch) {
        setActive(scrollMatch.link);
        return;
      }

      setActive(defaultLink ? defaultLink.link : null);
    };

    updateActiveLink();
    window.addEventListener("scroll", updateActiveLink, { passive: true });
    window.addEventListener("resize", updateActiveLink);
    window.addEventListener("hashchange", updateActiveLink);
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setTimeout(updateActiveLink, 0);
      });
    });
  })();

  // Contact subscribe form submit (AJAX)
  (function () {
    const form = document.getElementById("contact-subscribe-form");
    const status = document.getElementById("contact-subscribe-status");
    if (!form || !status) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const defaultBtnText = submitBtn ? submitBtn.textContent : "";

    const setStatus = function (message, isError) {
      status.textContent = message;
      status.classList.toggle("is-error", Boolean(isError));
    };

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      setStatus("મોકલી રહ્યું છે...", false);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "મોકલાઈ રહ્યું...";
      }
      try {
        const response = await fetch(
          "https://formsubmit.co/ajax/kishanimages2025@gmail.com",
          {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" },
          },
        );
        const data = await response.json().catch(function () {
          return null;
        });
        if (!response.ok || (data && data.success === false)) {
          throw new Error("Submission failed");
        }

        form.reset();
        setStatus("આભાર! તમારું ઇમેઇલ સફળતાપૂર્વક સબસ્ક્રાઇબ થયું.", false);
      } catch (error) {
        setStatus(
          "હાલમાં સબમિટ થઈ શક્યું નથી. કૃપા કરીને ફરી પ્રયાસ કરો.",
          true,
        );
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultBtnText;
        }
      }
    });
  })();
});

document.addEventListener("DOMContentLoaded", function () {
  const flipbookEl = document.getElementById("flipbook");
  const pagesList = document.querySelectorAll("#flipbook .page");
  const totalPages = pagesList.length;

  let pageFlip;
  // 1. Declare the flipLock variable
  let flipLock = false;

  if (flipbookEl) {
    pageFlip = new St.PageFlip(flipbookEl, {
      width: 400,
      height: 550,
      size: "stretch",
      minWidth: 300,
      maxWidth: 500,
      minHeight: 400,
      maxHeight: 700,
      maxShadowOpacity: 0.3,
      showCover: true,
      mobileScrollSupport: false,
      usePortrait: true,
      flippingTime: 800, // Explicitly set animation time (milliseconds)
    });
    pageFlip.loadFromHTML(pagesList);
  }

  const wrapper = document.getElementById("kankotri-scroll-wrapper");
  const progressBar = document.getElementById("flip-progress-bar");
  const hint = document.getElementById("flip-scroll-hint");
  const isMobileViewport = () => window.matchMedia("(max-width: 768px)").matches;

  if (wrapper && totalPages > 0) {
    const setWrapperHeight = function () {
      if (isMobileViewport()) {
        wrapper.style.height = "auto";
        return;
      }

      const computedVh = 100 + Math.max(0, totalPages - 1) * 1.6;
      const clampedVh = Math.max(108, Math.min(computedVh, 118));
      wrapper.style.height = clampedVh + "vh";
    };

    setWrapperHeight();
    window.addEventListener("resize", setWrapperHeight);
  }

  if (pageFlip && flipbookEl) {
    flipbookEl.addEventListener("pointerup", function (e) {
      if (!isMobileViewport()) return;

      const rect = flipbookEl.getBoundingClientRect();
      const tapX = e.clientX - rect.left;
      const goPrev = tapX < rect.width * 0.35;

      try {
        if (goPrev) {
          pageFlip.flipPrev("top");
        } else {
          pageFlip.flipNext("top");
        }
      } catch (err) {
        if (goPrev) {
          pageFlip.turnToPrevPage();
        } else {
          pageFlip.turnToNextPage();
        }
      }

      e.preventDefault();
    });
  }

  window.addEventListener("scroll", function () {
    if (!pageFlip || !wrapper) return;
    if (isMobileViewport()) return;

    const rect = wrapper.getBoundingClientRect();
    const wrapperScrollHeight = Math.max(
      wrapper.offsetHeight - window.innerHeight,
      1,
    );

    // Calculate scrolled distance
    let scrolled = -rect.top;

    // 2. Clamp the scroll value instead of returning early
    // This ensures we always hit 0% at the top and 100% at the bottom
    scrolled = Math.max(0, Math.min(scrolled, wrapperScrollHeight));

    const progress = scrolled / wrapperScrollHeight;

    // Update Progress Bar
    if (progressBar) {
      progressBar.style.width = progress * 100 + "%";
    }

    // Hide the hint smoothly once they start scrolling
    if (progress > 0.05 && hint) {
      hint.style.opacity = "0";
      hint.style.transition = "opacity 0.5s ease";
    }

    // 3. Calculate target page safely based on progress
    let targetPage = Math.floor(progress * totalPages);
    if (targetPage >= totalPages) targetPage = totalPages - 1;

    const currentPage = pageFlip.getCurrentPageIndex();

    // Trigger the flip if the page has changed and we aren't locked
    if (targetPage !== currentPage && !flipLock) {
      flipLock = true;

      try {
        // Direct flip works best when we control the lock properly
        pageFlip.flip(targetPage);
      } catch (e) {
        console.warn("Flip interrupted", e);
      }

      // 4. Lock the scroll-trigger until the animation finishes
      // Match this timeout to the 'flippingTime' in your config (800ms)
      setTimeout(function () {
        flipLock = false;
      }, 800);
    }
  });

  // Video modal functionality
  const modal = document.getElementById("videoModal");
  const videoPlayer = document.getElementById("historyVideoPlayer");
  const videoContainer = document.getElementById("videoContainer");

  window.openHistoryVideo = function () {
    if (!modal || !videoPlayer || !videoContainer) return;

    // Show modal
    modal.classList.remove("hidden");
    modal.classList.add("flex");

    // Tiny delay to allow CSS transitions to work
    setTimeout(() => {
      modal.classList.remove("opacity-0");
      videoContainer.classList.remove("scale-95");
      videoContainer.classList.add("scale-100");
    }, 10);

    // Play the video with sound!
    videoPlayer.play();
  };

  window.closeHistoryVideo = function () {
    if (!modal || !videoPlayer || !videoContainer) return;

    // Animate out
    modal.classList.add("opacity-0");
    videoContainer.classList.remove("scale-100");
    videoContainer.classList.add("scale-95");

    // Wait for animation to finish before hiding and pausing
    setTimeout(() => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");

      // Pause and reset video
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
    }, 300);
  };

  // Close modal if user clicks outside the video
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        window.closeHistoryVideo();
      }
    });
  }
});
