import { useEffect } from "react";

function useHandleClickOutside() {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const popupContainers = document.querySelectorAll(".popup-container");
      const searchContainers = document.querySelectorAll(".search-container");
      const optionsContainers = document.querySelectorAll(".option-container");

      popupContainers.forEach((popupContainer) => {
        if (popupContainer instanceof HTMLElement) {
          if (!popupContainer.contains(e.target as Node)) {
            popupContainer.classList.add("hidden");
          }
        }
      });

      searchContainers.forEach((searchContainer) => {
        if (searchContainer instanceof HTMLElement) {
          if (!searchContainer.contains(e.target as Node)) {
            const resultContainer = searchContainer.children[1];
            if (resultContainer instanceof HTMLElement) {
              resultContainer.classList.add("hidden");
            }
          }
        }
      });

      optionsContainers.forEach((optionsContainer) => {
        if (optionsContainer instanceof HTMLElement) {
          if (!optionsContainer.contains(e.target as Node)) {
            const option = optionsContainer.lastChild;
            if (option instanceof HTMLElement) {
              option.classList.add("hidden");
            }
          }
        }
      });
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
}

export default useHandleClickOutside;
