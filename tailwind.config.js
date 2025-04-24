import svgToDataUri from "mini-svg-data-uri";

// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
const {
    iconsPlugin,
    getIconCollections,
} = require("@egoist/tailwindcss-icons");
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx,astro}"],
    darkMode: "class",
    safelist: ["dark", "animate-ripple"],
    theme: {
        screens: {
            xs: "480px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1380px",
        },
        container: {
            center: true,
            padding: {
                DEFAULT: "0.625rem",
            },
        },

        extend: {
            aspectRatio: {
                auto: "auto",
                square: "1 / 1",
                video: "16 / 9",
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
                6: "6",
                7: "7",
                8: "8",
                9: "9",
                10: "10",
                11: "11",
                12: "12",
                13: "13",
                14: "14",
                15: "15",
                16: "16",
            },
            spacing: {
                10: "2.5rem",
                11: "2.75rem",
                12: "3rem",
                13: "3.25rem",
                14: "3.5rem",
                15: "3.75rem",
                16: "4rem",
                17: "4.25rem",
                18: "4.5rem",
                19: "4.75rem",
                20: "5rem",
                21: "5.25rem",
                22: "5.5rem",
                24: "6rem",
                25: "6.25rem",
                50: "12.5rem",
            },
            fontFamily: {
                iranyekan: "IRANYekan",
            },

            colors: {
                white: "#FEFEFF",
                black: "#0D0D0D",
                border: "hsl(var(--border))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                warning: "hsl(var(--warning))",
                success: {
                    DEFAULT: "hsl(var(--success))",
                    secondary: "hsl(var(--success-secondary))",
                },
                text: "hsl(var(--text))",
                primary: "hsl(var(--primary))",
                "primary-btn": "hsl(var(--primary-btn))",
                secondary: "hsl(var(--secondary))",
                destructive: "hsl(var(--destructive))",
                muted: "hsl(var(--muted))",
            },

            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },

            keyframes: {
                ripple: {
                    "50%": {
                        transform: "scale(var(--scale, 1.25))",
                    },
                },

                "fill-border": {
                    from: {
                        width: "0",
                    },
                    to: {
                        width: "100%",
                    },
                },
            },

            animation: {
                ripple: "ripple var(--duration, 1.5s) ease calc(var(--i, 0) * 0.1s) infinite",
                "fill-border": "fill-border 0.5s ease-out",
            },
        },
    },
    plugins: [
        iconsPlugin({
            collections: getIconCollections("all"),
            scale: 1.2,
            extraProperties: {
                display: "block",
                "vertical-align": "middle",
            },
        }),
        require("@tailwindcss/typography"),
        require("@tailwindcss/aspect-ratio"),
        plugin(({ addComponents, theme }) => {
            addComponents({
                ".ripple": {
                    "--size":
                        "calc(var(--baseSize, 80px) + var(--sizeStep, 64px) * var(--i, 0))",
                    width: "var(--size)",
                    height: "var(--size)",
                    opacity:
                        "calc(var(--baseOpacity, 0.25) - var(--opacityStep, 0.05) * var(--i, 0))",
                    animation: theme("animation.ripple"),
                },
            });
        }),
        addVariablesForColors,
        function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    "bg-grid": (value) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                        )}")`,
                    }),
                    "bg-grid-small": (value) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                        )}")`,
                    }),
                    "bg-dot": (value) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
                        )}")`,
                    }),
                },
                {
                    values: flattenColorPalette(theme("backgroundColor")),
                    type: "color",
                }
            );
        },
    ],
};
function addVariablesForColors({ addBase, theme }) {
    const allColors = flattenColorPalette(theme("colors"));
    const newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
    );

    addBase({
        ":root": newVars,
    });
}
