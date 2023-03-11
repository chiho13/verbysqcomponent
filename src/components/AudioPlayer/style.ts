import styled, { StyledComponent } from "styled-components";

export const AudioPlayerStyle: StyledComponent<"div", any> = styled.div`
  position: relative;

  .audioPlayer_timeline {
    width: 100%;
    height: 5px;
    background-color: #cccccc;
    position: relative;
    cursor: pointer;
  }
`;
