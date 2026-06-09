import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import jouleLogo from "@/assets/joule-logo.png";

/* Conversations icon — from Figma node 1343-13436 (active) / conversations.svg (inactive) */
const ConversationsFilledIcon = ({ isActive }: { isActive: boolean }) => isActive ? (
  <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V36C40 38.2091 38.2091 40 36 40H4C1.79086 40 0 38.2091 0 36V4Z" fill="#F1ECFF"/>
    <g filter="url(#filter0_f_conv)">
      <path d="M18 25H24C25.6569 25 27 23.6569 27 22V16" stroke="#2C13AD" strokeWidth="0.5" strokeLinecap="round"/>
    </g>
    <path d="M30 24.5V17.5C30 16.1193 28.8807 15 27.5 15H18C17.4477 15 17 15.4477 17 16V24.5C17 25.8807 18.1193 27 19.5 27H22.3789C22.5114 27.0001 22.6387 27.0528 22.7324 27.1465L25.293 29.707C25.579 29.993 26.0091 30.0786 26.3828 29.9238C26.7564 29.769 27 29.4044 27 29V27H27.5C28.8807 27 30 25.8807 30 24.5Z" fill="url(#paint0_conv)"/>
    <path d="M26 21.5C25.9998 22.8803 24.8809 24 23.5 24H17.499L14.7998 27.5996C14.5415 27.944 14.0919 28.0844 13.6836 27.9482C13.2754 27.812 13 27.4303 13 27V24H12.5C11.1193 24 10 22.8807 10 21.5V13.5C10 12.1193 11.1193 11 12.5 11H23.5C24.8809 11 25.9998 12.1197 26 13.5V21.5Z" fill="url(#paint1_conv)"/>
    <path d="M22 18C22.5523 18 23 18.4477 23 19C23 19.5523 22.5523 20 22 20H14C13.4477 20 13 19.5523 13 19C13 18.4477 13.4477 18 14 18H22Z" fill="#F0F2F4"/>
    <path d="M19 15C19.5523 15 20 15.4477 20 16C20 16.5523 19.5523 17 19 17H14C13.4477 17 13 16.5523 13 16C13 15.4477 13.4477 15 14 15H19Z" fill="#F0F2F4"/>
    <defs>
      <filter id="filter0_f_conv" x="15.75" y="13.75" width="13.5" height="13.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feGaussianBlur stdDeviation="1" result="effect1_foregroundBlur"/>
      </filter>
      <linearGradient id="paint0_conv" x1="33" y1="34.5" x2="23" y2="22.5" gradientUnits="userSpaceOnUse">
        <stop stopColor="#BA79EF"/>
        <stop offset="0.4" stopColor="#8A48E6"/>
        <stop offset="1" stopColor="#2C13AD"/>
      </linearGradient>
      <linearGradient id="paint1_conv" x1="26" y1="14" x2="13" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#BA79EF"/>
        <stop offset="0.487203" stopColor="#8A48E6"/>
        <stop offset="1" stopColor="#470CED"/>
      </linearGradient>
    </defs>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 3.5C14 3.22386 13.7761 3 13.5 3H2.5C2.22387 3 2.00001 3.22387 2 3.5V11.5C2 11.7761 2.22386 12 2.5 12H4C4.55223 12.0001 5 12.4478 5 13V13.5859L6.29297 12.293L6.36621 12.2266C6.54417 12.0807 6.76791 12 7 12H13.5C13.7761 12 14 11.7761 14 11.5V3.5ZM16 11.5C16 12.8807 14.8807 14 13.5 14H7.41406L4.70703 16.707C4.42103 16.993 3.99086 17.0786 3.61719 16.9238C3.24353 16.769 3 16.4045 3 16V14H2.5C1.11929 14 0 12.8807 0 11.5V3.5C1.10168e-05 2.1193 1.1193 1 2.5 1H13.5C14.8807 1 16 2.11929 16 3.5V11.5Z" fill="#0B0C0F"/>
    <path d="M20 14.5V7C20 5.89543 19.1046 5 18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7V14.5C18 14.7761 17.7761 15 17.5 15H16C15.4478 15.0001 15 15.4478 15 16V16.5859L13.707 15.293L13.6338 15.2266C13.4558 15.0807 13.2321 15 13 15H8C7.44771 15 7 15.4477 7 16C7 16.5523 7.44771 17 8 17H12.5859L15.293 19.707C15.579 19.993 16.0091 20.0786 16.3828 19.9238C16.7565 19.769 17 19.4045 17 19V17H17.5C18.8807 17 20 15.8807 20 14.5Z" fill="#0B0C0F"/>
    <path d="M9.33301 5C9.88529 5 10.333 5.44772 10.333 6C10.333 6.55228 9.88529 7 9.33301 7H4C3.44772 7 3 6.55228 3 6C3 5.44772 3.44772 5 4 5H9.33301Z" fill="#0B0C0F"/>
    <path d="M12 8C12.5521 8.00018 13 8.44782 13 9C13 9.55218 12.5521 9.99982 12 10H4C3.44772 10 3 9.55229 3 9C3 8.44772 3.44772 8 4 8H12Z" fill="#0B0C0F"/>
  </svg>
);

/* Spaces icon — from Figma node 1343-13449 (active) / spaces.svg (inactive) */
const SpacesFilledIcon = ({ isActive }: { isActive: boolean }) => isActive ? (
  <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 4C0 1.79086 1.79086 0 4 0H36C38.2091 0 40 1.79086 40 4V36C40 38.2091 38.2091 40 36 40H4C1.79086 40 0 38.2091 0 36V4Z" fill="#F1ECFF"/>
    <path d="M17.4277 17.4265C19.011 16.4659 20.989 16.4659 22.5723 17.4265L27.6563 20.512C29.5981 21.6905 29.5981 24.5365 27.6563 25.715L26.9448 26.1468L25.0012 27.3263L22.5723 28.8005C20.989 29.7611 19.011 29.7611 17.4277 28.8005L14.9985 27.3262L13.0551 26.1467L12.3438 25.715C10.4019 24.5365 10.4019 21.6905 12.3438 20.512L17.4277 17.4265Z" fill="url(#paint0_spaces)"/>
    <g filter="url(#filter0_f_spaces)">
      <path d="M11.8874 20.7061L18.2974 24.7123C19.2702 25.3203 20.5046 25.3203 21.4774 24.7123L27.8874 20.7061" stroke="#2C13AD" strokeLinecap="round"/>
    </g>
    <path d="M17.4277 11.4265C19.011 10.4659 20.989 10.4659 22.5723 11.4265L27.6563 14.512C29.5981 15.6905 29.5981 18.5365 27.6563 19.715L26.9448 20.1468L25.0012 21.3263L22.5723 22.8005C20.989 23.7611 19.011 23.7611 17.4277 22.8005L14.9985 21.3262L13.0551 20.1467L12.3438 19.715C10.4019 18.5365 10.4019 15.6905 12.3438 14.512L17.4277 11.4265Z" fill="url(#paint1_spaces)"/>
    <defs>
      <filter id="filter0_f_spaces" x="7.38733" y="16.2061" width="25.0001" height="13.4619" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
        <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur"/>
      </filter>
      <linearGradient id="paint0_spaces" x1="20" y1="20.7061" x2="20" y2="35.7061" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2C13AD"/>
        <stop offset="0.6" stopColor="#8A48E6"/>
        <stop offset="1" stopColor="#BA79EF"/>
      </linearGradient>
      <linearGradient id="paint1_spaces" x1="20" y1="10.7061" x2="20" y2="22.4998" gradientUnits="userSpaceOnUse">
        <stop stopColor="#470CED"/>
        <stop offset="0.4" stopColor="#8A48E6"/>
        <stop offset="1" stopColor="#BA79EF"/>
      </linearGradient>
    </defs>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5723 1.3933C10.989 0.432701 9.01101 0.432702 7.42775 1.3933L2.34377 4.47878C0.401936 5.65726 0.40194 8.50332 2.34377 9.68181L3.05514 10.1135L2.34377 10.545C0.401747 11.7235 0.40175 14.5706 2.34377 15.749L7.42775 18.8335C9.01112 19.7943 10.9889 19.7943 12.5723 18.8335L17.6563 15.749C19.5983 14.5706 19.5983 11.7235 17.6563 10.545L16.9448 10.1136L17.6563 9.68181C19.5981 8.50332 19.5981 5.65726 17.6563 4.47878L12.5723 1.3933ZM3.37306 12.2794L4.99854 11.293L7.42775 12.7673C9.01101 13.7279 10.989 13.7279 12.5723 12.7673L15.0012 11.2931L16.627 12.2794C17.2743 12.6722 17.2743 13.6219 16.627 14.0147L11.544 17.0992C10.5939 17.6757 9.40612 17.6757 8.45607 17.0992L3.37306 14.0147C2.72572 13.6219 2.72572 12.6722 3.37306 12.2794ZM8.45607 3.12765C9.40612 2.55114 10.5939 2.55114 11.544 3.12765L16.627 6.21312C17.2743 6.60594 17.2743 7.55464 16.627 7.94746L11.544 11.0329C10.5939 11.6094 9.40612 11.6094 8.45607 11.0329L3.37306 7.94746C2.72572 7.55464 2.72572 6.60594 3.37306 6.21312L8.45607 3.12765Z" fill="#0B0C0F"/>
  </svg>
);

/* ===== Joule Logomark (purple diamond with gradients) ===== */
const JouleLogo = ({ size = 38 }: { size?: number }) => {
  const h = size * (36 / 38);
  return (
    <svg width={size} height={h} viewBox="0 0 38 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background rounded rect mask */}
      <rect width="38" height="36" rx="4.5" fill="white" fillOpacity="0.8" />
      <rect width="38" height="36" rx="4.5" fill="black" fillOpacity="0.2" />
      {/* Gradient shapes */}
      <defs>
        <linearGradient id="jl1" x1="0.216" y1="0.664" x2="1.001" y2="-0.037">
          <stop offset="0.079" stopColor="#4013E3" />
          <stop offset="1" stopColor="#F090EB" />
        </linearGradient>
        <linearGradient id="jl2" x1="0.802" y1="0.29" x2="0.351" y2="0.448">
          <stop stopColor="#5739F5" />
          <stop offset="1" stopColor="#2815A6" />
        </linearGradient>
        <linearGradient id="jl3" x1="0.596" y1="-0.064" x2="0.258" y2="0.5">
          <stop stopColor="#F3B2E9" />
          <stop offset="1" stopColor="#4013E3" />
        </linearGradient>
        <linearGradient id="jl4" x1="0.864" y1="1.305" x2="0.067" y2="0.37">
          <stop stopColor="#F3B2E9" />
          <stop offset="0.995" stopColor="#4013E3" />
        </linearGradient>
        <linearGradient id="jl5" x1="0.942" y1="0.867" x2="-0.065" y2="0.573">
          <stop stopColor="#5739F5" />
          <stop offset="1" stopColor="#2815A6" />
        </linearGradient>
        <linearGradient id="jl6" x1="-0.45" y1="0.203" x2="0.999" y2="1.037">
          <stop stopColor="#735AF6" />
          <stop offset="1" stopColor="#F090EB" />
        </linearGradient>
      </defs>
      {/* Bottom-left leg */}
      <path d="M0 12L0 36H19" fill="url(#jl2)" />
      {/* Bottom-right leg */}
      <path d="M19 36H38V12" fill="url(#jl3)" />
      {/* Top cap */}
      <path d="M9.4 0H28.6L38 12H0L9.4 0Z" fill="url(#jl4)" />
      {/* Left triangle */}
      <path d="M0 0H12L0 12Z" fill="url(#jl5)" />
      {/* Right triangle */}
      <path d="M26 0H38L38 12Z" fill="url(#jl6)" />
      {/* Center V shape */}
      <path d="M12 12L19.7 6L19 24L12 12Z" fill="white" />
      <path d="M26 12L19.7 6L19 24L26 12Z" fill="white" fillOpacity="0.85" />
      {/* Top center diamond highlight */}
      <path d="M12 0L19 12H26L19 0H12Z" fill="url(#jl1)" />
    </svg>
  );
};

/* ===== Icon components matching Figma exactly ===== */

const ConversationsIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 21" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 3.6119C7.53742e-05 1.61714 1.59895 7.6231e-05 3.57129 0H10C10.5523 0 11 0.452806 11 1.01137C11 1.56994 10.5523 2.02274 10 2.02274H3.57129C2.70352 2.02282 2.00008 2.73427 2 3.6119V16.7745L5.43555 13.2999L5.50879 13.2328C5.68672 13.0852 5.91045 13.0037 6.14258 13.0036H16.4287C17.2964 13.0036 17.9998 12.292 18 11.4145V10.0594C18.0003 9.50105 18.4479 9.04802 19 9.04802C19.5521 9.04802 19.9997 9.50105 20 10.0594V11.4145C19.9998 13.4091 18.401 15.0263 16.4287 15.0264H6.55664L1.70703 19.9311C1.42103 20.2204 0.990862 20.3069 0.617188 20.1504C0.243586 19.9938 0 19.6251 0 19.2161V3.6119Z" />
    <path d="M19.043 4.16217C19.9834 4.45547 19.9834 5.80197 19.043 6.0953L17.2435 6.6568C16.9275 6.75535 16.6802 7.00564 16.5826 7.32516L16.0268 9.14585C15.7367 10.0969 14.4054 10.097 14.1154 9.14585L13.5602 7.32586C13.4628 7.00643 13.2158 6.75551 12.9 6.6568L11.0991 6.0953L10.9334 6.02825C10.162 5.63756 10.2175 4.43713 11.0991 4.16217L12.9 3.60066C13.1764 3.51428 13.3998 3.31157 13.5167 3.04824L13.5609 2.93231L14.1154 1.11162C14.4054 0.160524 15.7368 0.160522 16.0268 1.11162L16.5826 2.93231C16.668 3.21197 16.8677 3.43844 17.1282 3.55667L17.2435 3.60066L19.043 4.16217ZM16.8009 5.04982C16.0109 4.80336 15.3928 4.17822 15.1491 3.37928L15.0711 3.12297L14.993 3.37928C14.7494 4.17826 14.1313 4.8034 13.3413 5.04982L13.0885 5.12804L13.3413 5.20765L13.4877 5.25793C14.1593 5.51431 14.6898 6.05088 14.9433 6.73013L14.993 6.87819L15.0711 7.1331L15.1491 6.87819C15.3927 6.07923 16.0109 5.45411 16.8009 5.20765L17.0536 5.12804L16.8009 5.04982Z" />
    <path d="M5 11.1251C4.44772 11.1251 4 10.6723 4 10.1137C4 9.55515 4.44772 9.10234 5 9.10234L10 9.10234C10.5523 9.10234 11 9.55515 11 10.1137C11 10.6723 10.5523 11.1251 10 11.1251L5 11.1251Z" />
    <path d="M5 7.0796C4.44772 7.0796 4 6.62679 4 6.06823C4 5.50966 4.44772 5.05686 5 5.05686L8 5.05686C8.55228 5.05686 9 5.50966 9 6.06823C9 6.62679 8.55228 7.0796 8 7.0796L5 7.0796Z" />
  </svg>
);

const DiscoverIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 10.0002C1.7068e-05 5.13124 3.36325 1.05876 7.86743 0.0259049C8.41208 -0.0989723 8.95365 0.24708 9.07712 0.797925C9.20042 1.34867 8.85933 1.89651 8.31477 2.02137C4.71172 2.8476 2.02242 6.10737 2.0224 10.0002C2.0224 13.8935 4.71212 17.1543 8.31576 17.9801C8.86042 18.1049 9.2025 18.6527 9.0791 19.2036C8.95559 19.7541 8.41386 20.0991 7.86941 19.9746C3.36445 18.9423 0 14.8698 0 10.0002Z" />
    <path d="M18.0009 11.8209C18.1247 11.2704 18.6662 10.9251 19.2106 11.0499C19.7552 11.175 20.0967 11.7236 19.973 12.2744C19.1141 16.098 16.1402 19.1055 12.3593 19.9736C11.8147 20.0986 11.2723 19.7534 11.1487 19.2026C11.0251 18.6519 11.3666 18.1043 11.911 17.9791C14.9329 17.2854 17.3145 14.877 18.0009 11.8209Z" />
    <path d="M11.1447 0.797425C11.2681 0.246651 11.8098 -0.0991971 12.3544 0.0254056C16.1399 0.892653 19.1179 3.90483 19.975 7.73362C20.0981 8.28443 19.7562 8.83237 19.2116 8.95706C18.667 9.08166 18.1252 8.73587 18.0019 8.18504C17.317 5.12515 14.9334 2.71406 11.908 2.02087C11.3635 1.89611 11.0215 1.3482 11.1447 0.797425Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M10.2057 15.7757C9.97346 15.7834 9.73742 15.6674 9.6205 15.4276L9.5805 15.3256C9.59154 15.3618 9.60497 15.3958 9.6205 15.4276C9.73742 15.6674 9.97346 15.7834 10.2057 15.7757ZM4.88949 10.6428L4.99033 10.6832C4.95457 10.672 4.92095 10.6585 4.88949 10.6428Z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12.1883 8.46789C12.1639 8.46027 12.1401 8.45121 12.117 8.44081L12.1883 8.46789ZM8.59702 8.04583L8.5695 8.11954C8.53572 8.19553 8.48784 8.26348 8.42913 8.32005C8.50625 8.24576 8.5647 8.15184 8.59702 8.04583ZM8.17969 8.46791L5.40145 9.33352L4.99034 9.46262L8.17969 8.46791ZM10.2057 15.7757C9.97346 15.7834 9.73742 15.6674 9.6205 15.4276C9.73797 15.6653 9.97438 15.7835 10.2057 15.7757Z" />
    <path d="M10.9143 14.909L11.771 12.1C11.8325 11.8982 11.9887 11.7402 12.1883 11.6779L15.3775 10.6831C15.9714 10.4979 15.9713 9.64778 15.3775 9.46257L12.1883 8.46789C12.1639 8.46027 12.1401 8.45121 12.117 8.44081C11.9762 8.37676 11.8616 8.26184 11.7984 8.11935C11.7878 8.09559 11.7787 8.07105 11.771 8.04582L10.7874 4.82033C10.6043 4.21975 9.76373 4.21975 9.58059 4.82032L8.59702 8.04583C8.5579 8.17415 8.48049 8.28476 8.37801 8.3643C8.36337 8.37566 8.34822 8.38639 8.3326 8.39644C8.31782 8.40595 8.30262 8.41486 8.28703 8.42314C8.253 8.4412 8.21711 8.45624 8.17969 8.46791L4.99034 9.46262C4.68288 9.55861 4.53458 9.83299 4.54554 10.1009C4.55459 10.3191 4.66924 10.5329 4.88949 10.6428L4.99033 10.6832L8.17967 11.6779C8.37924 11.7402 8.53546 11.8982 8.597 12.1L9.45351 14.909L9.5805 15.3256L9.6205 15.4276C9.73742 15.6674 9.97346 15.7834 10.2057 15.7757C10.4542 15.7673 10.6983 15.6172 10.7873 15.3256L10.9143 14.909Z" />
  </svg>
);

export const SpacesIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5723 1.39355C10.989 0.432945 9.01101 0.432946 7.42775 1.39355L2.34377 4.47902C0.401936 5.6575 0.40194 8.50357 2.34377 9.68205L3.05514 10.1138L2.34377 10.5453C0.401747 11.7237 0.40175 14.5708 2.34377 15.7493L7.42775 18.8338C9.01112 19.7945 10.9889 19.7945 12.5723 18.8338L17.6563 15.7493C19.5983 14.5708 19.5983 11.7237 17.6563 10.5453L16.9448 10.1139L17.6563 9.68205C19.5981 8.50357 19.5981 5.6575 17.6563 4.47902L12.5723 1.39355ZM3.37306 12.2796L4.99854 11.2932L7.42775 12.7675C9.01101 13.7281 10.989 13.7281 12.5723 12.7675L15.0012 11.2934L16.627 12.2796C17.2743 12.6724 17.2743 13.6221 16.627 14.0149L11.544 17.0994C10.5939 17.6759 9.40612 17.6759 8.45607 17.0994L3.37306 14.0149C2.72572 13.6221 2.72572 12.6724 3.37306 12.2796ZM8.45607 3.12789C9.40612 2.55138 10.5939 2.55138 11.544 3.12789L16.627 6.21336C17.2743 6.60618 17.2743 7.55489 16.627 7.94771L11.544 11.0332C10.5939 11.6097 9.40612 11.6097 8.45607 11.0332L3.37306 7.94771C2.72572 7.55489 2.72572 6.60618 3.37306 6.21336L8.45607 3.12789Z" />
  </svg>
);

const JobsIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="-0.5 1.5 21 18" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M6.77487 6.94482C6.28776 6.27458 6 5.44695 6 4.55134C6 2.31708 7.79086 0.505859 10 0.505859C12.2091 0.505859 14 2.31709 14 4.55135C14 5.5438 13.6466 6.45278 13.0602 7.15662L15.5926 11.6517C15.7265 11.638 15.8625 11.6309 16 11.6309C18.2091 11.6309 20 13.4422 20 15.6764C20 17.9107 18.2091 19.7219 16 19.7219C14.1362 19.7219 12.5701 18.4326 12.126 16.6878H7.87398C7.42994 18.4326 5.86384 19.7219 4 19.7219C1.79086 19.7219 0 17.9107 0 15.6764C0 13.4628 1.75795 11.6644 3.93893 11.6314L6.77487 6.94482ZM5.96837 12.1538L8.34069 8.23342C8.84616 8.46679 9.40806 8.59683 10 8.59683C10.5007 8.59683 10.9798 8.5038 11.4216 8.3339L13.6951 12.3697C12.9318 12.9149 12.3656 13.7237 12.126 14.6651L7.87398 14.6651C7.60042 13.5901 6.90096 12.688 5.96837 12.1538ZM10 6.57409C8.89543 6.57409 8 5.66847 8 4.55134C8 3.43421 8.89543 2.5286 10 2.5286C11.1046 2.5286 12 3.43421 12 4.55134C12 5.66847 11.1046 6.57409 10 6.57409ZM4 17.6992C2.89543 17.6992 2 16.7936 2 15.6764C2 14.5593 2.89543 13.6537 4 13.6537C5.10457 13.6537 6 14.5593 6 15.6764C6 16.7936 5.10457 17.6992 4 17.6992ZM14 15.6764C14 14.5593 14.8954 13.6537 16 13.6537C17.1046 13.6537 18 14.5593 18 15.6764C18 16.7936 17.1046 17.6992 16 17.6992C14.8954 17.6992 14 16.7936 14 15.6764Z" />
  </svg>
);

const DeveloperIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="7 15 2 10 7 5" />
    <polyline points="13 5 18 10 13 15" />
  </svg>
);

const BellIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.74991 0C11.5116 0 13.2851 1.19459 14.3144 2.89429C15.2997 4.52147 15.5519 6.52136 15.5519 8.1311V8.92578C15.5519 10.2661 15.9779 11.3968 16.4156 12.2021C16.6507 12.6348 16.9264 13.0484 17.2511 13.4192C17.8039 14.0051 17.374 15 16.5683 15H11.7722C11.4208 16.4375 10.2022 17.5 8.74991 17.5C7.29769 17.4999 6.07892 16.4374 5.72762 15H0.93155C0.124152 14.9998 -0.304734 14.002 0.251108 13.4167C0.287505 13.3771 0.687674 12.9318 1.08425 12.2021C1.52193 11.3968 1.94794 10.2662 1.94794 8.92578V8.1311C1.94794 6.5214 2.20016 4.52144 3.18543 2.89429C4.21469 1.19458 5.9883 7.56018e-05 8.74991 0ZM8.74991 1.875C6.63171 1.87507 5.47317 2.73767 4.79064 3.86475C4.06419 5.06448 3.82434 6.66157 3.82434 8.1311V8.92578C3.82434 10.6812 3.26238 12.1306 2.71756 13.125H14.7823C14.2371 12.1308 13.6755 10.6812 13.6755 8.92578V8.1311C13.6755 6.66153 13.4357 5.06449 12.7092 3.86475C12.0266 2.73768 10.8682 1.875 8.74991 1.875Z" />
  </svg>
);

const expandIcon = "https://www.figma.com/api/mcp/asset/c8c575f8-a7e7-472b-891f-da42c601f1d8";

const DeveloperNavIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.29297 6.29297C6.68349 5.90244 7.31651 5.90244 7.70703 6.29297C8.09754 6.68349 8.09755 7.31651 7.70703 7.70703L5.41406 10L7.70703 12.293C8.09754 12.6835 8.09755 13.3165 7.70703 13.707C7.31651 14.0976 6.68349 14.0975 6.29297 13.707L3.29297 10.707C2.90244 10.3165 2.90244 9.68349 3.29297 9.29297L6.29297 6.29297Z" fill="#0B0C0F"/>
    <path d="M12.293 6.29297C12.6835 5.90245 13.3165 5.90246 13.707 6.29297L16.707 9.29297C17.0976 9.68349 17.0976 10.3165 16.707 10.707L13.707 13.707C13.3165 14.0976 12.6835 14.0976 12.293 13.707C11.9025 13.3165 11.9024 12.6835 12.293 12.293L14.5859 10L12.293 7.70703C11.9025 7.31651 11.9024 6.68349 12.293 6.29297Z" fill="#0B0C0F"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M17 0C18.6569 0 20 1.34315 20 3V17C20 18.6569 18.6569 20 17 20H3C1.34315 20 0 18.6569 0 17V3C0 1.34315 1.34315 0 3 0H17ZM3 2C2.44772 2 2 2.44772 2 3V17C2 17.5523 2.44772 18 3 18H17C17.5523 18 18 17.5523 18 17V3C18 2.44772 17.5523 2 17 2H3Z" fill="#0B0C0F"/>
  </svg>
);

type NavItemDef = {
  icon: (props: { size: number }) => JSX.Element;
  label: string;
  route?: string;
};

const navItems: NavItemDef[] = [
  { icon: ConversationsIcon, label: "Conversations", route: "/home" },
  { icon: SpacesIcon, label: "Spaces", route: "/spaces" },
  { icon: DeveloperIcon, label: "Developer" },
];

const CLICKABLE = [0, 1]; // Conversations + Spaces

const IconSidebar = ({ activeIndex = 0 }: { activeIndex?: number }) => {
  const navigate = useNavigate();
  const [currentActive, setCurrentActive] = useState(activeIndex);
  const [sliderTop, setSliderTop] = useState(0);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setCurrentActive(activeIndex);
    const btn = buttonRefs.current[activeIndex];
    const container = containerRef.current;
    if (btn && container) {
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setSliderTop(btnRect.top - containerRect.top);
    }
  }, [activeIndex]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (item: NavItemDef, i: number) => {
    if (!CLICKABLE.includes(i)) return;
    // Measure and update slider position synchronously before state update
    const btn = buttonRefs.current[i];
    const container = containerRef.current;
    if (btn && container) {
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setSliderTop(btnRect.top - containerRect.top);
    }
    setCurrentActive(i);
    if (item.route) navigate(item.route);
  };

  return (
    <div
      className="flex flex-col items-center justify-between shrink-0 border-r"
      style={{
        width: 80,
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "#f8f9fa",
        borderColor: "#e6e7ea",
      }}
    >
      {/* Top: Joule Logo */}
      <div
        className="flex items-center justify-center cursor-pointer shrink-0"
        style={{ width: 38, height: 36 }}
        onClick={() => navigate('/home', { state: { reset: Date.now() } })}
      >
        <img src={jouleLogo} alt="Joule" className="w-[38px] h-[36px] object-contain" loading="eager" decoding="sync" />
      </div>

      {/* Middle: Navigation Items */}
      <div ref={containerRef} className="relative flex flex-col items-center" style={{ gap: 16 }}>
        {/* Sliding active background */}
        <div
          style={{
            position: 'absolute',
            top: sliderTop,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 40,
            height: 40,
            borderRadius: 4,
            backgroundColor: "#f1ecff",
            transition: 'top 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
          }}
        />
        {navItems.map((item, i) => {
          const isActive = i === currentActive;
          return (
            <button
              key={item.label}
              ref={el => { buttonRefs.current[i] = el; }}
              onClick={() => handleClick(item, i)}
              className="relative flex items-center justify-center rounded transition-colors duration-150"
              style={{
                width: 40,
                height: 40,
                borderRadius: 4,
                color: isActive ? '#552cff' : '#0b0c0f',
              }}
              title={item.label}
            >
              {i === 0 ? (
                <ConversationsFilledIcon isActive={isActive} />
              ) : i === 1 ? (
                <SpacesFilledIcon isActive={isActive} />
              ) : (
                <DeveloperNavIcon />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom: Bell (with badge), Avatar, Expand */}
      <div className="flex flex-col items-center" style={{ gap: 16 }}>
        {/* Bell with notification badge */}
        <div className="relative">
          <button
            className="flex items-center justify-center rounded transition-colors hover:bg-[#f0f2f4]"
            style={{ width: 40, height: 40, borderRadius: 4, color: '#0b0c0f' }}
            title="Notifications"
          >
            <BellIcon size={16} />
          </button>
          <div
            className="absolute border border-[#f8f9fa]"
            style={{
              width: 10,
              height: 10,
              borderRadius: 16,
              backgroundColor: '#c72f2b',
              top: 2,
              left: 18,
            }}
          />
        </div>

        {/* User Avatar */}
        <button
          className="flex items-center justify-center overflow-hidden rounded-full"
          style={{ width: 32, height: 32, borderRadius: 64 }}
          title="User profile"
        >
          <img
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
            alt="User"
            className="w-full h-full object-cover"
          />
        </button>

        {/* Expand/Collapse */}
        <button
          className="flex items-center justify-center rounded transition-colors hover:bg-[#f0f2f4]"
          style={{ width: 40, height: 40, borderRadius: 4 }}
          title="Expand sidebar"
        >
          <img src={expandIcon} alt="Expand" className="w-4 h-4 object-contain" />
        </button>
      </div>
    </div>
  );
};

export default IconSidebar;
