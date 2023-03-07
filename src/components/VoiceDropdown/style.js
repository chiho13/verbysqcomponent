import styled from "styled-components";

export const VoiceDropdownStyle = styled.div`
  position: relative;
  margin-bottom: 20px;

  .dropdown-menu {
    min-height: 400px;
    max-height: 500px;
    overflow-y: scroll;
  }

  .dropdown_table {
    border-collapse: separate;
    border-spacing: 0;
  }

  .show {
    display: block;
  }

  .play-icon,
  .stop-icon {
    cursor: pointer;
    width: 34px;
    height: 34px;
    margin-right: 20px;
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

  .voiceItem_wrapperMargin {
    margin-top: 10px;
    display: contents;
  }

  .voiceItemContainer {
    padding-left: 10px;
    cursor: pointer;
    position: relative;
    top: 10px;
  }
  .voiceItemContainer:hover {
    background-color: #eeeeee;
    transition: all 0.3s ease;
  }

  .nameHeader {
    text-indent: 64px;
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
    position: sticky;
    top: 0;
    background: #ffffff;
    z-index: 100;

    th {
      padding-top: 20px;
      padding-bottom: 20px;
      border-bottom: 2px solid #333333;
      min-width: 100px;
    }
  }

  .voiceSampleAndName {
    padding-left: 20px;
  }
`;
