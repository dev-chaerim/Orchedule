// hooks/useWindowSize.ts
import { useEffect, useState } from "react";

export function useWindowWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    handleResize(); // 초기값 설정
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}
