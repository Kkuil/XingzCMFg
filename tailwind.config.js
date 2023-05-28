/** @type {import("tailwindcss").Config} */
export default {
    content: ["./src/**/*.{html,js,ts,vue}"],
    theme: {
        extend: {},
    },
    purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    darkMode: true,
    variants: {
        extend: {},
    },
    plugins: [],
    important: true
}

