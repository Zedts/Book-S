"use client";

import { useEffect } from "react";

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

export function useScrollReveal() {
  useEffect(() => {
    // Trigger initial on-load animations
    const loadTimer = setTimeout(() => {
      document.body.classList.add("is-loaded");
    }, 100);

    const observeElements = () => {
      const revealElements = document.querySelectorAll<HTMLElement>(".reveal:not(.active)");
      revealElements.forEach((el) => observer.observe(el));
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, OBSERVER_OPTIONS);

    // Initial check
    observeElements();

    // Watch for new elements being added to the DOM
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      clearTimeout(loadTimer);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}
