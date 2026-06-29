"use client";

import { ThemeProvider } from "next-themes";

const NextThemeProvider = ({ children }) => {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
        >
            {children}
        </ThemeProvider>
    );
};

export default NextThemeProvider;