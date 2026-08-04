// -------- AUDIO (customizable via <audio> tag) --------
const audioEl = document.getElementById("clickSound");

function playClick() {
  // Reset and play
  audioEl.currentTime = 0;
  audioEl.play().catch(function (e) {
    // Autoplay policy fallback: resume on interaction
    if (e.name === "NotAllowedError") {
      audioEl.play();
    }
  });
}
(function () {
  const loader = document.getElementById("loader");
  const MIN_DISPLAY_MS = 1800;
  let startTime = Date.now();
  let isHidden = false;

  function hideLoader() {
    if (isHidden) return;
    isHidden = true;
    loader.classList.add("loader-hidden");
  }

  function checkAndHide() {
    if (isHidden) return;
    const elapsed = Date.now() - startTime;
    if (elapsed >= MIN_DISPLAY_MS) {
      hideLoader();
    } else {
      setTimeout(checkAndHide, MIN_DISPLAY_MS - elapsed);
    }
  }

  // Stagger delays
  document.querySelectorAll(".loader-letter[data-delay]").forEach((el) => {
    const delay = parseInt(el.getAttribute("data-delay"), 10) || 0;
    el.style.setProperty("--delay", delay);
  });

  // On load, check
  if (document.readyState === "complete") {
    setTimeout(checkAndHide, 100);
  } else {
    window.addEventListener("load", function onLoad() {
      window.removeEventListener("load", onLoad);
      setTimeout(checkAndHide, 100);
    });
  }

  // Safety fallback
  setTimeout(() => {
    if (!loader.classList.contains("loader-hidden")) {
      hideLoader();
    }
  }, 5000);
})();
// -------- DOM refs --------
const ham = document.getElementById("navhamburger");
const overlay = document.getElementById("navoverlay");
const closeBtn = document.getElementById("navclose");
const nav = document.getElementById("navwrapper");
const themeToggle = document.getElementById("themeToggle");

// -------- THEME TOGGLE LOGIC --------
// This controls the entire page
themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  playClick(); // Play audio on theme change
});

// -------- Helper: Open sidebar --------
function openSidebar() {
  playClick();
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
  ham.classList.add("active");
  document.body.style.overflow = "hidden";
}

// -------- Helper: Close sidebar --------
function closeSidebar() {
  playClick();
  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
  ham.classList.remove("active");
  document.body.style.overflow = "";
}

// -------- Toggle sidebar on hamburger click --------
ham.addEventListener("click", function (e) {
  e.stopPropagation();
  if (overlay.classList.contains("active")) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

// -------- Close sidebar via close button --------
closeBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  closeSidebar();
});

// -------- Close on overlay background click (click outside content) --------
overlay.addEventListener("click", function (e) {
  if (e.target === overlay) {
    closeSidebar();
  }
});

// -------- Close on Escape key --------
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && overlay.classList.contains("active")) {
    closeSidebar();
  }
});

// -------- Sticky navbar on scroll (threshold: 40px) --------
window.addEventListener(
  "scroll",
  function () {
    if (window.scrollY > 40) {
      nav.classList.add("navsticky");
    } else {
      nav.classList.remove("navsticky");
    }
  },
  { passive: true },
);

// -------- Keyboard accessibility for hamburger --------
ham.addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (overlay.classList.contains("active")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
});

// -------- Keyboard accessibility for close button --------
closeBtn.addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    closeSidebar();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    easing: "cubic-bezier(0.19, 1, 0.22, 1)",
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // 1. Initialize AOS
  AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    easing: "cubic-bezier(0.19, 1, 0.22, 1)",
  });

  // 2. Number Counters with IntersectionObserver
  const counters = document.querySelectorAll(".secstatnumber");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-target"));
          const suffix = el.querySelector("span")
            ? el.querySelector("span").outerHTML
            : "";
          let current = 0;
          const increment = target / 60; // Smooth 60fps step

          const updateCount = () => {
            current += increment;
            if (current < target) {
              el.innerHTML = Math.floor(current) + suffix;
              requestAnimationFrame(updateCount);
            } else {
              el.innerHTML = target + suffix;
            }
          };
          updateCount();

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.4 },
  );

  counters.forEach((counter) => observer.observe(counter));
});

document.addEventListener("DOMContentLoaded", function () {
  // 1. Initialize AOS
  AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    easing: "cubic-bezier(0.19, 1, 0.22, 1)",
  });

  // 2. Horizontal Drawer Slider (2 images per view, 3 pairs total)
  const track = document.getElementById("thrslidertrack");
  const totalSlides = 6; // We now have exactly 6 slides
  const visibleSlides = 2; // Show 2 items per view on desktop
  let currentIndex = 0;
  let autoSlideInterval;

  function updateSlider() {
    track.style.transition = "transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)";
    // Since each slide is 50% width on desktop, shifting by 2 slides moves 100% (1 pair)
    track.style.transform = `translateX(-${currentIndex * (100 / visibleSlides)}%)`;
  }

  function nextSlide() {
    // Check if there's a next pair to show
    if (currentIndex < totalSlides - visibleSlides) {
      currentIndex += visibleSlides; // Move to next pair (e.g., from 0 to 2, 2 to 4)
    } else {
      currentIndex = 0; // Loop back to the very first pair
    }
    updateSlider();
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex -= visibleSlides; // Move back to previous pair
    } else {
      currentIndex = totalSlides - visibleSlides; // Loop back to the last pair (e.g., 4)
    }
    updateSlider();
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 1500); // 1.5 seconds
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Manual Controls
  document.getElementById("thrnavprev").addEventListener("click", function () {
    prevSlide();
    resetAutoSlide();
  });
  document.getElementById("thrnavnext").addEventListener("click", function () {
    nextSlide();
    resetAutoSlide();
  });

  // Start auto-play
  startAutoSlide();
});

document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    easing: "cubic-bezier(0.19, 1, 0.22, 1)",
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // 1. Initialize AOS
  AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    easing: "cubic-bezier(0.19, 1, 0.22, 1)",
  });

  // 2. Interactive Preview Hover Effect
  const members = document.querySelectorAll(".fifmember");
  const previewContainer = document.getElementById("fifpreview");
  const previewImg = document.getElementById("fifpreviewimg");

  members.forEach((member) => {
    // Hover Enter
    member.addEventListener("mouseenter", function () {
      // Ensure we are on desktop (screen > 1024px) where preview is visible
      if (window.innerWidth >= 1024) {
        const imgSrc = this.getAttribute("data-image");
        previewImg.src = imgSrc;
        previewContainer.classList.add("fifactive");
      }
    });

    // Hover Leave
    member.addEventListener("mouseleave", function () {
      if (window.innerWidth >= 1024) {
        previewContainer.classList.remove("fifactive");
        // Optional: Clear the image after fade out
        setTimeout(() => {
          if (!previewContainer.classList.contains("fifactive")) {
            previewImg.src = "";
          }
        }, 600);
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // 1. Initialize AOS
  AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    easing: "cubic-bezier(0.19, 1, 0.22, 1)",
  });

  // 2. Perfect Infinite Drawer Slider (1 Card Slide per click/time)
  const track = document.getElementById("sixslidertrack");
  const totalSlides = 8;
  let currentIndex = 0;
  let autoSlideInterval;

  function getVisibleCount() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function getMaxIndex() {
    const visible = getVisibleCount();
    return totalSlides - visible;
  }

  function updateSlider() {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const shiftPercent = (currentIndex / totalSlides) * 100;
    track.style.transition = "transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)";
    track.style.transform = `translateX(-${shiftPercent}%)`;
  }

  function nextSlide() {
    const maxIndex = getMaxIndex();
    currentIndex++;

    if (currentIndex > maxIndex) {
      // Instantly jump back to the start
      track.style.transition = "none";
      currentIndex = 0;
      track.style.transform = `translateX(0%)`;

      // Force a browser reflow to apply the instant jump
      track.offsetHeight;

      // Immediately animate to the next card (index 1)
      track.style.transition = "transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)";
      currentIndex = 1;
      track.style.transform = `translateX(-${(1 / totalSlides) * 100}%)`;
    } else {
      updateSlider();
    }
  }

  function prevSlide() {
    const maxIndex = getMaxIndex();
    currentIndex--;

    if (currentIndex < 0) {
      // Instantly jump to the last possible viewport
      track.style.transition = "none";
      currentIndex = maxIndex + 1;
      track.style.transform = `translateX(-${((maxIndex + 1) / totalSlides) * 100}%)`;

      // Force a browser reflow
      track.offsetHeight;

      // Immediately animate to the previous card (maxIndex)
      track.style.transition = "transform 0.6s cubic-bezier(0.19, 1, 0.22, 1)";
      currentIndex = maxIndex;
      track.style.transform = `translateX(-${(maxIndex / totalSlides) * 100}%)`;
    } else {
      updateSlider();
    }
  }

  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 3000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Manual Controls
  document.getElementById("sixprev").addEventListener("click", function () {
    prevSlide();
    resetAutoSlide();
  });
  document.getElementById("sixnext").addEventListener("click", function () {
    nextSlide();
    resetAutoSlide();
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
        updateSlider();
      }
    }, 250);
  });

  // Initialize slider and auto-play
  updateSlider();
  startAutoSlide();
});

document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 800,
    offset: 100,
    once: true,
    easing: "cubic-bezier(0.19, 1, 0.22, 1)",
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var ftrscrollToTopBtn = document.getElementById("ftrscrollToTopBtn");

  // Show/hide floating scroll button based on viewport scroll position
  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      ftrscrollToTopBtn.classList.add("visible");
    } else {
      ftrscrollToTopBtn.classList.remove("visible");
    }
  });

  // Smooth scroll to top behavior on click
  ftrscrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
