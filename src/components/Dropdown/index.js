import React, {
  useEffect,
  forwardRef,
  useState,
  useContext,
  useCallback,
} from "react";
import { DropdownStyle } from "./style";
import DropdownContext from "../../contexts/DropdownContextProvider/DropdownContext";

function Dropdown(
  { id, selectedItemText, children, icon, minHeight = 0 },
  ref
) {
  const [activeChildDropdown, setActiveChildDropdown] = useState(null);

  const handleClickOutsideDropdown = useCallback(
    (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        event.target.tagName !== "svg"
      ) {
        ref.current.classList.remove("show");
        setActiveChildDropdown(null);
      }
    },
    [ref]
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideDropdown);

    return () => {
      document.removeEventListener("click", handleClickOutsideDropdown);
    };
  }, [handleClickOutsideDropdown]);

  function handleVoicesDropdownClick(event) {
    event.preventDefault();
    event.stopPropagation();

    setActiveChildDropdown((prevState) => {
      // Close all other child Dropdown components
      const dropdowns = document.querySelectorAll(
        ".voiceTitles .dropdown-menu"
      );
      dropdowns.forEach((dropdown) => {
        if (dropdown !== ref.current && dropdown !== activeChildDropdown) {
          dropdown.classList.remove("show");
        }
      });

      // Toggle the current Dropdown component
      ref.current.classList.toggle("show");
      return prevState === ref ? null : ref;
    });
  }

  return (
    <DropdownStyle minHeight={minHeight}>
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
          {icon}
        </button>
      </div>

      <div
        id={id}
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
