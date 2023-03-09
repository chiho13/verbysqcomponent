import { useEffect } from "react";

type EventHandler = (event: MouseEvent) => void;

function useClickOutsideHandler(
  ref: React.RefObject<HTMLElement>,
  handleClickOutside: EventHandler
) {
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        ref &&
        ref.current &&
        !ref.current.contains(event.target as HTMLElement)
      ) {
        handleClickOutside(event);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [ref, handleClickOutside]);
}

export default useClickOutsideHandler;
