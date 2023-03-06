import React, { useEffect, forwardRef } from "react";
import { DropdownStyle } from "./style";

function Dropdown({ selectedItemText, children }, ref) {
  useEffect(() => {
    const handleClickOutsideDropdown = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        event.target.tagName !== "svg"
      ) {
        ref.current.classList.remove("show");
      }
    };

    document.addEventListener("click", handleClickOutsideDropdown);

    return () => {
      document.removeEventListener("click", handleClickOutsideDropdown);
    };
  }, [ref]);

  function handleVoicesDropdownClick(event) {
    event.preventDefault();
    event.stopPropagation();
    ref.current.classList.toggle("show");
  }

  return (
    <DropdownStyle>
      <div>
        <button
          className="dropdown-toggle inline-flex justify-center rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-opacity-50 focus-visible:outline-none"
          aria-expanded="true"
          aria-haspopup="true"
          id="voices-dropdown"
          onClick={handleVoicesDropdownClick}
          ref={ref}
        >
          <span> {selectedItemText}</span>
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div
        id="menuItems"
        className="dropdown-menu absolute left-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="voices-dropdown"
        tabIndex="-1"
        ref={ref}
      >
        {children}
      </div>
    </DropdownStyle>
  );
}

export default forwardRef(Dropdown);
