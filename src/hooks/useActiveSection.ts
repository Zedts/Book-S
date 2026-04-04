"use client";

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: string[], offset = 150) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = "";

      // If very close to the top, we consider no specific section active (defaults to Beranda)
      if (window.scrollY < 100) {
        setActiveSection("");
        return;
      }

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the element is near the top of the viewport
          if (rect.top <= offset && rect.bottom > offset) {
            currentSection = id;
          }
        }
      }
      
      // If we found a section, set it
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
}
