import { useState, forwardRef } from "react";
import Dropdown from "../Dropdown";
import { FilterDropdownStyle } from "./style";
import FilterIcon from "../../icons/FilterIcon";

function Filter({ options, onChange, defaultTitle }, ref) {
  const [selectedOption, setSelectedOption] = useState(defaultTitle);

  function handleOptionChange(option) {
    if (option === "All") {
      setSelectedOption(defaultTitle);
      onChange("All");
      return;
    }
    setSelectedOption(option);
    onChange(option);
  }

  return (
    <FilterDropdownStyle>
      <Dropdown
        selectedItemText={selectedOption}
        ref={ref}
        icon={<FilterIcon />}
        minHeight={0}
      >
        <ul
          class="filterDropdown_list py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          <li>
            <a
              href="#"
              class="filter_optionItems block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={(e) => {
                handleOptionChange("All");
              }}
            >
              All
            </a>
          </li>
          {options.map((option, index) => (
            <li key={index}>
              <a
                href="#"
                class="filter_optionItems block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={(e) => {
                  handleOptionChange(option);
                }}
              >
                {option}
              </a>
            </li>
          ))}
        </ul>
      </Dropdown>
    </FilterDropdownStyle>
  );
}

export default forwardRef(Filter);
