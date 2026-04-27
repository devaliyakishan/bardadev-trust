let pageFlip;
let flipLock = false;

document.addEventListener("DOMContentLoaded", function () {  
  // Swiper Hero Slider
  new Swiper(".heroSwiper", {
    loop: true,
    effect: "fade",
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true, type: "bullets" },
  });

  // Animate On Scroll
  AOS.init({ duration: 1000, once: true, offset: 100 });

  // Mobile menu toggle
  (function () {
    const btn = document.getElementById("mobile-menu-btn");
    const menu = document.getElementById("mobile-menu");
    if (!btn || !menu) return;
    const bars = btn.querySelectorAll(".menu-bar");

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
      flippingTime: 800 // Explicitly set animation time (milliseconds)
    });
    pageFlip.loadFromHTML(pagesList);
  }

  const wrapper = document.getElementById("kankotri-scroll-wrapper");
  const progressBar = document.getElementById("flip-progress-bar");
  const hint = document.getElementById("flip-scroll-hint");

  window.addEventListener("scroll", function () {
    if (!pageFlip || !wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const wrapperScrollHeight = wrapper.offsetHeight - window.innerHeight;
    
    // Calculate scrolled distance
    let scrolled = -rect.top;

    // 2. Clamp the scroll value instead of returning early
    // This ensures we always hit 0% at the top and 100% at the bottom
    scrolled = Math.max(0, Math.min(scrolled, wrapperScrollHeight));

    const progress = scrolled / wrapperScrollHeight;

    // Update Progress Bar
    if (progressBar) {
      progressBar.style.width = (progress * 100) + "%";
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
  const modal = document.getElementById('videoModal');
  const videoPlayer = document.getElementById('historyVideoPlayer');
  const videoContainer = document.getElementById('videoContainer');

  window.openHistoryVideo = function() {
    if (!modal || !videoPlayer || !videoContainer) return;
    
    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Tiny delay to allow CSS transitions to work
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      videoContainer.classList.remove('scale-95');
      videoContainer.classList.add('scale-100');
    }, 10);

    // Play the video with sound!
    videoPlayer.play();
  };

  window.closeHistoryVideo = function() {
    if (!modal || !videoPlayer || !videoContainer) return;
    
    // Animate out
    modal.classList.add('opacity-0');
    videoContainer.classList.remove('scale-100');
    videoContainer.classList.add('scale-95');

    // Wait for animation to finish before hiding and pausing
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      
      // Pause and reset video
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
    }, 300);
  };

  // Close modal if user clicks outside the video
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        window.closeHistoryVideo();
      }
    });
  }
});
