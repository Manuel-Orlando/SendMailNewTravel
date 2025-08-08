import { useState, useEffect } from "react";

export default function useMaxPageButtons() {
  const [maxButtons, setMaxButtons] = useState(5);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setMaxButtons(3);
      } else if (window.innerWidth < 1024) {
        setMaxButtons(5);
      } else {
        setMaxButtons(7);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return maxButtons;
}
