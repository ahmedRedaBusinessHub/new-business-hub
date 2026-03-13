import { useState, useEffect } from "react";

const useWindowWidth = (): number => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowWidth;
};

/**
 * A custom React hook that tracks the current window width.
 *
 * @returns {number} The current width of the window in pixels.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const windowWidth = useWindowWidth();
 *
 *   return (
 *     <div>
 *       Current window width: {windowWidth}px
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * This hook automatically updates when the window is resized.
 * It uses the window.innerWidth property and listens to the 'resize' event.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth MDN window.innerWidth}
 */
export default useWindowWidth;
