"use client";

import { useEffect } from "react";

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

export function useScrollReveal() {
  useEffect(() => {
    const revealElements = document.querySelectorAll<HTMLElement>(".reveal");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, OBSERVER_OPTIONS);

    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
