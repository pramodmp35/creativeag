/* ============================================================
   NAV ACTIVE STATE – Add to your JS file
   ============================================================ */

(function () {
  "use strict";

  // ---- Get current page filename ----
  function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split("/").pop() || "index.html";

    // Handle root path (e.g., domain.com/ → index.html)
    if (page === "" || page === "/") {
      return "index.html";
    }
    return page;
  }

  const currentPage = getCurrentPage();

  // ---- Helper: Get all nav links (desktop + sidebar) ----
  const desktopLinks = document.querySelectorAll(".navlink");
  const sidebarLinks = document.querySelectorAll(".navsidebarlink");

  // ---- Add active class to matching links ----
  function setActiveLinks(links) {
    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // ---- Apply to both desktop and sidebar ----
  setActiveLinks(desktopLinks);
  setActiveLinks(sidebarLinks);

  // ---- Also handle case where href is "./page.html" vs "page.html" ----
  // Some links might have "./" prefix, so we do a second pass
  function setActiveLinksWithPrefix(links) {
    links.forEach((link) => {
      const href = link.getAttribute("href");
      // Remove leading "./" if present
      const cleanHref = href.replace(/^\.\//, "");
      if (cleanHref === currentPage) {
        link.classList.add("active");
      }
    });
  }

  setActiveLinksWithPrefix(desktopLinks);
  setActiveLinksWithPrefix(sidebarLinks);
})();
