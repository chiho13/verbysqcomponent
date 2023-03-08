import styled from "styled-components";

export const DropdownStyle = styled.div`
  position: relative;

  .dropdown-menu {
    position: absolute;
    z-index: 1;
    display: none;
    background-color: white;
    border: 2px solid #ccc;
    min-height ${(props) => `${props.minHeight}px`};
  }



  .show {
    display: block;
  }
`;
