"use client"
import React from 'react';
import { FaArrowUp } from 'react-icons/fa';

const BackToTopBtn = () => {
    return (
        <button
            onClick={() =>
                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                })
            }
            className="absolute left-1/2 top-0 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-3 border-background brand-gradient text-xl text-white "
        >
            <FaArrowUp className="transition-all duration-300 hover:translate-y-[-40%] hover:scale-105" />
        </button>
    );
};

export default BackToTopBtn;