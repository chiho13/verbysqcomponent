import styled from "styled-components";

export const VoiceDropdownStyle = styled.div`
  position: relative;
  margin-bottom: 20px;

  .filter_label {
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 0;
    padding-left: 40px;
    padding-right: 40px;

    span {
      margin-right: 16px;
    }
  }

  .filter_pill {
    padding: 5px 9px;
  }
 
  .close-icon:hover path {
    stroke: #888888;
    transition: stroke 0.3s ease;
  }
  
  .filter_noResult {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 370px;
  }

  .dropdown_table {
    border-collapse: separate;
    border-spacing: 0;
   
  }

  .dropdown_table_wrapper {
    display: block;
    min-height 450px;
    max-height: 500px;
    overflow-y: scroll;
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
    text-indent: 74px;
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

    tr:first-child th {
      padding: 0;
    }

    tr:last-child th {
      padding-top: 20px;
      padding-bottom: 20px;
      min-width: 100px;
      border-bottom: 2px solid #333333;
    }
  }

  .voiceSampleAndName {
    padding-left: 20px;
  }
`;
