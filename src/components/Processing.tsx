import React from 'react'
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export function Processing({ color, ...rest }: any) {
    return (
        <svg width="24" height="40" viewBox="0 0 24 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_7_208" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="40">
                <path d="M4 0C1.8 0 0 1.8 0 4L0.0200005 10.36C0.0200005 11.42 0.44 12.42 1.18 13.18L8 20L1.18 26.86C0.44 27.6 0.0200005 28.62 0.0200005 29.68L0 36C0 38.2 1.8 40 4 40H20C22.2 40 24 38.2 24 36V29.68C24 28.62 23.58 27.6 22.84 26.86L16 20L22.82 13.2C23.58 12.44 24 11.42 24 10.36V4C24 1.8 22.2 0 20 0H4ZM20 29.82V34C20 35.1 19.1 36 18 36H6C4.9 36 4 35.1 4 34V29.82C4 29.28 4.22 28.78 4.58 28.4L12 21L19.42 28.42C19.78 28.78 20 29.3 20 29.82Z" fill="#ffffff" />
            </mask>
            <g mask="url(#mask0_7_208)">
                <rect x="-12" y="-4" width="48" height="48" fill="url(#paint0_linear_7_209)">
                    <animate attributeName="fill" values="#2B396A;#00F0FF;#2B396A;#D146C3;#2B396A" dur="5s" repeatCount="indefinite" />
                </rect>
            </g>
            <defs>
                <linearGradient id="paint0_linear_7_208" x1="12" y1="-4" x2="12" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2B396A" />
                    <stop offset="1" stopColor="#D146C3" />
                </linearGradient>
                <linearGradient id="paint0_linear_7_209" x1="12" y1="-4" x2="12" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00F0FF" />
                    <stop offset="1" stopColor="#2B396A" />
                </linearGradient>
            </defs>
        </svg>

    )
}
