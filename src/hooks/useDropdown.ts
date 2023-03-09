import React from "react";
import useClickOutsideHandler from "./useClickOutside";

interface UseDropdownProps {
  initialOpen?: boolean;
}

function useDropdown({ initialOpen = false }: UseDropdownProps = {}) {
  const [isOpen, setIsOpen] = React.useState(initialOpen);
  const ref = React.useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // useClickOutsideHandler(ref, () => {
  //   setIsOpen(false);
  // });

  return { ref, isOpen, handleOpen, handleClose };
}

export default useDropdown;
