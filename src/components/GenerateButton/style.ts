import styled, { StyledComponent } from "styled-components";

interface GenerateButtonStyleProps {
  isDisabled: boolean;
}

export const GenerateButtonStyle: StyledComponent<
  "button",
  any,
  GenerateButtonStyleProps
> = styled.button<GenerateButtonStyleProps>`
  display: flex;
  align-items: center;
  background-color: #fff;
  color: #777777;
  border: 2px solid #777777;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 0.25rem;
  opacity: ${({ isDisabled }) => (isDisabled ? "0.5" : "1")};
  cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
  transition: border 0.3s ease-in-out, opacity 0.3s ease;

  &:hover {
    background-color: #fefefe;
    color: #f5820d;
    border: 2px solid #f5820d;
  }

  &:disabled {
    opacity: 0.6;
    pointer-events: none;
  }
`;
