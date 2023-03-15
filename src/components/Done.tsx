import React from 'react'

// <!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->
export function Done({ color="#2B396A", ...rest }: any) {
    return (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest} >
            <g clipPath="url(#clip0_74_242)">
                <path d="M34.6 12.6C33.82 11.82 32.56 11.82 31.78 12.6L20.5 23.88L23.32 26.7L34.6 15.4C35.36 14.64 35.36 13.36 34.6 12.6ZM43.08 12.58L23.32 32.34L16.36 25.4C15.58 24.62 14.32 24.62 13.54 25.4C12.76 26.18 12.76 27.44 13.54 28.22L21.9 36.58C22.68 37.36 23.94 37.36 24.72 36.58L45.9 15.42C46.68 14.64 46.68 13.38 45.9 12.6H45.88C45.12 11.8 43.86 11.8 43.08 12.58ZM2.24003 28.24L10.6 36.6C11.38 37.38 12.64 37.38 13.42 36.6L14.82 35.2L5.06003 25.4C4.28003 24.62 3.02003 24.62 2.24003 25.4C1.46003 26.18 1.46003 27.46 2.24003 28.24Z" fill={color} />
            </g>
            <defs>
                <clipPath id="clip0_74_242">
                    <rect width="48" height="48" fill="white" />
                </clipPath>
            </defs>
        </svg>

    )
}
