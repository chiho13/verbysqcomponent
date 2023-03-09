import React, { useRef } from "react";
import { DropdownStyle } from "./style";
import useDropdown from "~/src/hooks/useDropdown";
interface DropdownProps {
  id: string;
  selectedItemText: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  minHeight?: number;
}

function Dropdown({
  id,
  selectedItemText,
  children,
  icon,
  minHeight = 0,
}: DropdownProps) {
  const { ref, isOpen, handleOpen, handleClose } = useDropdown();

  function handleVoicesDropdownClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }

  return (
    <DropdownStyle>
      <div>
        <button
          className="dropdown-toggle inline-flex justify-center rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-opacity-50 focus-visible:outline-none"
          aria-expanded={isOpen}
          aria-haspopup="true"
          id="voices-dropdown"
          onClick={handleVoicesDropdownClick}
        >
          <span> {selectedItemText}</span>
          {icon}
        </button>
      </div>

      <div
        id={id}
        className={`dropdown-menu absolute left-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 ${
          isOpen ? "show" : ""
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="voices-dropdown"
        tabIndex={-1}
        ref={ref}
      >
        {children}
      </div>
    </DropdownStyle>
  );
}

export default Dropdown;
