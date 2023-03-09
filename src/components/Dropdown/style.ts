import styled, { StyledComponent } from "styled-components";

export const DropdownStyle: StyledComponent<"div", any> = styled.div`
  position: relative;

  .dropdown-menu {
    position: absolute;
    z-index: 1;
    display: none;
    background-color: white;
    border: 2px solid #ccc;
  }

  .show {
    display: block;
  }
`;
