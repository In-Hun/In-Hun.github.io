(() => {
  "use strict";

  const root = document.documentElement;
  const themeToggle = document.querySelector(".theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = window.matchMedia("(max-width: 940px)");

  const updateThemeControl = () => {
    const isDark = root.dataset.theme === "dark";
    const label = isDark ? "Switch to light mode" : "Switch to dark mode";

    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", label);
    themeColor.setAttribute("content", isDark ? "#100d0f" : "#8b0029");
  };

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      // The selected theme still applies for the current page if storage is unavailable.
    }
    updateThemeControl();
  };

  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
  updateThemeControl();

  const closeNav = () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    if (mobileNav.matches) nav.setAttribute("inert", "");
  };

  const openNav = () => {
    nav.classList.add("is-open");
    nav.removeAttribute("inert");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation");
  };

  navToggle.addEventListener("click", () => {
    if (navToggle.getAttribute("aria-expanded") === "true") {
      closeNav();
    } else {
      openNav();
    }
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    if (!mobileNav.matches || !nav.classList.contains("is-open")) return;
    if (!event.target.closest(".topbar-inner")) closeNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeNav();
      navToggle.focus();
    }
  });

  const updateNavMode = () => {
    if (mobileNav.matches) {
      closeNav();
    } else {
      nav.classList.remove("is-open");
      nav.removeAttribute("inert");
      navToggle.setAttribute("aria-expanded", "false");
    }
  };

  mobileNav.addEventListener("change", updateNavMode);
  updateNavMode();

  const revealItems = document.querySelectorAll(".reveal");
  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 65}ms`);
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -7%" }
    );

    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top <= window.innerHeight * 1.08) {
        item.classList.add("is-visible");
      }
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);
        if (!visibleSection) return;

        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${visibleSection.target.id}`;
          link.classList.toggle("is-active", isActive);
          if (isActive) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-25% 0px -65%", threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  root.classList.add("js");
  document.getElementById("y").textContent = new Date().getFullYear();
})();
