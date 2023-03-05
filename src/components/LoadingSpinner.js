import React from "react";

function LoadingSpinner() {
  return (
    <svg
      aria-hidden="true"
      role="status"
      class="spinning-icon inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#aaaaaa"
        strokeWidth="3"
        strokeLinecap="round"
        d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          dur="1s"
          from="0 50 50"
          to="360 50 50"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

export default LoadingSpinner;
