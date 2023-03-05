import styled from "styled-components";

export const VoiceDropdownStyle = styled.div`
  position: relative;
  margin-bottom: 20px;

  .dropdown-menu {
    position: absolute;
    z-index: 1;
    display: none;
    background-color: white;
    max-height: 500px;
    overflow-y: auto;
  }

  .show {
    display: block;
  }

  .play-icon,
  .stop-icon {
    cursor: pointer;
    width: 34px;
    height: 34px;
  }

  .play-icon path,
  .stop-icon path {
    stroke: #777777;
  }

  .play-icon:hover path,
  .stop-icon:hover path {
    stroke: #f07d3b;
    transition: stroke 0.3s ease;
  }

  .play-icon path,
  .stop-icon path {
    pointer-events: none;
  }

  .voiceItemContainer {
    padding-left: 10px;
    cursor: pointer;
  }
  .voiceItemContainer:hover {
    background-color: #eeeeee;
    transition: all 0.3s ease;
  }

  .nameHeader {
    text-indent: 52px;
  }

  thead {
    padding: 1rem;
  }

  tr {
    padding: 0.5rem;
  }

  th,
  td {
    text-align: left;
    padding: 10px;
  }

  .voiceTitles {
    th {
      padding-top: 20px;
    }
  }

  .voiceSampleAndName {
    padding-left: 20px;
  }
`;
