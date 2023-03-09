import React, { useState, useEffect, forwardRef, RefObject } from "react";
import Dropdown from "../Dropdown";
import { FilterDropdownStyle } from "./style";
import FilterIcon from "../../icons/FilterIcon";
import useClickOutside from "../../hooks/useClickOutside";

interface FilterProps {
  id: string;
  options: { value: string }[];
  onChange: (option: { value: string }, ref: RefObject<HTMLDivElement>) => void;
  defaultTitle: string;
  isOpen?: boolean;
  setActiveFilter: (id: string) => void;
}

function Filter(
  {
    id,
    options,
    onChange,
    defaultTitle,
    isOpen = false,
    setActiveFilter,
  }: FilterProps,
  ref: RefObject<HTMLDivElement>
) {
  const [selectedOption, setSelectedOption] = useState(defaultTitle);

  // const { ref, isOpen, handleOpen, handleClose } = useMultiDropdown();
  function handleOptionChange(option: { value: string }) {
    if (option.value === "All") {
      // setSelectedOption(defaultTitle);
      onChange({ value: "All" }, ref);
      return;
    }
    // setSelectedOption(option.value);
    onChange(option, ref);
  }

  function handleVoicesDropdownClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();
    setActiveFilter(id);
  }
  useClickOutside(ref, () => {
    setActiveFilter("false");
  });

  return (
    <FilterDropdownStyle>
      <div>
        <button
          className="dropdown-toggle inline-flex justify-center rounded-md border-2 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-opacity-50 focus-visible:outline-none"
          aria-expanded={isOpen}
          aria-haspopup="true"
          id="filter-dropdown"
          onClick={handleVoicesDropdownClick}
        >
          <span> {defaultTitle}</span>
          <FilterIcon />
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
        <ul
          className="filterDropdown_list py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          {options.map((option) => (
            <li key={option.value}>
              <a
                href="#"
                className="filter_optionItems block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={(e) => {
                  handleOptionChange(option);
                }}
              >
                {option.value}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </FilterDropdownStyle>
  );
}
export default forwardRef<HTMLDivElement, FilterProps>(Filter);
