import { useEffect } from "react";

const useScrollToHashSection = (
  hash: string,
  ref: React.RefObject<HTMLElement>,
  offset: number = 180 // Default offset (adjust as needed)
) => {
  useEffect(() => {
    const scrollToSection = () => {
      const targetHash = window.location.hash.substring(1);
      if (targetHash === hash && ref.current) {
        const elementPosition =
          ref.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
      }
    };

    // Scroll to section on initial load if the hash matches
    scrollToSection();

    // Listen for hash changes
    window.addEventListener("hashchange", scrollToSection);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("hashchange", scrollToSection);
  }, [hash, ref, offset]);
};

export { useScrollToHashSection };
