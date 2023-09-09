import React from 'react';
export const CancelIcon = ({size=24, widt=0, height=0, ...props}) => (
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="#101935" />
        <line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2" />
        <line x1="6" y1="18" x2="18" y2="6" stroke="white" stroke-width="2" />
    </svg>

);