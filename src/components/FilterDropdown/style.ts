import styled from "styled-components";

export const FilterDropdownStyle = styled.div`
  position: relative;

  .dropdown-menu {
    z-index: 1000;
    max-height: none !important;
    overflow-y: visible !important;
  }

  button.dropdown-toggle {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 0;
    box-shadow: none;
  }

  .filter_optionItems {
    &:hover {
      background-color: #eee;
      transition: all 0.3s ease;
    }
  }
`;
