"use client";

import { ThemeProvider } from "next-themes";

const Providers = ({ children }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
        >
            {children}
        </ThemeProvider>
    );
};

export default Providers;