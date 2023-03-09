import React from "react";

interface UseDropdownProps {
  initialOpen?: boolean;
  setActiveChildDropdown?: (ref: React.RefObject<HTMLDivElement>) => void;
  activeChildDropdown?: React.RefObject<HTMLDivElement> | null;
}

function useDropdown({
  initialOpen = false,
  setActiveChildDropdown,
  activeChildDropdown,
}: UseDropdownProps = {}) {
  const [isOpen, setIsOpen] = React.useState(initialOpen);
  const ref = React.useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    if (setActiveChildDropdown) {
      setActiveChildDropdown(ref);
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    if (setActiveChildDropdown) {
      setActiveChildDropdown(null);
    }
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      ref &&
      "current" in ref &&
      ref.current &&
      !ref.current.contains(event.target as Node)
    ) {
      handleClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  React.useEffect(() => {
    if (activeChildDropdown && activeChildDropdown !== ref) {
      handleClose();
    }
  }, [activeChildDropdown]);

  return { ref, isOpen, handleOpen, handleClose };
}

export default useDropdown;
