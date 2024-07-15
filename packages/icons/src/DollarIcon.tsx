
import React, { FC } from 'react';
import { HiOutlineCurrencyDollar } from "react-icons/hi2";

interface DollarIconProps {
  className?: string;
}

export const DollarIcon: FC<DollarIconProps> = ({ className }) => {

  return (
    <HiOutlineCurrencyDollar></HiOutlineCurrencyDollar>
  );
};


// import React, { FC } from 'react';

// interface DollarIconProps {
//   className?: string;
// }

// export const DollarIcon: FC<DollarIconProps> = ({ className }) => {
//   const darkModeStrokeColor = 'dark' ? '#FFFFFF' : '#000000';

//   return (
//     <svg
//       className={className}
//       fill="none"
//       height="16"  
//       viewBox="0 0 24 24"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
//       <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
//       <g id="SVGRepo_iconCarrier">
//         <path
//           d="M15 9.5C15 8.11929 13.6569 7 12 7C10.3431 7 9 8.11929 9 9.5C9 10.8807 10.3431 12 12 12C13.6569 12 15 13.1193 15 14.5C15 15.8807 13.6569 17 12 17C10.3431 17 9 15.8807 9 14.5"
//           clipRule="evenodd"   // Use camelCase for JSX attributes: clipRule instead of clip-rule
//           fill="currentColor"
//           fillRule="evenodd"   // Use camelCase for JSX attributes: fillRule instead of fill-rule
//         ></path>
//       </g>
//     </svg>
//   );
// };

