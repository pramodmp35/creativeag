// -------- AUDIO --------
const audioEl = document.getElementById("clickSound");

function playClick() {
  audioEl.currentTime = 0;
  audioEl.play().catch(function (e) {
    if (e.name === "NotAllowedError") {
      audioEl.play();
    }
  });
}

// -------- THEME TOGGLE --------
const themeBtn = document.querySelector(".theme-icon");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-theme") ? "light" : "dark",
  );
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light-theme");
}

// -------- DOM REFS --------
const ham = document.getElementById("navhamburger");
const overlay = document.getElementById("navoverlay");
const closeBtn = document.getElementById("navclose");
const nav = document.getElementById("navwrapper");

// -------- Helper: check if desktop --------
function isDesktop() {
  return window.innerWidth >= 1024;
}

// -------- Helper: Open sidebar --------
function openSidebar() {
  if (isDesktop()) return;
  playClick();
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");
  ham.classList.add("active");
  document.body.style.overflow = "hidden";
}

// -------- Helper: Close sidebar --------
function closeSidebar() {
  if (isDesktop()) return;
  playClick();
  overlay.classList.remove("active");
  overlay.setAttribute("aria-hidden", "true");
  ham.classList.remove("active");
  document.body.style.overflow = "";
}

// -------- Toggle sidebar on hamburger click --------
ham.addEventListener("click", function (e) {
  e.stopPropagation();
  if (isDesktop()) return;
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

// -------- Close on overlay background click --------
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

// -------- Resize: close sidebar if desktop --------
window.addEventListener("resize", function () {
  if (isDesktop() && overlay.classList.contains("active")) {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    ham.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// -------- Keyboard accessibility for hamburger --------
ham.addEventListener("keydown", function (e) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    if (isDesktop()) return;
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
