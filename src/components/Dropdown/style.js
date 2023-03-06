import styled from "styled-components";

export const DropdownStyle = styled.div`
  position: relative;
  margin-bottom: 20px;

  .dropdown-menu {
    position: absolute;
    z-index: 1;
    display: none;
    background-color: white;
    max-height: 500px;
    overflow-y: scroll;
    border: 2px solid #ccc;
  }

  .dropdown_table {
    border-collapse: separate;
    border-spacing: 0;
  }

  .show {
    display: block;
  }
`;
