import { useState } from "react";

function Filter({ options, onChange }) {
  const [selectedOption, setSelectedOption] = useState("");

  function handleOptionChange(event) {
    const option = event.target.value;
    setSelectedOption(option);
    onChange(option);
  }

  return (
    <div>
      <label htmlFor="filter-select">Filter by:</label>
      <select
        id="filter-select"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={handleOptionChange}
        value={selectedOption}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filter;
