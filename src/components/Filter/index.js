import { useState, forwardRef } from "react";
import Dropdown from "../Dropdown";
import { FilterDropdownStyle } from "./style";
import FilterIcon from "../../icons/FilterIcon";

function Filter({ id, options, onChange, defaultTitle }, ref) {
  const [selectedOption, setSelectedOption] = useState(defaultTitle);

  function handleOptionChange(option) {
    if (option.value === "All") {
      // setSelectedOption(defaultTitle);
      onChange("All");
      return;
    }
    // setSelectedOption(option.value);
    onChange(option, ref);
  }

  return (
    <FilterDropdownStyle>
      <Dropdown
        id={id}
        selectedItemText={selectedOption}
        ref={ref}
        icon={<FilterIcon />}
        minHeight={0}
      >
        <ul
          class="filterDropdown_list py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownDefaultButton"
        >
          {options.map((option) => (
            <li key={option.value}>
              <a
                href="#"
                class="filter_optionItems block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={(e) => {
                  handleOptionChange(option);
                }}
              >
                {option.value}
              </a>
            </li>
          ))}
        </ul>
      </Dropdown>
    </FilterDropdownStyle>
  );
}
Filter.displayName = "ChildDropdown";
export default forwardRef(Filter);
